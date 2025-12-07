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
  const { tasks, vehicles, isLoading: isVehiclesLoading } = useVehicles();

  useEffect(() => {
    if (!notificationsEnabled || isVehiclesLoading) {
      return;
    }

    // Defer execution to avoid blocking startup/navigation
    const timer = setTimeout(() => {
      const scheduleNotificationsForTasks = async () => {
        try {
          const promises = tasks.map(async (task) => {
            if (task.isCompleted) {
              return;
            }

            const vehicle = vehicles.find((v) => v.id === task.vehicleId);
            if (!vehicle) {
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
                notificationSettings.overdueIntervals,
                notificationSettings.overdueFrequency
              );
            }
          });

          await Promise.all(promises);
        } catch (error) {
          console.error("Error scheduling notifications:", error);
        }
      };

      scheduleNotificationsForTasks();
    }, 2000); // 2 second delay to let app settle

    return () => clearTimeout(timer);
  }, [
    tasks,
    vehicles,
    notificationsEnabled,
    isVehiclesLoading,
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
