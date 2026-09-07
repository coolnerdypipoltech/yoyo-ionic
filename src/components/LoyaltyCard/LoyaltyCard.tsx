import { createGesture, IonButton } from '@ionic/react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { MouseEvent } from 'react';
import type { User } from '../../api/types';
import { openWhatsApp, padUserId } from '../../services/whatsapp';

import './LoyaltyCard.css';
import background from '../../assets/card/Tarjeta_YOYO.png';
import rabbit from '../../assets/card/Tarjeta_YOYO_rabbit.png';
import line from "../../assets/card/Line_card.png"
const FRAME_COUNT = 72;
const frames = Array.from(
  { length: FRAME_COUNT },
  (_, i) => new URL(`../../assets/card/animation/CardFX_${String(i).padStart(2, '0')}.png`, import.meta.url).href
);

// Warm the browser's cache for every frame as soon as this module loads.
// Without this, each frame's <img src> (set below, cycling at ~30fps)
// only starts fetching the first time the animation reaches it — visible
// as that frame popping in/loading live instead of already being ready,
// repeating every time the 72-frame loop comes back around to one that
// hadn't finished loading yet.
frames.forEach((src) => {
  const img = new Image();
  img.src = src;
});

interface LoyaltyCardProps {
  user: User;
}

const DRAG_SENSITIVITY = 0.5; // deg of Y-axis rotation per px dragged horizontally
const MAX_TILT = 10; // deg of X-axis "holographic" tilt while held
const TAP_THRESHOLD = 10; // px — below this, a release is treated as a tap, not a drag

export default function LoyaltyCard({ user }: LoyaltyCardProps) {
  const { t } = useTranslation(['main', 'common']);
  const flipperRef = useRef<HTMLDivElement>(null);

  // `rotation` is the settled resting angle (always a multiple of 180).
  // `liveOffset`/`tiltX` are transient, gesture-driven values applied on
  // top of it while a finger is down — they make the card follow the
  // thumb in real time instead of jumping straight to the next face.
  const [rotation, setRotation] = useState(0);
  const [liveOffset, setLiveOffset] = useState(0);
  const [tiltX, setTiltX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    const el = flipperRef.current;
    if (!el) return;

    let cardRect: DOMRect | null = null;

    const gesture = createGesture({
      el,
      gestureName: 'loyalty-card-tilt',
      direction: 'x',
      threshold: 0,
      // Let taps on the "Add Points" button (visible on the back face)
      // through without the tilt/drag gesture hijacking them.
      canStart: (ev) => !(ev.event.target as HTMLElement | null)?.closest('ion-button'),
      onStart: () => {
        cardRect = el.getBoundingClientRect();
        setIsDragging(true);
      },
      onMove: (ev) => {
        setLiveOffset(ev.deltaX * DRAG_SENSITIVITY);
        if (cardRect) {
          const relativeY = (ev.currentY - (cardRect.top + cardRect.height / 2)) / (cardRect.height / 2);
          setTiltX(Math.max(-1, Math.min(1, -relativeY)) * MAX_TILT);
        }
      },
      onEnd: (ev) => {
        setIsDragging(false);
        setTiltX(0);
        setLiveOffset(0);

        if (Math.abs(ev.deltaX) < TAP_THRESHOLD) {
          // A tap, not a drag — flip towards whichever side was tapped.
          const rect = el.getBoundingClientRect();
          const tappedRightSide = ev.currentX - rect.left > rect.width / 2;
          setRotation((r) => r + (tappedRightSide ? 180 : -180));
          return;
        }

        // A real drag — snap to whichever face ends up closer, like a
        // card settling after being flicked, rather than requiring a
        // full 180° drag to complete the flip. Rounding to the nearest
        // multiple of 180 in one step (instead of separately rounding a
        // "which full turn" and a "front or back" decision) guarantees the
        // result is always within 90° of the live position — otherwise
        // the two roundings could disagree near their boundaries and send
        // the card spinning an extra half-turn to reach the target.
        setRotation((r) => Math.round((r + ev.deltaX * DRAG_SENSITIVITY) / 180) * 180);
      },
    });
    gesture.enable();
    return () => gesture.destroy();
    // Deliberately mount-once (empty deps, using the functional setRotation
    // form above instead of reading `rotation` directly) — recreating the
    // gesture on every flip used to reset Ionic's own touch/mouse
    // ghost-click guard (createPointerEvents' `lastTouchEvent`, scoped to
    // one gesture instance), which is what deduplicates a tap's real touch
    // event against the synthetic compatibility mousedown/mouseup every
    // touchscreen fires ~afterward. With a fresh gesture instance for every
    // tap, that guard never got the chance to see the touch that just
    // happened, so the synthetic mouse pair was treated as a second,
    // independent tap — flipping the card twice and landing back on the
    // same face.
  }, []);

  // Animate the holographic frame sequence while the user is dragging the card.
  useEffect(() => {
    if (isDragging) {
      setFrameIndex(0);
      return;
    }

    let rafId: number;
    let lastTime = 0;
    const FRAME_DURATION = 40; // ~30 fps

    const tick = (time: number) => {
      if (time - lastTime >= FRAME_DURATION) {
        setFrameIndex((i) => (i + 1) % frames.length);
        lastTime = time;
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [isDragging]);

  const handleAddPoints = (e: MouseEvent) => {
    e.stopPropagation();
    openWhatsApp(t('common:whatsapp.addPoints', { id: padUserId(user.id) }));
  };

  const displayRotation = rotation + liveOffset;
  const normalizedRotation = ((rotation % 360) + 360) % 360;
  const isBackVisible = normalizedRotation === 180;


  return (
    <div className="loyalty-card__scene">
      <div
        className={`loyalty-card__flipper${isDragging ? ' loyalty-card__flipper--dragging' : ''}`}
        style={{ transform: `rotateX(${tiltX}deg) rotateY(${displayRotation}deg)`, backgroundImage: `url(${background})` }}
        ref={flipperRef}
        role="button"
        tabIndex={0}
        aria-label={t('loyaltyCard.flipHint')}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') setRotation((r) => r + 180);
        }}
      >


        <div className="loyalty-card__face loyalty-card__face--front" aria-hidden={isBackVisible}>
          <div className="loyalty-card__badge">
            <img src={rabbit} style={{height: "80px", width: "auto"}} alt="" />
          </div>
          <div className="loyalty-card__front-info">
            <span className="loyalty-card__id">{padUserId(user.id)}</span>
            <span className="loyalty-card__name">{user.name}</span>
          </div>

        </div>


        <div className="loyalty-card__face loyalty-card__face--back" aria-hidden={!isBackVisible} style={{padding: "5%"}}>
          <div className="loyalty-card__points-row">
            <div className="loyalty-card__points-block">
              <span className="loyalty-card__points-label">{t('loyaltyCard.totalPoints')}</span>
              <span className="loyalty-card__points-value">{t('loyaltyCard.points', { points: user.related.total_points })}</span>
            </div>
            <div style={{width: "100%", display: "flex", justifyContent: "center"}}>
              <img src={line} alt="line" />
            </div>
            <div className="loyalty-card__points-block">
              <span className="loyalty-card__points-label">{t('loyaltyCard.availablePoints')}</span>
              <span className="loyalty-card__points-value"> {t('loyaltyCard.points', { points: user.related.points })}</span>
            </div>
          </div>
          <IonButton size="small" className="loyalty-card__add-button" onClick={handleAddPoints}>
            {t('loyaltyCard.addPoints')}
          </IonButton>
        </div>

        {/* All 72 frames are mounted once, up front, and stay mounted for
           the component's whole lifetime — each <img> only ever gets one
           `src`, so the browser fetches/decodes it exactly once, ever.
           Advancing the animation just toggles which one has `display:
           block`; a single <img> whose `src` kept changing every ~33ms
           (the old approach) made the browser re-request that URL on
           every pass through the loop, since a changed src attribute is
           a brand-new load as far as the browser's resource pipeline is
           concerned, even when the response itself came back from cache.
           Hidden via `visibility` (not unmounted) while dragging, so
           dragging repeatedly can't trigger a remount → refetch cycle
           either. */}
        <div className="loyalty-card__face_anim" style={{ zIndex: 10, visibility: isDragging ? 'hidden' : 'visible' }}>
          {frames.map((src, i) => (
            <img key={src} src={src} alt="" style={{ display: i === frameIndex ? 'block' : 'none' }} />
          ))}
        </div>

      </div>
    </div>
  );
}
