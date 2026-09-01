import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.yoyotheclub.app',
  appName: 'YoYo',
  webDir: 'dist',
  // Without this, the native WebView's own default background (white)
  // shows through during the brief window before the web app's CSS has
  // loaded and painted — on a slower device/connection that's long
  // enough to read as "the app opened white instead of dark." The app
  // itself is always dark regardless of system theme (see
  // theme/variables.css), so this should always be black, not derived
  // from anything user- or system-configurable.
  backgroundColor: '#000000',
  ios: {
    backgroundColor: '#000000',
  },
  android: {
    backgroundColor: '#000000',
  },
};

export default config;
