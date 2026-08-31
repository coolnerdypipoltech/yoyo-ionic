import { IonButton, IonContent, IonPage, IonSpinner, IonHeader, IonToolbar, IonButtons } from '@ionic/react';
import BackButton from '../../components/BackButton/BackButton';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PasswordField from '../../components/PasswordField/PasswordField';
import { useAuth } from '../../context/AuthContext';
import tombstoneIcon from '../../assets/ACCS_Icon_DeleteAcount.png';
import './DeleteAccount.css';

export default function DeleteAccount() {
  const { t } = useTranslation('profile');
  const { deleteAccount } = useAuth();

  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    if (!password) {
      setError(t('deleteAccount.missingPassword'));
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      await deleteAccount(password);
      // Success unmounts this whole tree (isAuthenticated -> false), no
      // explicit navigation needed — see App.tsx.
    } catch {
      // The only documented failure for this endpoint is a wrong password.
      setError(t('deleteAccount.incorrectPassword'));
      setIsSubmitting(false);
    }
  };

  return (
    <IonPage>
      
            <IonHeader className="ion-no-border yoyo-header-offset places-info-page__header" >
        <IonToolbar>
          <IonButtons  slot="start">
            <BackButton defaultHref="/main/places" closeHref={true} />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="delete-account-page">



        <div className="delete-account-page__content">
          <img className="delete-account-page__tombstone" src={tombstoneIcon} alt="" />
          <p className="delete-account-page__instructions">{t('deleteAccount.instructions')}</p>
          <p className="delete-account-page__warning">{t('deleteAccount.warning')}</p>

          <PasswordField label={t('deleteAccount.password')} value={password} onChange={setPassword} />

          {error ? <p className="delete-account-page__error">{error}</p> : null}

          <IonButton expand="block" className="yoyo-pill--dark" disabled={isSubmitting} onClick={handleConfirm}>
            {isSubmitting ? <IonSpinner name="dots" /> : t('deleteAccount.confirm')}
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
}
