import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Plus, Bell } from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { useNotifications } from "@/contexts/NotificationContext";
import { useAppAlert } from "@/contexts/AlertContext";
import { useVehicles } from "@/contexts/VehicleContext";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Reminder } from "./quick-reminders/types";
import { ReminderCard } from "./quick-reminders/ReminderCard";
import { AddReminderModal } from "./quick-reminders/AddReminderModal";
import { ReminderDetailModal } from "./quick-reminders/ReminderDetailModal";

interface QuickRemindersProps {
  vehicleId: string;
}

export const QuickReminders = ({ vehicleId }: QuickRemindersProps) => {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const { requestPermissions, permissionGranted, notificationsEnabled } =
    useNotifications();
  const { showAlert } = useAppAlert();
  const {
    addQuickReminder,
    deleteQuickReminder,
    updateQuickReminder,
    getQuickRemindersByVehicle,
  } = useVehicles();

  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState<Reminder | null>(
    null
  );

  const reminders = getQuickRemindersByVehicle(vehicleId);

  // Update description text
  const updateReminderText = async (text: string) => {
    if (!selectedReminder) return;
    const updated = { ...selectedReminder, text };
    setSelectedReminder(updated);
    await updateQuickReminder(selectedReminder.id, { text });
  };

  const handleOpenModal = async () => {
    if (!notificationsEnabled) {
      showAlert({
        title: t("quick_reminders.notification_permission_alert_title"),
        message: t("quick_reminders.notification_permission_alert_message"),
      });
      return;
    }

    if (!permissionGranted) {
      const granted = await requestPermissions();
      if (!granted) {
        showAlert({
          title: t("quick_reminders.notification_permission_alert_title"),
          message: t("quick_reminders.notification_permission_alert_message"),
        });
        return;
      }
    }
    setModalVisible(true);
  };

  const handleAddReminder = async (
    text: string,
    date: Date,
    isRecurring: boolean
  ) => {
    try {
      let trigger: any;
      let dueDate: number;
      let secondsFromNow: number;

      if (isRecurring) {
        // Duration-based (Timer)
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const totalSeconds = hours * 3600 + minutes * 60;

        // Android requires at least 15 minutes for recurring background tasks
        // We'll let it try, but it might not work if < 15m and app is killed
        trigger = {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: totalSeconds,
          repeats: true,
        };
        secondsFromNow = totalSeconds;
        dueDate = Date.now() + totalSeconds * 1000;
      } else {
        // One-time Duration (Timer)
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const totalSeconds = hours * 3600 + minutes * 60;

        // Ensure at least 1 second
        const finalSeconds = totalSeconds > 0 ? totalSeconds : 1;

        trigger = {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: finalSeconds,
          repeats: false,
        };

        secondsFromNow = finalSeconds;
        dueDate = Date.now() + finalSeconds * 1000;
      }

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: t("quick_reminders.notification_title"),
          body: text,
          sound: "default",
        },
        trigger,
      });

      const newReminder: Reminder = {
        id: Math.random().toString(),
        vehicleId,
        text,
        createdAt: Date.now(),
        dueAt: dueDate,
        type: isRecurring ? "recurring" : "one-time",
        notificationId,
        triggerSeconds: secondsFromNow,
      };

      await addQuickReminder(newReminder);
      setModalVisible(false);
    } catch (e) {
      console.error("Error adding reminder:", e);
    }
  };

  const handleCompleteReminder = useCallback(
    async (reminder: Reminder) => {
      showAlert({
        title: t("quick_reminders.complete_confirmation_title"),
        message: t("quick_reminders.complete_confirmation_message"),
        buttons: [
          {
            text: t("quick_reminders.cancel"),
            style: "cancel",
          },
          {
            text: t("quick_reminders.confirm"),
            style: "destructive",
            onPress: async () => {
              // Cancel notification
              if (reminder.notificationId) {
                await Notifications.cancelScheduledNotificationAsync(
                  reminder.notificationId
                ).catch((err) =>
                  console.log("Failed to cancel notification:", err)
                );
              }
              setSelectedReminder((current) =>
                current?.id === reminder.id ? null : current
              );
              await deleteQuickReminder(reminder.id);
            },
          },
        ],
      });
    },
    [showAlert, deleteQuickReminder, t]
  );

  const handlePressReminder = useCallback((reminder: Reminder) => {
    setSelectedReminder(reminder);
  }, []);

  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Bell size={18} color={colors.primary} />
          <Text style={styles.title}>{t("quick_reminders.title")}</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={handleOpenModal}>
          <Plus size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Horizontal Scroll of Notes */}
      {reminders.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        >
          {reminders.map((reminder) => (
            <ReminderCard
              key={reminder.id}
              reminder={reminder}
              onPress={handlePressReminder}
              onComplete={handleCompleteReminder}
            />
          ))}
        </ScrollView>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>
            {t("quick_reminders.empty_state")}
          </Text>
        </View>
      )}

      <AddReminderModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onAdd={handleAddReminder}
      />

      <ReminderDetailModal
        visible={!!selectedReminder}
        reminder={selectedReminder}
        onClose={() => setSelectedReminder(null)}
        onUpdateText={updateReminderText}
        onComplete={() =>
          selectedReminder && handleCompleteReminder(selectedReminder)
        }
      />
    </View>
  );
};

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      marginTop: 20,
      marginBottom: 10,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      marginBottom: 12,
    },
    titleRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    title: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
    },
    addButton: {
      backgroundColor: colors.primary,
      width: 32,
      height: 32,
      borderRadius: 16,
      justifyContent: "center",
      alignItems: "center",
    },
    listContent: {
      paddingHorizontal: 20,
      gap: 12,
      paddingBottom: 20,
    },
    emptyState: {
      backgroundColor: colors.card,
      marginHorizontal: 20,
      padding: 24,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
      borderStyle: "dashed",
      borderWidth: 2,
      borderColor: colors.border,
      opacity: 0.8,
      minHeight: 100,
    },
    emptyText: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: "center",
    },
  });
