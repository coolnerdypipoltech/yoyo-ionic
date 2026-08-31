import { IonButton, IonContent, IonModal } from '@ionic/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { PRIVACY_POLICY_URL } from '../../api/config';
import { useAuth } from '../../context/AuthContext';
import './AccountMenuSheet.css';
import spark from "../../assets/icons/SparkG.svg";
interface AccountMenuSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AccountMenuSheet({ isOpen, onClose }: AccountMenuSheetProps) {
  const { t } = useTranslation(['main', 'common']);
  const history = useHistory();
  const { logout } = useAuth();
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

  const goTo = (path: string) => {
    onClose();
    history.push(path);
  };

  const handlePrivacyPolicy = () => {
    onClose();
    window.open(PRIVACY_POLICY_URL, '_blank', 'noopener,noreferrer');
  };

  const confirmLogOut = () => {
    onClose();
    void logout();
  };

  return (
    <>
    {isOpen && (<div  className="border-teal"></div>)}
      <IonModal isOpen={isOpen} onDidDismiss={onClose} initialBreakpoint={0.65} breakpoints={[0, 0.5]} className="account-round-top-borders">
        <IonContent className="account-menu-sheet">
          
          <img src={spark} alt="Spark" className="account-menu-sheet__spark" />

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

            <button
              type="button"
              className="account-menu-sheet__item account-menu-sheet__item--last"
              onClick={() => {
                setIsLogoutConfirmOpen(true);
                onClose();
              }}
            >
              {t('menu.logOut')}
            </button>
          </div>
        </IonContent>
      </IonModal>

      {/* Same custom popup format as PasswordRecovery's success dialog
         (dimmed backdrop + centered dark card) instead of the native
         IonAlert, per the design already established there. Rendered as
         a sibling of IonModal, not inside it — IonModal applies a
         transform to its content while presenting, which would trap a
         position:fixed descendant instead of letting it cover the real
         viewport. */}
      {isLogoutConfirmOpen ? (
        <div className="account-menu-sheet__logout-overlay" onClick={() => setIsLogoutConfirmOpen(false)}>
          <div className="account-menu-sheet__logout-popup">
            <h2 className="account-menu-sheet__logout-popup-title">{t('menu.logOutConfirm')}</h2>
            <p className="account-menu-sheet__logout-popup-text">{t('menu.logOutConfirmMessage')}</p>
            <IonButton
              expand="block"
              fill="clear"
              className="yoyo-pill--white account-menu-sheet__logout-popup-button"
              onClick={confirmLogOut}
            >
              {t('menu.logOutAccept')}
            </IonButton>
            <IonButton
              expand="block"
              fill="clear"
              className="yoyo-pill--dark account-menu-sheet__logout-popup-cancel"
              onClick={() => setIsLogoutConfirmOpen(false)}
            >
              {t('common:buttons.cancel')}
            </IonButton>
          </div>
        </div>
      ) : null}
    </>
  );
}
