import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import createContextHook from '@nkzw/create-context-hook';
import { useCallback, useEffect, useState } from 'react';
import { MaintenanceType } from '@/types/vehicle';

const NOTIFICATION_STORAGE_KEY = '@notifications_enabled';
const NOTIFICATION_HISTORY_KEY = '@notification_history';

export interface NotificationHistoryItem {
  id: string;
  taskId: string;
  taskTitle: string;
  vehicleName: string;
  type: MaintenanceType;
  sentAt: number;
  daysUntil?: number;
  kmUntil?: number;
  snoozedUntil?: number;
}

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

export const [NotificationProvider, useNotifications] = createContextHook(() => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [notificationHistory, setNotificationHistory] = useState<NotificationHistoryItem[]>([]);

  useEffect(() => {
    loadSettings();
    checkPermissions();
    loadNotificationHistory();
  }, []);

  const loadSettings = async () => {
    try {
      const enabled = await AsyncStorage.getItem(NOTIFICATION_STORAGE_KEY);
      if (enabled !== null) {
        setNotificationsEnabled(enabled === 'true');
      }
    } catch (error) {
      console.error('Error loading notification settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkPermissions = async () => {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    setPermissionGranted(existingStatus === 'granted');
  };

  const requestPermissions = async (): Promise<boolean> => {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      setPermissionGranted(status === 'granted');
      return status === 'granted';
    }
    
    setPermissionGranted(true);
    return true;
  };

  const toggleNotifications = useCallback(async (enabled: boolean) => {
    try {
      if (enabled && !permissionGranted) {
        const granted = await requestPermissions();
        if (!granted) {
          return false;
        }
      }

      await AsyncStorage.setItem(NOTIFICATION_STORAGE_KEY, enabled.toString());
      setNotificationsEnabled(enabled);
      return true;
    } catch (error) {
      console.error('Error toggling notifications:', error);
      return false;
    }
  }, [permissionGranted]);

  const scheduleMaintenanceNotification = useCallback(
    async (taskId: string, taskTitle: string, vehicleName: string, daysUntil: number) => {
      if (!notificationsEnabled || !permissionGranted) {
        return;
      }

      try {
        // Cancel all existing notifications for this task
        await Notifications.cancelScheduledNotificationAsync(taskId).catch(() => {});
        await Notifications.cancelScheduledNotificationAsync(`${taskId}_7d`).catch(() => {});
        await Notifications.cancelScheduledNotificationAsync(`${taskId}_3d`).catch(() => {});
        await Notifications.cancelScheduledNotificationAsync(`${taskId}_1d`).catch(() => {});
        await Notifications.cancelScheduledNotificationAsync(`${taskId}_today`).catch(() => {});

        const now = new Date();
        
        if (daysUntil < 0) {
          // Notification for overdue tasks - sent at 9 AM today
          const overdueDate = new Date();
          if (now.getHours() >= 9) {
            overdueDate.setDate(overdueDate.getDate() + 1); // Tomorrow at 9 AM
          }
          overdueDate.setHours(9, 0, 0, 0);

          await Notifications.scheduleNotificationAsync({
            identifier: `${taskId}_overdue`,
            content: {
              title: '⚠️ Manutenção Atrasada',
              body: `${taskTitle} para ${vehicleName} está atrasada há ${Math.abs(daysUntil)} dias!`,
              data: { taskId, vehicleName, type: 'overdue' },
              sound: true,
            },
            trigger: {
              type: Notifications.SchedulableTriggerInputTypes.DATE,
              date: overdueDate,
            },
          });
        } else if (daysUntil === 0) {
          // Today - notify at 9 AM if not passed yet
          const todayDate = new Date();
          todayDate.setHours(9, 0, 0, 0);
          
          if (now.getTime() < todayDate.getTime()) {
            await Notifications.scheduleNotificationAsync({
              identifier: `${taskId}_today`,
              content: {
                title: '🔔 Manutenção Hoje',
                body: `${taskTitle} para ${vehicleName} deve ser feita hoje!`,
                data: { taskId, vehicleName, type: 'today' },
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
            sevenDayDate.setHours(9, 0, 0, 0);
            
            if (sevenDayDate.getTime() > now.getTime()) {
              await Notifications.scheduleNotificationAsync({
                identifier: `${taskId}_7d`,
                content: {
                  title: '📅 Lembrete de Manutenção',
                  body: `${taskTitle} para ${vehicleName} em 7 dias`,
                  data: { taskId, vehicleName, type: '7days' },
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
            threeDayDate.setHours(9, 0, 0, 0);
            
            if (threeDayDate.getTime() > now.getTime()) {
              await Notifications.scheduleNotificationAsync({
                identifier: `${taskId}_3d`,
                content: {
                  title: '⚠️ Manutenção Próxima',
                  body: `${taskTitle} para ${vehicleName} em 3 dias`,
                  data: { taskId, vehicleName, type: '3days' },
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
            oneDayDate.setHours(9, 0, 0, 0);
            
            if (oneDayDate.getTime() > now.getTime()) {
              await Notifications.scheduleNotificationAsync({
                identifier: `${taskId}_1d`,
                content: {
                  title: '🔔 Manutenção Amanhã',
                  body: `Não se esqueça: ${taskTitle} para ${vehicleName} é amanhã!`,
                  data: { taskId, vehicleName, type: '1day' },
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
        console.error('Error scheduling notification:', error);
      }
    },
    [notificationsEnabled, permissionGranted]
  );

  const scheduleMileageNotification = useCallback(
    async (taskId: string, taskTitle: string, vehicleName: string, kmRemaining: number) => {
      if (!notificationsEnabled || !permissionGranted) {
        return;
      }

      try {
        // Cancel all existing mileage notifications for this task
        await Notifications.cancelScheduledNotificationAsync(`${taskId}_km_overdue`).catch(() => {});
        await Notifications.cancelScheduledNotificationAsync(`${taskId}_km_200`).catch(() => {});
        await Notifications.cancelScheduledNotificationAsync(`${taskId}_km_500`).catch(() => {});
        await Notifications.cancelScheduledNotificationAsync(`${taskId}_km_1000`).catch(() => {});

        const now = new Date();
        const notificationTime = new Date();
        
        // Set notification time to 9 AM
        notificationTime.setHours(9, 0, 0, 0);
        if (now.getTime() >= notificationTime.getTime()) {
          // If it's already past 9 AM today, schedule for tomorrow
          notificationTime.setDate(notificationTime.getDate() + 1);
        }

        if (kmRemaining < 0) {
          // Overdue notification
          await Notifications.scheduleNotificationAsync({
            identifier: `${taskId}_km_overdue`,
            content: {
              title: '⚠️ Manutenção Atrasada',
              body: `${taskTitle} para ${vehicleName} ultrapassou ${Math.abs(kmRemaining)} km!`,
              data: { taskId, vehicleName, type: 'overdue' },
              sound: true,
            },
            trigger: {
              type: Notifications.SchedulableTriggerInputTypes.DATE,
              date: notificationTime,
            },
          });
        } else if (kmRemaining <= 200) {
          // Critical - within 200 km
          await Notifications.scheduleNotificationAsync({
            identifier: `${taskId}_km_200`,
            content: {
              title: '🚨 Manutenção Urgente',
              body: `${taskTitle} para ${vehicleName} em apenas ${kmRemaining} km!`,
              data: { taskId, vehicleName, type: '200km' },
              sound: true,
            },
            trigger: {
              type: Notifications.SchedulableTriggerInputTypes.DATE,
              date: notificationTime,
            },
          });
        } else if (kmRemaining <= 500) {
          // Warning - within 500 km
          await Notifications.scheduleNotificationAsync({
            identifier: `${taskId}_km_500`,
            content: {
              title: '⚠️ Manutenção Próxima',
              body: `${taskTitle} para ${vehicleName} em ${kmRemaining} km`,
              data: { taskId, vehicleName, type: '500km' },
              sound: true,
            },
            trigger: {
              type: Notifications.SchedulableTriggerInputTypes.DATE,
              date: notificationTime,
            },
          });
        } else if (kmRemaining <= 1000) {
          // Early reminder - within 1000 km
          await Notifications.scheduleNotificationAsync({
            identifier: `${taskId}_km_1000`,
            content: {
              title: '📅 Lembrete de Manutenção',
              body: `${taskTitle} para ${vehicleName} em ${kmRemaining} km`,
              data: { taskId, vehicleName, type: '1000km' },
              sound: true,
            },
            trigger: {
              type: Notifications.SchedulableTriggerInputTypes.DATE,
              date: notificationTime,
            },
          });
        }
      } catch (error) {
        console.error('Error scheduling mileage notification:', error);
      }
    },
    [notificationsEnabled, permissionGranted]
  );

  const cancelNotification = useCallback(async (taskId: string) => {
    try {
      // Cancel all variants of this task notification
      await Notifications.cancelScheduledNotificationAsync(taskId).catch(() => {});
      await Notifications.cancelScheduledNotificationAsync(`${taskId}_7d`).catch(() => {});
      await Notifications.cancelScheduledNotificationAsync(`${taskId}_3d`).catch(() => {});
      await Notifications.cancelScheduledNotificationAsync(`${taskId}_1d`).catch(() => {});
      await Notifications.cancelScheduledNotificationAsync(`${taskId}_today`).catch(() => {});
      await Notifications.cancelScheduledNotificationAsync(`${taskId}_overdue`).catch(() => {});
      await Notifications.cancelScheduledNotificationAsync(`${taskId}_km_overdue`).catch(() => {});
      await Notifications.cancelScheduledNotificationAsync(`${taskId}_km_200`).catch(() => {});
      await Notifications.cancelScheduledNotificationAsync(`${taskId}_km_500`).catch(() => {});
      await Notifications.cancelScheduledNotificationAsync(`${taskId}_km_1000`).catch(() => {});
    } catch (error) {
      console.error('Error canceling notification:', error);
    }
  }, []);

  const cancelAllNotifications = useCallback(async () => {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error canceling all notifications:', error);
    }
  }, []);

  // Load notification history
  const loadNotificationHistory = async () => {
    try {
      const stored = await AsyncStorage.getItem(NOTIFICATION_HISTORY_KEY);
      if (stored) {
        const history = JSON.parse(stored);
        setNotificationHistory(history);
      }
    } catch (error) {
      console.error('Error loading notification history:', error);
    }
  };

  // Add to notification history
  const addToHistory = useCallback(async (item: Omit<NotificationHistoryItem, 'id' | 'sentAt'>) => {
    try {
      const newItem: NotificationHistoryItem = {
        ...item,
        id: Date.now().toString(),
        sentAt: Date.now(),
      };
      
      const updatedHistory = [newItem, ...notificationHistory].slice(0, 100); // Keep last 100
      await AsyncStorage.setItem(NOTIFICATION_HISTORY_KEY, JSON.stringify(updatedHistory));
      setNotificationHistory(updatedHistory);
    } catch (error) {
      console.error('Error adding to notification history:', error);
    }
  }, [notificationHistory]);

  // Clear notification history
  const clearHistory = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(NOTIFICATION_HISTORY_KEY);
      setNotificationHistory([]);
    } catch (error) {
      console.error('Error clearing notification history:', error);
    }
  }, []);

  // Snooze notification (reschedule for later)
  const snoozeNotification = useCallback(async (
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
          title: '🔔 Lembrete Adiado',
          body: `${taskTitle} para ${vehicleName}`,
          data: { taskId, vehicleName, type: 'snoozed', maintenanceType },
          sound: getSoundForType(maintenanceType),
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: snoozeDate,
        },
      });

      // Add to history
      await addToHistory({
        taskId,
        taskTitle,
        vehicleName,
        type: maintenanceType,
        snoozedUntil: snoozeDate.getTime(),
      });
    } catch (error) {
      console.error('Error snoozing notification:', error);
    }
  }, [notificationsEnabled, permissionGranted, cancelNotification, addToHistory]);

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
    notificationHistory,
    toggleNotifications,
    requestPermissions,
    scheduleMaintenanceNotification,
    scheduleMileageNotification,
    cancelNotification,
    cancelAllNotifications,
    snoozeNotification,
    clearHistory,
    addToHistory,
  };
});

