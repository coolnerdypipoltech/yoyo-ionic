import { IonInput } from '@ionic/react';
import type { TextFieldTypes } from '@ionic/core';
import './FormField.css';

interface FormFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: TextFieldTypes;
  placeholder?: string;
  error?: string;
  id?: string;
  /** Auth-style fields (Login, Recover Password...) show no caption above
   * the input, only placeholder text — set true to render a visible label
   * instead (used by editing screens like Edit Your Taste). */
  showLabel?: boolean;
}

export default function FormField({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  error,
  id,
  showLabel = false,
}: FormFieldProps) {
  return (
    <div className="form-field">
      {showLabel ? (
        <label className="form-field__label" htmlFor={id}>
          {label}
        </label>
      ) : null}
      <IonInput
        className={`form-field__input${error ? ' form-field__input--invalid' : ''}`}
        aria-label={label}
        type={type}
        value={value}
        placeholder={placeholder ?? label}
        id={id}
        fill="outline"
        onIonInput={(e) => onChange(e.detail.value ?? '')}
      />
      {error ? <p className="form-field__error">{error}</p> : null}
    </div>
  );
}
