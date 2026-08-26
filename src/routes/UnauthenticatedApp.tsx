import { IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import Welcome from '../pages/Welcome/Welcome';
import Login from '../pages/Login/Login';
import PasswordRecovery from '../pages/PasswordRecovery/PasswordRecovery';
import VerifyCode from '../pages/VerifyCode/VerifyCode';
import Register from '../pages/Register/Register';
import BackgroundVideo from '../components/BackgroundVideo/BackgroundVideo';
import welcomeVideo from '../assets/videos/welcome-video.mp4';

export default function UnauthenticatedApp() {
  return (
    <IonReactRouter>
      <BackgroundVideo src={welcomeVideo} />
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
