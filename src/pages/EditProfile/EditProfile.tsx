import { IonButton, IonContent, IonIcon, IonPage, IonSpinner } from '@ionic/react';
import { closeOutline } from 'ionicons/icons';
import { useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import ImageCropper from '../../components/ImageCropper/ImageCropper';
import type { ImageCropperHandle } from '../../components/ImageCropper/ImageCropper';
import { useAuth } from '../../context/AuthContext';
import * as authService from '../../api/services/auth.service';
import './EditProfile.css';

const MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024; // server enforces no limit, so validate client-side

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function EditProfile() {
  const { t } = useTranslation('profile');
  const history = useHistory();
  const { user, refreshUser } = useAuth();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cropperRef = useRef<ImageCropperHandle>(null);

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError(t('editProfile.invalidFile'));
      return;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setError(t('editProfile.fileTooLarge'));
      return;
    }

    setError(null);
    setImageSrc(await readFileAsDataUrl(file));
  };

  const handleSave = async () => {
    if (!cropperRef.current) return;
    setIsSaving(true);
    try {
      const base64 = await cropperRef.current.getCroppedImage();
      if (!base64) return;
      await authService.uploadAvatar(base64);
      await refreshUser();
      history.goBack();
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemovePhoto = async () => {
    setIsSaving(true);
    try {
      await authService.uploadAvatar('');
      await refreshUser();
      history.goBack();
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) return null;
  const hasExistingPhoto = Boolean(user.related.image?.absolute_url);

  return (
    <IonPage>
      <IonContent fullscreen className="edit-profile-page">
        <input
          ref={fileInputRef}
          className="edit-profile-page__file-input"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />

        <div className="edit-profile-page__overlay">
          {imageSrc ? (
            <div className="edit-profile-page__cropper-card">
              <button type="button" className="edit-profile-page__close" onClick={() => history.goBack()}>
                <IonIcon icon={closeOutline} />
              </button>
              <ImageCropper ref={cropperRef} imageSrc={imageSrc} />
              <p className="edit-profile-page__hint">{t('editProfile.cropInstructions')}</p>
              <IonButton expand="block" className="yoyo-pill--white" disabled={isSaving} onClick={handleSave}>
                {isSaving ? <IonSpinner name="dots" /> : t('editProfile.save')}
              </IonButton>
            </div>
          ) : (
            <div className="edit-profile-page__popup">
              <button type="button" className="edit-profile-page__close" onClick={() => history.goBack()}>
                <IonIcon icon={closeOutline} />
              </button>
              <h1 className="edit-profile-page__title">{t('editProfile.title')}</h1>

              {error ? <p className="edit-profile-page__error">{error}</p> : null}

              <IonButton expand="block" className="yoyo-pill--white" onClick={() => fileInputRef.current?.click()}>
                {t('editProfile.choosePhoto')}
              </IonButton>

              {hasExistingPhoto ? (
                <IonButton expand="block" className="yoyo-pill--dark" disabled={isSaving} onClick={handleRemovePhoto}>
                  {isSaving ? <IonSpinner name="dots" /> : t('editProfile.removePhoto')}
                </IonButton>
              ) : null}

              
            </div>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
}
