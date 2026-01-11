import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { X, Clock, Repeat, Bell } from "lucide-react-native";
import Animated, {
  FadeIn,
  FadeOut,
  ZoomIn,
  ZoomOut,
} from "react-native-reanimated";
import { useTheme } from "@/contexts/ThemeContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { Reminder } from "./types";
import { getStatusColor } from "./utils";
import { createReminderDetailStyles } from "@/styles/vehicle/ReminderDetailModal.styles";

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
  const { colors, isDark } = useTheme();
  const { t } = useLocalization();
  const styles = createReminderDetailStyles(colors, isDark);

  const [currentText, setCurrentText] = useState("");
  const [isModified, setIsModified] = useState(false);

  useEffect(() => {
    if (reminder && visible) {
      setCurrentText(reminder.text);
      setIsModified(false);
    }
  }, [reminder, visible]);

  if (!reminder) return null;

  const handleTextChange = (text: string) => {
    setCurrentText(text);
    setIsModified(text !== reminder.text);
  };

  const handleAction = () => {
    if (isModified) {
      onUpdateText(currentText);
      onClose();
    } else {
      onComplete();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
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
              <Bell size={20} color={colors.primary} style={styles.titleIcon} />
              <Text style={styles.title}>{t("quick_reminders.title")}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.content}
          >
            <View style={styles.menuGroup}>
              <View style={styles.menuRow}>
                <View style={styles.menuLabelRow}>
                  {reminder.type === "recurring" ? (
                    <Repeat size={18} color={colors.primary} />
                  ) : (
                    <Clock
                      size={18}
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

              <View style={[styles.menuRow, styles.menuRowLast]}>
                <View style={styles.timestampContainer}>
                  <Text style={styles.timestampText}>
                    {t("common.created_at")}:{" "}
                    {new Date(reminder.createdAt).toLocaleDateString()}{" "}
                    {new Date(reminder.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                  {reminder.type !== "recurring" &&
                    reminder.dueAt <= Date.now() && (
                      <Text
                        style={[styles.timestampText, { color: colors.error }]}
                      >
                        {t("common.overdue_since")}:{" "}
                        {new Date(reminder.dueAt).toLocaleDateString()}{" "}
                        {new Date(reminder.dueAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Text>
                    )}
                </View>
              </View>
            </View>

            <View>
              <Text style={styles.sectionLabel}>
                {t("quick_reminders.description_label")}
              </Text>
              <View style={styles.descriptionInputContainer}>
                <TextInput
                  style={styles.descriptionInput}
                  multiline
                  value={currentText}
                  onChangeText={handleTextChange}
                  placeholder={t("quick_reminders.description_placeholder")}
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
            </View>
          </ScrollView>

          <TouchableOpacity style={styles.actionButton} onPress={handleAction}>
            <Text style={styles.actionButtonText}>
              {isModified
                ? t("quick_reminders.update_button")
                : t("quick_reminders.complete_button")}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};
