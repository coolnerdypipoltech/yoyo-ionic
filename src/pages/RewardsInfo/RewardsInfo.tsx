import { IonButtons, IonButton, IonContent, IonHeader, IonPage, IonToolbar } from '@ionic/react';

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import MediaCarousel from '../../components/MediaCarousel/MediaCarousel';
import AvailabilityNotice from '../../components/AvailabilityNotice/AvailabilityNotice';
import BackButton from '../../components/BackButton/BackButton';
import PageTitle from '../../components/PageTitle/PageTitle';
import { useAuth } from '../../context/AuthContext';
import { openWhatsApp, padUserId } from '../../services/whatsapp';
import { formatDateRange } from '../../utils/format';
import { getUnavailabilityReason } from '../../utils/availability';
import type { ResultObject } from '../../api/types';
import './RewardsInfo.css';
import spark from "../../assets/icons/SparkG.svg";

import Points from "../../assets/icons/Points.svg";
import Quantity from "../../assets/icons/Quantity.svg";
import Danger from "../../assets/icons/Danger.svg";
interface LocationState {
  item?: ResultObject;
  isFromRewards?: boolean;
}

export default function RewardsInfo() {
  const { t } = useTranslation('main');
  const history = useHistory();
  const location = useLocation<LocationState | undefined>();
  const { user } = useAuth();

  const item = location.state?.item;
  const isFromRewards = location.state?.isFromRewards ?? true;

  useEffect(() => {
    if (!item) {
      history.replace('/main/rewards');
    }
    // Only needs to run once — location.state is fixed for this page instance.
  }, []);

  if (!item || !user) return null;

  const reason = getUnavailabilityReason(item, user.related.points);

  const handleRedeem = () => {
    const key = isFromRewards ? 'common:whatsapp.redeemReward' : 'common:whatsapp.contactPartner';
    openWhatsApp(t(key, { title: item.name, id: padUserId(user.id) }));
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border yoyo-header-offset rewards-info-page__header">
        <IonToolbar>
          <IonButtons slot="start">
            <BackButton defaultHref="/main/rewards" />
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="rewards-info-page">
        <MediaCarousel items={item.gallery.length > 0 ? item.gallery : item.media} />

        <div className="rewards-info-page__content">
          <PageTitle className="rewards-info-page__title">{item.name}</PageTitle>

          
          <hr className="places-info-divider"  />
          <h2 className="yoyo-section-header" style={{fontSize: "16px", marginTop: "24px"}}>
            <img src={spark} alt="Spark" className="yoyo-section-header__spark" />
            {t('detail.description')}
          </h2>
          <p className="rewards-info-page__text">{item.description}</p>

          {item.starts_on && item.ends_on ? (
            <>
              <h2 className="yoyo-section-header yoyo-section-header--teal rewards-info-page__section-spacing" style={{fontSize: "16px", marginTop: "24px"}}>
                <img src={spark} alt="Spark" className="yoyo-section-header__spark" />
                {t('detail.validity')}
              </h2>
              <div className="rewards-info-page__validity-box">
                {formatDateRange(item.starts_on, item.ends_on)}
              </div>
            </>
          ) : null}
          <hr className="places-info-divider" />
        
          {item.conditions ? (
            <>
            
              
              <h2 className="yoyo-section-header" style={{fontSize: "16px", marginTop: "24px"}}>
                <img src={spark} alt="Spark" className="yoyo-section-header__spark" />
                {t('detail.conditions')}
              </h2>
              <p className="rewards-info-page__text">{item.conditions}</p>
            </>
          ) : null}

          

          <h2 className="yoyo-section-header" style={{fontSize: "16px", marginTop: "24px"}}>
            <img src={spark} alt="Spark" className="yoyo-section-header__spark" />
            {t('detail.cost')}
          </h2>
          <p className="rewards-info-page__row">
            <img src={Points} alt="Points" />
            {`${item.cost} points`}
          </p>

          <h2 className="yoyo-section-header rewards-info-page__section-spacing" style={{fontSize: "16px", marginTop: "24px"}}>
            <img src={spark} alt="Spark" className="yoyo-section-header__spark" />
            {t('detail.availableQuantity')}
          </h2>
          <p className="rewards-info-page__row">
            <img src={Quantity} alt="Quantity" />
            {item.stock}
          </p>

          <AvailabilityNotice reason={reason} isFromRewards={isFromRewards} />

          {reason ? <div className="rewards-info-page__disclaimer"><img src={Danger} alt="Danger" />{t('detail.reviewDisclaimer')}</div> : null}

          <IonButton expand="block" className="yoyo-pill--white rewards-info-page__redeem-button" disabled={reason !== null} onClick={handleRedeem}>
            {t('detail.redeem')}
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
}
