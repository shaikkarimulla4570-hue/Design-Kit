import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { CategoryId, ToolId } from '../types';
import { LanguageMeta, TranslationDictionary, TranslationKey } from './types';
import { SUPPORTED_LANGUAGES } from './languages';
import { EN_DICTIONARY } from './locales/en';
import { MAJOR_LOCALES_A } from './locales/majorLocalesA';
import { MAJOR_LOCALES_B } from './locales/majorLocalesB';
import { EUROPEAN_EXTENDED_LOCALES } from './locales/europeanExtended';
import { WORLD_EXTENDED_LOCALES } from './locales/worldExtended';

const STORAGE_KEY = 'designkit_locale';

export const ALL_TRANSLATIONS: Record<string, Partial<TranslationDictionary>> = {
  en: EN_DICTIONARY,
  ...MAJOR_LOCALES_A,
  ...MAJOR_LOCALES_B,
  ...EUROPEAN_EXTENDED_LOCALES,
  ...WORLD_EXTENDED_LOCALES,
};

interface I18nContextValue {
  locale: string;
  setLocale: (code: string) => void;
  currentLanguage: LanguageMeta;
  languages: LanguageMeta[];
  isRtl: boolean;
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
  tCategoryTitle: (catId: CategoryId) => string;
  tToolTitle: (toolId: ToolId) => string;
  tToolDesc: (toolId: ToolId) => string;
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

function getInitialLocale(): string {
  if (typeof window === 'undefined') return 'en';
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved && SUPPORTED_LANGUAGES.some((l) => l.code === saved)) {
      return saved;
    }
  } catch {
    // Ignore storage read errors in restricted iframes
  }
  return 'en';
}

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<string>(getInitialLocale);

  const currentLanguage = useMemo<LanguageMeta>(
    () =>
      SUPPORTED_LANGUAGES.find((l) => l.code === locale) ||
      SUPPORTED_LANGUAGES.find((l) => l.code === 'en')!,
    [locale]
  );

  const isRtl = currentLanguage.dir === 'rtl';

  const setLocale = useCallback((code: string) => {
    const valid = SUPPORTED_LANGUAGES.some((l) => l.code === code) ? code : 'en';
    setLocaleState(valid);
    try {
      window.localStorage.setItem(STORAGE_KEY, valid);
    } catch {
      // Ignore storage write errors
    }
  }, []);

  // Synchronize <html lang="..." dir="..."> for screen readers and RTL layout mirroring
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = currentLanguage.code;
      document.documentElement.dir = currentLanguage.dir;
    }
  }, [currentLanguage]);

  const activeDictionary = useMemo<Partial<TranslationDictionary>>(
    () => ALL_TRANSLATIONS[locale] || EN_DICTIONARY,
    [locale]
  );

  const t = useCallback(
    (key: TranslationKey, vars?: Record<string, string | number>): string => {
      const rawValue = activeDictionary[key] || EN_DICTIONARY[key] || '';
      if (!vars) return rawValue;
      return Object.entries(vars).reduce(
        (acc, [varKey, varVal]) => acc.split(`{${varKey}}`).join(String(varVal)),
        rawValue
      );
    },
    [activeDictionary]
  );

  const tCategoryTitle = useCallback(
    (catId: CategoryId): string => t(`cat.${catId}` as TranslationKey),
    [t]
  );

  const tToolTitle = useCallback(
    (toolId: ToolId): string => t(`tool.${toolId}` as TranslationKey),
    [t]
  );

  const tToolDesc = useCallback(
    (toolId: ToolId): string => t(`toolDesc.${toolId}` as TranslationKey),
    [t]
  );

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      setLocale,
      currentLanguage,
      languages: SUPPORTED_LANGUAGES,
      isRtl,
      t,
      tCategoryTitle,
      tToolTitle,
      tToolDesc,
    }),
    [locale, setLocale, currentLanguage, isRtl, t, tCategoryTitle, tToolTitle, tToolDesc]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return ctx;
}
