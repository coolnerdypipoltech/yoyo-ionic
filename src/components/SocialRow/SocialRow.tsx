import { IonIcon } from '@ionic/react';
import { globeOutline, logoFacebook, logoInstagram } from 'ionicons/icons';
import './SocialRow.css';

interface SocialRowProps {
  websiteUrl?: string | null;
  facebookUrl?: string | null;
  instagramUrl?: string | null;
}

export default function SocialRow({ websiteUrl, facebookUrl, instagramUrl }: SocialRowProps) {
  if (!websiteUrl && !facebookUrl && !instagramUrl) return null;

  return (
    <div className="social-row">
      {websiteUrl ? (
        <a className="social-row__icon" href={websiteUrl} target="_blank" rel="noopener noreferrer">
          <IonIcon icon={globeOutline} />
        </a>
      ) : null}
      {facebookUrl ? (
        <a className="social-row__icon" href={facebookUrl} target="_blank" rel="noopener noreferrer">
          <IonIcon icon={logoFacebook} />
        </a>
      ) : null}
      {instagramUrl ? (
        <a className="social-row__icon" href={instagramUrl} target="_blank" rel="noopener noreferrer">
          <IonIcon icon={logoInstagram} />
        </a>
      ) : null}
    </div>
  );
}
