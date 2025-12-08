import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import createContextHook from "@nkzw/create-context-hook";
import { useCallback, useEffect, useState } from "react";
import { Platform } from "react-native";
import { MaintenanceType } from "@/types/maintenance";
import { useLocalization } from "@/contexts/LocalizationContext";
import { usePreferences } from "@/contexts/PreferencesContext";

const NOTIFICATION_STORAGE_KEY = "@notifications_enabled";

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const [NotificationProvider, useNotifications] = createContextHook(
  () => {
    const { t } = useLocalization();
    const { notificationSettings } = usePreferences();
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);
    const [permissionGranted, setPermissionGranted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      loadSettings();
      setupNotifications();

      // Listen for received notifications (foreground)
      const receivedSubscription =
        Notifications.addNotificationReceivedListener(async (notification) => {
          // Notification received
        });

      // Listen for notification responses (user tapped notification)
      const responseSubscription =
        Notifications.addNotificationResponseReceivedListener(
          async (response) => {
            // Notification response received
          }
        );

      return () => {
        receivedSubscription.remove();
        responseSubscription.remove();
      };
    }, []);

    const setupNotifications = async () => {
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        });
      }
      checkPermissions();
    };

    const loadSettings = async () => {
      try {
        const enabled = await AsyncStorage.getItem(NOTIFICATION_STORAGE_KEY);
        if (enabled !== null) {
          setNotificationsEnabled(enabled === "true");
        }
      } catch (error) {
        console.error("Error loading notification settings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const checkPermissions = async () => {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      setPermissionGranted(existingStatus === "granted");
    };

    const requestPermissions = async (): Promise<boolean> => {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        setPermissionGranted(status === "granted");
        return status === "granted";
      }

      setPermissionGranted(true);
      return true;
    };

    const toggleNotifications = useCallback(
      async (enabled: boolean) => {
        try {
          if (enabled && !permissionGranted) {
            const granted = await requestPermissions();
            if (!granted) {
              return false;
            }
          }

          await AsyncStorage.setItem(
            NOTIFICATION_STORAGE_KEY,
            enabled.toString()
          );
          setNotificationsEnabled(enabled);
          return true;
        } catch (error) {
          console.error("Error toggling notifications:", error);
          return false;
        }
      },
      [permissionGranted]
    );

    const scheduleMaintenanceNotification = useCallback(
      async (
        taskId: string,
        taskTitle: string,
        vehicleName: string,
        daysUntil: number,
        overdueIntervals: number[] = [1, 3, 7],
        overdueFrequency: "custom" | "daily" | "weekly" | "monthly" = "custom"
      ) => {
        if (!notificationsEnabled || !permissionGranted) {
          return;
        }

        try {
          // Cancel all existing notifications for this task
          await Notifications.cancelScheduledNotificationAsync(taskId).catch(
            () => {}
          );
          await Notifications.cancelScheduledNotificationAsync(
            `${taskId}_7d`
          ).catch(() => {});
          await Notifications.cancelScheduledNotificationAsync(
            `${taskId}_3d`
          ).catch(() => {});
          await Notifications.cancelScheduledNotificationAsync(
            `${taskId}_1d`
          ).catch(() => {});
          await Notifications.cancelScheduledNotificationAsync(
            `${taskId}_today`
          ).catch(() => {});

          const now = new Date();

          if (daysUntil < 0) {
            // Notification for overdue tasks - sent at 9 AM today
            const overdueDate = new Date();
            if (now.getHours() >= notificationSettings.notificationTime) {
              overdueDate.setDate(overdueDate.getDate() + 1); // Tomorrow at scheduled time
            }
            overdueDate.setHours(
              notificationSettings.notificationTime,
              0,
              0,
              0
            );

            await Notifications.scheduleNotificationAsync({
              identifier: `${taskId}_overdue`,
              content: {
                title: t("notifications.maintenance_overdue_title"),
                body: t("notifications.maintenance_overdue_body", {
                  taskTitle,
                  vehicleName,
                  days: Math.abs(daysUntil),
                }),
                data: { taskId, vehicleName, type: "overdue" },
                sound: true,
              },
              trigger: {
                type: Notifications.SchedulableTriggerInputTypes.DATE,
                date: overdueDate,
              },
            });

            // Schedule future overdue reminders based on intervals
            // We calculate the due date based on current date and daysUntil (which is negative)
            const dueDate = new Date();
            dueDate.setDate(dueDate.getDate() + daysUntil); // Go back to due date

            let intervalsToSchedule: number[] = [];

            if (overdueFrequency === "daily") {
              // Schedule for the next 30 days
              intervalsToSchedule = Array.from({ length: 30 }, (_, i) => i + 1);
            } else if (overdueFrequency === "weekly") {
              // Schedule for the next 12 weeks
              intervalsToSchedule = Array.from(
                { length: 12 },
                (_, i) => (i + 1) * 7
              );
            } else if (overdueFrequency === "monthly") {
              // Schedule for the next 12 months (approx 30 days)
              intervalsToSchedule = Array.from(
                { length: 12 },
                (_, i) => (i + 1) * 30
              );
            } else {
              // Custom intervals
              intervalsToSchedule = overdueIntervals;
            }

            for (const interval of intervalsToSchedule) {
              const reminderDate = new Date(dueDate);
              reminderDate.setDate(reminderDate.getDate() + interval);
              reminderDate.setHours(
                notificationSettings.notificationTime,
                0,
                0,
                0
              );

              // Only schedule if it's in the future
              if (reminderDate.getTime() > now.getTime()) {
                await Notifications.scheduleNotificationAsync({
                  identifier: `${taskId}_overdue_${interval}d`,
                  content: {
                    title: t("notifications.maintenance_overdue_title"),
                    body: t("notifications.maintenance_overdue_body", {
                      taskTitle,
                      vehicleName,
                      days: interval,
                    }),
                    data: {
                      taskId,
                      vehicleName,
                      type: "overdue",
                      daysOverdue: interval,
                    },
                    sound: true,
                  },
                  trigger: {
                    type: Notifications.SchedulableTriggerInputTypes.DATE,
                    date: reminderDate,
                  },
                });
              }
            }
          } else if (daysUntil === 0) {
            // Today - notify at scheduled time if not passed yet
            const todayDate = new Date();
            todayDate.setHours(notificationSettings.notificationTime, 0, 0, 0);

            if (now.getTime() < todayDate.getTime()) {
              await Notifications.scheduleNotificationAsync({
                identifier: `${taskId}_today`,
                content: {
                  title: t("notifications.maintenance_today_title"),
                  body: t("notifications.maintenance_today_body", {
                    taskTitle,
                    vehicleName,
                  }),
                  data: { taskId, vehicleName, type: "today" },
                  sound: true,
                },
                trigger: {
                  type: Notifications.SchedulableTriggerInputTypes.DATE,
                  date: todayDate,
                },
              });
            }
          } else {
            // Schedule multiple notifications at recommended intervals

            // 7 days before (if applicable)
            if (daysUntil >= 7) {
              const sevenDayDate = new Date();
              sevenDayDate.setDate(sevenDayDate.getDate() + daysUntil - 7);
              sevenDayDate.setHours(
                notificationSettings.notificationTime,
                0,
                0,
                0
              );

              if (sevenDayDate.getTime() > now.getTime()) {
                await Notifications.scheduleNotificationAsync({
                  identifier: `${taskId}_7d`,
                  content: {
                    title: t("notifications.maintenance_reminder_title"),
                    body: t("notifications.maintenance_7days_body", {
                      taskTitle,
                      vehicleName,
                    }),
                    data: { taskId, vehicleName, type: "7days" },
                    sound: true,
                  },
                  trigger: {
                    type: Notifications.SchedulableTriggerInputTypes.DATE,
                    date: sevenDayDate,
                  },
                });
              }
            }

            // 3 days before (if applicable)
            if (daysUntil >= 3) {
              const threeDayDate = new Date();
              threeDayDate.setDate(threeDayDate.getDate() + daysUntil - 3);
              threeDayDate.setHours(
                notificationSettings.notificationTime,
                0,
                0,
                0
              );

              if (threeDayDate.getTime() > now.getTime()) {
                await Notifications.scheduleNotificationAsync({
                  identifier: `${taskId}_3d`,
                  content: {
                    title: t("notifications.maintenance_3days_title"),
                    body: t("notifications.maintenance_3days_body", {
                      taskTitle,
                      vehicleName,
                    }),
                    data: { taskId, vehicleName, type: "3days" },
                    sound: true,
                  },
                  trigger: {
                    type: Notifications.SchedulableTriggerInputTypes.DATE,
                    date: threeDayDate,
                  },
                });
              }
            }

            // 1 day before (if applicable)
            if (daysUntil >= 1) {
              const oneDayDate = new Date();
              oneDayDate.setDate(oneDayDate.getDate() + daysUntil - 1);
              oneDayDate.setHours(
                notificationSettings.notificationTime,
                0,
                0,
                0
              );

              if (oneDayDate.getTime() > now.getTime()) {
                await Notifications.scheduleNotificationAsync({
                  identifier: `${taskId}_1d`,
                  content: {
                    title: t("notifications.maintenance_tomorrow_title"),
                    body: t("notifications.maintenance_tomorrow_body", {
                      taskTitle,
                      vehicleName,
                    }),
                    data: { taskId, vehicleName, type: "1day" },
                    sound: true,
                  },
                  trigger: {
                    type: Notifications.SchedulableTriggerInputTypes.DATE,
                    date: oneDayDate,
                  },
                });
              }
            }
          }
        } catch (error) {
          console.error("Error scheduling notification:", error);
        }
      },
      [notificationsEnabled, permissionGranted]
    );

    const cancelNotification = useCallback(async (taskId: string) => {
      try {
        // Cancel all variants of this task notification
        await Notifications.cancelScheduledNotificationAsync(taskId).catch(
          () => {}
        );
        await Notifications.cancelScheduledNotificationAsync(
          `${taskId}_7d`
        ).catch(() => {});
        await Notifications.cancelScheduledNotificationAsync(
          `${taskId}_3d`
        ).catch(() => {});
        await Notifications.cancelScheduledNotificationAsync(
          `${taskId}_1d`
        ).catch(() => {});
        await Notifications.cancelScheduledNotificationAsync(
          `${taskId}_today`
        ).catch(() => {});
        await Notifications.cancelScheduledNotificationAsync(
          `${taskId}_overdue`
        ).catch(() => {});
        // Cancel dynamic overdue notifications (we try to cancel common ones)
        // In a real scenario we might need to store the IDs or iterate a known max range
        for (const i of [1, 2, 3, 4, 5, 6, 7, 10, 14, 15, 21, 30]) {
          await Notifications.cancelScheduledNotificationAsync(
            `${taskId}_overdue_${i}d`
          ).catch(() => {});
        }
      } catch (error) {
        console.error("Error canceling notification:", error);
      }
    }, []);

    const cancelAllNotifications = useCallback(async () => {
      try {
        await Notifications.cancelAllScheduledNotificationsAsync();
      } catch (error) {
        console.error("Error canceling all notifications:", error);
      }
    }, []);

    // Load notification history

    // Snooze notification (reschedule for later)
    const snoozeNotification = useCallback(
      async (
        taskId: string,
        taskTitle: string,
        vehicleName: string,
        maintenanceType: MaintenanceType,
        snoozeHours: number = 24
      ) => {
        if (!notificationsEnabled || !permissionGranted) {
          return;
        }

        try {
          // Cancel existing notification
          await cancelNotification(taskId);

          // Schedule new notification
          const snoozeDate = new Date();
          snoozeDate.setHours(snoozeDate.getHours() + snoozeHours);

          await Notifications.scheduleNotificationAsync({
            identifier: `${taskId}_snoozed`,
            content: {
              title: t("notifications.snoozed_title"),
              body: `${taskTitle} - ${vehicleName}`,
              data: { taskId, vehicleName, type: "snoozed", maintenanceType },
              sound: getSoundForType(maintenanceType),
            },
            trigger: {
              type: Notifications.SchedulableTriggerInputTypes.DATE,
              date: snoozeDate,
            },
          });
        } catch (error) {
          console.error("Error snoozing notification:", error);
        }
      },
      [notificationsEnabled, permissionGranted, cancelNotification]
    );

    // Get sound based on maintenance type
    const getSoundForType = (type: MaintenanceType): string | boolean => {
      // You can customize sounds per type here
      // For now, return true for default sound
      // In the future, you can specify custom sounds like:
      // return 'oil_change.wav' or 'inspection.wav' etc.
      return true;
    };

    return {
      notificationsEnabled,
      permissionGranted,
      isLoading,
      toggleNotifications,
      requestPermissions,
      scheduleMaintenanceNotification,
      cancelNotification,
      cancelAllNotifications,
      snoozeNotification,
    };
  }
);
