import { IonBackButton, IonButtons, IonButton, IonContent, IonHeader, IonIcon, IonPage, IonToolbar } from '@ionic/react';
import { cardOutline, cashOutline, locationOutline, shirtOutline, sparklesOutline } from 'ionicons/icons';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import MediaCarousel from '../../components/MediaCarousel/MediaCarousel';
import SocialRow from '../../components/SocialRow/SocialRow';
import { useAuth } from '../../context/AuthContext';
import { openWhatsApp, padUserId } from '../../services/whatsapp';
import { dresscodeMatches, paymentOptionMatches } from '../../utils/format';
import type { Place } from '../../api/types';
import './PlacesInfo.css';

interface LocationState {
  place?: Place;
  isFromPlace?: boolean;
}

export default function PlacesInfo() {
  const { t } = useTranslation('main');
  const history = useHistory();
  const location = useLocation<LocationState | undefined>();
  const { user } = useAuth();

  const place = location.state?.place;
  const isFromPlace = location.state?.isFromPlace ?? true;

  useEffect(() => {
    if (!place) {
      history.replace('/main/places');
    }
    // Only needs to run once — location.state is fixed for this page instance.
  }, []);

  if (!place || !user) return null;

  const handleReserve = () => {
    if (isFromPlace) {
      openWhatsApp(t('common:whatsapp.reservePlace', { title: place.name, id: padUserId(user.id) }));
    } else if (place.url) {
      window.open(place.url, '_blank', 'noopener,noreferrer');
    }
  };

  const dresscodeLabel = dresscodeMatches(place.dresscode, 'formal')
    ? 'Formal'
    : dresscodeMatches(place.dresscode, 'casual')
      ? 'Casual'
      : place.dresscode;

  const paymentLabels = [
    paymentOptionMatches(place.payment_options, 'card') ? t('detail.paymentCard') : null,
    paymentOptionMatches(place.payment_options, 'cash') ? t('detail.paymentCash') : null,
  ].filter(Boolean);

  return (
    <IonPage>
      <IonHeader className="ion-no-border places-info-page__header">
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/main/places" text="" />
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="places-info-page">
        <div className="places-info-page__hero">
          <MediaCarousel items={place.gallery.length > 0 ? place.gallery : place.media} />
          <div className="places-info-page__watermark" />
        </div>

        <div className="places-info-page__content">
          <h1 className="places-info-page__title">{place.name}</h1>
          <SocialRow websiteUrl={place.website_url} facebookUrl={place.facebook_url} instagramUrl={place.instagram_url} />

          <hr className="yoyo-divider" />

          <h2 className="yoyo-section-header">
            <IonIcon icon={sparklesOutline} className="yoyo-section-header__spark" />
            {t('detail.description')}
          </h2>
          <p className="places-info-page__text">{place.description}</p>

          {place.music_genre_list.length > 0 ? (
            <div className="places-info-page__tags">
              {place.music_genre_list.map((genre) => (
                <span key={genre} className="places-info-page__tag">{genre}</span>
              ))}
            </div>
          ) : null}

          {place.music_lineup ? (
            <>
              <h2 className="yoyo-section-header places-info-page__section-spacing">
                <IonIcon icon={sparklesOutline} className="yoyo-section-header__spark" />
                {t('detail.musicLineup')}
              </h2>
              <p className="places-info-page__text">{place.music_lineup}</p>
            </>
          ) : null}

          <div className="places-info-page__actions">
            {place.gmaps ? (
              <IonButton expand="block" className="yoyo-pill--dark" href={place.gmaps} target="_blank">
                {t('detail.getDirections')}
              </IonButton>
            ) : null}
            <IonButton expand="block" className="yoyo-pill--white" onClick={handleReserve}>
              {isFromPlace ? t('detail.reserve') : t('detail.buyTicket')}
            </IonButton>
          </div>

          {place.address || place.gmaps ? (
            <>
              <hr className="yoyo-divider" />
              <h2 className="yoyo-section-header">
                <IonIcon icon={sparklesOutline} className="yoyo-section-header__spark" />
                {t('detail.location')}
              </h2>
              <p className="places-info-page__row">
                <IonIcon icon={locationOutline} />
                {place.address}
              </p>
            </>
          ) : null}

          {dresscodeLabel ? (
            <>
              <hr className="yoyo-divider" />
              <h2 className="yoyo-section-header">
                <IonIcon icon={sparklesOutline} className="yoyo-section-header__spark" />
                {t('detail.dresscode')}
              </h2>
              <p className="places-info-page__row">
                <IonIcon icon={shirtOutline} />
                {dresscodeLabel}
              </p>
            </>
          ) : null}

          {paymentLabels.length > 0 ? (
            <>
              <hr className="yoyo-divider" />
              <h2 className="yoyo-section-header">
                <IonIcon icon={sparklesOutline} className="yoyo-section-header__spark" />
                {t('detail.paymentOptions')}
              </h2>
              <div className="places-info-page__payment-row">
                {paymentOptionMatches(place.payment_options, 'card') ? (
                  <span className="places-info-page__row">
                    <IonIcon icon={cardOutline} />
                    {t('detail.paymentCard')}
                  </span>
                ) : null}
                {paymentOptionMatches(place.payment_options, 'cash') ? (
                  <span className="places-info-page__row">
                    <IonIcon icon={cashOutline} />
                    {t('detail.paymentCash')}
                  </span>
                ) : null}
              </div>
            </>
          ) : null}

          <div className="places-info-page__disclaimer">{t('detail.paymentDisclaimer')}</div>
        </div>
      </IonContent>
    </IonPage>
  );
}
