import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from '../../i18n/i18n';
import * as storage from '../../services/storage';
import './LanguageSwitcher.css';

export default function LanguageSwitcher() {
  const { t, i18n } = useTranslation('common');
  const current = i18n.language.split('-')[0] as SupportedLanguage;

  const handleSelect = (lang: SupportedLanguage) => {
    if (lang === current) return;
    void i18n.changeLanguage(lang);
    void storage.setLanguage(lang);
  };

  return (
    <div className="language-switcher" role="group" aria-label={t('language.label')}>
      {SUPPORTED_LANGUAGES.map((lang) => (
        <button
          key={lang}
          type="button"
          className={`language-switcher__option${lang === current ? ' language-switcher__option--active' : ''}`}
          onClick={() => handleSelect(lang)}
        >
          {t(`language.${lang}`)}
        </button>
      ))}
    </div>
  );
}
