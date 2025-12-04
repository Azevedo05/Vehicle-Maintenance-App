import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Wrench, Fuel, BarChart3, Edit, Trash2 } from "lucide-react-native";
import { router } from "expo-router";

import { BottomSheet } from "@/components/BottomSheet";
import { useTheme } from "@/contexts/ThemeContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { createStyles } from "@/components/styles/index.styles";

import { useVehicles } from "@/contexts/VehicleContext";
import { useAppAlert } from "@/contexts/AlertContext";

interface VehicleQuickActionsProps {
  visible: boolean;
  onClose: () => void;
  vehicleId: string | null;
}

export const VehicleQuickActions = ({
  visible,
  onClose,
  vehicleId,
}: VehicleQuickActionsProps) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { t } = useLocalization();
  const { deleteVehicle, restoreLastSnapshot, getVehicleById } = useVehicles();
  const { showAlert, showToast } = useAppAlert();

  const vehicle = vehicleId ? getVehicleById(vehicleId) : null;

  const handleDelete = () => {
    if (!vehicle) return;

    onClose(); // Close modal first

    showAlert({
      title: t("vehicles.delete"),
      message: t("vehicles.delete_text", {
        name: `${vehicle.make} ${vehicle.model}`,
      }),
      buttons: [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("common.delete"),
          style: "destructive",
          onPress: async () => {
            const vehicleName = `${vehicle.make} ${vehicle.model}`;
            await deleteVehicle(vehicle.id);
            showToast({
              message: t("vehicles.delete_success", { name: vehicleName }),
              actionLabel: t("common.undo"),
              onAction: async () => {
                await restoreLastSnapshot();
              },
            });
          },
        },
      ],
    });
  };

  if (!vehicleId) return null;

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View style={styles.modalHeaderRow}>
        <Text style={styles.modalTitle}>{t("vehicles.quick_actions")}</Text>
      </View>

      <View style={styles.actionsList}>
        <TouchableOpacity
          style={styles.actionItem}
          onPress={() => {
            router.push({
              pathname: "/add-record",
              params: { vehicleId: vehicleId },
            });
            onClose();
          }}
        >
          <View style={styles.actionIcon}>
            <Wrench size={24} color={colors.primary} />
          </View>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>
              {t("vehicles.quick_add_maintenance")}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionItem}
          onPress={() => {
            router.push({
              pathname: "/add-fuel-log",
              params: { vehicleId: vehicleId },
            });
            onClose();
          }}
        >
          <View style={styles.actionIcon}>
            <Fuel size={24} color={colors.primary} />
          </View>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>
              {t("vehicles.quick_add_fuel")}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionItem}
          onPress={() => {
            router.push(`/vehicle/${vehicleId}`);
            onClose();
          }}
        >
          <View style={styles.actionIcon}>
            <BarChart3 size={24} color={colors.primary} />
          </View>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>
              {t("vehicles.quick_view_stats")}
            </Text>
          </View>
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity
          style={styles.actionItem}
          onPress={() => {
            router.push(`/edit-vehicle?id=${vehicleId}`);
            onClose();
          }}
        >
          <View style={styles.actionIcon}>
            <Edit size={24} color={colors.text} />
          </View>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>{t("vehicles.edit")}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionItem} onPress={handleDelete}>
          <View style={styles.actionIcon}>
            <Trash2 size={24} color={colors.error} />
          </View>
          <View style={styles.actionContent}>
            <Text style={[styles.actionTitle, { color: colors.error }]}>
              {t("common.delete")}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </BottomSheet>
  );
};
