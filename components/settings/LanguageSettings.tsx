import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { createSettingsStyles } from "./SettingsStyles";

export const LanguageSettings = () => {
  const { colors } = useTheme();
  const { t, language, changeLanguage } = useLocalization();
  const styles = createSettingsStyles(colors);

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{t("settings.language")}</Text>
      <View style={styles.optionGroup}>
        <TouchableOpacity
          style={[
            styles.optionButton,
            language === "en" && styles.optionButtonActive,
          ]}
          onPress={() => changeLanguage("en")}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.optionText,
              language === "en" && styles.optionTextActive,
            ]}
          >
            {t("settings.language_en")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.optionButton,
            language === "pt-PT" && styles.optionButtonActive,
            styles.optionButtonLast,
          ]}
          onPress={() => changeLanguage("pt-PT")}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.optionText,
              language === "pt-PT" && styles.optionTextActive,
            ]}
          >
            {t("settings.language_pt")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
