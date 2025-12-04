import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Globe, DollarSign } from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import {
  usePreferences,
  Currency,
  CURRENCY_SYMBOLS,
} from "@/contexts/PreferencesContext";
import { createSettingsStyles } from "./SettingsStyles";

export const UnitSettings = () => {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const { distanceUnit, currency, setDistanceUnit, setCurrency } =
    usePreferences();
  const styles = createSettingsStyles(colors);
  const localStyles = createLocalStyles(colors);

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{t("settings.units")}</Text>
      <View style={styles.optionGroup}>
        <View style={styles.optionButton}>
          <Globe size={20} color={colors.text} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.optionText}>{t("settings.distance_unit")}</Text>
            <Text style={localStyles.helperText}>
              {t("settings.distance_unit_coming_soon")}
            </Text>
          </View>
          <View style={localStyles.unitSelector}>
            <TouchableOpacity
              style={[
                localStyles.unitButton,
                distanceUnit === "km" && localStyles.unitButtonActive,
                { opacity: 0.5 },
              ]}
              disabled={true}
              onPress={() => setDistanceUnit("km")}
            >
              <Text
                style={[
                  localStyles.unitButtonText,
                  distanceUnit === "km" && localStyles.unitButtonTextActive,
                ]}
              >
                km
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                localStyles.unitButton,
                distanceUnit === "mi" && localStyles.unitButtonActive,
                { opacity: 0.5 },
              ]}
              disabled={true}
              onPress={() => setDistanceUnit("mi")}
            >
              <Text
                style={[
                  localStyles.unitButtonText,
                  distanceUnit === "mi" && localStyles.unitButtonTextActive,
                ]}
              >
                mi
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.optionButton, styles.optionButtonLast]}>
          <DollarSign size={20} color={colors.text} />
          <Text style={styles.optionText}>{t("settings.currency")}</Text>
          <View style={localStyles.currencySelector}>
            {(["EUR", "USD", "GBP", "BRL"] as Currency[]).map((curr) => (
              <TouchableOpacity
                key={curr}
                style={[
                  localStyles.currencyButton,
                  currency === curr && localStyles.currencyButtonActive,
                ]}
                onPress={() => setCurrency(curr)}
              >
                <Text
                  style={[
                    localStyles.currencyButtonText,
                    currency === curr && localStyles.currencyButtonTextActive,
                  ]}
                >
                  {CURRENCY_SYMBOLS[curr]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};

const createLocalStyles = (colors: any) =>
  StyleSheet.create({
    unitSelector: {
      flexDirection: "row",
      gap: 8,
    },
    unitButton: {
      paddingHorizontal: 16,
      paddingVertical: 6,
      borderRadius: 8,
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
    },
    unitButtonActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    unitButtonText: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.text,
    },
    unitButtonTextActive: {
      color: "#FFFFFF",
      fontWeight: "600",
    },
    helperText: {
      fontSize: 12,
      color: colors.textSecondary,
      fontStyle: "italic",
    },
    currencySelector: {
      flexDirection: "row",
      gap: 8,
    },
    currencyButton: {
      minWidth: 44,
      paddingVertical: 6,
      borderRadius: 8,
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: "center",
      justifyContent: "center",
    },
    currencyButtonActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    currencyButtonText: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.text,
    },
    currencyButtonTextActive: {
      color: "#FFFFFF",
    },
  });
