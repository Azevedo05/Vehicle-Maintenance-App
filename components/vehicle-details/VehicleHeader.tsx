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
    <View style={styles.headerContainer}>
      {vehicle.photo ? (
        <>
          <Image
            source={{ uri: vehicle.photo }}
            style={styles.vehicleImage}
            contentFit="cover"
          />
          <LinearGradient
            colors={["transparent", colors.background]}
            style={styles.imageGradient}
          />
        </>
      ) : (
        <View style={styles.noImagePlaceholder}>
          <Car size={64} color={colors.placeholder} />
        </View>
      )}

      <View style={styles.infoCard}>
        <View style={styles.nameContainer}>
          <View style={styles.nameRow}>
            <Text style={styles.vehicleName}>
              {vehicle.make} {vehicle.model}
            </Text>
            <TouchableOpacity
              onPress={handleArchiveToggle}
              style={{ padding: 4 }}
            >
              {vehicle.archived ? (
                <ArchiveRestore size={20} color={colors.warning} />
              ) : (
                <Archive size={20} color={colors.primary} />
              )}
            </TouchableOpacity>
          </View>
          <View style={styles.badgeRow}>
            {vehicle.licensePlate && (
              <View style={styles.licenseBadge}>
                <Text style={styles.licenseBadgeText}>
                  {vehicle.licensePlate}
                </Text>
              </View>
            )}
            <View style={styles.yearBadge}>
              <Text style={styles.yearBadgeText}>{vehicle.year}</Text>
            </View>
            {vehicle.fuelType && (
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryBadgeText}>
                  {t(`fuel.type_${vehicle.fuelType}`)}
                </Text>
              </View>
            )}
            {vehicle.category && (
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryBadgeText}>
                  {t(`vehicles.category_${vehicle.category}`)}
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.mileageCard}>
          <View style={styles.mileageIconContainer}>
            <Gauge size={24} color={colors.primary} />
          </View>
          <View style={styles.mileageContent}>
            <Text style={styles.mileageLabel}>
              {t("vehicles.current_mileage")}
            </Text>
            <Text style={styles.mileageValue}>
              {vehicle.currentMileage.toLocaleString()} {t("vehicles.km")}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const createStyles = (colors: any) =>
  StyleSheet.create({
    headerContainer: {
      position: "relative",
    },
    vehicleImage: {
      width: "100%",
      height: 250,
      backgroundColor: colors.border,
    },
    imageGradient: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      height: 100,
    },
    noImagePlaceholder: {
      width: "100%",
      height: 250,
      backgroundColor: colors.primary + "10",
      justifyContent: "center",
      alignItems: "center",
      borderBottomWidth: 3,
      borderBottomColor: colors.primary + "30",
    },
    infoCard: {
      backgroundColor: colors.background,
      paddingHorizontal: 20,
      paddingTop: 12,
      paddingBottom: 24,
    },
    nameContainer: {
      flexDirection: "column",
      alignItems: "flex-start",
      marginBottom: 12,
      gap: 4,
    },
    nameRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      flex: 1,
    },
    vehicleName: {
      fontSize: 32,
      fontWeight: "800",
      color: colors.text,
      flex: 1,
    },
    badgeRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginTop: 4,
    },
    licenseBadge: {
      backgroundColor: colors.primary + "20",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.primary + "40",
    },
    licenseBadgeText: {
      fontSize: 14,
      fontWeight: "700",
      color: colors.primary,
      letterSpacing: 1,
    },
    categoryBadge: {
      backgroundColor: colors.surface,
      borderRadius: 8,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderWidth: 1,
      borderColor: colors.border,
    },
    categoryBadgeText: {
      fontSize: 12,
      color: colors.textSecondary,
      fontWeight: "600",
    },
    yearBadge: {
      backgroundColor: colors.surface,
      borderRadius: 8,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderWidth: 1,
      borderColor: colors.border,
    },
    yearBadgeText: {
      fontSize: 12,
      color: colors.textSecondary,
      fontWeight: "600",
    },
    mileageCard: {
      backgroundColor: colors.primary + "10",
      borderRadius: 16,
      padding: 16,
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.primary + "30",
    },
    mileageIconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.primary + "20",
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    mileageContent: {
      flex: 1,
    },
    mileageLabel: {
      fontSize: 12,
      color: colors.textSecondary,
      marginBottom: 4,
      textTransform: "uppercase",
      fontWeight: "600",
    },
    mileageValue: {
      fontSize: 24,
      fontWeight: "700",
      color: colors.primary,
    },
  });
