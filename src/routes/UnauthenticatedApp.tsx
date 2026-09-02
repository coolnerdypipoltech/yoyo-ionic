import { IonRouterOutlet } from '@ionic/react';

import { useEffect } from 'react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import Welcome from '../pages/Welcome/Welcome';
import Login from '../pages/Login/Login';
import PasswordRecovery from '../pages/PasswordRecovery/PasswordRecovery';
import VerifyCode from '../pages/VerifyCode/VerifyCode';
import Register from '../pages/Register/Register';
import BackgroundVideo from '../components/BackgroundVideo/BackgroundVideo';
import { preloadRabbitTransitionAssets } from '../components/RabbitTransition/RabbitTransition';

import welcomeVideoDesktop from '../assets/videos/desktop/welcome-video.mp4';
import gradient from '../assets/backgrounds/welcome.png';


import { useViewport } from '../context/ViewportContext';
import BackgroundGradient from '../components/BackgroundGradient/BackgroundGradient';
export default function UnauthenticatedApp() {
  const { isMobile } = useViewport();

  // The whole point of the rabbit transition landing on Places is a
  // surprise payoff right after login — so its assets need to already be
  // cached *before* that moment. This tree is mounted for the entire
  // pre-login flow (Welcome, Login, Register, ...), which is exactly the
  // idle time available to get them ready.
  useEffect(() => {
    preloadRabbitTransitionAssets();
  }, []);

  return (
    <IonReactRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      {isMobile ? (
        <BackgroundGradient src={gradient} />
      ) : <BackgroundVideo src={welcomeVideoDesktop} variant="welcome" />}
      
      
      <IonRouterOutlet>
        <Route exact path="/welcome" component={Welcome} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/password-recovery" component={PasswordRecovery} />
        <Route exact path="/verify-code" component={VerifyCode} />
        <Route exact path="/register" component={Register} />
        <Redirect exact from="/" to="/welcome" />
      </IonRouterOutlet>
    </IonReactRouter>
  );
}
