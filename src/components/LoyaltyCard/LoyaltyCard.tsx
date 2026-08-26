import { createGesture, IonButton } from '@ionic/react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { MouseEvent } from 'react';
import type { User } from '../../api/types';
import { openWhatsApp, padUserId } from '../../services/whatsapp';

import './LoyaltyCard.css';
import background from '../../assets/card/Tarjeta_YOYO.png';
import rabbit from '../../assets/card/Tarjeta_YOYO_rabbit.png';
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
        const liveRotation = rotation + ev.deltaX * DRAG_SENSITIVITY;
        setRotation(Math.round(liveRotation / 180) * 180);
      },
    });
    gesture.enable();
    return () => gesture.destroy();
    // `rotation` is read inside the gesture's onEnd closure — re-create the
    // gesture whenever it changes so that closure always sees the latest
    // settled value instead of a stale one captured at mount time.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rotation]);

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
        <div className="loyalty-card__edge loyalty-card__edge--top" />
        <div className="loyalty-card__edge loyalty-card__edge--bottom" />
        <div className="loyalty-card__edge loyalty-card__edge--left" />
        <div className="loyalty-card__edge loyalty-card__edge--right" />

        <div className="loyalty-card__face loyalty-card__face--front" aria-hidden={isBackVisible}>
          <div className="loyalty-card__badge">
            <img src={rabbit} alt="" />
          </div>
          <div className="loyalty-card__front-info">
            <span className="loyalty-card__id">{padUserId(user.id)}</span>
            <span className="loyalty-card__name">{user.name}</span>
          </div>
          <span className="loyalty-card__shine" />
        </div>

        <div className="loyalty-card__face loyalty-card__face--back" aria-hidden={!isBackVisible}>
          <div className="loyalty-card__points-row">
            <div className="loyalty-card__points-block">
              <span className="loyalty-card__points-label">{t('loyaltyCard.totalPoints')}</span>
              <span className="loyalty-card__points-value">{user.related.total_points}</span>
            </div>
            <div className="loyalty-card__points-block">
              <span className="loyalty-card__points-label">{t('loyaltyCard.availablePoints')}</span>
              <span className="loyalty-card__points-value">{user.related.points}</span>
            </div>
          </div>
          <IonButton size="small" className="loyalty-card__add-button" onClick={handleAddPoints}>
            {t('loyaltyCard.addPoints')}
          </IonButton>
        </div>
      </div>
    </div>
  );
}
