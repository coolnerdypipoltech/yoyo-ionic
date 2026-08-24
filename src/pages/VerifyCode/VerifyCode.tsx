import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonPage,
  IonSpinner,
  IonToolbar,
} from '@ionic/react';
import { eyeOffOutline, eyeOutline } from 'ionicons/icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { isValidAccessCode } from '../../utils/validation';
import * as authService from '../../api/services/auth.service';
import './VerifyCode.css';

export default function VerifyCode() {
  const { t } = useTranslation('auth');
  const history = useHistory();

  const [code, setCode] = useState('');
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleVerify = async () => {
    if (!isValidAccessCode(code)) return;
    setError(null);
    setIsSubmitting(true);
    try {
      await authService.verifyAccessCode(code);
      history.push('/register', { accessCode: code });
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
      <div className="verify-code-page__glow" />
      <IonHeader className="ion-no-border verify-code-page__header">
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/welcome" text="" />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="verify-code-page">
        <div className="verify-code-page__content">
          <h1 className="verify-code-page__title">{t('verifyCode.title')}</h1>
          <p className="verify-code-page__instructions">{t('verifyCode.instructions')}</p>

          <div className="verify-code-page__input-wrap">
            <IonInput
              className="verify-code-page__input"
              fill="outline"
              type={visible ? 'text' : 'password'}
              value={code}
              placeholder={t('verifyCode.placeholder')}
              maxlength={6}
              onIonInput={(e) => setCode((e.detail.value ?? '').replace(/[^a-zA-Z0-9]/g, '').slice(0, 6))}
            />
            <button
              type="button"
              className="verify-code-page__toggle"
              aria-label={visible ? 'Hide code' : 'Show code'}
              onClick={() => setVisible((v) => !v)}
            >
              <IonIcon icon={visible ? eyeOffOutline : eyeOutline} />
            </button>
          </div>

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
