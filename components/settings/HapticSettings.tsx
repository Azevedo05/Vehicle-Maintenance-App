import React from "react";
import { View, Text, Switch } from "react-native";
import { Vibrate } from "lucide-react-native";
import * as Haptics from "expo-haptics";

import { useTheme } from "@/contexts/ThemeContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { usePreferences } from "@/contexts/PreferencesContext";
import { createSettingsStyles } from "@/styles/settings/SettingsSections.styles";

export const HapticSettings = () => {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const { hapticsEnabled, setHapticsEnabled } = usePreferences();

  const styles = createSettingsStyles(colors);

  const handleToggle = (value: boolean) => {
    // Provide instant feedback if turning ON (or if it was already on)
    if (value) {
      Haptics.selectionAsync();
    }
    setHapticsEnabled(value);
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{t("settings.haptics_title")}</Text>
      <View style={styles.optionGroup}>
        <View style={[styles.optionButton, styles.optionButtonLast]}>
          <Vibrate
            size={20}
            color={hapticsEnabled ? colors.primary : colors.text}
          />
          <View style={styles.notificationContent}>
            <Text
              style={[
                styles.optionText,
                hapticsEnabled && styles.optionTextActive,
              ]}
            >
              {t("settings.haptics_enabled")}
            </Text>
            <Text style={styles.optionDescription}>
              {t("settings.haptics_description")}
            </Text>
          </View>
          <Switch
            value={hapticsEnabled}
            onValueChange={handleToggle}
            trackColor={{ false: colors.border, true: colors.primary + "50" }}
            thumbColor={hapticsEnabled ? colors.primary : colors.placeholder}
          />
        </View>
      </View>
    </View>
  );
};
