import { IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/react';
import { useEffect } from 'react';
import { Redirect, Route, useLocation } from 'react-router-dom';
import Places from '../pages/Places/Places';
import Rewards from '../pages/Rewards/Rewards';
import rabbitOn from '../assets/icons/Rabbit_icon_ON.svg';
import rabbitOff from '../assets/icons/Rabbit_icon_OFF.svg';
import crownOn from "../assets/icons/Perks_icon_ON.svg";
import crownOff from "../assets/icons/Perks_icon_OFF.svg";


import './MainTabs.css';



export default function MainTabs() {
  const location = useLocation();
  const isRewards = location.pathname.startsWith('/main/rewards');
  // MainTabs stays mounted (Ionic keeps pages in the stack rather than
  // unmounting them) while a detail page like PlacesInfo/RewardsInfo is
  // pushed over it — including for the whole outer page-transition, which
  // can take a beat to actually hide this page once it's done. The floating
  // bar lives outside the nested tabs outlet though (it's not part of what
  // that transition hides), so without this it kept floating on screen,
  // on top of the incoming page, for as long as that hide was pending —
  // reacting to the *global* route here (not just /main/places vs
  // /main/rewards) hides it the moment navigation away from /main starts,
  // instead of however long the transition's own cleanup takes.
  const isOnMainTab = location.pathname.startsWith('/main');

  // Bouncing between /main/places (or /main/rewards) and a pushed detail
  // page fast enough — fast enough that a page's own entrance CSS
  // animation (PageTitle's title, the tab bar's own entrance) is still
  // running when the next navigation interrupts it — can leave that
  // animation paused mid-timeline and never resuming, which reads as a
  // "stuck" blank/faded screen even though the DOM/layout underneath is
  // verifiably correct. This can't be fixed by hooking a page's own
  // useIonViewDidEnter — that's exactly the lifecycle callback Ionic skips
  // when a transition gets interrupted by yet another rapid navigation,
  // i.e. precisely the case that causes this. Reacting to every location
  // change instead (MainTabs stays mounted for the whole authenticated
  // session, so it sees all of them) and debouncing — each new change
  // cancels the previous pending cleanup via this effect's own cleanup —
  // finishes off whatever's left running shortly after navigation
  // actually settles, regardless of how many transitions got interrupted
  // to get there.
  useEffect(() => {
    // Longer than PageTitle's own 400ms settle-debounce — its remount (and
    // the fresh entrance animation that comes with it) needs to have
    // actually happened before this runs, or this sweep finishes a stale
    // animation instance and misses the real, current, still-stuck one.
    const timeout = window.setTimeout(() => {
      document.body.getAnimations({ subtree: true }).forEach((animation) => {
        try {
          animation.finish();
        } catch {
          // A still-infinite animation (e.g. one of the looping carousel/
          // card ones) throws here instead of finishing — nothing to do
          // for those, so just leave them running and move on.
        }
      });
    }, 650);
    return () => window.clearTimeout(timeout);
  }, [location.pathname]);

  return (
    <IonTabs className="main-tabs">


      <IonRouterOutlet>
        <Route exact path="/main/places" component={Places} />
        <Route exact path="/main/rewards" component={Rewards} />
        <Redirect exact from="/main" to="/main/places" />
      </IonRouterOutlet>

      <IonTabBar slot="bottom" className={`main-tabs__bar${isOnMainTab ? '' : ' main-tabs__bar--hidden'}`}>
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
