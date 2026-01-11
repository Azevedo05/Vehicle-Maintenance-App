import React from "react";
import { Modal, View, Text, TouchableOpacity, Pressable } from "react-native";
import { BlurView } from "expo-blur";
import {
  X,
  Calendar,
  Clock,
  RotateCcw,
  AlertTriangle,
  Info,
} from "lucide-react-native";
import Animated, {
  FadeIn,
  FadeOut,
  ZoomIn,
  ZoomOut,
} from "react-native-reanimated";
import { useTheme } from "@/contexts/ThemeContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { MaintenanceTask, getMaintenanceTypeLabel } from "@/types/maintenance";
import { createTaskInfoStyles } from "@/styles/task/TaskInfoModal.styles";

interface TaskInfoModalProps {
  visible: boolean;
  onClose: () => void;
  task: MaintenanceTask;
  isStrictlyOverdue?: boolean;
}

export const TaskInfoModal = ({
  visible,
  onClose,
  task,
  isStrictlyOverdue,
}: TaskInfoModalProps) => {
  const { colors, isDark } = useTheme();
  const { t } = useLocalization();
  const styles = createTaskInfoStyles(colors, isDark);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const formatDateTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
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
              <Info size={20} color={colors.primary} style={styles.titleIcon} />
              <Text style={styles.title}>{t("maintenance.task_info")}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={20} color={colors.textSecondary} />
            </TouchableOpacity>
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

          <TouchableOpacity onPress={onClose} style={styles.doneButton}>
            <Text style={styles.doneButtonText}>{t("common.done")}</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};
