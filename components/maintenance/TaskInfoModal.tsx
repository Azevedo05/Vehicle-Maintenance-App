import React from "react";
import { View, Text, TouchableOpacity, Pressable } from "react-native";
import { BlurView } from "expo-blur";
import {
  X,
  Calendar,
  Clock,
  RotateCcw,
  AlertTriangle,
  Info,
  CalendarPlus,
} from "lucide-react-native";
import Animated, {
  FadeIn,
  FadeOut,
  ZoomIn,
  ZoomOut,
} from "react-native-reanimated";
import { useTheme } from "@/contexts/ThemeContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { usePreferences } from "@/contexts/PreferencesContext";
import { MaintenanceTask, getMaintenanceTypeLabel } from "@/types/maintenance";
import { createTaskInfoStyles } from "@/styles/task/TaskInfoModal.styles";
import { useCalendarExport } from "@/hooks/useCalendarExport";
import { useVehicles } from "@/contexts/VehicleContext";

interface TaskInfoModalProps {
  visible: boolean;
  onClose: () => void;
  task: MaintenanceTask;
  vehicle?: any; // Add vehicle info for calendar export
  isStrictlyOverdue?: boolean;
}

export const TaskInfoModal = ({
  visible,
  onClose,
  task,
  vehicle,
  isStrictlyOverdue,
}: TaskInfoModalProps) => {
  const { colors, isDark } = useTheme();
  const { t, language } = useLocalization();
  const { formatDistance } = usePreferences();
  const { tasks, updateTask, vehicles, updateVehicle } = useVehicles();
  const styles = createTaskInfoStyles(colors, isDark);
  const { exportToCalendar, removeFromCalendar, isExporting } = useCalendarExport();

  // Find the latest task or synthetic insurance task from context to ensure reactivity
  const isInsuranceTask = task.id.startsWith("insurance_");
  const actualVehicle = vehicle || vehicles.find(v => v.id === task.vehicleId);
  
  const latestTask = isInsuranceTask 
    ? task // For synthetic tasks, we use the passed task but look up insurance data
    : tasks.find(t => t.id === task.id) || task;

  const insuranceData = actualVehicle?.insurance;
  const calendarEventId = isInsuranceTask ? insuranceData?.calendarEventId : latestTask.calendarEventId;
  const nextDueDate = isInsuranceTask ? insuranceData?.endDate : latestTask.nextDueDate;

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString(language);
  };

  const formatDateTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${date.toLocaleDateString(language)} ${date.toLocaleTimeString(language, {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };

  const handleExportToCalendar = async () => {
    if (!nextDueDate) return;

    if (calendarEventId) {
      const removed = await removeFromCalendar(calendarEventId);
      if (removed) {
        if (isInsuranceTask && actualVehicle && insuranceData) {
          const updatedInsurance = { ...insuranceData };
          delete updatedInsurance.calendarEventId;
          updateVehicle(actualVehicle.id, { insurance: updatedInsurance });
        } else {
          updateTask(latestTask.id, { calendarEventId: undefined });
        }
      }
      return;
    }

    const vehicleName = actualVehicle ? `${actualVehicle.make} ${actualVehicle.model}` : "";
    const typeLabel = isInsuranceTask ? t("insurance.title") : getMaintenanceTypeLabel(latestTask.type, t);

    const exportTitle = isInsuranceTask 
      ? t("insurance.calendar_title", { provider: insuranceData?.provider || "", vehicle: vehicleName })
      : t("maintenance.calendar_title", { type: typeLabel, vehicle: vehicleName });

    const exportNotes = isInsuranceTask
      ? t("insurance.calendar_notes", {
          vehicle: vehicleName,
          policy: insuranceData?.policyNumber || t("insurance.not_defined"),
          date: new Date(nextDueDate).toLocaleDateString(language),
          contact: insuranceData?.emergencyContact 
            ? `\n${t("insurance.emergency_contact")}: ${insuranceData.emergencyContact}`
            : "",
        })
      : t("maintenance.calendar_notes", {
          vehicle: vehicleName,
          date: new Date(nextDueDate).toLocaleDateString(language),
          type: typeLabel,
          mileage: latestTask.nextDueMileage 
            ? `\n${t("maintenance.at_mileage", { mileage: formatDistance(latestTask.nextDueMileage) })}`
            : "",
        });

    const eventId = await exportToCalendar(
      exportTitle,
      new Date(nextDueDate),
      exportNotes
    );

    if (eventId) {
      if (isInsuranceTask && actualVehicle && insuranceData) {
        updateVehicle(actualVehicle.id, {
          insurance: { ...insuranceData, calendarEventId: eventId },
        });
      } else {
        updateTask(latestTask.id, { calendarEventId: eventId });
      }
    }
  };

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Animated.View
          entering={FadeIn}
          exiting={FadeOut}
          style={[
            styles.absoluteFill,
            { backgroundColor: "rgba(0,0,0,0.6)" },
          ]}
        />
      </Pressable>

      <Animated.View
        entering={ZoomIn.duration(300)}
        exiting={ZoomOut.duration(200)}
        style={styles.modalContainer}
      >
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
              {t("maintenance.task_info")}
            </Text>
          </View>
          
          {nextDueDate && (
            <TouchableOpacity 
              onPress={handleExportToCalendar} 
              style={styles.headerAction}
              disabled={isExporting}
            >
              <CalendarPlus 
                size={20} 
                color={calendarEventId ? colors.error : colors.primary} 
              />
            </TouchableOpacity>
          )}
        </View>

          <View style={styles.content}>
            <View style={styles.typeBadge}>
              <Text style={styles.typeText}>
                {getMaintenanceTypeLabel(task.type, t)}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <View
                style={[
                  styles.iconBox,
                  { backgroundColor: colors.primary + "15" },
                ]}
              >
                <Calendar size={18} color={colors.primary} />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>
                  {t("maintenance.created_on").replace("{{date}}", "")}
                </Text>
                <Text style={styles.infoValue}>
                  {formatDateTime(task.createdAt)}
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View
                style={[
                  styles.iconBox,
                  {
                    backgroundColor: task.isRecurring
                      ? colors.primary + "15"
                      : colors.border + "15",
                  },
                ]}
              >
                <RotateCcw
                  size={18}
                  color={
                    task.isRecurring ? colors.primary : colors.textSecondary
                  }
                />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.recurrenceValue}>
                  {task.isRecurring
                    ? t("maintenance.recurring_status")
                    : t("maintenance.one_time_status")}
                </Text>
              </View>
            </View>

            {isStrictlyOverdue && task.nextDueDate && (
              <View style={styles.alertBox}>
                <AlertTriangle size={18} color={colors.error} />
                <Text style={styles.alertText}>
                  {t("maintenance.overdue_since").replace(
                    "{{date}}",
                    formatDate(task.nextDueDate)
                  )}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.actions}>
            <TouchableOpacity onPress={onClose} style={styles.doneButton}>
              <Text style={styles.doneButtonText}>{t("common.close")}</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
  );
};
