import AsyncStorage from "@react-native-async-storage/async-storage";
import createContextHook from "@nkzw/create-context-hook";
import { useCallback, useEffect, useState } from "react";
import { useColorScheme } from "react-native";

type ThemeMode = "light" | "dark" | "system";
type ActiveTheme = "light" | "dark";

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
  primary: "#2563EB", // More vibrant, modern blue (Tailwind Blue 600)
  background: "#F8F9FA", // Lighter, cleaner gray (Modern app background)
  surface: "#FFFFFF",
  text: "#1A1A1A", // Softer black for better reading comfort
  textSecondary: "#6B7280", // Modern slate gray (Tailwind Gray 500)
  border: "#E5E7EB", // Lighter, subtle border (Tailwind Gray 200)
  card: "#FFFFFF",
  error: "#EF4444", // Modern vibrant red
  success: "#10B981", // Modern vibrant green
  warning: "#F59E0B", // Modern vibrant amber
  tabBarBackground: "#FFFFFF",
  tabBarBorder: "#E5E7EB",
  placeholder: "#9CA3AF", // Tailwind Gray 400
  shadow: "#000000",
};

const darkColors: Colors = {
  primary: "#0A84FF",
  background: "#000000",
  surface: "#1C1C1E",
  text: "#FFFFFF",
  // Enhanced secondary text for better readability in dark mode
  textSecondary: "#AAABB0",
  // Improved border contrast while maintaining dark theme
  border: "#444447",
  card: "#1C1C1E",
  error: "#FF453A",
  success: "#32D74B",
  warning: "#FF9F0A",
  tabBarBackground: "#1C1C1E",
  tabBarBorder: "#444447",
  placeholder: "#6B6B6F",
  // Lighter shadow for dark mode - creates subtle depth/elevation
  shadow: "rgba(255, 255, 255, 0.05)",
};

const THEME_STORAGE_KEY = "@theme_mode";

export const [ThemeProvider, useTheme] = createContextHook(() => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>("system");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadThemeMode();
  }, []);

  const loadThemeMode = async () => {
    try {
      const stored = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (
        stored &&
        (stored === "light" || stored === "dark" || stored === "system")
      ) {
        setThemeMode(stored);
      }
    } catch (error) {
      console.error("Error loading theme mode:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveThemeMode = useCallback(async (mode: ThemeMode) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
      setThemeMode(mode);
    } catch (error) {
      console.error("Error saving theme mode:", error);
    }
  }, []);

  const activeTheme: ActiveTheme =
    themeMode === "system"
      ? systemColorScheme === "dark"
        ? "dark"
        : "light"
      : themeMode;

  const colors = activeTheme === "dark" ? darkColors : lightColors;

  return {
    themeMode,
    activeTheme,
    colors,
    setThemeMode: saveThemeMode,
    isLoading,
    isDark: activeTheme === "dark",
  };
});
