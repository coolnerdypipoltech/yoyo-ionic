import { IonApp, setupIonicReact } from '@ionic/react';
import { AuthProvider, useAuth } from './context/AuthContext';
import UnauthenticatedApp from './routes/UnauthenticatedApp';
import AuthenticatedApp from './routes/AuthenticatedApp';

setupIonicReact();

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
      {isBooting ? null : isAuthenticated ? <AuthenticatedApp /> : <UnauthenticatedApp />}
    </IonApp>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}
