import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Sun, Moon, Settings as SettingsIcon } from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { createSettingsStyles } from "./SettingsStyles";

export const ThemeSettings = () => {
  const { colors, themeMode, setThemeMode } = useTheme();
  const { t } = useLocalization();
  const styles = createSettingsStyles(colors);

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{t("settings.theme")}</Text>
      <View style={styles.optionGroup}>
        <TouchableOpacity
          style={[
            styles.optionButton,
            themeMode === "light" && styles.optionButtonActive,
          ]}
          onPress={() => setThemeMode("light")}
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
          onPress={() => setThemeMode("dark")}
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
          onPress={() => setThemeMode("system")}
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
