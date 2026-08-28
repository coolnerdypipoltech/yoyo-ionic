import { IonContent, IonIcon, IonInput, IonModal } from '@ionic/react';
import { chevronForward, searchOutline } from 'ionicons/icons';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { COUNTRIES, countryDisplayName, flagEmoji, getCountry } from '../../utils/countries';
import './PhoneNumberField.css';

interface PhoneNumberFieldProps {
  countryIso2: string;
  phone: string;
  onCountryChange: (iso2: string) => void;
  onPhoneChange: (phone: string) => void;
  countryLabel: string;
  phoneLabel: string;
  phonePlaceholder?: string;
  error?: string;
}

export default function PhoneNumberField({
  countryIso2,
  phone,
  onCountryChange,
  onPhoneChange,
  countryLabel,
  phoneLabel,
  phonePlaceholder,
  error,
}: PhoneNumberFieldProps) {
  const { t, i18n } = useTranslation('common');
  const locale = i18n.language.split('-')[0];
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleIonFocus = () => {
    setIsFocused(true);
  };

  const handleIonBlur = () => {
    setIsFocused(false);
  };

  const selected = getCountry(countryIso2);

  const countries = useMemo(
    () =>
      COUNTRIES.map((c) => ({ ...c, name: countryDisplayName(c.iso2, locale) })).sort((a, b) =>
        a.name.localeCompare(b.name),
      ),
    [locale],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return countries;
    return countries.filter((c) => c.name.toLowerCase().includes(q) || c.dialCode.includes(q));
  }, [countries, query]);

  const handleSelect = (iso2: string) => {
    onCountryChange(iso2);
    setIsOpen(false);
    setQuery('');
  };

  return (
    <div className="phone-field">
      <div className={`phone-field__group${error ? ' phone-field__group--invalid' : ''}`}>
        <button type="button" className="phone-field__country" onClick={() => setIsOpen(true)}>
          <span className="phone-field__country-text">
            <span className="phone-field__country-label">{countryLabel}</span>
            <span className="phone-field__country-value">
              {flagEmoji(selected.iso2)} {countryDisplayName(selected.iso2, locale)} ({selected.dialCode})
            </span>
          </span>
          <IonIcon icon={chevronForward} className="phone-field__chevron" />
        </button>

        <IonInput
          className="phone-field__input"
          aria-label={phoneLabel}
          type="tel"
          inputmode="numeric"
          value={phone}
          placeholder={phonePlaceholder ?? phoneLabel}
          fill="outline"
          onIonFocus={handleIonFocus}
          onIonInput={(e) => onPhoneChange((e.detail.value ?? '').replace(/\D/g, ''))}
          onIonBlur={handleIonBlur}
        />
        <div className="phone-filed__outline-container">
          <div className={isFocused ? 'phone-field__outline phone-field__outline--focused' : 'phone-field__outline'}></div>
        </div>
      </div>
      {error ? <p className="phone-field__error">{error}</p> : null}

      <IonModal
        isOpen={isOpen}
        onDidDismiss={() => {
          setIsOpen(false);
          setQuery('');
        }}
        initialBreakpoint={0.75}
        breakpoints={[0, 0.75, 1]}
        className="account-round-top-borders phone-field__modal"
      >
        <IonContent className="phone-field__sheet">
          <div className="phone-field__search-wrap">
            <IonIcon icon={searchOutline} className="phone-field__search-icon" />
            <input
              className="phone-field__search"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('phoneField.searchCountry')}
              autoFocus
            />
          </div>
          <div className="phone-field__list">
            {filtered.map((c) => (
              <button
                type="button"
                key={c.iso2}
                className={`phone-field__option${c.iso2 === selected.iso2 ? ' phone-field__option--active' : ''}`}
                onClick={() => handleSelect(c.iso2)}
              >
                <span className="phone-field__option-flag">{flagEmoji(c.iso2)}</span>
                <span className="phone-field__option-name">{c.name}</span>
                <span className="phone-field__option-dial">{c.dialCode}</span>
              </button>
            ))}
          </div>
        </IonContent>
      </IonModal>
    </div>
  );
}
