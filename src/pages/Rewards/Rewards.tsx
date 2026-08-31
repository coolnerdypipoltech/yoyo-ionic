import { IonContent, IonHeader, IonPage, IonRefresher, IonRefresherContent, IonToolbar } from '@ionic/react';
import type { RefresherEventDetail } from '@ionic/core';

import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import AdBanner from '../../components/AdBanner/AdBanner';
import HorizontalCarousel from '../../components/HorizontalCarousel/HorizontalCarousel';
import CarouselItemCard from '../../components/CarouselItemCard/CarouselItemCard';
import AccountMenuSheet from '../../components/AccountMenuSheet/AccountMenuSheet';
import { useAuth } from '../../context/AuthContext';
import { useInfiniteList } from '../../hooks/useInfiniteList';
import * as rewardsService from '../../api/services/rewards.service';
import type { ResultObject } from '../../api/types';
import './Rewards.css';
import yoyoLetterLogo from '../../assets/icons/YoyoLetters.png';


import spark from "../../assets/icons/SparkG.svg";
const PAGE_SIZE = 10;

export default function Rewards() {
  const { t } = useTranslation('main');
  const history = useHistory();
  const { user, refreshUser } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const fetchFirstRewards = useCallback(() => rewardsService.getRewards(PAGE_SIZE, 0), []);
  const fetchNextRewards = useCallback((next: string) => rewardsService.getNextRewardsPage(next), []);
  const rewards = useInfiniteList<ResultObject>({ fetchFirstPage: fetchFirstRewards, fetchNextPage: fetchNextRewards });

  const fetchFirstPartners = useCallback(() => rewardsService.getPartners(PAGE_SIZE, 0), []);
  const fetchNextPartners = useCallback((next: string) => rewardsService.getNextRewardsPage(next), []);
  const partners = useInfiniteList<ResultObject>({ fetchFirstPage: fetchFirstPartners, fetchNextPage: fetchNextPartners });

  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    await Promise.all([rewards.refresh(), partners.refresh(), refreshUser()]);
    event.detail.complete();
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border yoyo-header-offset places-page__header">
        <IonToolbar>
          <img src={yoyoLetterLogo} alt="YOYO Logo" className="places-page__logo" />
          <button
            type="button"
            slot="end"
            className={`places-page__menu-button ${menuOpen ? 'places-page__menu-button--rotated' : ''}`}
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
          >
            <img src={spark} alt="Spark" />
          </button>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="rewards-page">
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        <h1 className="rewards-page__heading">
          <span className="rewards-page__heading-line">{t('rewards.headingLine1')}</span>
          <span className="rewards-page__heading-display">{t('rewards.headingLine2')}</span>
        </h1>

        {user ? (
          <div className="rewards-page__credits-container">
            <p className="rewards-page__credits">
            {t('rewards.availableCredits' )}
            
          </p>
          <p className="rewards-page__credits" style={{color: "white"}}>{`${user.related.points}`}</p>
          </div>
        ) : null}

        <AdBanner />

        <section className="rewards-page__section">
          <h2 className="yoyo-section-header rewards-page__section-header">
            <img src={spark} alt="Spark" className="yoyo-section-header__spark" />
            {t('rewards.rewardsSection')}
          </h2>
          <HorizontalCarousel
            items={rewards.results}
            isLoading={rewards.isLoading}
            hasMore={rewards.hasMore}
            onLoadMore={rewards.loadMore}
            emptyText={t('rewards.noRewards')}
            getKey={(item) => item.id}
            renderItem={(item) => (
              <CarouselItemCard
                title={item.name}
                imageUrl={item.thumbnail?.absolute_url}
                onClick={() => history.push(`/rewards/${item.id}`, { item, isFromRewards: true })}
              />
            )}
          />
        </section>

        <section className="rewards-page__section">
          <h2 className="yoyo-section-header rewards-page__section-header">
            <img src={spark} alt="Spark" className="yoyo-section-header__spark" />
            {t('rewards.partnersSection')}
          </h2>
          <HorizontalCarousel
            items={partners.results}
            isLoading={partners.isLoading}
            hasMore={partners.hasMore}
            onLoadMore={partners.loadMore}
            emptyText={t('rewards.noPartners')}
            getKey={(item) => item.id}
            renderItem={(item) => (
              <CarouselItemCard
                title={item.name}
                imageUrl={item.thumbnail?.absolute_url}
                onClick={() => history.push(`/rewards/${item.id}`, { item, isFromRewards: false })}
              />
            )}
          />
        </section>
      </IonContent>

      <AccountMenuSheet isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </IonPage>
  );
}
