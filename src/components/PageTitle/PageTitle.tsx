
import {  useRef } from 'react';
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
// is also inconsistent across browsers. Bumping `key` forces React to
// genuinely unmount+remount the <h1> so the animation reliably replays
// regardless of any of that.
//
// Debounced rather than bumped straight from ionViewWillEnter: bouncing
// back to this page and away again fast enough (rapid taps between this
// page and a pushed detail page) fires that callback repeatedly, each one
// tearing down the still-animating <h1> and starting a fresh one — and
// under fast enough repetition, the very last one has been observed to
// get left animating from a browser-paused/interrupted state that never
// resumes, i.e. the title stuck invisible instead of settling at opacity
// 1. Waiting for entrance signals to stop arriving for a beat before
// actually bumping the key means only the *settled* entrance ever
// triggers a real remount.
export default function PageTitle({ className, children }: PageTitleProps) {

  const headingRef = useRef<HTMLHeadingElement>(null);



  return (
    <h1  ref={headingRef} className={className}>
      {children}
    </h1>
  );
}
