import { IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import MainTabs from './MainTabs';
import PlacesInfo from '../pages/PlacesInfo/PlacesInfo';
import RewardsInfo from '../pages/RewardsInfo/RewardsInfo';
import Faqs from '../pages/Faqs/Faqs';
import Profile from '../pages/Profile/Profile';
import EditProfile from '../pages/EditProfile/EditProfile';
import EditTaste from '../pages/EditTaste/EditTaste';
import DeleteAccount from '../pages/DeleteAccount/DeleteAccount';

export default function AuthenticatedApp() {
  return (
    <IonReactRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <IonRouterOutlet>
        <Route path="/main" render={() => <MainTabs />} />
        <Route exact path="/places/:id" component={PlacesInfo} />
        <Route exact path="/rewards/:id" component={RewardsInfo} />
        <Route exact path="/faqs" component={Faqs} />
        <Route exact path="/profile" component={Profile} />
        <Route exact path="/profile/edit-photo" component={EditProfile} />
        <Route exact path="/profile/edit-taste" component={EditTaste} />
        <Route exact path="/profile/delete" component={DeleteAccount} />
        <Redirect exact from="/" to="/main" />
      </IonRouterOutlet>
    </IonReactRouter>
  );
}
