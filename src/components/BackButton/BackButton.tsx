import { IonBackButton } from '@ionic/react';
import backIcon from '../../assets/icons/Back.svg';
import './BackButton.css';

interface BackButtonProps {
  defaultHref: string;
}

// Thin wrapper around IonBackButton so every screen in the app uses the same
// custom back icon instead of Ionic's default chevron, in one place.
export default function BackButton({ defaultHref }: BackButtonProps) {
  return <IonBackButton className="yoyo-back-button" defaultHref={defaultHref} text="" icon={backIcon} />;
}
