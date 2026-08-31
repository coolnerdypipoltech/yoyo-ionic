import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonSpinner,
  IonToolbar,
} from '@ionic/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import BackButton from '../../components/BackButton/BackButton';
import PasswordField from '../../components/PasswordField/PasswordField';
import { isValidAccessCode } from '../../utils/validation';
import * as authService from '../../api/services/auth.service';
import BackgroundGradient from "../../components/BackgroundGradient/BackgroundGradient";
import gradient from "../../assets/backgrounds/verify_code.png";
import './VerifyCode.css';

export default function VerifyCode() {
  const { t } = useTranslation('auth');
  const history = useHistory();

  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleVerify = async () => {
    if (!isValidAccessCode(code)) return;
    setError(null);
    setIsSubmitting(true);
    try {
      await authService.verifyAccessCode(code);
      // Replace instead of push — Register shouldn't be a page you can
      // land back on via the hardware/browser back button once you've
      // moved past it (see Register's own push->replace to Login).
      history.replace('/register', { accessCode: code });
      
    } catch {
      // The backend distinguishes "not found" (404) from "already redeemed"
      // (400), but the old client never surfaced that distinction to the
      // user either — every failure shows the same generic message here.
      setError(t('verifyCode.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <IonPage>
      
      <BackgroundGradient src={gradient} />
      <IonHeader className="ion-no-border yoyo-header-offset verify-code-page__header">
        <IonToolbar>
          <IonButtons slot="start">
            <BackButton defaultHref="/welcome" />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="verify-code-page">
        <div className="verify-code-page__content">
          <h1 className="verify-code-page__title">{t('verifyCode.title')}</h1>
          <p className="verify-code-page__instructions">{t('verifyCode.instructions')}</p>

          <PasswordField
            label={t('verifyCode.placeholder')}
            className="verify-code-page__input-wrap"
            inputClassName="verify-code-page__input"
            value={code}
            onChange={(v) => setCode(v.replace(/[^a-zA-Z0-9]/g, '').slice(0, 6))}
            maxLength={6}
          />

          {error ? <p className="verify-code-page__error">/{error}</p> : null}

          <IonButton
            expand="block"
            size="large"
            className="yoyo-pill--white"
            disabled={code.length !== 6 || isSubmitting}
            onClick={handleVerify}
          >
            {isSubmitting ? <IonSpinner name="dots" /> : t('verifyCode.continue')}
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
}
