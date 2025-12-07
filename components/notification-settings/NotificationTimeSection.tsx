import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, FlatList } from "react-native";
import { Clock } from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { createNotificationSettingsStyles } from "./NotificationSettingsStyles";
import { TimePicker } from "@/components/ui/TimePicker";

interface NotificationTimeSectionProps {
  selectedTime: number;
  onTimeChange: (time: number) => void;
}

export const NotificationTimeSection = ({
  selectedTime,
  onTimeChange,
}: NotificationTimeSectionProps) => {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const styles = createNotificationSettingsStyles(colors);
  // Convert current hour (number) to Date for TimePicker
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [tempDate, setTempDate] = useState(() => {
    const d = new Date();
    d.setHours(Math.floor(selectedTime), (selectedTime % 1) * 60, 0, 0);
    return d;
  });

  const handleTimeChange = (date: Date) => {
    setTempDate(date);
    // We can update immediately or wait for save?
    // The prop onTimeChange expects a number (hour).
    // If we want to support minutes, we might need to send hour + minute/60.
    // For now, let's assume we want to support minutes if the user is using the specific picker.
    const hours = date.getHours();
    const minutes = date.getMinutes();
    onTimeChange(hours + minutes / 60);
  };

  const formatTime = (time: number) => {
    const h = Math.floor(time);
    const m = Math.round((time - h) * 60);
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
  };

  return (
    <>
      <View style={[styles.section, styles.firstSection]}>
        <View style={styles.sectionHeader}>
          <Clock size={20} color={colors.primary} />
          <Text style={styles.sectionTitle}>
            {t("settings.notification_time")}
          </Text>
        </View>
        <Text style={styles.sectionDescription}>
          {t("settings.notification_time_description")}
        </Text>

        <TouchableOpacity
          style={styles.timePickerButton}
          onPress={() => {
            // Reset temp date to current selectedTime
            const d = new Date();
            d.setHours(Math.floor(selectedTime), (selectedTime % 1) * 60, 0, 0);
            setTempDate(d);
            setShowTimePicker(true);
          }}
        >
          <Clock size={24} color={colors.primary} />
          <Text style={styles.timePickerText}>{formatTime(selectedTime)}</Text>
          <Text style={styles.timePickerHint}>
            {t("settings.tap_to_change")}
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showTimePicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowTimePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t("settings.select_time")}</Text>
            <Text style={styles.modalDescription}>
              {t("settings.select_notification_time")}
            </Text>

            {/* Reusing the TimePicker from QuickReminders */}
            <TimePicker value={tempDate} onChange={setTempDate} />

            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                marginTop: 20,
                gap: 15,
              }}
            >
              <TouchableOpacity onPress={() => setShowTimePicker(false)}>
                <Text style={{ color: colors.textSecondary, fontSize: 16 }}>
                  {t("common.cancel")}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  handleTimeChange(tempDate);
                  setShowTimePicker(false);
                }}
              >
                <Text
                  style={{
                    color: colors.primary,
                    fontSize: 16,
                    fontWeight: "bold",
                  }}
                >
                  {t("common.confirm")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};
