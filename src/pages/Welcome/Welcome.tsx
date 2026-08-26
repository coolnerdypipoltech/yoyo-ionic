import { IonButton, IonContent, IonPage } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import logoPattern from '../../assets/Logo YOYO.png';
import rabbit from "../../assets/icons/Icon_rabbit.svg"
import './Welcome.css';

export default function Welcome() {
  const { t } = useTranslation('auth');
  const history = useHistory();

  return (
    <IonPage>
      <IonContent fullscreen className="welcome-page">
        <div className="welcome-page__glow" />

        <div className="welcome-page__content">
          <div></div>
          <div>
            <div className="welcome-page__logo-frame">
            <img className="welcome-page__logo" src={logoPattern} alt="YOYO" />
          </div>
          
          </div>

          <div className="welcome-page__actions">
            <img src={rabbit} className='welcome-page__rabbit' alt="Rabbit" />
            <p className="welcome-page__tagline">{t('welcome.tagline')}</p>
            <IonButton expand="block" size="large" className="yoyo-pill--white" onClick={() => history.push('/login')}>
              {t('welcome.logIn')}
            </IonButton>
            <IonButton
              expand="block"
              size="large"
              className="yoyo-pill--dark"
              onClick={() => history.push('/verify-code')}
            >
              {t('welcome.createAccount')}
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}
