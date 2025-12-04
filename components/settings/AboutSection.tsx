import React from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  Info,
  Settings as SettingsIcon,
  Bell,
  Database,
  Download,
} from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { APP_VERSION } from "@/utils/dataManagement";
import { createSettingsStyles } from "./SettingsStyles";

export const AboutSection = () => {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const styles = createSettingsStyles(colors);
  const localStyles = createLocalStyles(colors);

  return (
    <View style={[styles.section, { marginBottom: 0 }]}>
      <Text style={styles.sectionTitle}>{t("settings.about")}</Text>
      <View style={styles.optionGroup}>
        <View
          style={[
            styles.optionButton,
            styles.optionButtonLast,
            localStyles.aboutSection,
            { marginBottom: 0 },
          ]}
        >
          <Info size={24} color={colors.primary} />
          <View style={localStyles.aboutContent}>
            <Text style={localStyles.aboutTitle}>
              {t("settings.about_app_title")}
            </Text>
            <Text style={localStyles.aboutDescription}>
              {t("settings.about_app_description")}
            </Text>
            <View style={localStyles.separator} />
            <Text style={localStyles.aboutSubDescription}>
              {t("settings.about_app_sub_description")}
            </Text>

            <Text style={localStyles.aboutSectionTitle}>
              {t("settings.how_it_works")}
            </Text>

            <View style={localStyles.featuresList}>
              <View style={localStyles.featureItem}>
                <View style={localStyles.featureIconContainer}>
                  <SettingsIcon size={16} color={colors.primary} />
                </View>
                <Text style={localStyles.featureText}>
                  {t("settings.feature_vehicles")}
                </Text>
              </View>

              <View style={localStyles.featureItem}>
                <View style={localStyles.featureIconContainer}>
                  <Bell size={16} color={colors.primary} />
                </View>
                <Text style={localStyles.featureText}>
                  {t("settings.feature_tasks")}
                </Text>
              </View>

              <View style={localStyles.featureItem}>
                <View style={localStyles.featureIconContainer}>
                  <Database size={16} color={colors.primary} />
                </View>
                <Text style={localStyles.featureText}>
                  {t("settings.feature_records")}
                </Text>
              </View>

              <View style={localStyles.featureItem}>
                <View style={localStyles.featureIconContainer}>
                  <Bell size={16} color={colors.primary} />
                </View>
                <Text style={localStyles.featureText}>
                  {t("settings.feature_notifications")}
                </Text>
              </View>

              <View style={localStyles.featureItem}>
                <View style={localStyles.featureIconContainer}>
                  <Download size={16} color={colors.primary} />
                </View>
                <Text style={localStyles.featureText}>
                  {t("settings.feature_backup")}
                </Text>
              </View>
            </View>

            <View style={localStyles.versionContainer}>
              <Text style={localStyles.versionLabel}>
                {t("settings.version")}
              </Text>
              <Text style={localStyles.versionText}>{APP_VERSION}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const createLocalStyles = (colors: any) =>
  StyleSheet.create({
    aboutSection: {
      flexDirection: "column",
      alignItems: "flex-start",
      gap: 16,
    },
    aboutContent: {
      flex: 1,
      width: "100%",
    },
    aboutTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 8,
    },
    aboutDescription: {
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 20,
      fontStyle: "italic",

      marginBottom: 8,
    },
    separator: {
      height: 1,
      backgroundColor: colors.border,
      marginVertical: 16,
      width: "100%",
    },
    aboutSubDescription: {
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 20,
      marginBottom: 24,
    },
    aboutSectionTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 12,
    },
    featuresList: {
      gap: 12,
      marginBottom: 24,
    },
    featureItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    featureIconContainer: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.primary + "15",
      alignItems: "center",
      justifyContent: "center",
    },
    featureText: {
      fontSize: 14,
      color: colors.text,
      fontWeight: "500",
    },
    versionContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      marginTop: 8,
    },
    versionLabel: {
      fontSize: 13,
      color: colors.textSecondary,
      marginRight: 4,
    },
    versionText: {
      fontSize: 13,
      fontWeight: "600",
      color: colors.textSecondary,
    },
  });
