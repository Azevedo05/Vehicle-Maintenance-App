import { useEffect } from "react";
import { useNotifications } from "@/contexts/NotificationContext";
import { useVehicles } from "@/contexts/VehicleContext";
import { useLocalization } from "@/contexts/LocalizationContext";

/**
 * Hook that automatically manages notifications for vehicle insurance
 */
export function useInsuranceNotifications() {
    const { scheduleInsuranceNotification, cancelNotification, notificationsEnabled } =
        useNotifications();
    const { vehicles, isLoading: isVehiclesLoading } = useVehicles();
    const { language } = useLocalization();

    useEffect(() => {
        if (!notificationsEnabled || isVehiclesLoading) {
            return;
        }

        // Defer execution to avoid blocking startup/navigation
        const timer = setTimeout(() => {
            const scheduleNotificationsForInsurance = async () => {
                try {
                    const promises = vehicles.map(async (vehicle) => {
                        const insurance = vehicle.insurance;

                        if (!insurance) {
                            // We could potentially try to cancel it using a derived ID,
                            // but we don't store previous insurance IDs locally when deleted directly from useVehicles.
                            // A direct cancelation in the `delete` handler is safer.
                            return;
                        }

                        const vehicleName = `${vehicle.make} ${vehicle.model}`;

                        if (insurance.endDate) {
                            const daysUntil = Math.ceil(
                                (new Date(insurance.endDate).getTime() - Date.now()) /
                                (1000 * 60 * 60 * 24)
                            );
                            await scheduleInsuranceNotification(
                                insurance.id,
                                insurance.provider,
                                vehicleName,
                                daysUntil
                            );
                        }
                    });

                    await Promise.all(promises);
                } catch (error) {
                    console.error("Error scheduling insurance notifications:", error);
                }
            };

            scheduleNotificationsForInsurance();
        }, 2500); // 2.5 second delay to let app settle, slightly staggered from maintenance

        return () => clearTimeout(timer);
    }, [
        vehicles,
        notificationsEnabled,
        isVehiclesLoading,
        scheduleInsuranceNotification,
        language,
    ]);
}
