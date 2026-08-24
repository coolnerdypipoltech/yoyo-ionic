import { IonAccordion, IonAccordionGroup, IonContent, IonIcon, IonItem, IonLabel, IonPage } from '@ionic/react';
import { closeOutline } from 'ionicons/icons';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import './Faqs.css';

interface FaqItem {
  q: string;
  a: string;
}

export default function Faqs() {
  const { t } = useTranslation('faqs');
  const history = useHistory();
  const items = t('items', { returnObjects: true }) as FaqItem[];

  return (
    <IonPage>
      <div className="faqs-page__glow" />
      <IonContent fullscreen className="faqs-page">
        <button type="button" className="yoyo-icon-button faqs-page__close" onClick={() => history.goBack()}>
          <IonIcon icon={closeOutline} />
        </button>

        <h1 className="faqs-page__title">{t('title')}</h1>

        <IonAccordionGroup className="faqs-page__group" value="0">
          {items.map((item, index) => (
            <IonAccordion key={index} value={String(index)}>
              <IonItem slot="header" lines="none">
                <IonLabel className="faqs-page__question">{item.q}</IonLabel>
              </IonItem>
              <div className="faqs-page__answer" slot="content">
                {item.a || t('placeholderAnswer')}
              </div>
            </IonAccordion>
          ))}
        </IonAccordionGroup>
      </IonContent>
    </IonPage>
  );
}
