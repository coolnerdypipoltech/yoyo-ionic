import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonSpinner,
  IonToolbar,
} from '@ionic/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import FormField from '../../components/FormField/FormField';
import PasswordField from '../../components/PasswordField/PasswordField';
import BackButton from '../../components/BackButton/BackButton';

import { useAuth } from '../../context/AuthContext';
import { ApiError } from '../../api/errors';
import './Login.css';
import yoyoLogo from '../../assets/icons/YoyoLetters.png';
interface LocationState {
  justRegistered?: boolean;
}

export default function Login() {
  const { t } = useTranslation(['auth', 'common']);
  const history = useHistory();
  const location = useLocation<LocationState | undefined>();
  const { login } = useAuth();

  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showVerifyBanner] = useState(Boolean(location.state?.justRegistered));

  useEffect(() => {
    if (location.state?.justRegistered) {
      history.replace(location.pathname);
    }
    // Intentionally run once on mount — clears the one-time banner state.
  }, []);

  const handleLogIn = async () => {
    if (!email.trim() || !password) {
      setError(t('login.genericError'));
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      await login(email.trim(), password);
    } catch (err) {
      if (err instanceof ApiError && err.code === 'api.error.email_not_verified') {
        setError(t('login.verifyEmailBanner'));
      } else {
        setError(t('login.genericError'));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <IonPage>
      <div className="login-page__glow" />
      <IonHeader className="ion-no-border yoyo-header-offset login-page__header">
        <IonToolbar>
          <IonButtons slot="start">
            <BackButton defaultHref="/welcome" />
          </IonButtons>
          <img src={yoyoLogo} className="login-page__logo" alt="YOYO" />

        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="login-page">
        <div className="login-page__content">
          <h1 className="login-page__heading">
            <span className="login-page__heading-line">{t('login.headingLine1')}</span>
            <span className="login-page__heading-line">{t('login.headingLine2')}</span>
            <span className="login-page__heading-display">{t('login.headingLine3')}</span>
          </h1>

          {showVerifyBanner ? (
            <div className="login-page__banner">{t('login.verifyEmailBanner')}</div>
          ) : null}

          <FormField label={t('login.email')} type="email" value={email} onChange={setEmail} />
          <PasswordField label={t('login.password')} value={password} onChange={setPassword} />

          <button
            type="button"
            className="login-page__forgot"
            onClick={() => history.push('/password-recovery')}
          >
            {t('login.forgotPassword')}
          </button>

          {error ? <p className="login-page__error">{error}</p> : null}

          <IonButton expand="block" size="large" className="yoyo-pill--white" disabled={isSubmitting} onClick={handleLogIn}>
            {isSubmitting ? <IonSpinner name="dots" /> : t('login.continue')}
          </IonButton>

        </div>
      </IonContent>
    </IonPage>
  );
}
