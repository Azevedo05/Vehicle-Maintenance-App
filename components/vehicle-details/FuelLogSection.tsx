import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Fuel, Plus, ChevronRight } from "lucide-react-native";
import { router } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { useVehicles } from "@/contexts/VehicleContext";
import { usePreferences } from "@/contexts/PreferencesContext";
import { useAppAlert } from "@/contexts/AlertContext";
import { createVehicleDetailsStyles } from "./VehicleDetailsStyles";

interface FuelLogSectionProps {
  vehicleId: string;
}

export const FuelLogSection = ({ vehicleId }: FuelLogSectionProps) => {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const { getFuelLogsByVehicle, deleteFuelLog, restoreLastSnapshot } =
    useVehicles();
  const { currencySymbol } = usePreferences();
  const { showAlert, showToast } = useAppAlert();
  const styles = createVehicleDetailsStyles(colors);

  const fuelLogs = getFuelLogsByVehicle(vehicleId);

  const handleDeleteFuelLog = (logId: string) => {
    showAlert({
      title: t("fuel.delete_log"),
      message: t("fuel.delete_confirm"),
      buttons: [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("common.delete"),
          style: "destructive",
          onPress: async () => {
            await deleteFuelLog(logId);
            showToast({
              message: t("fuel.delete_success"),
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

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{t("fuel.section_title")}</Text>
        <TouchableOpacity
          onPress={() => router.push(`/add-fuel-log?vehicleId=${vehicleId}`)}
          style={styles.addButton}
        >
          <Plus size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {fuelLogs.length === 0 ? (
        <View style={styles.emptyCard}>
          <Fuel size={32} color={colors.placeholder} />
          <Text style={styles.emptyText}>{t("fuel.empty_state")}</Text>
        </View>
      ) : (
        fuelLogs.slice(0, 3).map((log) => (
          <TouchableOpacity
            key={log.id}
            style={styles.fuelCard}
            onPress={() =>
              router.push(
                `/add-fuel-log?vehicleId=${vehicleId}&fuelLogId=${log.id}`
              )
            }
            onLongPress={() => handleDeleteFuelLog(log.id)}
            delayLongPress={500}
            activeOpacity={0.7}
          >
            <View style={styles.recordInfo}>
              <View style={styles.fuelRow}>
                <Text style={styles.recordTitle}>{formatDate(log.date)}</Text>
                <Text style={styles.fuelVolume}>
                  {log.volume.toFixed(1)} {t("fuel.volume_unit")}
                </Text>
              </View>
              <Text style={styles.recordDate}>
                {currencySymbol}
                {log.totalCost.toFixed(2)} • {t(`fuel.type_${log.fuelType}`)}
              </Text>
              {log.pricePerUnit !== undefined && (
                <Text style={styles.fuelPricePerUnit}>
                  {currencySymbol}
                  {log.pricePerUnit.toFixed(3)}/{t("fuel.volume_unit")}
                </Text>
              )}
              {log.station && (
                <Text style={styles.recordNotes} numberOfLines={1}>
                  {log.station}
                </Text>
              )}
            </View>
            <ChevronRight size={20} color={colors.border} />
          </TouchableOpacity>
        ))
      )}
    </View>
  );
};
