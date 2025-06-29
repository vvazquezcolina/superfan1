
'use client';
import type { ReactNode } from 'react';
import { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { translations, type AllTranslations, type TranslationSet } from '@/translations';

type Language = 'es' | 'en' | 'fr';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: keyof AllTranslations, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('es'); // Default to Spanish

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
    }
  }, []);

  const t = useCallback(
    (key: keyof AllTranslations, fallback?: string): string => {
      const translationSet = translations[key] as TranslationSet | undefined;

      if (translationSet) {
        if (language === 'en') {
          if (typeof translationSet.en === 'string' && translationSet.en.trim() !== '') {
            return translationSet.en;
          }
          // Fallback to Spanish if English is missing
          if (typeof translationSet.es === 'string' && translationSet.es.trim() !== '') {
            return translationSet.es;
          }
        } else if (language === 'fr') {
          if (typeof translationSet.fr === 'string' && translationSet.fr.trim() !== '') {
            return translationSet.fr;
          }
          // Fallback to Spanish if French is missing
          if (typeof translationSet.es === 'string' && translationSet.es.trim() !== '') {
            return translationSet.es;
          }
        } else if (language === 'es') {
          // Default to Spanish
          if (typeof translationSet.es === 'string' && translationSet.es.trim() !== '') {
            return translationSet.es;
          }
        }
      }
      // Final fallback if no suitable translation is found or translationSet is undefined
      return fallback || String(key);
    },
    [language]
  );

  // Set initial lang attribute on mount
  if (typeof document !== 'undefined' && document.documentElement.lang !== language) {
    document.documentElement.lang = language;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
