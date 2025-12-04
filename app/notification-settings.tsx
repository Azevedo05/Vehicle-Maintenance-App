import { Stack, router } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useTheme } from "@/contexts/ThemeContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { usePreferences } from "@/contexts/PreferencesContext";
import { useAppAlert } from "@/contexts/AlertContext";
import { SuccessAnimation } from "@/components/ui/SuccessAnimation";
import { createNotificationSettingsStyles } from "@/components/notification-settings/NotificationSettingsStyles";
import { NotificationTimeSection } from "@/components/notification-settings/NotificationTimeSection";
import { DateIntervalsSection } from "@/components/notification-settings/DateIntervalsSection";
import { OverdueIntervalsSection } from "@/components/notification-settings/OverdueIntervalsSection";

export default function NotificationSettingsScreen() {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const styles = createNotificationSettingsStyles(colors);

  const { notificationSettings, setNotificationSettings } = usePreferences();
  const { showAlert } = useAppAlert();

  const [selectedTime, setSelectedTime] = useState(
    notificationSettings.notificationTime
  );
  const [dateIntervals, setDateIntervals] = useState<number[]>(
    notificationSettings.dateIntervals
  );
  const [overdueIntervals, setOverdueIntervals] = useState<number[]>(
    notificationSettings.overdueIntervals || [1, 3, 7]
  );
  const [overdueFrequency, setOverdueFrequency] = useState<
    "custom" | "daily" | "weekly" | "monthly"
  >(notificationSettings.overdueFrequency || "custom");

  const [showSuccess, setShowSuccess] = useState(false);

  const addDateInterval = (value: number) => {
    const updated = [...dateIntervals, value].sort((a, b) => b - a);
    setDateIntervals(updated);
  };

  const removeDateInterval = (value: number) => {
    setDateIntervals(dateIntervals.filter((v) => v !== value));
  };

  const addOverdueInterval = (value: number) => {
    const currentIntervals = Array.isArray(overdueIntervals)
      ? overdueIntervals
      : [];
    const updated = [...currentIntervals, value].sort((a, b) => a - b);
    setOverdueIntervals(updated);
  };

  const removeOverdueInterval = (value: number) => {
    setOverdueIntervals(overdueIntervals.filter((v) => v !== value));
  };

  const handleSaveSettings = async () => {
    try {
      if (dateIntervals.length === 0) {
        showAlert({
          title: t("common.error"),
          message: t("settings.need_intervals"),
        });
        return;
      }

      if (overdueFrequency === "custom" && overdueIntervals.length === 0) {
        showAlert({
          title: t("common.error"),
          message: t("settings.need_overdue_intervals"),
        });
        return;
      }

      await setNotificationSettings({
        notificationTime: selectedTime,
        dateIntervals,
        overdueIntervals,
        overdueFrequency,
      });

      setShowSuccess(true);
    } catch (error) {
      showAlert({
        title: t("common.error"),
        message: t("settings.settings_error"),
      });
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: t("settings.notification_settings"),
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
        }}
      />
      <SuccessAnimation
        visible={showSuccess}
        onAnimationFinish={() => {
          setShowSuccess(false);
          router.back();
        }}
      />
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          <NotificationTimeSection
            selectedTime={selectedTime}
            onTimeChange={setSelectedTime}
          />

          <DateIntervalsSection
            intervals={dateIntervals}
            onAddInterval={addDateInterval}
            onRemoveInterval={removeDateInterval}
          />

          <OverdueIntervalsSection
            frequency={overdueFrequency}
            intervals={overdueIntervals}
            onFrequencyChange={setOverdueFrequency}
            onAddInterval={addOverdueInterval}
            onRemoveInterval={removeOverdueInterval}
          />

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveSettings}
          >
            <Text style={styles.saveButtonText}>{t("common.save")}</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
