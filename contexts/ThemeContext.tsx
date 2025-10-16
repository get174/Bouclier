import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { ColorSchemeName, useColorScheme } from 'react-native';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: ColorSchemeName;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  const [theme, setTheme] = useState<ColorSchemeName>('light');
  const systemColorScheme = useColorScheme();

  // Load saved theme preference on mount
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('themeMode');
        if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
          setThemeModeState(savedTheme as ThemeMode);
        }
      } catch (error) {
        console.error('Failed to load theme preference:', error);
      }
    };

    loadThemePreference();
  }, []);

  // Update theme when themeMode or system color scheme changes
  useEffect(() => {
    const updateTheme = async () => {
      try {
        await AsyncStorage.setItem('themeMode', themeMode);
      } catch (error) {
        console.error('Failed to save theme preference:', error);
      }

      let activeTheme: ColorSchemeName;
      if (themeMode === 'system') {
        // Use the actual system color scheme
        activeTheme = systemColorScheme ?? 'light';
      } else {
        activeTheme = themeMode;
      }

      setTheme(activeTheme);
    };

    updateTheme();
  }, [themeMode, systemColorScheme]);

  const setThemeMode = async (mode: ThemeMode) => {
    setThemeModeState(mode);
  };

  const toggleTheme = () => {
    const newMode = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(newMode);
  };

  const value: ThemeContextType = {
    theme,
    themeMode,
    setThemeMode,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
