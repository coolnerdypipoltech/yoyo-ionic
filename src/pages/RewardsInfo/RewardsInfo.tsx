import { IonButtons, IonButton, IonContent, IonHeader, IonPage, IonToolbar } from '@ionic/react';

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import MediaCarousel from '../../components/MediaCarousel/MediaCarousel';
import AvailabilityNotice from '../../components/AvailabilityNotice/AvailabilityNotice';
import BackButton from '../../components/BackButton/BackButton';
import PageTitle from '../../components/PageTitle/PageTitle';
import { useAuth } from '../../context/AuthContext';
import { contactFor, padUserId } from '../../services/whatsapp';
import { formatDateRange } from '../../utils/format';
import { getUnavailabilityReason } from '../../utils/availability';
import type { ResultObject } from '../../api/types';
import './RewardsInfo.css';
import spark from "../../assets/icons/SparkG.svg";

import Points from "../../assets/icons/Points.svg";
import Quantity from "../../assets/icons/Quantity.svg";
import Danger from "../../assets/icons/Danger.svg";
import { useViewport } from '../../context/ViewportContext';

import sparkAvailable from '../../assets/icons/Spark.svg';
import sparkExpired from '../../assets/icons/SparkGrey.svg';
import sparkComingSoon from '../../assets/icons/SparkG.svg';
import sparkSold from '../../assets/icons/SparkW.svg';



import BackgroundGradient from '../../components/BackgroundGradient/BackgroundGradient';
import gradient from "../../assets/backgrounds/desktop/Home_others.png";
interface LocationState {
  item?: ResultObject;
  isFromRewards?: boolean;
}

export default function RewardsInfo() {
  const { t } = useTranslation('main');
  const history = useHistory();
  const location = useLocation<LocationState | undefined>();
  const { user } = useAuth();
  const { isMobile } = useViewport();
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
    contactFor({pr: item.pr, contact_link: item.contact_link}, t(key, { title: item.name, id: padUserId(user.id) }));
  };

  const stock = item.stock;
  const starts = item.starts_on;
  const expired = item.ends_on;

  let isStocked = true;
  let hasStarted = true;
  let isExpired = true;

  if(stock !== undefined) {
    
    if(stock == 0) {
      isStocked = false;
    }else{
      isStocked = true;
    }
  }

  if(starts){
      if(new Date().getTime() < (starts ? new Date(starts).getTime() : 0)) {
      hasStarted = false;
    } else {
      hasStarted = true;
    }
  }

  if(expired){
    
      if(new Date().getTime() > (expired ? new Date(expired).getTime() : 0)) {
      isExpired = false;
    } else {
      isExpired = true;
      
    }
  }

  if(!isStocked && !isExpired){
    isStocked = true;
  }

  if(!isStocked && !hasStarted){
    isStocked = true;
  }

  let sparkHolder = sparkAvailable;
  if(!isStocked){
    sparkHolder = sparkSold;
  } else if(!isExpired){
    sparkHolder = sparkExpired;
  } else if(!hasStarted){
    sparkHolder = sparkComingSoon;
  }


  return (
    <IonPage>
      <IonHeader className="ion-no-border yoyo-header-offset rewards-info-page__header">
        <IonToolbar>
          <IonButtons slot="start">
            <BackButton defaultHref="/main/rewards" />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
    {!isMobile ? <BackgroundGradient src={gradient} /> : null}
      <IonContent fullscreen className="rewards-info-page">
        
        <div className="rewards-info-page__carousel">
          <MediaCarousel items={item.gallery} />
        </div>

        <div className="rewards-info-page__content">
          <PageTitle className="rewards-info-page__title">{item.name}</PageTitle>

          <div className="rewards-info-page__status-container">
            
              <div className="rewards-info-page__status-tag">
                <img src={sparkHolder} alt="status" />
                <p>{isStocked ? (isExpired ? (hasStarted ? "Available" : "Coming Soon") : "Expired") : "Sold Out"}</p>
              </div>
            
          </div>
          
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
              <hr className="places-info-divider"  />
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
          <hr className="places-info-divider"  />
          <h2 className="yoyo-section-header rewards-info-page__section-spacing" style={{fontSize: "16px", marginTop: "24px"}}>
            <img src={spark} alt="Spark" className="yoyo-section-header__spark" />
            {t('detail.availableQuantity')}
          </h2>
          <p className="rewards-info-page__row">
            <img src={Quantity} alt="Quantity" />
            {item.stock}
          </p>
          <hr className="places-info-divider"  />
          <AvailabilityNotice reason={reason} isFromRewards={isFromRewards} />

          {reason ? <div className="rewards-info-page__disclaimer"><img src={Danger} alt="Danger" />{t('detail.reviewDisclaimer')}</div> : null}

          <div className="rewards-info-page__redeem-button">
            <IonButton expand="block" className={reason !== null ? "yoyo-pill-disabled" : "yoyo-pill--white"} disabled={reason !== null} onClick={handleRedeem}>
            {t('detail.redeem')}
          </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}
