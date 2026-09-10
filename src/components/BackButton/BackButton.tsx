import { IonBackButton } from '@ionic/react';
import backIcon from '../../assets/icons/Back.svg';
import cerrar from "../../assets/icons/Icon_cerrar.svg";
import './BackButton.css';

interface BackButtonProps {
  defaultHref: string;
  closeHref?: boolean;
}


// Thin wrapper around IonBackButton so every screen in the app uses the same
// custom back icon instead of Ionic's default chevron, in one place.
//
// The icon itself is rendered as a plain <img>, separate from
// IonBackButton's own icon (still passed via the `icon` prop below so
// Ionic doesn't fall back to its default chevron, but hidden via
// ::part(icon) in the CSS). IonBackButton sizes its icon through Ionic's
// internal font-size-relative shadow-DOM layout, which centers fine on
// desktop but has been reported drifting off-center on real mobile
// browsers — a separate <img>, absolutely centered with plain CSS we
// fully control, sidesteps that instead of fighting it.
export default function BackButton({ defaultHref, closeHref }: BackButtonProps) {
  const icon = closeHref ? cerrar : backIcon;
  return (
    <div className="yoyo-back-button-wrapper">
      <IonBackButton className="yoyo-back-button" defaultHref={defaultHref} text="" icon={icon} />
      <img src={icon} alt="" className="yoyo-back-button__icon" style={{left: closeHref ? "50%" : "45%"}} />
    </div>
  );
}
