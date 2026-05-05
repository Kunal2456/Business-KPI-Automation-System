import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import all language translations
import itTranslations from './locales/it.json';
import enTranslations from './locales/en.json';
import frTranslations from './locales/fr.json';
import deTranslations from './locales/de.json';
import esTranslations from './locales/es.json';
import ptTranslations from './locales/pt.json';
import nlTranslations from './locales/nl.json';
import plTranslations from './locales/pl.json';
import hiTranslations from './locales/hi.json';

export const resources = {
  en: { translation: enTranslations },  // English (Priority)
  it: { translation: itTranslations },  // Italian
  fr: { translation: frTranslations },  // French
  de: { translation: deTranslations },  // German
  es: { translation: esTranslations },  // Spanish
  pt: { translation: ptTranslations },  // Portuguese
  nl: { translation: nlTranslations },  // Dutch
  pl: { translation: plTranslations },  // Polish
  hi: { translation: hiTranslations },  // Hindi
} as const;

// All supported languages - English as default
const supportedLanguages = ['en', 'it', 'fr', 'de', 'es', 'pt', 'nl', 'pl', 'hi'];

// Initialize i18n
const initI18n = () => {
  let savedLanguage = typeof window !== 'undefined'
    ? localStorage.getItem('shelfiq-language')
    : null;

  // Force reset to English if currently set to Italian
  if (savedLanguage === 'it' && typeof window !== 'undefined') {
    savedLanguage = 'en';
    localStorage.setItem('shelfiq-language', 'en');
  }

  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: 'en', // English as default fallback
      supportedLngs: supportedLanguages,
      lng: savedLanguage || 'en', // Default to English
      interpolation: {
        escapeValue: false,
      },
      detection: {
        order: ['localStorage', 'navigator'],
        caches: ['localStorage'],
        lookupLocalStorage: 'shelfiq-language',
      },
      react: {
        useSuspense: true,
      },
    });
};

// Initialize immediately
initI18n();

// Make i18n accessible in browser console for debugging
if (typeof window !== 'undefined') {
  (window as any).i18n = i18n;
  console.log('🌍 i18n initialized with 9 languages:', supportedLanguages);
  console.log('📍 Current language:', i18n.language);
  console.log('🎯 Available translations:', Object.keys(resources));
}

export default i18n;
