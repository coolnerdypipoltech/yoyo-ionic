import { Preferences } from '@capacitor/preferences';
import type { User } from '../api/types';

const TOKEN_KEY = 'yoyo_access_token';
const USER_KEY = 'yoyo_current_user';
const LANGUAGE_KEY = 'yoyo_language';

export async function getToken(): Promise<string | null> {
  const { value } = await Preferences.get({ key: TOKEN_KEY });
  return value;
}

export async function setToken(token: string): Promise<void> {
  await Preferences.set({ key: TOKEN_KEY, value: token });
}

export async function clearToken(): Promise<void> {
  await Preferences.remove({ key: TOKEN_KEY });
}

export async function getCachedUser(): Promise<User | null> {
  const { value } = await Preferences.get({ key: USER_KEY });
  if (!value) return null;
  try {
    return JSON.parse(value) as User;
  } catch {
    return null;
  }
}

export async function setCachedUser(user: User): Promise<void> {
  await Preferences.set({ key: USER_KEY, value: JSON.stringify(user) });
}

export async function clearCachedUser(): Promise<void> {
  await Preferences.remove({ key: USER_KEY });
}

// Clears every persisted piece of session state — used on logout AND on
// account deletion (the old Unity client had a bug where account deletion
// left the token in PlayerPrefs; we clear everything explicitly here).
export async function clearSession(): Promise<void> {
  await Promise.all([clearToken(), clearCachedUser()]);
}

export async function getLanguage(): Promise<string | null> {
  const { value } = await Preferences.get({ key: LANGUAGE_KEY });
  return value;
}

export async function setLanguage(language: string): Promise<void> {
  await Preferences.set({ key: LANGUAGE_KEY, value: language });
}
