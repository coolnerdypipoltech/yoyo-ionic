import { IonButton, IonContent, IonIcon, IonPage, IonSpinner } from '@ionic/react';
import { closeOutline } from 'ionicons/icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import FormField from '../../components/FormField/FormField';
import { useAuth } from '../../context/AuthContext';
import './EditTaste.css';

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
      <div className="edit-taste-page__glow" />
      <IonContent fullscreen className="edit-taste-page">
        <button type="button" className="yoyo-icon-button edit-taste-page__close" onClick={() => history.goBack()}>
          <IonIcon icon={closeOutline} />
        </button>

        <div className="edit-taste-page__content">
          <h1 className="edit-taste-page__title">{t('editTaste.title')}</h1>
          <p className="edit-taste-page__subtitle">{t('editTaste.subtitle')}</p>

          <hr className="yoyo-divider" />

          <FormField showLabel label={t('editTaste.drinkTaste')} value={drink} onChange={setDrink} />
          <FormField showLabel label={t('editTaste.musicTaste')} value={music} onChange={setMusic} />
          <FormField showLabel label={t('editTaste.foodTaste')} value={food} onChange={setFood} />

          <IonButton expand="block" size="large" className="yoyo-pill--white" disabled={isSaving} onClick={handleSave}>
            {isSaving ? <IonSpinner name="dots" /> : t('editTaste.save')}
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
}
