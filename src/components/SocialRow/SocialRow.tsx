import { IonIcon } from '@ionic/react';

import './SocialRow.css';

import instagram from "../../assets/icons/Intagram_icon.svg";
import facebook from "../../assets/icons/Facebook_icon.svg";
import web from "../../assets/icons/Web_icon.svg";

interface SocialRowProps {
  websiteUrl?: string | null;
  facebookUrl?: string | null;
  instagramUrl?: string | null;
}

export default function SocialRow({ websiteUrl, facebookUrl, instagramUrl }: SocialRowProps) {
  if (!websiteUrl && !facebookUrl && !instagramUrl) return null;

  return (
    <div className="social-row">
            {instagramUrl ? (
        <a className="social-row__icon" href={instagramUrl} target="_blank" rel="noopener noreferrer">
          <img src={instagram} alt="Instagram" />
        </a>
      ) : null}

      {facebookUrl ? (
        <a className="social-row__icon" href={facebookUrl} target="_blank" rel="noopener noreferrer">
          <img src={facebook} alt="Facebook" />
        </a>
      ) : null}
            {websiteUrl ? (
        <a className="social-row__icon" href={websiteUrl} target="_blank" rel="noopener noreferrer">
          <img src={web} alt="Website" />
        </a>
      ) : null}

    </div>
  );
}
