import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import './RabbitTransitionDesktop.css';
import video from '../../assets/LoaderVideo.mp4';

// Mounted once at the app root (see App.tsx), for the app's entire
// lifetime, regardless of auth state or which page is active — so the
// browser has already fetched and buffered the video by the time
// RabbitTransition itself first mounts (right after login, minutes
// later, or on re-entering Places), and the very first play-through
// doesn't stutter waiting on the network. `preload="auto"` alone (i.e.
// putting it only on the real <video> below) wouldn't help with that
// gap — the element doesn't exist yet to start buffering until the
// transition actually mounts.
export function RabbitTransitionPreloaderDesktop() {
  return (
    <video
      aria-hidden="true"
      preload="auto"
      muted
      playsInline
      src={video}
      style={{ position: 'fixed', top: 0, left: 0, width: 0, height: 0, opacity: 0, pointerEvents: 'none' }}
    />
  );
}

interface RabbitTransitionProps {
  /** While false, the video loops forever instead of playing once — it
   * only plays out its current pass to the end (firing onComplete) once
   * this becomes true. Defaults to true (plays once, same as if there
   * were nothing to wait for). */
  ready?: boolean;
  /** Called once, when the video finishes its final (non-looping) pass. */
  onComplete?: () => void;
}

export default function RabbitTransitionDesktop({ ready = true, onComplete }: RabbitTransitionProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  // Toggling the native `loop` property (instead of tearing down and
  // restarting playback some other way) lets a `ready` flip mid-loop
  // take effect without cutting the animation off: the browser lets the
  // current pass finish playing out to its natural end instead of
  // jumping back to frame 0, and `ended` only fires once looping has
  // actually stopped — so this is also what makes onComplete fire.
  useEffect(() => {
    const el = videoRef.current;
    if (el) el.loop = !ready;
  }, [ready]);

  return createPortal(
    <div className="rabbit-transition" aria-hidden="true">
      <video
        ref={videoRef}
        className="rabbit-transition__video"
        src={video}
        autoPlay
        muted
        playsInline
        loop={!ready}
        onEnded={() => onCompleteRef.current?.()}
      />
    </div>,
    document.body,
  );
}
