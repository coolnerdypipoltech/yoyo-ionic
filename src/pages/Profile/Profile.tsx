import { IonContent, IonHeader, IonIcon, IonPage, IonToolbar, IonButtons } from '@ionic/react';
import BackButton from '../../components/BackButton/BackButton';
import { closeOutline, createOutline, informationCircleOutline, personOutline } from 'ionicons/icons';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { padUserId } from '../../services/whatsapp';
import tombstoneIcon from '../../assets/ACCS_Icon_DeleteAcount.png';
import './Profile.css';

import editPhoto from "../../assets/icons/Editar_foto.svg";
import editTaste from "../../assets/icons/Editar.svg";
import spark from "../../assets/icons/Spark.svg";
import tooltip from "../../assets/icons/Tooltip.svg";

export default function Profile() {
  const { t } = useTranslation('profile');
  const history = useHistory();
  const { user } = useAuth();

  if (!user) return null;
  const avatarUrl = user.related.image?.absolute_url;

  return (
    <IonPage>
      <div className="profile-page__glow" />
      <IonHeader className="ion-no-border yoyo-header-offset places-info-page__header" >
        <IonToolbar>
          <IonButtons  slot="start">
            <BackButton defaultHref="/main/places" closeHref={true} />
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="profile-page">
        <h1 className="profile-page__title">{t('profile.title')}</h1>

        <div className="profile-page__avatar-block">
          <button type="button" className="profile-page__avatar" onClick={() => history.push('/profile/edit-photo')}>
            {avatarUrl ? <img src={avatarUrl} alt="" /> : <IonIcon icon={personOutline} />}

          </button>
                      <span className="profile-page__avatar-edit">
              <img src={editPhoto} alt="edit photo" />
            </span>
          <span className="profile-page__id ">
            {t('profile.idLabel')}: {padUserId(user.id)}
          </span>
        </div>

        <h2 className="yoyo-section-header profile-page__section-header">
          <img src={spark} alt="spark" />
          {t('profile.totalPoints')}
          <img src={tooltip} alt="tooltip" />
        </h2>
        <div className="profile-page__points-box">{t('profile.points', { points: user.related.points })}</div>

        <h2 className="yoyo-section-header profile-page__section-header profile-page__section-spacing">
          <img src={spark} alt="spark" />
          {t('profile.yourTaste')}
          <img src={tooltip} alt="tooltip" />
        </h2>

        <div className="profile-page__taste-row">
          <div>
            <span className="profile-page__taste-label">{t('profile.drinkTaste')}</span>
            <span className="profile-page__taste-value">{user.related.taste_drink || t('profile.tastePlaceholder')}</span>
          </div>
          <button type="button" className="profile-page__edit-button" onClick={() => history.push('/profile/edit-taste')}>
            <img src={editTaste} alt="edit taste" />
          </button>
        </div>
        <div className="profile-page__taste-row">
          <div>
            <span className="profile-page__taste-label">{t('profile.musicTaste')}</span>
            <span className="profile-page__taste-value">{user.related.taste_music || t('profile.tastePlaceholder')}</span>
          </div>
          <button type="button" className="profile-page__edit-button" onClick={() => history.push('/profile/edit-taste')}>
            <img src={editTaste} alt="edit taste" />
          </button>
        </div>
        <div className="profile-page__taste-row">
          <div>
            <span className="profile-page__taste-label">{t('profile.foodTaste')}</span>
            <span className="profile-page__taste-value">{user.related.taste_food || t('profile.tastePlaceholder')}</span>
          </div>
          <button type="button" className="profile-page__edit-button" onClick={() => history.push('/profile/edit-taste')}>
            <img src={editTaste} alt="edit taste" />
          </button>
        </div>

        <h2 className="yoyo-section-header profile-page__section-header profile-page__section-spacing">
          <img src={spark} alt="spark" />
          {t('profile.yourProfile')}
          <img src={tooltip} alt="tooltip" />
        </h2>

        <div className="profile-page__info-card">
          <div className="profile-page__info-row">
            <span className="profile-page__info-label">{t('profile.name')}</span>
            <span className="profile-page__info-value">{user.name}</span>
          </div>
          <div className="profile-page__info-row">
            <span className="profile-page__info-label">{t('profile.email')}</span>
            <span className="profile-page__info-value">{user.email}</span>
          </div>
          <div className="profile-page__info-row">
            <span className="profile-page__info-label">{t('profile.phone')}</span>
            <span className="profile-page__info-value">{user.related.phone ?? '—'}</span>
          </div>
        </div>

        <hr className="yoyo-divider" />

        <div className="profile-page__danger-card">
          <h2 className="profile-page__danger-title">{t('profile.dangerousHole')}</h2>
          <img className="profile-page__tombstone" src={tombstoneIcon} alt="" />
          <p className="profile-page__danger-text">{t('profile.deleteWarning')}</p>
        </div>

        <button type="button" className="profile-page__delete-button" onClick={() => history.push('/profile/delete')}>
          {t('profile.deleteAccount')}
        </button>
      </IonContent>
    </IonPage>
  );
}
