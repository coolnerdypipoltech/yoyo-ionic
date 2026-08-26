import { IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/react';
import { Redirect, Route, useLocation } from 'react-router-dom';
import Places from '../pages/Places/Places';
import Rewards from '../pages/Rewards/Rewards';
import rabbitOn from '../assets/icons/Rabbit_icon_ON.svg';
import rabbitOff from '../assets/icons/Rabbit_Icon_Off.svg';
import crownOn from "../assets/icons/Perks_icon_ON.svg";
import crownOff from "../assets/icons/Perks_icon_OFF.svg";
import BackgroundVideo from '../components/BackgroundVideo/BackgroundVideo';
import mainVideo from '../assets/videos/main-vieo.mp4';
import './MainTabs.css';

function CrownIcon({ active }: { active: boolean }) {
  return (
    <svg
      className={`main-tabs__crown${active ? ' main-tabs__crown--active' : ''}`}
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M4 18h16M4.5 18 3 8l5 3.5L12 6l4 5.5 5-3.5-1.5 10z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function MainTabs() {
  const location = useLocation();
  const isRewards = location.pathname.startsWith('/main/rewards');

  return (
    <IonTabs className="main-tabs">
      <BackgroundVideo src={mainVideo} />
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
