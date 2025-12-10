import AsyncStorage from "@react-native-async-storage/async-storage";
import createContextHook from "@nkzw/create-context-hook";
import { useCallback, useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import {
  MD3LightTheme,
  MD3DarkTheme,
  configureFonts,
  MD3Theme,
} from "react-native-paper";

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

// Valid Font Config for MD3
const fontConfig = {
  fontFamily: "Inter_400Regular", // Default font
  displayLarge: { fontFamily: "Inter_800ExtraBold" },
  displayMedium: { fontFamily: "Inter_800ExtraBold" },
  displaySmall: { fontFamily: "Inter_700Bold" },
  headlineLarge: { fontFamily: "Inter_700Bold" },
  headlineMedium: { fontFamily: "Inter_700Bold" },
  headlineSmall: { fontFamily: "Inter_600SemiBold" },
  titleLarge: { fontFamily: "Inter_600SemiBold" },
  titleMedium: { fontFamily: "Inter_600SemiBold" },
  titleSmall: { fontFamily: "Inter_500Medium" },
  labelLarge: { fontFamily: "Inter_600SemiBold" },
  labelMedium: { fontFamily: "Inter_500Medium" },
  labelSmall: { fontFamily: "Inter_500Medium" },
  bodyLarge: { fontFamily: "Inter_400Regular" },
  bodyMedium: { fontFamily: "Inter_400Regular" },
  bodySmall: { fontFamily: "Inter_400Regular" },
};

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

  // Create Paper Theme derived from our colors
  const basePaperTheme = activeTheme === "dark" ? MD3DarkTheme : MD3LightTheme;

  const paperTheme: MD3Theme = {
    ...basePaperTheme,
    fonts: configureFonts({ config: fontConfig }),
    colors: {
      ...basePaperTheme.colors,
      primary: colors.primary,
      onPrimary: "#FFFFFF",
      primaryContainer: activeTheme === "dark" ? "#003366" : "#DBEAFE", // Darker blue / Light blue
      onPrimaryContainer: activeTheme === "dark" ? "#DBEAFE" : "#003366",
      secondary: colors.textSecondary,
      secondaryContainer: activeTheme === "dark" ? "#333333" : "#E5E7EB",
      onSecondaryContainer: activeTheme === "dark" ? "#E5E7EB" : "#1A1A1A",

      // Tertiary: Use a neutral or complementary. Going with a cool gray/blue mix to stay consistent.
      tertiary: activeTheme === "dark" ? "#60A5FA" : "#3B82F6",
      onTertiary: "#FFFFFF",
      tertiaryContainer: activeTheme === "dark" ? "#1E3A8A" : "#DBEAFE",
      onTertiaryContainer: activeTheme === "dark" ? "#DBEAFE" : "#1E3A8A",

      background: colors.background,
      surface: colors.surface,
      surfaceVariant: colors.card,
      onSurface: colors.text,
      onSurfaceVariant: colors.textSecondary,

      error: colors.error,
      onError: "#FFFFFF",
      errorContainer: activeTheme === "dark" ? "#991B1B" : "#FEE2E2",
      onErrorContainer: activeTheme === "dark" ? "#FEE2E2" : "#991B1B",

      outline: colors.border,
      outlineVariant: activeTheme === "dark" ? "#444447" : "#D1D5DB",
    },
  };

  const toggleTheme = useCallback(() => {
    saveThemeMode(activeTheme === "light" ? "dark" : "light");
  }, [activeTheme, saveThemeMode]);

  return {
    themeMode,
    activeTheme,
    colors,
    paperTheme,
    setThemeMode: saveThemeMode,
    toggleTheme,
    isLoading,
    isDark: activeTheme === "dark",
  };
});
