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
import '@ionic/react/css/palettes/dark.system.css';

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
