import { IonRouterOutlet } from '@ionic/react';

import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import Welcome from '../pages/Welcome/Welcome';
import Login from '../pages/Login/Login';
import PasswordRecovery from '../pages/PasswordRecovery/PasswordRecovery';
import VerifyCode from '../pages/VerifyCode/VerifyCode';
import Register from '../pages/Register/Register';
import BackgroundVideo from '../components/BackgroundVideo/BackgroundVideo';

import welcomeVideoDesktop from '../assets/videos/desktop/welcome-video.mp4';
import gradient from '../assets/backgrounds/login.png';


import { useViewport } from '../context/ViewportContext';
import BackgroundGradient from '../components/BackgroundGradient/BackgroundGradient';
export default function UnauthenticatedApp() {
  const { isMobile } = useViewport();
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
