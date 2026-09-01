import {
  IonButtons,
  IonButton,
  IonContent,
  IonHeader,

  IonPage,
  IonToolbar,
} from "@ionic/react";

import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router-dom";
import MediaCarousel from "../../components/MediaCarousel/MediaCarousel";
import SocialRow from "../../components/SocialRow/SocialRow";
import BackButton from "../../components/BackButton/BackButton";
import PageTitle from "../../components/PageTitle/PageTitle";
import { useAuth } from "../../context/AuthContext";
import { openWhatsApp, padUserId } from "../../services/whatsapp";
import { dresscodeMatches, paymentOptionMatches, truncate } from "../../utils/format";
import type { Place } from "../../api/types";
import "./PlacesInfo.css";
import spark from "../../assets/icons/Spark.svg";

import locationIcon from "../../assets/icons/Icon_Location.svg";
import dresscode from "../../assets/icons/Dresscode.svg";
import card from "../../assets/icons/Icon_Credit.svg";
import cash from "../../assets/icons/Cash.svg";
import time from "../../assets/icons/Icon_reloj.svg";

interface LocationState {
  place?: Place;
  isFromPlace?: boolean;
}

export default function PlacesInfo() {
  const { t } = useTranslation("main");
  const history = useHistory();
  const location = useLocation<LocationState | undefined>();
  const { user } = useAuth();

  const place = location.state?.place;
  const isFromPlace = location.state?.isFromPlace ?? true;

  useEffect(() => {
    if (!place) {
      history.replace("/main/places");
    }
    // Only needs to run once — location.state is fixed for this page instance.
  }, []);

  if (!place || !user) return null;

  const handleReserve = () => {
    if (isFromPlace) {
      openWhatsApp(
        t("common:whatsapp.reservePlace", {
          title: place.name,
          id: padUserId(user.id),
        }),
      );
    } else if (place.url) {
      window.open(place.url, "_blank", "noopener,noreferrer");
    }
  };

  const dresscodeLabel = dresscodeMatches(place.dresscode, "formal")
    ? "Formal"
    : dresscodeMatches(place.dresscode, "casual")
      ? "Casual"
      : place.dresscode;

  const paymentLabels = [
    paymentOptionMatches(place.payment_options, "card")
      ? t("detail.paymentCard")
      : null,
    paymentOptionMatches(place.payment_options, "cash")
      ? t("detail.paymentCash")
      : null,
  ].filter(Boolean);

  console.log(place);

  return (
    <IonPage>
      <IonHeader className="ion-no-border yoyo-header-offset places-info-page__header">
        <IonToolbar>
          <IonButtons slot="start">
            <BackButton defaultHref="/main/places" />
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="places-info-page">
        <div className="places-info-page__hero">
          <MediaCarousel
            items={place.gallery.length > 0 ? place.gallery : place.media}
          />
        </div>

        <div className="places-info-page__content">
          <PageTitle className="places-info-page__title">{place.name}</PageTitle>
          <SocialRow
            websiteUrl={place.website_url}
            facebookUrl={place.facebook_url}
            instagramUrl={place.instagram_url}
          />

          <hr className="places-info-divider" />

          <h2
            className="yoyo-section-header"
            style={{ marginTop: "24px", fontSize: "16px" }}
          >
            <img
              src={spark}
              alt="Spark"
              className="yoyo-section-header__spark"
            />
            {t("detail.description")}
          </h2>
          <p className="places-info-page__text">{place.description}</p>

          {place.music_genre_list.length > 0 ? (
            <>
            <div className="places-info-page__tags">
              {place.music_genre_list.map((genre) => (
                <span key={genre} className="places-info-page__tag">
                  {genre}
                </span>
              ))}
              
            </div>
            </>
          ) : null}

          {place.music_lineup ? (
            <>
              <hr className="places-info-divider" />
              <h2
                className="yoyo-section-header places-info-page__section-spacing"
                style={{ fontSize: "16px" }}
              >
                <img
                  src={spark}
                  alt="Spark"
                  className="yoyo-section-header__spark"
                />
                {t("detail.musicLineup")}
              </h2>
              <p className="places-info-page__text">{place.music_lineup}</p>
            </>
          ) : null}

          {place.schedule_list.length > 0 ? (
            place.schedule_list.map((schedule) => (
              <>
              <span className="places-info-page__row" style={{ marginBottom: "6px" }}>
                    <img src={time} alt="Time" />
                    {schedule}
                  </span>
                  
              </>
            ))
          ) : null}

          {place.address || place.gmaps ? (
            <>
              <hr className="places-info-divider"/>

              <h2 className="yoyo-section-header" style={{ fontSize: "16px", marginTop: "24px" }}>
                <img
                  src={spark}
                  alt="Spark"
                  className="yoyo-section-header__spark"
                />
                {t("detail.location")}
              </h2>
              <div className="places-info-location-row">
                <p className="places-info-page__row">
                <img src={locationIcon} alt="Location" />
                {truncate(place.address)}
              </p>
              <div className="places-info-page__actions">
                {place.gmaps ? (
                  <IonButton
                    expand="block"
                    className="places-info-page__more-button"
                    href={place.gmaps}
                    target="_blank"
                  >
                    {t("detail.getDirections")}
                  </IonButton>
                ) : null}
              </div>
              </div>
            </>
          ) : null}

          {dresscodeLabel ? (
            <>
              <hr className="places-info-divider" />

              <h2 className="yoyo-section-header" style={{ fontSize: "16px", marginTop: "24px" }}>
                <img
                  src={spark}
                  alt="Spark"
                  className="yoyo-section-header__spark"
                />
                {t("detail.dresscode")}
              </h2>
              <p className="places-info-page__row">
                <img src={dresscode} alt="Dresscode" />
                {dresscodeLabel}
              </p>
            </>
          ) : null}

          {paymentLabels.length > 0 ? (
            <>
              <hr className="places-info-divider" />
 
              <h2 className="yoyo-section-header" style={{ fontSize: "16px", marginTop: "24px" }}>
                <img
                  src={spark}
                  alt="Spark"
                  className="yoyo-section-header__spark"
                />
                {t("detail.paymentOptions")}
              </h2>
              <div className="places-info-page__payment-row">
                {paymentOptionMatches(place.payment_options, "card") ? (
                  <span className="places-info-page__row">
                    <img src={card} alt="Card" />
                    {t("detail.paymentCard")}
                  </span>
                ) : null}
                {paymentOptionMatches(place.payment_options, "cash") ? (
                  <span className="places-info-page__row">
                    <img src={cash} alt="Cash" />
                    {t("detail.paymentCash")}
                  </span>
                ) : null}
              </div>
            </>
          ) : null}

          <div className="places-info-page__disclaimer">
            <p style={{ width: "80%" }}>{t("detail.paymentDisclaimer")}</p>
          </div>
          <IonButton
            expand="block"
            className="yoyo-pill--white places-info-reserve-button"
            onClick={handleReserve}
          >
            {isFromPlace ? t("detail.reserve") : t("detail.buyTicket")}
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
}
