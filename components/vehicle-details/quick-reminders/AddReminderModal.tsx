import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ScrollView,
} from "react-native";
import { X } from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { TimePicker } from "@/components/ui/TimePicker";

interface AddReminderModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (text: string, date: Date, isRecurring: boolean) => void;
}

export const AddReminderModal = ({
  visible,
  onClose,
  onAdd,
}: AddReminderModalProps) => {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const styles = createStyles(colors);

  const [newReminderText, setNewReminderText] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [selectedTime, setSelectedTime] = useState(() => {
    // Default to 1 hour (01:00)
    const d = new Date();
    d.setHours(1);
    d.setMinutes(0);
    return d;
  });

  const handleAdd = () => {
    if (!newReminderText.trim()) return;
    onAdd(newReminderText, selectedTime, isRecurring);
    // Reset fields
    setNewReminderText("");
    setIsRecurring(false);
    const d = new Date();
    setSelectedTime(d);
  };

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

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.keyboardView}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {t("quick_reminders.title")}
              </Text>
              <TouchableOpacity
                onPress={onClose}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
              keyboardShouldPersistTaps="handled"
            >
              <TextInput
                style={styles.input}
                placeholder={t("quick_reminders.description_placeholder")}
                placeholderTextColor={colors.textSecondary}
                value={newReminderText}
                onChangeText={setNewReminderText}
                multiline={false}
              />

              {/* Type Selector */}
              <View style={styles.typeSelector}>
                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    !isRecurring && styles.typeButtonActive,
                  ]}
                  onPress={() => {
                    Keyboard.dismiss();
                    setIsRecurring(false);
                  }}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.typeText,
                      !isRecurring && styles.typeTextActive,
                    ]}
                  >
                    {t("quick_reminders.one_time")}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    isRecurring && styles.typeButtonActive,
                  ]}
                  onPress={() => {
                    Keyboard.dismiss();
                    setIsRecurring(true);
                  }}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.typeText,
                      isRecurring && styles.typeTextActive,
                    ]}
                  >
                    {t("quick_reminders.recurring")}
                  </Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.sectionLabel}>
                {isRecurring
                  ? t("quick_reminders.repeat_every")
                  : t("quick_reminders.remind_in")}
              </Text>

              {/* Time Picker */}
              <View style={{ marginBottom: 20 }}>
                <TimePicker value={selectedTime} onChange={setSelectedTime} />
              </View>

              <TouchableOpacity
                style={[
                  styles.saveButton,
                  !newReminderText.trim() && { opacity: 0.5 },
                ]}
                onPress={handleAdd}
                disabled={!newReminderText.trim()}
              >
                <Text style={styles.saveButtonText}>
                  {t("quick_reminders.create_button")}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const createStyles = (colors: any) =>
  StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      padding: 16, // Use standard padding
    },
    modalBackdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0,0,0,0.5)",
    },
    keyboardView: {
      width: "100%",
      maxHeight: "85%", // Give it slightly more room
    },
    modalContent: {
      backgroundColor: colors.background,
      borderRadius: 24,
      padding: 24,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.25,
      shadowRadius: 24,
      elevation: 10,
      width: "100%",
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 24,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.text,
    },
    input: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      color: colors.text,
      fontSize: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.border,
      width: "100%", // Ensure full width
    },
    typeSelector: {
      flexDirection: "row",
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 4,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: colors.border,
    },
    typeButton: {
      flex: 1,
      paddingVertical: 12, // Increased touch target
      alignItems: "center",
      borderRadius: 8,
    },
    typeButtonActive: {
      backgroundColor: colors.primary,
    },
    typeText: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.textSecondary,
    },
    typeTextActive: {
      color: "#FFFFFF",
    },
    sectionLabel: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.textSecondary,
      marginBottom: 12,
      marginLeft: 4,
    },
    saveButton: {
      backgroundColor: colors.primary,
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: "center",
      marginTop: 8,
    },
    saveButtonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "700",
    },
  });
