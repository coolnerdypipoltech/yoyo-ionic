import { IonButton, IonContent, IonIcon, IonModal } from '@ionic/react';
import { closeOutline } from 'ionicons/icons';
import { createAnimation } from '@ionic/core';
import {  useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { PRIVACY_POLICY_URL } from '../../api/config';
import { useAuth } from '../../context/AuthContext';
import { useViewport } from '../../context/ViewportContext';
import './AccountMenuSheet.css';
import spark from "../../assets/icons/SparkG.svg";
interface AccountMenuSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

// Desktop presents this as a right-anchored side panel instead of the
// mobile bottom sheet (see the isMobile branch below), so it needs its
// own slide-in-from-the-right transition — Ionic's built-in modal
// animations only ever slide up (ios: from the bottom, md: as a sheet),
// neither of which fits a side panel. Reaches into the modal's shadow
// root for `.modal-wrapper`/`ion-backdrop` because that's how Ionic's
// own custom-animation examples target them — there's no public
// part()/CSS-var hook for the transform itself.
const desktopEnterAnimation = (baseEl: HTMLElement) => {
  const root = baseEl.shadowRoot;
  const backdropAnimation = createAnimation()
    .addElement(root?.querySelector('ion-backdrop') ?? [])
    .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');
  // Ionic pre-sets the wrapper to opacity: 0.01 before an enter
  // animation runs (to avoid a flash of unstyled content) and expects
  // the animation itself to bring it back to 1 — a transform-only
  // keyframe list leaves it stuck there, fully positioned but invisible.
  const wrapperAnimation = createAnimation()
    .addElement(root?.querySelector('.modal-wrapper') ?? [])
    .keyframes([
      { offset: 0, opacity: '0', transform: 'translateX(100%)' },
      { offset: 1, opacity: '1', transform: 'translateX(0)' },
    ]);
  return createAnimation()
    .addElement(baseEl)
    .easing('cubic-bezier(0.36, 0.66, 0.04, 1)')
    .duration(280)
    .addAnimation([backdropAnimation, wrapperAnimation]);
};

const desktopLeaveAnimation = (baseEl: HTMLElement) => desktopEnterAnimation(baseEl).direction('reverse');

export default function AccountMenuSheet({ isOpen, onClose }: AccountMenuSheetProps) {
  const { t } = useTranslation(['main', 'common']);
  const history = useHistory();
  const { logout } = useAuth();
  const { isMobile } = useViewport();
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

      <IonModal
        isOpen={isOpen}
        onDidDismiss={() => {onClose();}}
        className={isMobile ? 'account-round-top-borders' : 'account-menu-sheet--desktop'}
        {...(isMobile
          ? { initialBreakpoint: 0.65 }
          : { enterAnimation: desktopEnterAnimation, leaveAnimation: desktopLeaveAnimation })}
      >
        <div className="border-teal"></div>
        <IonContent className="account-menu-sheet">
          {/* Desktop-only: this panel now covers the header's own
             "Open menu" toggle button (it's a full-height panel
             anchored to the same right edge that button sits in), so
             that button can no longer be clicked to close it back —
             this is the panel's own reachable close affordance. */}
          {!isMobile ? (
            <button type="button" className="account-menu-sheet__close" onClick={onClose} aria-label="Close">
              <IonIcon icon={closeOutline} />
            </button>
          ) : null}

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
<div className='centered-content' style={{ flexDirection: 'column' }}>
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
        </div>
      ) : null}
    </>
  );
}
