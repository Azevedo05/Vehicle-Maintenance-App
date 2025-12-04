import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, TextInput } from "react-native";
import {
  Calendar,
  CalendarDays,
  CalendarRange,
  Plus,
  Repeat,
  X,
} from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { useAppAlert } from "@/contexts/AlertContext";
import { createNotificationSettingsStyles } from "./NotificationSettingsStyles";

interface OverdueIntervalsSectionProps {
  frequency: "custom" | "daily" | "weekly" | "monthly";
  intervals: number[];
  onFrequencyChange: (
    frequency: "custom" | "daily" | "weekly" | "monthly"
  ) => void;
  onAddInterval: (interval: number) => void;
  onRemoveInterval: (interval: number) => void;
}

export const OverdueIntervalsSection = ({
  frequency,
  intervals,
  onFrequencyChange,
  onAddInterval,
  onRemoveInterval,
}: OverdueIntervalsSectionProps) => {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const { showAlert } = useAppAlert();
  const styles = createNotificationSettingsStyles(colors);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newInterval, setNewInterval] = useState("");

  const handleAddInterval = () => {
    const value = parseInt(newInterval.trim());
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
          <Calendar size={20} color={colors.error} />
          <Text style={styles.sectionTitle}>
            {t("settings.overdue_intervals")}
          </Text>
        </View>
        <Text style={styles.sectionDescription}>
          {t("settings.overdue_intervals_description")}
        </Text>

        {/* Frequency Selector */}
        <View style={styles.frequencyGrid}>
          <TouchableOpacity
            style={[
              styles.frequencyCard,
              frequency === "custom" && styles.frequencyCardActive,
            ]}
            onPress={() => onFrequencyChange("custom")}
          >
            <Calendar
              size={24}
              color={frequency === "custom" ? colors.primary : colors.text}
            />
            <Text
              style={[
                styles.frequencyCardTitle,
                frequency === "custom" && styles.frequencyCardTitleActive,
              ]}
            >
              {t("settings.frequency_custom")}
            </Text>
            <Text
              style={[
                styles.frequencyCardDescription,
                frequency === "custom" && styles.frequencyCardDescriptionActive,
              ]}
            >
              {t("settings.frequency_custom_desc")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.frequencyCard,
              frequency === "daily" && styles.frequencyCardActive,
            ]}
            onPress={() => onFrequencyChange("daily")}
          >
            <Repeat
              size={24}
              color={frequency === "daily" ? colors.primary : colors.text}
            />
            <Text
              style={[
                styles.frequencyCardTitle,
                frequency === "daily" && styles.frequencyCardTitleActive,
              ]}
            >
              {t("settings.frequency_daily")}
            </Text>
            <Text
              style={[
                styles.frequencyCardDescription,
                frequency === "daily" && styles.frequencyCardDescriptionActive,
              ]}
            >
              {t("settings.frequency_daily_desc")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.frequencyCard,
              frequency === "weekly" && styles.frequencyCardActive,
            ]}
            onPress={() => onFrequencyChange("weekly")}
          >
            <CalendarDays
              size={24}
              color={frequency === "weekly" ? colors.primary : colors.text}
            />
            <Text
              style={[
                styles.frequencyCardTitle,
                frequency === "weekly" && styles.frequencyCardTitleActive,
              ]}
            >
              {t("settings.frequency_weekly")}
            </Text>
            <Text
              style={[
                styles.frequencyCardDescription,
                frequency === "weekly" && styles.frequencyCardDescriptionActive,
              ]}
            >
              {t("settings.frequency_weekly_desc")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.frequencyCard,
              frequency === "monthly" && styles.frequencyCardActive,
            ]}
            onPress={() => onFrequencyChange("monthly")}
          >
            <CalendarRange
              size={24}
              color={frequency === "monthly" ? colors.primary : colors.text}
            />
            <Text
              style={[
                styles.frequencyCardTitle,
                frequency === "monthly" && styles.frequencyCardTitleActive,
              ]}
            >
              {t("settings.frequency_monthly")}
            </Text>
            <Text
              style={[
                styles.frequencyCardDescription,
                frequency === "monthly" &&
                  styles.frequencyCardDescriptionActive,
              ]}
            >
              {t("settings.frequency_monthly_desc")}
            </Text>
          </TouchableOpacity>
        </View>

        {frequency === "custom" && (
          <View style={styles.intervalTags}>
            {intervals.map((interval) => (
              <View
                key={interval}
                style={[
                  styles.intervalTag,
                  { backgroundColor: colors.error + "20" },
                ]}
              >
                <Text style={[styles.intervalTagText, { color: colors.error }]}>
                  {interval} {t("settings.days_short")}
                </Text>
                <TouchableOpacity onPress={() => onRemoveInterval(interval)}>
                  <X size={16} color={colors.text} />
                </TouchableOpacity>
              </View>
            ))}

            <TouchableOpacity
              style={[styles.addIntervalButton, { borderColor: colors.error }]}
              onPress={() => setShowAddModal(true)}
            >
              <Plus size={20} color={colors.error} />
              <Text
                style={[styles.addIntervalButtonText, { color: colors.error }]}
              >
                {t("settings.add_interval")}
              </Text>
            </TouchableOpacity>
          </View>
        )}
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
              {t("settings.add_overdue_interval")}
            </Text>
            <Text style={styles.modalDescription}>
              {t("settings.days_after_notify")}
            </Text>

            <TextInput
              style={styles.modalInput}
              value={newInterval}
              onChangeText={setNewInterval}
              placeholder={t("settings.example_days")}
              placeholderTextColor={colors.placeholder}
              keyboardType="numeric"
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
                style={[
                  styles.modalButton,
                  styles.modalButtonConfirm,
                  { backgroundColor: colors.error },
                ]}
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
