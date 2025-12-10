import React from "react";
import { View, Text, StyleSheet, Modal, TouchableOpacity } from "react-native";
import { Switch, Divider } from "react-native-paper";
import { X } from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { usePreferences } from "@/contexts/PreferencesContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { BlurView } from "expo-blur";

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

const styles = StyleSheet.create({
  blurContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "rgba(0, 0, 0, 0.4)", // Slight dim on top of blur
  },
  modalCard: {
    width: "100%",
    maxWidth: 340,
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
  },
  closeButton: {
    padding: 4,
  },
  description: {
    fontSize: 14,
    marginBottom: 24,
    fontFamily: "Inter_400Regular",
  },
  optionsList: {
    gap: 8,
  },
  optionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "Inter_500Medium",
  },
});
