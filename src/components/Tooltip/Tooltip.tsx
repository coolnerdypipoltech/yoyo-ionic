import { IonPopover } from '@ionic/react';
import { useState } from 'react';
import type { MouseEvent } from 'react';
import tooltipIcon from '../../assets/icons/tooltip.svg';
import './Tooltip.css';

interface TooltipProps {
  text: string;
  label?: string;
}

export default function Tooltip({ text, label = 'More info' }: TooltipProps) {
  // IonPopover's `trigger` prop looks up the trigger element by ID at the
  // moment it mounts, and never retries — with a dynamically-generated ID
  // it consistently missed the button and silently never opened. Driving
  // `isOpen` directly (keyed off the click event, for positioning) sidesteps
  // that lookup entirely.
  const [openEvent, setOpenEvent] = useState<Event | undefined>(undefined);

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setOpenEvent(e.nativeEvent);
  };

  return (
    <>
      <button type="button" className="yoyo-tooltip__trigger" aria-label={label} onClick={handleClick}>
        <img src={tooltipIcon} alt="" />
      </button>
      <IonPopover
        isOpen={!!openEvent}
        event={openEvent}
        onDidDismiss={() => setOpenEvent(undefined)}
        side="top"
        alignment="center"
        className="yoyo-tooltip__popover"
        arrow
      >
        <div className="yoyo-tooltip__content">{text}</div>
      </IonPopover>
    </>
  );
}
