import { IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/react';
import { Redirect, Route, useLocation } from 'react-router-dom';
import Places from '../pages/Places/Places';
import Rewards from '../pages/Rewards/Rewards';
import rabbitOn from '../assets/Rabbit_icon_ON.png';
import rabbitOff from '../assets/Rabbit_Icon_Off.png';
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
          <CrownIcon active={isRewards} />
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
}
