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

interface VehicleHeaderProps {
  vehicle: Vehicle;
}

export const VehicleHeader = ({ vehicle }: VehicleHeaderProps) => {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const { setVehicleArchived, restoreLastSnapshot } = useVehicles();
  const { showAlert, showToast } = useAppAlert();
  const styles = createStyles(colors);

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

      <View style={styles.badgeRow}>
        <View style={styles.yearBadge}>
          <Text style={styles.yearBadgeText}>{vehicle.year}</Text>
        </View>
        {vehicle.fuelType && (
          <View style={styles.pillBadge}>
            <Text style={styles.pillBadgeText}>
              {t(`fuel.type_${vehicle.fuelType}`)}
            </Text>
          </View>
        )}
        {vehicle.category && (
          <View style={styles.pillBadge}>
            <Text style={styles.pillBadgeText}>
              {t(`vehicles.category_${vehicle.category}`)}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.mileageContainer}>
        <View style={styles.mileageHeader}>
          <View style={styles.iconCircle}>
            <Gauge size={20} color={colors.primary} />
          </View>
          <Text style={styles.mileageLabel}>
            {t("vehicles.current_mileage")}
          </Text>
        </View>
        <Text style={styles.mileageValue}>
          {vehicle.currentMileage.toLocaleString()}{" "}
          <Text style={styles.mileageUnit}>{t("vehicles.km")}</Text>
        </Text>
      </View>
    </View>
  );
};

const createStyles = (colors: any) =>
  StyleSheet.create({
    infoCard: {
      paddingHorizontal: 24,
      paddingBottom: 24,
      gap: 20,
    },
    headerTopRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    nameContainer: {
      flex: 1,
      gap: 4,
    },
    vehicleName: {
      fontSize: 32,
      fontWeight: "800",
      color: colors.text,
      letterSpacing: -0.5,
      lineHeight: 40,
    },
    licenseText: {
      fontSize: 16,
      color: colors.textSecondary,
      fontWeight: "600",
      letterSpacing: 1,
    },
    archiveButton: {
      padding: 4,
      // No background, matching list header style
    },
    badgeRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      flexWrap: "wrap",
    },
    yearBadge: {
      backgroundColor: colors.surface,
      borderRadius: 50,
      paddingHorizontal: 14,
      paddingVertical: 6,
      borderWidth: 1,
      borderColor: colors.border,
    },
    yearBadgeText: {
      fontSize: 13,
      color: colors.textSecondary,
      fontWeight: "600",
    },
    pillBadge: {
      backgroundColor: colors.surface,
      borderRadius: 50,
      paddingHorizontal: 14,
      paddingVertical: 6,
      borderWidth: 1,
      borderColor: colors.border,
    },
    pillBadgeText: {
      fontSize: 13,
      color: colors.textSecondary,
      fontWeight: "600",
    },
    mileageContainer: {
      marginTop: 8,
      paddingTop: 20,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      gap: 8,
    },
    mileageHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    iconCircle: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.primary + "15",
      justifyContent: "center",
      alignItems: "center",
    },
    mileageLabel: {
      fontSize: 13,
      color: colors.textSecondary,
      fontWeight: "600",
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    mileageValue: {
      fontSize: 36,
      fontWeight: "300", // Light weight for large numbers looks premium
      color: colors.text,
      letterSpacing: -1,
    },
    mileageUnit: {
      fontSize: 18,
      fontWeight: "500",
      color: colors.textSecondary,
      marginLeft: 4,
    },
  });
