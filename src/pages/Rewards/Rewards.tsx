import { IonContent, IonHeader, IonIcon, IonPage, IonRefresher, IonRefresherContent, IonToolbar } from '@ionic/react';
import type { RefresherEventDetail } from '@ionic/core';
import { sparklesOutline } from 'ionicons/icons';
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
      <IonHeader className="ion-no-border rewards-page__header">
        <IonToolbar>
          <span className="rewards-page__logo">YOYO</span>
          <button
            type="button"
            slot="end"
            className="rewards-page__menu-button"
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
          >
            <IonIcon icon={sparklesOutline} />
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
          <p className="rewards-page__credits">
            {t('rewards.availableCredits', { points: user.related.points })}
          </p>
        ) : null}

        <AdBanner />

        <section className="rewards-page__section">
          <h2 className="yoyo-section-header rewards-page__section-header">
            <IonIcon icon={sparklesOutline} className="yoyo-section-header__spark" />
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
            <IonIcon icon={sparklesOutline} className="yoyo-section-header__spark" />
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
