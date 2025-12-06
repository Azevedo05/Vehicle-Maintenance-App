import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Calendar, Plus } from "lucide-react-native";
import { router } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { useVehicles } from "@/contexts/VehicleContext";
import { usePreferences } from "@/contexts/PreferencesContext";
import { getMaintenanceTypeLabel } from "@/types/maintenance";
import { createVehicleDetailsStyles } from "./VehicleDetailsStyles";

interface MaintenanceOverviewProps {
  vehicleId: string;
}

export const MaintenanceOverview = ({
  vehicleId,
}: MaintenanceOverviewProps) => {
  const { colors } = useTheme();
  const { t } = useLocalization();

  const { getUpcomingTasks } = useVehicles();
  const { formatDistance } = usePreferences();
  const styles = createVehicleDetailsStyles(colors);

  const upcomingTasks = getUpcomingTasks(vehicleId);

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{t("maintenance.upcoming")}</Text>
        <TouchableOpacity
          onPress={() => router.push(`/add-task?vehicleId=${vehicleId}`)}
          style={styles.addButton}
        >
          <Plus size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {upcomingTasks.length === 0 ? (
        <View style={styles.emptyCard}>
          <Calendar size={32} color={colors.placeholder} />
          <Text style={styles.emptyText}>
            {t("maintenance.empty_title_all_done")}
          </Text>
        </View>
      ) : (
        upcomingTasks.map((item) => {
          return (
            <View
              key={item.task.id}
              style={[
                styles.taskCard,
                item.isDue &&
                  (item.task.type === "inspection"
                    ? styles.inspectionOverdueCard
                    : styles.dueTaskCard),
              ]}
            >
              <View style={styles.taskInfo}>
                <Text style={styles.taskTitle} numberOfLines={2}>
                  {getMaintenanceTypeLabel(item.task.type, t)}
                </Text>
                <Text
                  style={[
                    styles.taskDue,
                    item.isDue ? styles.taskOverdue : styles.taskScheduled,
                  ]}
                >
                  {item.daysUntilDue !== undefined
                    ? item.daysUntilDue <= 0
                      ? t("maintenance.overdue")
                      : t("maintenance.due_on_date", {
                          date: new Date(
                            item.task.nextDueDate || 0
                          ).toLocaleDateString(),
                        })
                    : item.milesUntilDue !== undefined
                    ? item.milesUntilDue <= 0
                      ? t("maintenance.overdue")
                      : t("maintenance.due_at_km", {
                          km: formatDistance(item.task.nextDueMileage || 0),
                        })
                    : t("maintenance.scheduled")}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() =>
                  router.push(
                    `/add-record?vehicleId=${vehicleId}&taskId=${item.task.id}`
                  )
                }
                style={styles.completeButton}
              >
                <Text style={styles.completeButtonText}>
                  {t("maintenance.complete")}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })
      )}
    </View>
  );
};
