import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, FlatList } from "react-native";
import { Clock } from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { createNotificationSettingsStyles } from "./NotificationSettingsStyles";

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
  const [showTimePicker, setShowTimePicker] = useState(false);

  const formatTime = (hour: number) => {
    return `${hour.toString().padStart(2, "0")}:00`;
  };

  const hours = Array.from({ length: 24 }, (_, i) => i);

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
          onPress={() => setShowTimePicker(true)}
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

            <FlatList
              data={hours}
              keyExtractor={(item) => item.toString()}
              style={styles.timeList}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.timeListItem,
                    selectedTime === item && styles.timeListItemActive,
                  ]}
                  onPress={() => {
                    onTimeChange(item);
                    setShowTimePicker(false);
                  }}
                >
                  <Text
                    style={[
                      styles.timeListItemText,
                      selectedTime === item && styles.timeListItemTextActive,
                    ]}
                  >
                    {formatTime(item)}
                  </Text>
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity
              style={styles.timePickerCancelButton}
              onPress={() => setShowTimePicker(false)}
            >
              <Text style={styles.timePickerCancelButtonText}>
                {t("common.cancel")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};
