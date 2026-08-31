import { IonAccordion, IonAccordionGroup, IonContent, IonItem, IonLabel, IonPage, IonHeader, IonToolbar, IonButtons } from '@ionic/react';
import BackButton from '../../components/BackButton/BackButton';
import { useTranslation } from 'react-i18next';
import './Faqs.css';
import BackgroundGradient from "../../components/BackgroundGradient/BackgroundGradient";
import gradient from "../../assets/backgrounds/faqs.png";

interface FaqItem {
  q: string;
  a: string;
}

export default function Faqs() {
  const { t } = useTranslation('faqs');
  const items = t('items', { returnObjects: true }) as FaqItem[];

  return (
    <IonPage>
      <BackgroundGradient src={gradient}   />
            <IonHeader className="ion-no-border yoyo-header-offset places-info-page__header" >
        <IonToolbar>
          <IonButtons  slot="start">
            <BackButton defaultHref="/main/places" closeHref={true} />
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="faqs-page">


        <h1 className="faqs-page__title">{t('title')} <br></br> {t('title2')}</h1>

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
