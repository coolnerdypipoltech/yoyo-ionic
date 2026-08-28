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
import FormField from '../../components/FormField/FormField';
import BackButton from '../../components/BackButton/BackButton';
import { isValidEmail } from '../../utils/validation';
import * as authService from '../../api/services/auth.service';
import './PasswordRecovery.css';

export default function PasswordRecovery() {
  const { t } = useTranslation('auth');
  const history = useHistory();

  const [email, setEmail] = useState('');
  const [invalid, setInvalid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    if (!email.trim() || !isValidEmail(email)) {
      setInvalid(true);
      return;
    }
    setInvalid(false);
    setIsSubmitting(true);
    try {
      await authService.requestPasswordReset(email.trim());
    } catch {
      // Intentionally ignored: the backend always responds 204 to avoid
      // leaking which emails are registered — show the same success state
      // regardless of outcome (see YoYo-API-Reference.md §3.4).
    } finally {
      setIsSubmitting(false);
      setSent(true);
    }
  };

  return (
    <IonPage>
      <div className="password-recovery-page__glow" />
      <IonHeader className="ion-no-border yoyo-header-offset password-recovery-page__header">
        <IonToolbar>
          <IonButtons slot="start">
            <BackButton defaultHref="/login" />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="password-recovery-page">
        <div className="password-recovery-page__content">
          <h1 className="password-recovery-page__title">{t('passwordRecovery.title')}</h1>
          <p className="password-recovery-page__instructions">{t('passwordRecovery.instructions')}</p>

          <FormField
            label={t('passwordRecovery.emailPlaceholder')}
            type="email"
            value={email}
            onChange={(v) => {
              setEmail(v);
              if (invalid) setInvalid(!isValidEmail(v));
            }}
            error={invalid ? t('passwordRecovery.invalidEmail') : undefined}
          />

          <IonButton expand="block" size="large" className="yoyo-pill--white" disabled={isSubmitting} onClick={handleSend}>
            {isSubmitting ? <IonSpinner name="dots" /> : t('passwordRecovery.send')}
          </IonButton>
        </div>

        {sent ? (
          <div className="password-recovery-page__overlay">
            <div className="password-recovery-page__popup">
              <p className="password-recovery-page__popup-text">{t('passwordRecovery.successMessage')}</p>
              <IonButton
                expand="block"
                fill="clear"
                className="yoyo-pill--dark  password-recovery-page__popup-button"
                onClick={() => history.push('/login')}
              >
                {t('passwordRecovery.successButton')}
              </IonButton>
            </div>
          </div>
        ) : null}
      </IonContent>
    </IonPage>
  );
}
