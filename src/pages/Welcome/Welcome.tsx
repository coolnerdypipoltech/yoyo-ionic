import { IonButton, IonContent, IonPage } from "@ionic/react";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import logoPattern from "../../assets/Logo YOYO.png";
import rabbit from "../../assets/icons/Icon_rabbit.svg";
import "./Welcome.css";

export default function Welcome() {
  const { t } = useTranslation("auth");
  const history = useHistory();
  const pageRef = useRef<HTMLElement>(null);

  // Ionic hides a freshly-mounted page behind the `ion-page-invisible`
  // class (opacity: 0) until its router outlet marks it current. Welcome
  // is the first page of a brand-new IonRouterOutlet every time someone
  // logs out (the whole authenticated router tree unmounts and this one
  // mounts in its place — see App.tsx), with no prior page to transition
  // from, and that class has been observed stuck afterwards: the logo
  // and content are fully rendered (opacity: 1 on inspection) but stay
  // invisible because this ancestor never gets uncovered. Safety net:
  // strip it shortly after mount if Ionic hasn't already.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      pageRef.current?.classList.remove('ion-page-invisible');
    }, 50);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <IonPage ref={pageRef}>
      <IonContent fullscreen className="welcome-page">
        <div className="welcome-page__glow" />

        <div className="welcome-page__content">
          <div></div>

          <div className="welcome-page__actions">
            <div className="welcome-page__logo-container">
              <div className="welcome-page__logo-frame">
                <img
                  className="welcome-page__logo"
                  src={logoPattern}
                  alt="YOYO"
                />
              </div>
            </div>
            <img src={rabbit} className="welcome-page__rabbit" alt="Rabbit" />
            <p className="welcome-page__tagline">{t("welcome.tagline")}</p>
          </div>
          <div className="welcome-page__actions">
            <IonButton
              expand="block"
              size="large"
              className="yoyo-pill--white login-button"
              onClick={() => history.push("/login")}
            >
              {t("welcome.logIn")}
            </IonButton>
            <IonButton
              expand="block"
              size="large"
              className="yoyo-pill--dark"
              onClick={() => history.push("/verify-code")}
            >
              {t("welcome.createAccount")}
            </IonButton>
          </div>
          <div></div>
        </div>
      </IonContent>
    </IonPage>
  );
}
