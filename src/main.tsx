import { createRoot } from 'react-dom/client';

/* Core Ionic CSS */
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
// Deliberately not importing '@ionic/react/css/palettes/dark.system.css' —
// this app is always dark regardless of the device's system setting (see
// theme/variables.css), and that palette sets --ion-background-color to
// #121212 whenever the system happens to be in dark mode. Most components
// never notice because they're themed through page-local --background
// vars, but a few (e.g. ion-accordion's host) read --ion-background-color
// directly, so it was leaking through as a gray background there.

import './theme/variables.css';
import './theme/global.css';

import i18n from './i18n/i18n';
import * as storage from './services/storage';
import App from './App';

async function bootstrapLanguage() {
  const stored = await storage.getLanguage();
  if (stored) {
    await i18n.changeLanguage(stored);
  }
}

// Note: deliberately not wrapped in <StrictMode> — Ionic's router outlet
// manages page DOM imperatively outside React's reconciliation, and
// StrictMode's double-invoked effects in dev cause duplicate/ghost pages.
bootstrapLanguage().finally(() => {
  createRoot(document.getElementById('root')!).render(<App />);
});
