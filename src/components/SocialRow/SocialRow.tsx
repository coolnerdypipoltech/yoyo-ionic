
import './SocialRow.css';

import instagram from "../../assets/icons/Intagram_icon.svg";
import facebook from "../../assets/icons/Facebook_icon.svg";
import web from "../../assets/icons/Web_icon.svg";

import instagram2 from "../../assets/icons/Intagram_icon2.svg";
import facebook2 from "../../assets/icons/Facebook_icon2.svg";
import web2 from "../../assets/icons/Web_icon2.svg";

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
          <img className="social-row__icon-img social-row__icon-img--default" src={instagram} alt="Instagram" />
          <img className="social-row__icon-img social-row__icon-img--hover" src={instagram2} alt="" />
        </a>
      ) : null}

      {facebookUrl ? (
        <a className="social-row__icon" href={facebookUrl} target="_blank" rel="noopener noreferrer">
          <img className="social-row__icon-img social-row__icon-img--default" src={facebook} alt="Facebook" />
          <img className="social-row__icon-img social-row__icon-img--hover" src={facebook2} alt="" />
        </a>
      ) : null}

      {websiteUrl ? (
        <a className="social-row__icon" href={websiteUrl} target="_blank" rel="noopener noreferrer">
          <img className="social-row__icon-img social-row__icon-img--default" src={web} alt="Website" />
          <img className="social-row__icon-img social-row__icon-img--hover" src={web2} alt="" />
        </a>
      ) : null}
    </div>
  );
}
