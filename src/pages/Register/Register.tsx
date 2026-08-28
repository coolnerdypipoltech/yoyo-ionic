import {
  IonActionSheet,
  IonButton,
  IonButtons,
  IonCheckbox,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonSpinner,
  IonToolbar,
} from '@ionic/react';
import { chevronForward } from 'ionicons/icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import FormField from '../../components/FormField/FormField';
import BackButton from '../../components/BackButton/BackButton';
import PasswordField from '../../components/PasswordField/PasswordField';
import PhoneNumberField from '../../components/PhoneNumberField/PhoneNumberField';
import { ApiError } from '../../api/errors';
import * as authService from '../../api/services/auth.service';
import { dialCodeFor, DEFAULT_COUNTRY_ISO2 } from '../../utils/countries';
import {
  GENDER_OPTIONS,
  assemblePhone,
  isValidAccessCode,
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
  code: string;
  age: string;
  gender: Gender;
  countryIso2: string;
  phone: string;
  pronouns: string;
  password: string;
  confirmPassword: string;
  termsAccepted: boolean;
}

export default function Register() {
  const { t } = useTranslation(['auth', 'common', 'errors']);
  const history = useHistory();
  const location = useLocation<LocationState | undefined>();

  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    code: location.state?.accessCode ?? '',
    age: '',
    gender: 'Women',
    countryIso2: DEFAULT_COUNTRY_ISO2,
    phone: '',
    pronouns: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false,
  });
  const [isGenderSheetOpen, setIsGenderSheetOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const genderLabel = (gender: Gender) =>
    t(`common:gender.${gender === 'Women' ? 'women' : gender === 'Men' ? 'men' : 'unspecified'}`);

  const validate = (): string | null => {
    const missing: string[] = [];
    if (!form.name.trim()) missing.push(t('register.fullName'));
    if (!form.email.trim()) missing.push(t('register.email'));
    if (!form.code.trim()) missing.push(t('register.code'));
    if (!form.pronouns.trim()) missing.push(t('register.pronouns'));
    if (!form.age.trim()) missing.push(t('register.age'));
    if (!form.phone.trim()) missing.push(t('register.phone'));
    if (!form.password) missing.push(t('register.password'));
    if (missing.length > 0) {
      return t('register.errors.missingFields');
    }
    if (!isValidEmail(form.email)) return t('register.errors.invalidEmail');
    if (!isValidAccessCode(form.code)) return t('register.errors.invalidCode');
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
        phone: assemblePhone(dialCodeFor(form.countryIso2), form.phone),
        password: form.password,
        points: 0,
        pronouns: form.pronouns.trim(),
        access_code: form.code.trim(),
      });
      // Replace, not push — once you've registered, pressing back from
      // Login should land on Welcome, not bounce back into this form.
      history.replace('/login', { justRegistered: true });
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
      <IonHeader className="ion-no-border yoyo-header-offset register-page__header">
        <IonToolbar>
          <IonButtons slot="start">
            <BackButton defaultHref="/verify-code" />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="register-page">
        <div className="register-page__content">
          <h1 className="register-page__title">{t('register.title')}</h1>

          <FormField required label={t('register.email')} type="email" value={form.email} onChange={(v) => update('email', v)} />

          <FormField required label={t('register.fullName')} value={form.name} onChange={(v) => update('name', v)} />
          <p className="register-page__hint">{t('register.nameHint')}</p>

          <FormField
            required
            label={t('register.code')}
            value={form.code}
            onChange={(v) => update('code', v.replace(/[^a-zA-Z0-9]/g, '').slice(0, 6))}
          />
          <p className="register-page__hint">{t('register.codeHint')}</p>

          <button type="button" className="register-page__select" onClick={() => setIsGenderSheetOpen(true)}>
            <span>{genderLabel(form.gender)}</span>
            <IonIcon icon={chevronForward} className="register-page__select-chevron" />
          </button>

          <FormField required label={t('register.pronouns')} value={form.pronouns} onChange={(v) => update('pronouns', v)} />
          <FormField required label={t('register.age')} type="number" value={form.age} onChange={(v) => update('age', v)} />

          <PhoneNumberField
            countryIso2={form.countryIso2}
            onCountryChange={(iso2) => update('countryIso2', iso2)}
            countryLabel={t('register.country')}
            phone={form.phone}
            onPhoneChange={(v) => update('phone', v)}
            phoneLabel={t('register.phone')}
            phonePlaceholder="9999999999"
          />

          <PasswordField label={t('register.password')} value={form.password} onChange={(v) => update('password', v)} />
          <PasswordField
            label={t('register.confirmPassword')}
            value={form.confirmPassword}
            onChange={(v) => update('confirmPassword', v)}
          />
          <p className="register-page__hint">{t('register.passwordHint')}</p>

          <label className="register-page__terms">
            <IonCheckbox
              className="register-page__checkbox"
              checked={form.termsAccepted}
              onIonChange={(e) => update('termsAccepted', e.detail.checked)}
            />
            <span>
              {t('register.termsLabel')}{' '}
              {t('register.termsLabel2')}
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

          <button type="button" className="register-page__login-link" onClick={() => history.replace('/login')}>
            {t('register.alreadyHaveAccount')} <a href="#login" onClick={() => history.replace('/login')}>
                {t('register.goToLogin')}
              </a>
          </button>
        </div>
      </IonContent>

      <IonActionSheet
        isOpen={isGenderSheetOpen}
        onDidDismiss={() => setIsGenderSheetOpen(false)}
        header={t('register.gender')}
        className="register-page__gender-sheet"
        buttons={[
          ...GENDER_OPTIONS.map((option) => ({
            text: genderLabel(option),
            handler: () => update('gender', option),
          })),
          { text: t('common:buttons.cancel'), role: 'cancel' },
        ]}
      />
    </IonPage>
  );
}
