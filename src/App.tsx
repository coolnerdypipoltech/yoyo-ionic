import { IonApp, setupIonicReact } from '@ionic/react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ViewportProvider } from './context/ViewportContext';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import UnauthenticatedApp from './routes/UnauthenticatedApp';
import AuthenticatedApp from './routes/AuthenticatedApp';

import { RabbitTransitionPreloaderDesktop } from './components/RabbitTransitionDesktop/RabbitTransitionDesktop';
// scrollAssist off: its iOS "Passwords bar" heuristic adds a flat 50px
// to the scroll-into-view amount for any password input (see
// @ionic/core's scroll-assist.js), assuming iOS will show a Keychain
// suggestions bar above the keyboard. That bar doesn't always appear
// (depends on the user's own Keychain/Safari settings), so the app has
// no reliable way to know in advance whether those extra 50px are
// warranted — when they aren't, the page overshoots and scrolls up
// more than the keyboard actually requires. Mobile Safari already
// scrolls a focused input into view on its own, so disabling Ionic's
// own layer here just removes that unreliable extra correction instead
// of replacing it with anything.
setupIonicReact({ scrollAssist: false });



// Two separate IonReactRouter trees, swapped based on auth state. Each one
// only ever mounts once the URL has already been aligned to a path valid
// for it (see AuthContext's syncUrl calls in login/logout/boot) — that's
// what makes the swap safe: a fresh router mounting at a matching path has
// no ambiguous nested-outlet transition to resolve, unlike trying to share
// one router across both a public flow and a tabbed authenticated section.
function AppShell() {
  const { isBooting, isAuthenticated } = useAuth();
  return (
    <IonApp>
      {/* Mounted unconditionally — outside the auth swap below — so it
          survives login/logout and every page change, keeping the rabbit
          transition's frames decoded and ready for the entire session. */}
     <RabbitTransitionPreloaderDesktop />
      {isBooting ? null : isAuthenticated ? <AuthenticatedApp /> : <UnauthenticatedApp />}
    </IonApp>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ViewportProvider>
          <AppShell />
        </ViewportProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
