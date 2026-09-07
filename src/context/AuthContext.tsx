import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import * as authService from '../api/services/auth.service';
import * as storage from '../services/storage';
import type { UpdateTastesRequest, User } from '../api/types';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isBooting: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateTastes: (payload: UpdateTastesRequest) => Promise<void>;
  deleteAccount: (password: string) => Promise<void>;
  setUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// Authenticated and unauthenticated screens live in two separate
// IonReactRouter trees (see App.tsx) — each mounts its own fresh router
// instance, so the browser URL must already point at a path valid for the
// tree about to mount *before* React swaps trees. Using the raw History API
// here (not react-router's history) is deliberate: this runs from plain
// AuthContext code with no router instance of its own, and a bare
// replaceState is exactly what's needed to align the URL without
// triggering any router's transition/outlet logic.
//
// A plain replaceState is invisible to the *currently mounted* router's own
// history instance, though — it only notices a URL it changed itself, or a
// real `popstate`. That's fine the moment this runs alongside setting
// isAuthenticated (the tree is about to remount from scratch and will read
// the corrected URL fresh) — but syncUrl is also used below to recover from
// a URL/auth mismatch *without* an auth change (e.g. a back-swipe landing on
// a path from the other tree), where the same tree stays mounted and needs
// telling. The synthetic popstate covers that case too, harmlessly.
function syncUrl(path: string) {
  if (window.location.pathname !== path) {
    window.history.replaceState(null, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }
}

// Each auth tree (see App.tsx) only declares routes for its own screens —
// landing on a path from the *other* tree (typically a back-gesture or the
// hardware/OS back action popping to a history entry from before a login or
// logout) leaves that tree's outlet with nothing to match, rendering blank
// while its own always-on chrome (MainTabs' floating bar, or the
// unauthenticated background) stays put — the "stuck in limbo" look. These
// mirror the <Route> paths declared in UnauthenticatedApp/AuthenticatedApp.
const UNAUTHENTICATED_PATH_PREFIXES = ['/welcome', '/login', '/password-recovery', '/verify-code', '/register'];
const AUTHENTICATED_PATH_PREFIXES = ['/main', '/places/', '/rewards/', '/faqs', '/profile'];

function isPathValidForAuthState(pathname: string, isAuthenticated: boolean): boolean {
  const prefixes = isAuthenticated ? AUTHENTICATED_PATH_PREFIXES : UNAUTHENTICATED_PATH_PREFIXES;
  return prefixes.some((prefix) => pathname.startsWith(prefix));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isBooting, setIsBooting] = useState(true);

  // Boot/session-restore: replicates ApiManager.Awake() — if a token was
  // persisted, validate it against GET /auth/info before deciding whether
  // to land on Places or Welcome.
  useEffect(() => {
    let cancelled = false;

    (async () => {
      const token = await storage.getToken();
      if (!token) {
        if (!cancelled) setIsBooting(false);
        return;
      }
      try {
        const freshUser = await authService.getInfo();
        if (cancelled) return;
        setUserState(freshUser);
        await storage.setCachedUser(freshUser);
        syncUrl('/main/places');
        setIsAuthenticated(true);
      } catch {
        await storage.clearSession();
      } finally {
        if (!cancelled) setIsBooting(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // Defends against the URL and the mounted auth tree drifting apart —
  // normally login/logout/boot above keep them in lockstep via syncUrl, but
  // nothing stops a *later* back-navigation (an iOS edge-swipe, the
  // hardware back button, or just history.back()) from landing on a path
  // that belonged to the other tree, e.g. a pre-login `/welcome` entry
  // still sitting behind `/main/places` in history after login only
  // replaced the single entry it happened on. Re-checks on every popstate,
  // plus once whenever isAuthenticated/isBooting themselves change (that
  // covers a page freshly loaded on a stale URL, like a bookmarked
  // `/main/places` opened after the session has since expired).
  useEffect(() => {
    if (isBooting) return;

    const correctIfMismatched = () => {
      if (!isPathValidForAuthState(window.location.pathname, isAuthenticated)) {
        syncUrl(isAuthenticated ? '/main/places' : '/welcome');
      }
    };
    correctIfMismatched();

    window.addEventListener('popstate', correctIfMismatched);
    return () => window.removeEventListener('popstate', correctIfMismatched);
  }, [isAuthenticated, isBooting]);

  const login = useCallback(async (email: string, password: string) => {
    const res = await authService.login(email, password);
    await storage.setToken(res.access_token);
    await storage.setCachedUser(res.user);
    setUserState(res.user);
    syncUrl('/main/places');
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(async () => {
    await storage.clearSession();
    setUserState(null);
    syncUrl('/welcome');
    setIsAuthenticated(false);
  }, []);

  const refreshUser = useCallback(async () => {
    const freshUser = await authService.getInfo();
    setUserState(freshUser);
    await storage.setCachedUser(freshUser);
  }, []);

  const updateTastes = useCallback(async (payload: UpdateTastesRequest) => {
    const freshUser = await authService.updateTastes(payload);
    setUserState(freshUser);
    await storage.setCachedUser(freshUser);
  }, []);

  const deleteAccount = useCallback(async (password: string) => {
    await authService.deleteAccount(password);
    // Explicitly clear both token and cached user — the old Unity client
    // only cleared the in-memory token here, leaving a stale one in
    // PlayerPrefs that could attempt to auto-login post-deletion.
    await storage.clearSession();
    setUserState(null);
    syncUrl('/welcome');
    setIsAuthenticated(false);
  }, []);

  const setUser = useCallback((nextUser: User) => {
    setUserState(nextUser);
    void storage.setCachedUser(nextUser);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, isAuthenticated, isBooting, login, logout, refreshUser, updateTastes, deleteAccount, setUser }),
    [user, isAuthenticated, isBooting, login, logout, refreshUser, updateTastes, deleteAccount, setUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
