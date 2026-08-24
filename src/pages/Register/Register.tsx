import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCheckbox,
  IonContent,
  IonHeader,
  IonPage,
  IonSpinner,
  IonToolbar,
} from '@ionic/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import FormField from '../../components/FormField/FormField';
import PasswordField from '../../components/PasswordField/PasswordField';
import { ApiError } from '../../api/errors';
import * as authService from '../../api/services/auth.service';
import {
  GENDER_OPTIONS,
  assemblePhone,
  isValidAge,
  isValidEmail,
  isValidPassword,
  parseAge,
  type Gender,
} from '../../utils/validation';
import './Register.css';

interface LocationState {
  accessCode?: string;
}

interface FormState {
  name: string;
  email: string;
  age: string;
  gender: Gender;
  countryCode: string;
  phone: string;
  pronouns: string;
  password: string;
  confirmPassword: string;
  termsAccepted: boolean;
}

const INITIAL_STATE: FormState = {
  name: '',
  email: '',
  age: '',
  gender: 'Women',
  countryCode: '+52',
  phone: '',
  pronouns: '',
  password: '',
  confirmPassword: '',
  termsAccepted: false,
};

export default function Register() {
  const { t } = useTranslation(['auth', 'common', 'errors']);
  const history = useHistory();
  const location = useLocation<LocationState | undefined>();
  const accessCode = location.state?.accessCode ?? '';

  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const validate = (): string | null => {
    const missing: string[] = [];
    if (!form.name.trim()) missing.push(t('register.fullName'));
    if (!form.email.trim()) missing.push(t('register.email'));
    if (!form.age.trim()) missing.push(t('register.age'));
    if (!form.phone.trim()) missing.push(t('register.phone'));
    if (!form.password) missing.push(t('register.password'));
    if (!accessCode) missing.push(t('verifyCode.title'));
    if (missing.length > 0) {
      return t('register.errors.missingFields', { fields: missing.join(', ') });
    }
    if (!isValidEmail(form.email)) return t('register.errors.invalidEmail');
    if (!isValidPassword(form.password)) return t('register.errors.invalidPassword');
    const age = parseAge(form.age);
    if (!isValidAge(age)) return t('register.errors.invalidAge');
    if (!form.termsAccepted) return t('register.errors.termsRequired');
    if (form.password !== form.confirmPassword) return t('register.errors.passwordMismatch');
    return null;
  };

  const handleSubmit = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      await authService.signUp({
        name: form.name.trim(),
        email: form.email.trim(),
        age: parseAge(form.age) ?? 0,
        gender: form.gender,
        phone: assemblePhone(form.countryCode, form.phone),
        password: form.password,
        points: 0,
        pronouns: form.pronouns.trim(),
        access_code: accessCode,
      });
      history.push('/login', { justRegistered: true });
    } catch (err) {
      if (err instanceof ApiError && err.isValidationError && err.fieldErrors) {
        setError(Object.values(err.fieldErrors).flat().join(' '));
      } else if (err instanceof ApiError && err.code === 'api.error.already_exists') {
        setError(t('register.errors.alreadyExists'));
      } else if (err instanceof ApiError && err.code === 'api.error.code_not_found') {
        setError(t('errors:codeNotFound'));
      } else if (err instanceof ApiError && err.code === 'api.error.code_already_redeemed') {
        setError(t('errors:codeAlreadyRedeemed'));
      } else {
        setError(t('errors:generic'));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <IonPage>
      <div className="register-page__glow" />
      <IonHeader className="ion-no-border register-page__header">
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/verify-code" text="" />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="register-page">
        <div className="register-page__content">
          <h1 className="register-page__title">{t('register.title')}</h1>
          <p className="register-page__disclaimer">{t('register.disclaimer')}</p>

          <FormField showLabel label={t('register.fullName')} value={form.name} onChange={(v) => update('name', v)} />
          <FormField showLabel label={t('register.email')} type="email" value={form.email} onChange={(v) => update('email', v)} />
          <FormField showLabel label={t('register.pronouns')} value={form.pronouns} onChange={(v) => update('pronouns', v)} />
          <FormField showLabel label={t('register.age')} type="number" value={form.age} onChange={(v) => update('age', v)} />

          <div className="register-page__field-group">
            <span className="register-page__label">{t('register.gender')}</span>
            <div className="register-page__gender-options">
              {GENDER_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`register-page__gender-option${form.gender === option ? ' register-page__gender-option--active' : ''}`}
                  onClick={() => update('gender', option)}
                >
                  {t(`common:gender.${option === 'Women' ? 'women' : option === 'Men' ? 'men' : 'unspecified'}`)}
                </button>
              ))}
            </div>
          </div>

          <div className="register-page__phone-row">
            <FormField showLabel label={t('register.country')} value={form.countryCode} onChange={(v) => update('countryCode', v)} />
            <FormField showLabel label={t('register.phone')} type="tel" value={form.phone} onChange={(v) => update('phone', v)} />
          </div>

          <PasswordField label={t('register.password')} value={form.password} onChange={(v) => update('password', v)} />
          <PasswordField
            label={t('register.confirmPassword')}
            value={form.confirmPassword}
            onChange={(v) => update('confirmPassword', v)}
          />

          <label className="register-page__terms">
            <IonCheckbox
              checked={form.termsAccepted}
              onIonChange={(e) => update('termsAccepted', e.detail.checked)}
            />
            <span>
              {t('register.termsLabel')}{' '}
              <a href="#privacy" onClick={(e) => e.preventDefault()}>
                {t('register.termsLink')}
              </a>
              .
            </span>
          </label>

          {error ? <p className="register-page__error">{error}</p> : null}

          <IonButton expand="block" size="large" className="yoyo-pill--white" disabled={isSubmitting} onClick={handleSubmit}>
            {isSubmitting ? <IonSpinner name="dots" /> : t('register.submit')}
          </IonButton>

          <button type="button" className="register-page__login-link" onClick={() => history.push('/login')}>
            {t('register.alreadyHaveAccount')} {t('register.goToLogin')}
          </button>
        </div>
      </IonContent>
    </IonPage>
  );
}
