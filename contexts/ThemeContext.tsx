import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { useCallback, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';

type ThemeMode = 'light' | 'dark' | 'system';
type ActiveTheme = 'light' | 'dark';

interface Colors {
  primary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  card: string;
  error: string;
  success: string;
  warning: string;
  tabBarBackground: string;
  tabBarBorder: string;
  placeholder: string;
  shadow: string;
}

const lightColors: Colors = {
  primary: '#007AFF',
  background: '#F2F2F7',
  surface: '#FFFFFF',
  text: '#000000',
  textSecondary: '#8E8E93',
  border: '#E5E5EA',
  card: '#FFFFFF',
  error: '#FF3B30',
  success: '#34C759',
  warning: '#FF9500',
  tabBarBackground: '#FFFFFF',
  tabBarBorder: '#E5E5EA',
  placeholder: '#C7C7CC',
  shadow: '#000000',
};

const darkColors: Colors = {
  primary: '#0A84FF',
  background: '#000000',
  surface: '#1C1C1E',
  text: '#FFFFFF',
  // Slightly lighter secondary text for better contrast on black background
  textSecondary: '#A1A1AA',
  // Softer but still visible borders for cards and list items
  border: '#3A3A3C',
  card: '#1C1C1E',
  error: '#FF453A',
  success: '#32D74B',
  warning: '#FF9F0A',
  tabBarBackground: '#1C1C1E',
  tabBarBorder: '#3A3A3C',
  placeholder: '#6B6B6F',
  shadow: '#000000',
};

const THEME_STORAGE_KEY = '@theme_mode';

export const [ThemeProvider, useTheme] = createContextHook(() => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadThemeMode();
  }, []);

  const loadThemeMode = async () => {
    try {
      const stored = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (stored && (stored === 'light' || stored === 'dark' || stored === 'system')) {
        setThemeMode(stored);
      }
    } catch (error) {
      console.error('Error loading theme mode:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveThemeMode = useCallback(async (mode: ThemeMode) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
      setThemeMode(mode);
    } catch (error) {
      console.error('Error saving theme mode:', error);
    }
  }, []);

  const activeTheme: ActiveTheme =
    themeMode === 'system'
      ? systemColorScheme === 'dark'
        ? 'dark'
        : 'light'
      : themeMode;

  const colors = activeTheme === 'dark' ? darkColors : lightColors;

  return {
    themeMode,
    activeTheme,
    colors,
    setThemeMode: saveThemeMode,
    isLoading,
    isDark: activeTheme === 'dark',
  };
});
