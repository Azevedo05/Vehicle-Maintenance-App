import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, TextInput } from "react-native";
import { Calendar, Plus, X } from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { useAppAlert } from "@/contexts/AlertContext";
import { createNotificationSettingsStyles } from "./NotificationSettingsStyles";

interface DateIntervalsSectionProps {
  intervals: number[];
  onAddInterval: (interval: number) => void;
  onRemoveInterval: (interval: number) => void;
}

export const DateIntervalsSection = ({
  intervals,
  onAddInterval,
  onRemoveInterval,
}: DateIntervalsSectionProps) => {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const { showAlert } = useAppAlert();
  const styles = createNotificationSettingsStyles(colors);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newInterval, setNewInterval] = useState("");

  const handleAddInterval = () => {
    const value = parseInt(newInterval);
    if (!isNaN(value) && value > 0 && !intervals.includes(value)) {
      onAddInterval(value);
      setNewInterval("");
      setShowAddModal(false);
    } else {
      showAlert({
        title: t("common.error"),
        message: t("settings.invalid_interval"),
      });
    }
  };

  return (
    <>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Calendar size={20} color={colors.primary} />
          <Text style={styles.sectionTitle}>
            {t("settings.date_intervals")}
          </Text>
        </View>
        <Text style={styles.sectionDescription}>
          {t("settings.date_intervals_description")}
        </Text>

        <View style={styles.intervalTags}>
          {intervals.map((interval) => (
            <View key={interval} style={styles.intervalTag}>
              <Text style={styles.intervalTagText}>
                {interval} {t("settings.days_short")}
              </Text>
              <TouchableOpacity onPress={() => onRemoveInterval(interval)}>
                <X size={16} color={colors.text} />
              </TouchableOpacity>
            </View>
          ))}

          <TouchableOpacity
            style={styles.addIntervalButton}
            onPress={() => setShowAddModal(true)}
          >
            <Plus size={20} color={colors.primary} />
            <Text style={styles.addIntervalButtonText}>
              {t("settings.add_interval")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        visible={showAddModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {t("settings.add_date_interval")}
            </Text>
            <Text style={styles.modalDescription}>
              {t("settings.days_before_notify")}
            </Text>

            <TextInput
              style={styles.modalInput}
              value={newInterval}
              onChangeText={setNewInterval}
              placeholder={t("settings.example_days")}
              placeholderTextColor={colors.placeholder}
              keyboardType="numeric"
              autoFocus
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => {
                  setShowAddModal(false);
                  setNewInterval("");
                }}
              >
                <Text style={styles.modalButtonTextCancel}>
                  {t("common.cancel")}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonConfirm]}
                onPress={handleAddInterval}
              >
                <Text style={styles.modalButtonTextConfirm}>
                  {t("common.add")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};
