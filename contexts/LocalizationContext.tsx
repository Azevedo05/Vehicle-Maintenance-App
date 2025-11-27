import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import i18n from 'i18next';
import { useCallback, useEffect, useState } from 'react';
import { initReactI18next } from 'react-i18next';

import en from '@/locales/en.json';
import ptPT from '@/locales/pt-PT.json';

export type Language = 'en' | 'pt-PT';

const LANGUAGE_STORAGE_KEY = '@language';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    'pt-PT': { translation: ptPT },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export const [LocalizationProvider, useLocalization] = createContextHook(() => {
  const [language, setLanguage] = useState<Language>('en');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const stored = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (stored && (stored === 'en' || stored === 'pt-PT')) {
        setLanguage(stored);
        i18n.changeLanguage(stored);
      }
    } catch (error) {
      console.error('Error loading language:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const changeLanguage = useCallback(async (lang: Language) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
      setLanguage(lang);
      i18n.changeLanguage(lang);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  }, []);

  return {
    language,
    changeLanguage,
    isLoading,
    t: i18n.t,
  };
});
