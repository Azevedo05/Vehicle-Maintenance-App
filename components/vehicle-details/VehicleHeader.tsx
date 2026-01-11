import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Car, Archive, ArchiveRestore, Gauge } from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { useVehicles } from "@/contexts/VehicleContext";
import { useAppAlert } from "@/contexts/AlertContext";
import { Vehicle } from "@/types/vehicle";
import { createVehicleHeaderStyles } from "@/styles/vehicle/VehicleHeader.styles";

interface VehicleHeaderProps {
  vehicle: Vehicle;
}

export const VehicleHeader = ({ vehicle }: VehicleHeaderProps) => {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const { setVehicleArchived, restoreLastSnapshot } = useVehicles();
  const { showAlert, showToast } = useAppAlert();
  const styles = createVehicleHeaderStyles(colors);

  const handleArchiveToggle = () => {
    const isArchived = !!vehicle.archived;
    const vehicleName = `${vehicle.make} ${vehicle.model}`;
    showAlert({
      title: isArchived
        ? t("vehicles.unarchive_confirm")
        : t("vehicles.archive_confirm"),
      message: isArchived
        ? t("vehicles.unarchive_text")
        : t("vehicles.archive_text"),
      buttons: [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: isArchived ? t("vehicles.unarchive") : t("vehicles.archive"),
          onPress: async () => {
            await setVehicleArchived(vehicle.id, !isArchived);

            showToast({
              message: isArchived
                ? t("vehicles.unarchive_success", { name: vehicleName })
                : t("vehicles.archive_success", { name: vehicleName }),
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

  return (
    <View style={styles.infoCard}>
      <View style={styles.headerTopRow}>
        <View style={styles.nameContainer}>
          <Text style={styles.vehicleName}>
            {vehicle.make}{" "}
            <Text style={{ fontWeight: "400", opacity: 0.9 }}>
              {vehicle.model}
            </Text>
          </Text>
          {/* License Plate as a secondary subtle element */}
          {vehicle.licensePlate && (
            <Text style={styles.licenseText}>{vehicle.licensePlate}</Text>
          )}
        </View>

        <TouchableOpacity
          onPress={handleArchiveToggle}
          style={styles.archiveButton}
        >
          {vehicle.archived ? (
            <ArchiveRestore size={24} color={colors.warning} />
          ) : (
            <Archive size={24} color={colors.text} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};
