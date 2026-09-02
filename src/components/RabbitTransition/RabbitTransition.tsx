import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import './RabbitTransition.css';
import gradient from '../../assets/backgrounds/welcome.png';
// ---- Frame sequences (src/assets/animation/*) ----
const idleFrames = Array.from(
  { length: 16 },
  (_, i) => new URL(`../../assets/animation/Idle/Idle_Rabbit${String(i).padStart(2, '0')}.png`, import.meta.url).href,
);
const runFrames = Array.from(
  { length: 12 },
  (_, i) => new URL(`../../assets/animation/Run/Run_Rabbit${String(i + 3).padStart(2, '0')}.png`, import.meta.url).href,
);
const jumpFrames = Array.from(
  { length: 13 },
  (_, i) => new URL(`../../assets/animation/Salto/jump_rabbit_${String(i + 3).padStart(2, '0')}.png`, import.meta.url).href,
);

let hasPreloaded = false;

// Warms the browser's cache for every asset this component needs (all
// sprite frames plus its backdrop image) so the very first play-through
// — right after login — doesn't stutter waiting on first fetches.
// Exported so the unauthenticated flow (Welcome/Login/etc., which is
// exactly the "idle time" before a login can complete) can trigger this
// well ahead of Places ever mounting, instead of relying on it only
// once RabbitTransition itself is first rendered.
export function preloadRabbitTransitionAssets() {
  if (hasPreloaded) return;
  hasPreloaded = true;
  [...idleFrames, ...runFrames, ...jumpFrames, gradient].forEach((src) => {
    const img = new Image();
    img.src = src;
  });
}

// Also run once as soon as this module itself loads, in case something
// imports it without going through the explicit call above.
preloadRabbitTransitionAssets();

interface MovingPhase {
  frames: string[];
  fps: number;
  fromX: number;
  toX: number;
  duration: number;
  /** Peak height (px) of a parabolic arc added on top of the ground
   * position — 0 for a flat run, set on the jump phases so they
   * actually leave the ground instead of just sliding sideways. */
  jumpHeight: number;
}

interface StillPhase {
  frames: string[];
  fps: number;
  x: number;
}

// ---- Tune the whole sequence here ----
// x positions are vw, measured from the left edge to the sprite's own
// horizontal *center* (not its left edge) — 50 is screen-center
// regardless of sprite width. Durations are ms. Phases run in the order
// listed below; each one's `toX`/`x` should match the next one's
// `fromX`/`x` so the rabbit doesn't visibly jump between phases.
export const RABBIT_TRANSITION_CONFIG = {
  jumpIn: { frames: jumpFrames, fps: 36, fromX: -20, toX: 50, duration: 450, jumpHeight: 70 } satisfies MovingPhase,
  idle: { frames: idleFrames, fps: 20, x: 50 } satisfies StillPhase,
  run: { frames: runFrames, fps: 32, fromX: 50, toX: 88, duration: 425, jumpHeight: 0 } satisfies MovingPhase,
  jumpOut: { frames: jumpFrames, fps: 36, fromX: 88, toX: 130, duration: 400, jumpHeight: 70 } satisfies MovingPhase,
};

// Vertical placement (from the bottom of the screen) and on-screen size
// — shared by every phase, since only horizontal position changes.
export const RABBIT_GROUND_OFFSET = '45%';
export const RABBIT_SPRITE_SIZE = 150;

const PHASE_ORDER = Object.keys(RABBIT_TRANSITION_CONFIG) as (keyof typeof RABBIT_TRANSITION_CONFIG)[];

function isMovingPhase(phase: MovingPhase | StillPhase): phase is MovingPhase {
  return 'fromX' in phase;
}

// Ease-in-out — the horizontal move ramps up and settles instead of
// running at a constant speed, which reads more like a hop/run than a
// mechanical slide.
function easeInOutQuad(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
}

// 0 at t=0 and t=1, peaking at `height` when t=0.5 — a symmetric
// parabola, so a jump phase rises and falls back to the ground over its
// own duration instead of just sliding horizontally.
function jumpArc(t: number, height: number): number {
  return height * 4 * t * (1 - t);
}

interface RabbitTransitionProps {
  /** While the current phase is `idle`, it loops forever instead of
   * playing once — it only advances to `run` once this becomes true.
   * Defaults to true (idle plays once, same as if there were nothing to
   * wait for). */
  ready?: boolean;
  /** Called once, after the last phase (jumpOut) finishes. */
  onComplete?: () => void;
}

export default function RabbitTransition({ ready = true, onComplete }: RabbitTransitionProps) {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [frameIndex, setFrameIndex] = useState(0);
  const [x, setX] = useState(RABBIT_TRANSITION_CONFIG.jumpIn.fromX);
  const [y, setY] = useState(0);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  const readyRef = useRef(ready);
  readyRef.current = ready;

  useEffect(() => {
    const phase = RABBIT_TRANSITION_CONFIG[PHASE_ORDER[phaseIndex]];
    let startTime: number | null = null;
    let rafId: number;

    const tick = (time: number) => {
      if (startTime === null) startTime = time;
      const elapsed = time - startTime;

      if (!isMovingPhase(phase)) {
        // idle: loops forever (frame index wraps instead of clamping)
        // and only advances to `run` once the caller says it's ready.
        setFrameIndex(Math.floor((elapsed / 1000) * phase.fps) % phase.frames.length);
        setX(phase.x);
        setY(0);

        if (readyRef.current) {
          setPhaseIndex((p) => p + 1);
          return;
        }
        rafId = requestAnimationFrame(tick);
        return;
      }

      const progress = Math.min(elapsed / phase.duration, 1);
      setFrameIndex(Math.min(Math.floor((elapsed / 1000) * phase.fps), phase.frames.length - 1));
      setX(phase.fromX + (phase.toX - phase.fromX) * easeInOutQuad(progress));
      setY(jumpArc(progress, phase.jumpHeight));

      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
        return;
      }
      if (phaseIndex < PHASE_ORDER.length - 1) {
        setPhaseIndex((p) => p + 1);
      } else {
        onCompleteRef.current?.();
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [phaseIndex]);

  const phase = RABBIT_TRANSITION_CONFIG[PHASE_ORDER[phaseIndex]];
  const src = phase.frames[Math.min(frameIndex, phase.frames.length - 1)];

  return createPortal(
    <div
      className="rabbit-transition"
      style={{ backgroundImage: `url(${gradient})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      aria-hidden="true"
    >
      <img
        className="rabbit-transition__sprite"
        src={src}
        alt=""
        style={{
          left: `${x}vw`,
          bottom: `calc(${RABBIT_GROUND_OFFSET} + ${y}px)`,
          width: RABBIT_SPRITE_SIZE,
          height: RABBIT_SPRITE_SIZE,
        }}
      />
    </div>,
    document.body,
  );
}
