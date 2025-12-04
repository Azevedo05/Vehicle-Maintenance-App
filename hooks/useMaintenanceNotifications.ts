import { useEffect } from "react";
import { useNotifications } from "@/contexts/NotificationContext";
import { useVehicles } from "@/contexts/VehicleContext";
import { usePreferences } from "@/contexts/PreferencesContext";
import { Vehicle } from "@/types/vehicle";
import { MaintenanceTask } from "@/types/maintenance";

/**
 * Hook that automatically manages notifications for maintenance tasks
 */
export function useMaintenanceNotifications() {
  const { scheduleMaintenanceNotification, notificationsEnabled } =
    useNotifications();
  const { notificationSettings } = usePreferences();
  const { tasks, vehicles } = useVehicles();

  useEffect(() => {
    if (!notificationsEnabled) {
      return;
    }

    const scheduleNotificationsForTasks = async () => {
      for (const task of tasks) {
        if (task.isCompleted) {
          continue;
        }

        const vehicle = vehicles.find((v) => v.id === task.vehicleId);
        if (!vehicle) {
          continue;
        }

        const vehicleName = `${vehicle.make} ${vehicle.model}`;

        if (task.intervalType === "date" && task.nextDueDate) {
          const daysUntil = Math.ceil(
            (new Date(task.nextDueDate).getTime() - Date.now()) /
              (1000 * 60 * 60 * 24)
          );
          await scheduleMaintenanceNotification(
            task.id,
            task.title,
            vehicleName,
            daysUntil,
            notificationSettings.overdueIntervals,
            notificationSettings.overdueFrequency
          );
        }
      }
    };

    scheduleNotificationsForTasks();
  }, [
    tasks,
    vehicles,
    notificationsEnabled,
    scheduleMaintenanceNotification,
    notificationSettings,
  ]);
}

/**
 * Utility function to schedule a notification for a specific task
 */
export async function scheduleTaskNotification(
  task: MaintenanceTask,
  vehicle: Vehicle,
  scheduleMaintenanceNotification: (
    taskId: string,
    taskTitle: string,
    vehicleName: string,
    daysUntil: number,
    overdueIntervals: number[],
    overdueFrequency: "custom" | "daily" | "weekly" | "monthly"
  ) => Promise<void>,
  overdueIntervals: number[],
  overdueFrequency: "custom" | "daily" | "weekly" | "monthly"
) {
  if (task.isCompleted) {
    return;
  }

  const vehicleName = `${vehicle.make} ${vehicle.model}`;

  if (task.intervalType === "date" && task.nextDueDate) {
    const daysUntil = Math.ceil(
      (new Date(task.nextDueDate).getTime() - Date.now()) /
        (1000 * 60 * 60 * 24)
    );
    await scheduleMaintenanceNotification(
      task.id,
      task.title,
      vehicleName,
      daysUntil,
      overdueIntervals,
      overdueFrequency
    );
  }
}
