import React from "react";
import { View, Text, TouchableOpacity, Linking } from "react-native";
import { Coffee, ChevronRight } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { useTheme } from "@/contexts/ThemeContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { usePreferences } from "@/contexts/PreferencesContext";
import { createSettingsStyles } from "@/styles/settings/SettingsSections.styles";

const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/eVqeVe7TVf4R6Cyabwcs803";

export const BuyMeCoffee = () => {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const { hapticsEnabled } = usePreferences();
  const styles = createSettingsStyles(colors);

  const handlePress = async () => {
    if (hapticsEnabled) {
      Haptics.selectionAsync();
    }
    try {
      await Linking.openURL(STRIPE_PAYMENT_LINK);
    } catch (error) {
      console.error("Failed to open URL:", error);
    }
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        {t("settings.support") || "Support"}
      </Text>
      <View style={styles.optionGroup}>
        <TouchableOpacity
          style={[styles.optionButton, styles.optionButtonLast]}
          onPress={handlePress}
          activeOpacity={0.7}
        >
          <Coffee size={20} color={colors.primary} />
          <View style={styles.notificationContent}>
            <Text style={styles.optionText}>
              {t("settings.buy_me_coffee") || "Buy Me a Coffee"}
            </Text>
            <Text style={styles.optionDescription}>
              {t("settings.buy_me_coffee_description") ||
                "Support the development of this app"}
            </Text>
          </View>
          <ChevronRight size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};
