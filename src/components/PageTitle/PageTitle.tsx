import { useIonViewWillEnter } from '@ionic/react';
import { useState } from 'react';
import type { ReactNode } from 'react';

interface PageTitleProps {
  className?: string;
  children: ReactNode;
}

// Ionic keeps a page's DOM alive when you navigate away from it inside
// the same IonRouterOutlet (just toggling display:none via
// ion-page-hidden) instead of unmounting it, so a plain CSS
// mount-triggered @keyframes animation (see global.css's `ion-content
// h1` rule) only ever plays once, on the very first visit — going back
// to an already-visited page doesn't remount the <h1>, so it doesn't
// replay. Whether display:none->visible alone restarts a CSS animation
// is also inconsistent across browsers. Bumping `key` on every
// ionViewWillEnter forces React to genuinely unmount+remount the <h1>
// each time the page becomes active, so the animation reliably replays
// regardless of any of that.
export default function PageTitle({ className, children }: PageTitleProps) {
  const [enterKey, setEnterKey] = useState(0);

  useIonViewWillEnter(() => {
    setEnterKey((k) => k + 1);
  });

  return (
    <h1 key={enterKey} className={className}>
      {children}
    </h1>
  );
}
