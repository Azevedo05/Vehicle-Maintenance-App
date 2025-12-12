import React, { useState } from "react";
import { View, Text, Switch, TouchableOpacity, StyleSheet } from "react-native";
import {
  Bell,
  Settings as SettingsIcon,
  ChevronRight,
} from "lucide-react-native";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { useTheme } from "@/contexts/ThemeContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { usePreferences } from "@/contexts/PreferencesContext";
import { useNotifications } from "@/contexts/NotificationContext";
import { useAppAlert } from "@/contexts/AlertContext";
import { createSettingsStyles } from "./SettingsStyles";

export const NotificationSettingsSection = () => {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const { hapticsEnabled } = usePreferences();
  const {
    notificationsEnabled,
    permissionGranted,
    toggleNotifications,
    requestPermissions,
  } = useNotifications();
  const { showAlert } = useAppAlert();

  const [isTogglingNotifications, setIsTogglingNotifications] = useState(false);
  const styles = createSettingsStyles(colors);
  const localStyles = createLocalStyles(colors);

  const handleToggleNotifications = async (value: boolean) => {
    if (hapticsEnabled) {
      Haptics.selectionAsync();
    }

    // If turning on, request permission directly (native behavior)
    if (value && !permissionGranted) {
      setIsTogglingNotifications(true);
      const granted = await requestPermissions();
      if (granted) {
        await toggleNotifications(true);
      }
      setIsTogglingNotifications(false);
      return;
    }

    // If turning off or permission already granted, just toggle
    setIsTogglingNotifications(true);
    await toggleNotifications(value);
    setIsTogglingNotifications(false);
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{t("settings.notifications")}</Text>
      <View style={styles.optionGroup}>
        <View style={[styles.optionButton, styles.optionButtonLast]}>
          <Bell
            size={20}
            color={notificationsEnabled ? colors.primary : colors.text}
          />
          <View style={styles.notificationContent}>
            <Text
              style={[
                styles.optionText,
                notificationsEnabled && styles.optionTextActive,
              ]}
            >
              {t("settings.enable_notifications")}
            </Text>
            <Text style={styles.optionDescription}>
              {t("settings.notifications_description")}
            </Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={handleToggleNotifications}
            disabled={isTogglingNotifications}
            trackColor={{
              false: colors.border,
              true: colors.primary + "50",
            }}
            thumbColor={
              notificationsEnabled ? colors.primary : colors.placeholder
            }
          />
        </View>
      </View>

      {!permissionGranted && (
        <Text style={localStyles.permissionWarning}>
          ⚠️ {t("settings.notifications_permission_needed")}
        </Text>
      )}

      {notificationsEnabled && (
        <TouchableOpacity
          style={localStyles.advancedSettingsButton}
          onPress={() => router.push("/notification-settings")}
          activeOpacity={0.7}
        >
          <SettingsIcon size={18} color={colors.primary} />
          <Text style={localStyles.advancedSettingsText}>
            {t("settings.notification_settings")}
          </Text>
          <ChevronRight size={18} color={colors.textSecondary} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const createLocalStyles = (colors: any) =>
  StyleSheet.create({
    permissionWarning: {
      fontSize: 13,
      color: colors.warning,
      marginTop: 8,
      marginLeft: 4,
    },
    advancedSettingsButton: {
      flexDirection: "row",
      alignItems: "center",
      padding: 12,
      marginTop: 12,
      backgroundColor: `${colors.primary}10`,
      borderRadius: 8,
      gap: 8,
    },
    advancedSettingsText: {
      flex: 1,
      fontSize: 14,
      fontWeight: "500",
      color: colors.primary,
    },
  });
