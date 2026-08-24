import { IonContent, IonIcon, IonModal } from '@ionic/react';
import { closeOutline, sparklesOutline } from 'ionicons/icons';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { PRIVACY_POLICY_URL } from '../../api/config';
import { useAuth } from '../../context/AuthContext';
import './AccountMenuSheet.css';

interface AccountMenuSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AccountMenuSheet({ isOpen, onClose }: AccountMenuSheetProps) {
  const { t } = useTranslation('main');
  const history = useHistory();
  const { logout } = useAuth();

  const goTo = (path: string) => {
    onClose();
    history.push(path);
  };

  const handlePrivacyPolicy = () => {
    onClose();
    window.open(PRIVACY_POLICY_URL, '_blank', 'noopener,noreferrer');
  };

  const handleLogOut = () => {
    onClose();
    void logout();
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose} initialBreakpoint={0.5} breakpoints={[0, 0.5]}>
      <IonContent className="account-menu-sheet">
        <IonIcon icon={sparklesOutline} className="account-menu-sheet__spark" />

        <div className="account-menu-sheet__list">
          <button type="button" className="account-menu-sheet__item" onClick={() => goTo('/profile')}>
            {t('menu.accountSettings')}
          </button>

          <button type="button" className="account-menu-sheet__item" onClick={() => goTo('/faqs')}>
            {t('menu.faqs')}
          </button>

          <button type="button" className="account-menu-sheet__item" onClick={handlePrivacyPolicy}>
            {t('menu.privacyPolicies')}
          </button>

          <button type="button" className="account-menu-sheet__item account-menu-sheet__item--last" onClick={handleLogOut}>
            {t('menu.logOut')}
          </button>
        </div>

        <button type="button" className="account-menu-sheet__close" aria-label="Close" onClick={onClose}>
          <IonIcon icon={closeOutline} />
        </button>
      </IonContent>
    </IonModal>
  );
}
