import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { X, Clock, Repeat } from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { Reminder } from "./types";
import { getStatusColor, getStatusText } from "./utils";

interface ReminderDetailModalProps {
  visible: boolean;
  reminder: Reminder | null;
  onClose: () => void;
  onUpdateText: (text: string) => void;
  onComplete: () => void;
}

export const ReminderDetailModal = ({
  visible,
  reminder,
  onClose,
  onUpdateText,
  onComplete,
}: ReminderDetailModalProps) => {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const styles = createStyles(colors);

  if (!reminder) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <Pressable style={styles.modalBackdrop} onPress={onClose} />

        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{t("quick_reminders.title")}</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Info Group (Settings Style) */}
            <View style={styles.menuGroup}>
              {/* Type/Time Row - Now the only metadata row */}
              <View style={[styles.menuRow, styles.menuRowLast]}>
                <View style={styles.menuLabelRow}>
                  {reminder.type === "recurring" ? (
                    <Repeat size={20} color={colors.primary} />
                  ) : (
                    <Clock
                      size={20}
                      color={getStatusColor(
                        reminder.dueAt,
                        reminder.type,
                        colors
                      )}
                    />
                  )}
                  <Text style={styles.menuLabel}>
                    {reminder.type === "recurring"
                      ? t("quick_reminders.repeat_prefix")
                      : t("quick_reminders.reminder_time_label")}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.menuValue,
                    // Color text red if overdue and not recurring
                    reminder.type !== "recurring" &&
                    reminder.dueAt <= Date.now()
                      ? { color: colors.error }
                      : {},
                  ]}
                >
                  {reminder.type === "recurring"
                    ? (() => {
                        const seconds = reminder.triggerSeconds || 0;
                        const h = Math.floor(seconds / 3600);
                        const m = Math.floor((seconds % 3600) / 60);
                        let timeStr = "";
                        if (h > 0)
                          timeStr += `${h}${t("quick_reminders.hour_suffix")}`;
                        if (m > 0)
                          timeStr += `${h > 0 ? " " : ""}${m}${t(
                            "quick_reminders.minute_suffix"
                          )}`;
                        return timeStr;
                      })()
                    : new Date(reminder.dueAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                </Text>
              </View>
            </View>

            {/* Description Section */}
            <Text style={styles.sectionLabel}>
              {t("quick_reminders.description_label")}
            </Text>
            <View style={[styles.menuGroup, { padding: 4, minHeight: 100 }]}>
              <TextInput
                style={styles.descriptionInput}
                multiline
                value={reminder.text}
                onChangeText={onUpdateText}
                placeholder={t("quick_reminders.description_placeholder")}
                placeholderTextColor={colors.textSecondary}
              />
            </View>
          </ScrollView>

          {/* Actions */}
          <View style={{ marginTop: 24, gap: 12 }}>
            <TouchableOpacity
              style={[
                styles.saveButton,
                { backgroundColor: colors.primary, marginTop: 0 },
              ]}
              onPress={onComplete}
            >
              <Text style={styles.saveButtonText}>
                {t("quick_reminders.complete_button")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const createStyles = (colors: any) =>
  StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      padding: 20,
    },
    modalBackdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContent: {
      backgroundColor: colors.background,
      borderRadius: 24,
      padding: 24,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 20,
      elevation: 10,
      maxHeight: "80%",
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.text,
    },
    sectionLabel: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.textSecondary,
      marginBottom: 8,
      marginTop: 16,
      marginLeft: 4,
    },
    descriptionInput: {
      fontSize: 16,
      color: colors.text,
      lineHeight: 24,
      textAlign: "left",
      textAlignVertical: "top",
      padding: 12,
      minHeight: 100,
    },
    saveButton: {
      backgroundColor: colors.primary,
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: "center",
      marginTop: 20,
    },
    saveButtonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "700",
    },
    // Menu Styles
    menuGroup: {
      backgroundColor: colors.card,
      borderRadius: 16,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: colors.border,
    },
    menuRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    menuRowLast: {
      borderBottomWidth: 0,
    },
    menuLabelRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    menuLabel: {
      fontSize: 16,
      color: colors.text,
      fontWeight: "500",
    },
    menuValue: {
      fontSize: 16,
      color: colors.textSecondary,
      fontWeight: "600",
    },
  });
