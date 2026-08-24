import { IonIcon, IonInput } from '@ionic/react';
import { eyeOffOutline, eyeOutline } from 'ionicons/icons';
import { useState } from 'react';
import './PasswordField.css';

interface PasswordFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  id?: string;
}

export default function PasswordField({ label, value, onChange, placeholder, id }: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="password-field">
      <IonInput
        className="password-field__input"
        aria-label={label}
        type={visible ? 'text' : 'password'}
        value={value}
        placeholder={placeholder ?? label}
        id={id}
        fill="outline"
        onIonInput={(e) => onChange(e.detail.value ?? '')}
      />
      <button
        type="button"
        className="password-field__toggle"
        aria-label={visible ? 'Hide password' : 'Show password'}
        onClick={() => setVisible((v) => !v)}
      >
        <IonIcon icon={visible ? eyeOffOutline : eyeOutline} />
      </button>
    </div>
  );
}
