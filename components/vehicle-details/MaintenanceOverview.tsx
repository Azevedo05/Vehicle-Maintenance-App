import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Calendar, Plus } from "lucide-react-native";
import { router } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { useVehicles } from "@/contexts/VehicleContext";
import { usePreferences } from "@/contexts/PreferencesContext";
import { useAppAlert } from "@/contexts/AlertContext";
import { getMaintenanceTypeLabel, MaintenanceTask } from "@/types/maintenance";
import { createVehicleDetailsStyles } from "@/styles/vehicle/VehicleDetailsStyles";
import { TaskInfoModal } from "../maintenance/TaskInfoModal";

interface MaintenanceOverviewProps {
  vehicleId: string;
}

export const MaintenanceOverview = ({
  vehicleId,
}: MaintenanceOverviewProps) => {
  const { colors } = useTheme();
  const { t, language } = useLocalization();

  const { getUpcomingTasks, vehicles } = useVehicles();
  const { formatDistance } = usePreferences();
  const { showAlert } = useAppAlert();
  const styles = createVehicleDetailsStyles(colors);

  const vehicle = vehicles.find((v) => v.id === vehicleId);

  const [selectedTaskInfo, setSelectedTaskInfo] = React.useState<{
    task: MaintenanceTask;
    isStrictlyOverdue: boolean;
  } | null>(null);

  const upcomingTasks = getUpcomingTasks(vehicleId);

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{t("maintenance.upcoming")}</Text>
        <TouchableOpacity
          onPress={() => router.push(`/add-task?vehicleId=${vehicleId}`)}
          style={styles.addButton}
        >
          <Plus size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={{ marginTop: 8 }}>
        {upcomingTasks.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>
              {t("maintenance.empty_text_all_done")}
            </Text>
          </View>
        ) : (
          upcomingTasks.slice(0, 3).map((item) => {
            const isStrictlyOverdue =
              item.daysUntilDue !== undefined
                ? item.daysUntilDue <= 0
                : item.milesUntilDue !== undefined
                ? item.milesUntilDue <= 0
                : false;

            return (
              <TouchableOpacity
                key={item.task.id}
                activeOpacity={0.7}
                onPress={() => {
                  setSelectedTaskInfo({
                    task: item.task,
                    isStrictlyOverdue,
                  });
                }}
                style={[
                  styles.taskCard,
                  isStrictlyOverdue
                    ? item.task.type === "inspection"
                      ? styles.inspectionOverdueCard
                      : styles.overdueTaskCard
                    : item.isDue
                    ? styles.dueSoonTaskCard
                    : undefined,
                ]}
              >
                <View style={styles.taskInfo}>
                  <Text style={styles.taskTitle} numberOfLines={2}>
                    {getMaintenanceTypeLabel(item.task.type, t)}
                  </Text>
                  <Text
                    style={[
                      styles.taskDue,
                      isStrictlyOverdue
                        ? styles.taskOverdue
                        : item.isDue
                        ? styles.taskWarning
                        : styles.taskScheduled,
                    ]}
                  >
                    {item.daysUntilDue !== undefined
                      ? item.daysUntilDue <= 0
                        ? t("maintenance.overdue")
                        : t("maintenance.due_on_date", {
                            date: new Date(
                              item.task.nextDueDate || 0
                            ).toLocaleDateString(language),
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
                    item.task.type === "inspection"
                      ? router.push(`/add-record?vehicleId=${vehicleId}`)
                      : router.push(
                          `/add-record?vehicleId=${vehicleId}&taskId=${item.task.id}`
                        )
                  }
                  style={styles.completeButton}
                >
                  <Text style={styles.completeButtonText}>
                    {t("maintenance.complete")}
                  </Text>
                </TouchableOpacity>
              </TouchableOpacity>
            );
          })
        )}
      </View>
      {selectedTaskInfo && (
        <TaskInfoModal
          visible={!!selectedTaskInfo}
          onClose={() => setSelectedTaskInfo(null)}
          task={selectedTaskInfo.task}
          vehicle={vehicle}
          isStrictlyOverdue={selectedTaskInfo.isStrictlyOverdue}
        />
      )}
    </View>
  );
};
