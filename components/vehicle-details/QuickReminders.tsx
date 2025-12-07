import React, { useState, useEffect } from "react";
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
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState<Reminder | null>(
    null
  );

  const STORAGE_KEY = `@quick_reminders_${vehicleId}`;

  // Load reminders
  useEffect(() => {
    const loadReminders = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          setReminders(JSON.parse(stored));
        }
      } catch (e) {
        console.error("Failed to load reminders", e);
      }
    };
    loadReminders();
  }, [vehicleId]);

  // Save reminders
  useEffect(() => {
    const saveReminders = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(reminders));
      } catch (e) {
        console.error("Failed to save reminders", e);
      }
    };
    saveReminders();
  }, [reminders, vehicleId]);

  // Update description text
  const updateReminderText = (text: string) => {
    if (!selectedReminder) return;
    const updated = { ...selectedReminder, text };
    setSelectedReminder(updated);
    setReminders((prev) =>
      prev.map((r) => (r.id === updated.id ? updated : r))
    );
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
        // Time-based (Alarm)
        const now = new Date();
        const triggerDate = new Date();
        triggerDate.setHours(date.getHours(), date.getMinutes(), 0, 0);

        // If time passed today, schedule for tomorrow
        if (triggerDate.getTime() <= now.getTime()) {
          triggerDate.setDate(triggerDate.getDate() + 1);
        }

        trigger = {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: triggerDate,
        };

        dueDate = triggerDate.getTime();
        secondsFromNow = (dueDate - now.getTime()) / 1000;
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
        text,
        createdAt: Date.now(),
        dueAt: dueDate,
        type: isRecurring ? "recurring" : "one-time",
        notificationId,
        triggerSeconds: secondsFromNow,
      };

      setReminders((prev) => [newReminder, ...prev]);
      setModalVisible(false);
    } catch (e) {
      console.error("Error adding reminder:", e);
    }
  };

  const handleCompleteReminder = async (reminder: Reminder) => {
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
            // Optimistic removal
            setReminders((prev) => prev.filter((r) => r.id !== reminder.id));

            // Cancel notification
            if (reminder.notificationId) {
              await Notifications.cancelScheduledNotificationAsync(
                reminder.notificationId
              ).catch((err) =>
                console.log("Failed to cancel notification:", err)
              );
            }
            if (selectedReminder?.id === reminder.id) {
              setSelectedReminder(null);
            }
          },
        },
      ],
    });
  };

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
              onPress={setSelectedReminder}
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
