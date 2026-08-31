import { IonIcon, IonInput } from '@ionic/react';
import { closeCircle } from 'ionicons/icons';
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
  /** Shows the placeholder with a trailing red asterisk instead of plain
   * text. A native `placeholder` string can't mix colors, so this hides
   * the real placeholder and overlays a fake one built from JSX — same
   * position, hidden as soon as there's a value, same as a real one. */
  required?: boolean;
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
  required = false,
}: FormFieldProps) {
  const displayText = placeholder ?? label;
  return (
    <div className="form-field">
      {showLabel ? (
        <label className="form-field__label" htmlFor={id}>
          {label}
        </label>
      ) : null}
      <div className="form-field__input-wrap">
        <IonInput
          className={`form-field__input${error ? ' form-field__input--invalid' : ''}`}
          aria-label={label}
          type={type}
          value={value}
          placeholder={required ? '' : displayText}
          id={id}
          fill="outline"
          onIonInput={(e) => onChange(e.detail.value ?? '')}
        />
        {required && !value ? (
          <span className="form-field__placeholder" aria-hidden="true">
            {displayText}
            <span className="form-field__required-asterisk">*</span>
          </span>
        ) : null}
        {value ? (
          <button type="button" className="form-field__clear" aria-label="Clear" onClick={() => onChange('')}>
            <IonIcon icon={closeCircle} />
          </button>
        ) : null}
      </div>
      {error ? <p className="form-field__error">{error}</p> : null}
    </div>
  );
}
