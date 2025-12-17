import AsyncStorage from "@react-native-async-storage/async-storage";
import createContextHook from "@nkzw/create-context-hook";
import i18n from "i18next";
import { useCallback, useEffect, useState } from "react";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";

import en from "@/locales/en.json";
import ptPT from "@/locales/pt-PT.json";

export type Language = "en" | "pt-PT";

const LANGUAGE_STORAGE_KEY = "@language";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    "pt-PT": { translation: ptPT },
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

/**
 * Detects if the device language is a Portuguese variant
 * Supports pt-PT, pt-BR, pt, and other Portuguese locales
 */
const detectDeviceLanguage = (): Language => {
  const deviceLocale = Localization.getLocales()[0]?.languageCode || "en";

  // Check if device language starts with 'pt' (covers pt-PT, pt-BR, etc.)
  if (deviceLocale.toLowerCase().startsWith("pt")) {
    return "pt-PT";
  }

  return "en";
};

export const [LocalizationProvider, useLocalization] = createContextHook(() => {
  const [language, setLanguage] = useState<Language>("en");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const stored = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (stored && (stored === "en" || stored === "pt-PT")) {
        // User has previously selected a language
        setLanguage(stored);
        i18n.changeLanguage(stored);
      } else {
        // First launch: detect device language
        const detectedLang = detectDeviceLanguage();
        setLanguage(detectedLang);
        i18n.changeLanguage(detectedLang);
        // Save the detected language so it persists
        await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, detectedLang);
      }
    } catch (error) {
      console.error("Error loading language:", error);
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
      console.error("Error saving language:", error);
    }
  }, []);

  return {
    language,
    changeLanguage,
    isLoading,
    t: i18n.t,
  };
});
