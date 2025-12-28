import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Sun, Moon, Settings as SettingsIcon } from "lucide-react-native";
import * as Haptics from "expo-haptics";

import { useTheme } from "@/contexts/ThemeContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { usePreferences } from "@/contexts/PreferencesContext";
import { createSettingsStyles } from "@/styles/settings/SettingsSections.styles";

export const ThemeSettings = () => {
  const { colors, themeMode, setThemeMode } = useTheme();
  const { t } = useLocalization();
  const { hapticsEnabled } = usePreferences();
  const styles = createSettingsStyles(colors);

  const handleThemeChange = (mode: "light" | "dark" | "system") => {
    if (hapticsEnabled) {
      Haptics.selectionAsync();
    }
    setThemeMode(mode);
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{t("settings.theme")}</Text>
      <View style={styles.optionGroup}>
        <TouchableOpacity
          style={[
            styles.optionButton,
            themeMode === "light" && styles.optionButtonActive,
          ]}
          onPress={() => handleThemeChange("light")}
          activeOpacity={0.7}
        >
          <Sun
            size={20}
            color={themeMode === "light" ? colors.primary : colors.text}
          />
          <Text
            style={[
              styles.optionText,
              themeMode === "light" && styles.optionTextActive,
            ]}
          >
            {t("settings.theme_light")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.optionButton,
            themeMode === "dark" && styles.optionButtonActive,
          ]}
          onPress={() => handleThemeChange("dark")}
          activeOpacity={0.7}
        >
          <Moon
            size={20}
            color={themeMode === "dark" ? colors.primary : colors.text}
          />
          <Text
            style={[
              styles.optionText,
              themeMode === "dark" && styles.optionTextActive,
            ]}
          >
            {t("settings.theme_dark")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.optionButton,
            themeMode === "system" && styles.optionButtonActive,
            styles.optionButtonLast,
          ]}
          onPress={() => handleThemeChange("system")}
          activeOpacity={0.7}
        >
          <SettingsIcon
            size={20}
            color={themeMode === "system" ? colors.primary : colors.text}
          />
          <Text
            style={[
              styles.optionText,
              themeMode === "system" && styles.optionTextActive,
            ]}
          >
            {t("settings.theme_system")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
