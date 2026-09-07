import { IonRouterOutlet } from '@ionic/react';

import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import Welcome from '../pages/Welcome/Welcome';
import Login from '../pages/Login/Login';
import PasswordRecovery from '../pages/PasswordRecovery/PasswordRecovery';
import VerifyCode from '../pages/VerifyCode/VerifyCode';
import Register from '../pages/Register/Register';

import gradient from '../assets/backgrounds/welcome.png';
import gradientD from '../assets/backgrounds/desktop/welcome.png';


import { useViewport } from '../context/ViewportContext';
import BackgroundGradient from '../components/BackgroundGradient/BackgroundGradient';
export default function UnauthenticatedApp() {
  const { isMobile } = useViewport();

  return (
    <IonReactRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      {isMobile ? (
        <BackgroundGradient src={gradient} variant="welcome" />
      ) : <BackgroundGradient src={gradientD} variant="welcome" />}
      
      
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
