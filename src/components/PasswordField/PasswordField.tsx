import { IonInput } from '@ionic/react';
import { useState } from 'react';
import './PasswordField.css';
import Visibility from "../../assets/icons/Visibility.svg"
import VisibilityOff from "../../assets/icons/Visibility_Off.svg"
interface PasswordFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  id?: string;
  /** Extra class on the outer wrapper — lets a caller like VerifyCode
   * layer its own spacing on top without forking this component. */
  className?: string;
  /** Extra class on the input itself — for callers that need a
   * different border-radius, letter-spacing, etc. */
  inputClassName?: string;
  maxLength?: number;
}

export default function PasswordField({
  label,
  value,
  onChange,
  placeholder,
  id,
  className,
  inputClassName,
  maxLength,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className={className ? `password-field ${className}` : 'password-field'}>
      <IonInput
        className={inputClassName ? `password-field__input ${inputClassName}` : 'password-field__input'}
        aria-label={label}
        type={visible ? 'text' : 'password'}
        value={value}
        placeholder={placeholder ?? label}
        id={id}
        maxlength={maxLength}
        fill="outline"
        onIonInput={(e) => onChange(e.detail.value ?? '')}
      />
      <button
        type="button"
        className="password-field__toggle"
        aria-label={visible ? 'Hide password' : 'Show password'}
        onClick={() => setVisible((v) => !v)}
      >
        <img src={!visible ? VisibilityOff : Visibility} alt={visible ? 'Hide password' : 'Show password'} />
      </button>
    </div>
  );
}
