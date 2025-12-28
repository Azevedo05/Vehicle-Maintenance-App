import React from "react";
import { View, Text, StyleSheet, Modal, TouchableOpacity } from "react-native";
import { Switch, Divider } from "react-native-paper";
import { X } from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { usePreferences } from "@/contexts/PreferencesContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { BlurView } from "expo-blur";
import { createVehicleViewSettingsModalStyles } from "@/styles/vehicle/VehicleViewSettingsModal.styles";

interface VehicleViewSettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

export const VehicleViewSettingsModal = ({
  visible,
  onClose,
}: VehicleViewSettingsModalProps) => {
  const { colors } = useTheme();
  const { vehicleLayout, setVehicleLayout } = usePreferences();
  const { t } = useLocalization();
  const styles = createVehicleViewSettingsModalStyles(colors);

  const toggleOption = (key: keyof typeof vehicleLayout) => {
    setVehicleLayout({
      ...vehicleLayout,
      [key]: !vehicleLayout[key],
    });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <BlurView
        intensity={20}
        tint="dark"
        style={[StyleSheet.absoluteFill, styles.blurContainer]}
      >
        <View style={styles.overlay}>
          <View style={[styles.modalCard, { backgroundColor: colors.card }]}>
            <View style={styles.header}>
              <Text style={[styles.title, { color: colors.text }]}>
                {t("vehicle_details.customize_view")}
              </Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <X size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.description, { color: colors.textSecondary }]}>
              {t("vehicle_details.customize_view_description")}
            </Text>

            <View style={styles.optionsList}>
              <View style={styles.optionRow}>
                <Text style={[styles.optionLabel, { color: colors.text }]}>
                  {t("vehicle_details.show_quick_reminders")}
                </Text>
                <Switch
                  value={vehicleLayout.showQuickReminders}
                  onValueChange={() => toggleOption("showQuickReminders")}
                  color={colors.primary}
                />
              </View>
              <Divider />

              <View style={styles.optionRow}>
                <Text style={[styles.optionLabel, { color: colors.text }]}>
                  {t("vehicle_details.show_maintenance_overview")}
                </Text>
                <Switch
                  value={vehicleLayout.showMaintenanceOverview}
                  onValueChange={() => toggleOption("showMaintenanceOverview")}
                  color={colors.primary}
                />
              </View>
              <Divider />

              <View style={styles.optionRow}>
                <Text style={[styles.optionLabel, { color: colors.text }]}>
                  {t("vehicle_details.show_maintenance_history")}
                </Text>
                <Switch
                  value={vehicleLayout.showMaintenanceHistory}
                  onValueChange={() => toggleOption("showMaintenanceHistory")}
                  color={colors.primary}
                />
              </View>
              <Divider />

              <View style={styles.optionRow}>
                <Text style={[styles.optionLabel, { color: colors.text }]}>
                  {t("vehicle_details.show_fuel_logs")}
                </Text>
                <Switch
                  value={vehicleLayout.showFuelLogs}
                  onValueChange={() => toggleOption("showFuelLogs")}
                  color={colors.primary}
                />
              </View>
            </View>
          </View>
        </View>
      </BlurView>
    </Modal>
  );
};
