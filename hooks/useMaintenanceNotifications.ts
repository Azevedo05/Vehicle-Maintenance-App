import { useEffect } from 'react';
import { useNotifications } from '@/contexts/NotificationContext';
import { useVehicles } from '@/contexts/VehicleContext';
import { MaintenanceTask, Vehicle } from '@/types/vehicle';

/**
 * Hook that automatically manages notifications for maintenance tasks
 */
export function useMaintenanceNotifications() {
  const { scheduleMaintenanceNotification, scheduleMileageNotification, notificationsEnabled } = useNotifications();
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

        if (task.intervalType === 'date' && task.nextDueDate) {
          const daysUntil = Math.ceil(
            (new Date(task.nextDueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
          );
          await scheduleMaintenanceNotification(
            task.id,
            task.title,
            vehicleName,
            daysUntil
          );
        } else if (task.intervalType === 'mileage' && task.nextDueMileage && vehicle.currentMileage) {
          const kmRemaining = task.nextDueMileage - vehicle.currentMileage;
          await scheduleMileageNotification(
            task.id,
            task.title,
            vehicleName,
            kmRemaining
          );
        }
      }
    };

    scheduleNotificationsForTasks();
  }, [tasks, vehicles, notificationsEnabled, scheduleMaintenanceNotification, scheduleMileageNotification]);
}

/**
 * Utility function to schedule a notification for a specific task
 */
export async function scheduleTaskNotification(
  task: MaintenanceTask,
  vehicle: Vehicle,
  scheduleMaintenanceNotification: (taskId: string, taskTitle: string, vehicleName: string, daysUntil: number) => Promise<void>,
  scheduleMileageNotification: (taskId: string, taskTitle: string, vehicleName: string, kmRemaining: number) => Promise<void>
) {
  if (task.isCompleted) {
    return;
  }

  const vehicleName = `${vehicle.make} ${vehicle.model}`;

  if (task.intervalType === 'date' && task.nextDueDate) {
    const daysUntil = Math.ceil(
      (new Date(task.nextDueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    await scheduleMaintenanceNotification(task.id, task.title, vehicleName, daysUntil);
  } else if (task.intervalType === 'mileage' && task.nextDueMileage && vehicle.currentMileage) {
    const kmRemaining = task.nextDueMileage - vehicle.currentMileage;
    await scheduleMileageNotification(task.id, task.title, vehicleName, kmRemaining);
  }
}

