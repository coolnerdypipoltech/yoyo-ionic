import { IonButton, IonContent, IonPage, IonSpinner } from '@ionic/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import FormField from '../../components/FormField/FormField';
import PageTitle from '../../components/PageTitle/PageTitle';
import { useAuth } from '../../context/AuthContext';
import './EditTaste.css';
import closeIcon from "../../assets/icons/Icon_cerrar.svg";

import BackgroundGradient from "../../components/BackgroundGradient/BackgroundGradient";
import gradient from "../../assets/backgrounds/taste.png";

export default function EditTaste() {
  const { t } = useTranslation('profile');
  const history = useHistory();
  const { user, updateTastes } = useAuth();

  const [drink, setDrink] = useState(user?.related.taste_drink ?? '');
  const [food, setFood] = useState(user?.related.taste_food ?? '');
  const [music, setMusic] = useState(user?.related.taste_music ?? '');
  const [isSaving, setIsSaving] = useState(false);

  if (!user) return null;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateTastes({
        age: user.related.age,
        gender: user.related.gender,
        pronouns: user.related.pronouns,
        taste_drink: drink.trim(),
        taste_music: music.trim(),
        taste_food: food.trim(),
      });
      history.goBack();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <IonPage>
      <BackgroundGradient src={gradient} />
      <IonContent fullscreen className="edit-taste-page">
        <button type="button" className="yoyo-icon-button edit-taste-page__close" onClick={() => history.goBack()}>
          <img src={closeIcon} alt="Close" />
        </button>

        <div className="edit-taste-page__content">
          <PageTitle className="edit-taste-page__title">{t('editTaste.title')}</PageTitle>
          <p className="edit-taste-page__subtitle">{t('editTaste.subtitle')}</p>

          <hr className="places-info-divider" />
          
          <div className="edit-taste-page__form-container">
            <FormField showLabel label={t('editTaste.drinkTaste')} value={drink} onChange={setDrink} />
          <FormField showLabel label={t('editTaste.musicTaste')} value={music} onChange={setMusic} />
          <FormField showLabel label={t('editTaste.foodTaste')} value={food} onChange={setFood} />
          </div>

          <IonButton expand="block" size="large" className="yoyo-pill--white" disabled={isSaving} onClick={handleSave}>
            {isSaving ? <IonSpinner name="dots" /> : t('editTaste.save')}
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
}
