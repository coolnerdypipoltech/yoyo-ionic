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
export default function BackButton({ defaultHref, closeHref }: BackButtonProps) {
  return <IonBackButton className="yoyo-back-button" defaultHref={defaultHref} text="" icon={!closeHref ? backIcon : cerrar} />;
}
