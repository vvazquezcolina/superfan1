
"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect, useCallback }
  from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark'); // Default to dark

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      root.classList.add('dark');
    }
  }, [theme]);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    // Optional: Persist theme to localStorage
    // localStorage.setItem('theme', newTheme);
  }, []);

  // Optional: Load theme from localStorage on initial mount
  // useEffect(() => {
  //   const storedTheme = localStorage.getItem('theme') as Theme | null;
  //   if (storedTheme) {
  //     setThemeState(storedTheme);
  //   } else {
  //      // Fallback to system preference if no stored theme
  //      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  //      setThemeState(prefersDark ? 'dark' : 'light');
  //   }
  // }, []);


  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
