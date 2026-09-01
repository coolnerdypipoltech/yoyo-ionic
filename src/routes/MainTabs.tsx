import { IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/react';
import { Redirect, Route, useLocation } from 'react-router-dom';
import Places from '../pages/Places/Places';
import Rewards from '../pages/Rewards/Rewards';
import rabbitOn from '../assets/icons/Rabbit_icon_ON.svg';
import rabbitOff from '../assets/icons/Rabbit_Icon_Off.svg';
import crownOn from "../assets/icons/Perks_icon_ON.svg";
import crownOff from "../assets/icons/Perks_icon_OFF.svg";
import BackgroundVideo from '../components/BackgroundVideo/BackgroundVideo';
import BackgroundGradient from '../components/BackgroundGradient/BackgroundGradient';

import mainVideoDesktop from '../assets/videos/desktop/main-video.mp4';
import gradient from '../assets/backgrounds/login.png';
import './MainTabs.css';

import { useViewport } from '../context/ViewportContext';

export default function MainTabs() {
  const location = useLocation();
  const isRewards = location.pathname.startsWith('/main/rewards');
  const { isMobile } = useViewport();

  return (
    <IonTabs className="main-tabs">
            {isMobile ? (
        <BackgroundGradient src={gradient} />
      ) : <BackgroundVideo src={mainVideoDesktop} variant="welcome" />}
      
      <IonRouterOutlet>
        <Route exact path="/main/places" component={Places} />
        <Route exact path="/main/rewards" component={Rewards} />
        <Redirect exact from="/main" to="/main/places" />
      </IonRouterOutlet>

      <IonTabBar slot="bottom" className="main-tabs__bar">
        <IonTabButton tab="places" href="/main/places" className="main-tabs__button">
          <img className="main-tabs__rabbit" src={isRewards ? rabbitOff : rabbitOn} alt="" />
        </IonTabButton>
        <IonTabButton tab="rewards" href="/main/rewards" className="main-tabs__button">
          <img className="main-tabs__rabbit" src={isRewards ? crownOn : crownOff} alt="" />
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
}
