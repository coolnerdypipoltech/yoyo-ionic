import { IonContent, IonHeader, IonIcon, IonPage, IonRefresher, IonRefresherContent, IonToolbar } from '@ionic/react';
import type { RefresherEventDetail } from '@ionic/core';
import { sparklesOutline } from 'ionicons/icons';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import LoyaltyCard from '../../components/LoyaltyCard/LoyaltyCard';
import HorizontalCarousel from '../../components/HorizontalCarousel/HorizontalCarousel';
import CarouselItemCard from '../../components/CarouselItemCard/CarouselItemCard';
import AccountMenuSheet from '../../components/AccountMenuSheet/AccountMenuSheet';
import { useAuth } from '../../context/AuthContext';
import { useInfiniteList } from '../../hooks/useInfiniteList';
import * as placesService from '../../api/services/places.service';
import type { Place } from '../../api/types';
import './Places.css';

const PAGE_SIZE = 10;

export default function Places() {
  const { t } = useTranslation('main');
  const history = useHistory();
  const { user, refreshUser } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const fetchFirstPlaces = useCallback(() => placesService.getConsumptionCenters(PAGE_SIZE, 0), []);
  const fetchNextPlaces = useCallback((next: string) => placesService.getNextPlacesPage(next), []);
  const places = useInfiniteList<Place>({ fetchFirstPage: fetchFirstPlaces, fetchNextPage: fetchNextPlaces });

  const fetchFirstEvents = useCallback(() => placesService.getEvents(PAGE_SIZE, 0), []);
  const fetchNextEvents = useCallback((next: string) => placesService.getNextPlacesPage(next), []);
  const events = useInfiniteList<Place>({ fetchFirstPage: fetchFirstEvents, fetchNextPage: fetchNextEvents });

  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    await Promise.all([places.refresh(), events.refresh(), refreshUser()]);
    event.detail.complete();
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border places-page__header">
        <IonToolbar>
          <span className="places-page__logo">YOYO</span>
          <button
            type="button"
            slot="end"
            className="places-page__menu-button"
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
          >
            <IonIcon icon={sparklesOutline} />
          </button>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="places-page">
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        <h1 className="places-page__heading">
          <span className="places-page__heading-line">{t('places.headingLine1')}</span>
          <span className="places-page__heading-display">{t('places.headingLine2')}</span>
        </h1>

        {user ? <LoyaltyCard user={user} /> : null}

        <section className="places-page__section">
          <h2 className="yoyo-section-header places-page__section-header">
            <IonIcon icon={sparklesOutline} className="yoyo-section-header__spark" />
            {t('places.placesSection')}
          </h2>
          <HorizontalCarousel
            items={places.results}
            isLoading={places.isLoading}
            hasMore={places.hasMore}
            onLoadMore={places.loadMore}
            emptyText={t('places.noPlaces')}
            getKey={(item) => item.id}
            renderItem={(item) => (
              <CarouselItemCard
                title={item.name}
                imageUrl={item.gallery[0]?.absolute_url}
                onClick={() => history.push(`/places/${item.id}`, { place: item, isFromPlace: true })}
              />
            )}
          />
        </section>

        <section className="places-page__section">
          <h2 className="yoyo-section-header places-page__section-header">
            <IonIcon icon={sparklesOutline} className="yoyo-section-header__spark" />
            {t('places.eventsSection')}
          </h2>
          <HorizontalCarousel
            items={events.results}
            isLoading={events.isLoading}
            hasMore={events.hasMore}
            onLoadMore={events.loadMore}
            emptyText={t('places.noEvents')}
            getKey={(item) => item.id}
            renderItem={(item) => (
              <CarouselItemCard
                title={item.name}
                imageUrl={item.gallery[0]?.absolute_url}
                onClick={() => history.push(`/places/${item.id}`, { place: item, isFromPlace: false })}
              />
            )}
          />
        </section>
      </IonContent>

      <AccountMenuSheet isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </IonPage>
  );
}
