import React, { useMemo, useState } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { Calendar, ChevronRight } from "lucide-react-native";
import { router } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { useVehicles } from "@/contexts/VehicleContext";
import { usePreferences } from "@/contexts/PreferencesContext";
import { useAppAlert } from "@/contexts/AlertContext";
import { getMaintenanceTypeLabel } from "@/types/maintenance";
import { createVehicleDetailsStyles } from "./VehicleDetailsStyles";

interface MaintenanceHistoryProps {
  vehicleId: string;
}

type RecordSortOption =
  | "date_recent"
  | "date_oldest"
  | "cost_high"
  | "cost_low"
  | "mileage_high"
  | "mileage_low"
  | "type";

export const MaintenanceHistory = ({ vehicleId }: MaintenanceHistoryProps) => {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const { getRecordsByVehicle, deleteRecord, restoreLastSnapshot } =
    useVehicles();
  const { currencySymbol } = usePreferences();
  const { showAlert, showToast } = useAppAlert();
  const styles = createVehicleDetailsStyles(colors);

  const [recordSortOption, setRecordSortOption] =
    useState<RecordSortOption>("date_recent");

  const allRecords = getRecordsByVehicle(vehicleId);
  const records = useMemo(() => {
    return [...allRecords].sort((a, b) => {
      switch (recordSortOption) {
        case "date_recent":
          return b.date - a.date;
        case "date_oldest":
          return a.date - b.date;
        case "cost_high":
          return (b.cost ?? 0) - (a.cost ?? 0);
        case "cost_low":
          return (a.cost ?? 0) - (b.cost ?? 0);
        case "mileage_high":
          return b.mileage - a.mileage;
        case "mileage_low":
          return a.mileage - b.mileage;
        case "type":
          return getMaintenanceTypeLabel(a.type, t).localeCompare(
            getMaintenanceTypeLabel(b.type, t)
          );
        default:
          return 0;
      }
    });
  }, [allRecords, recordSortOption, t]);

  const handleDeleteRecord = (recordId: string) => {
    showAlert({
      title: t("common.delete"),
      message: t("maintenance.delete_confirm"),
      buttons: [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("common.delete"),
          style: "destructive",
          onPress: async () => {
            await deleteRecord(recordId);
            showToast({
              message: t("maintenance.delete_success"),
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
      <Text style={styles.sectionTitle}>{t("maintenance.history")}</Text>

      {records.length === 0 ? (
        <View style={styles.emptyCard}>
          <Calendar size={32} color={colors.placeholder} />
          <Text style={styles.emptyText}>{t("maintenance.empty_history")}</Text>
        </View>
      ) : (
        <FlatList
          data={records}
          renderItem={({ item: record }) => (
            <TouchableOpacity
              style={styles.recordCard}
              onPress={() =>
                router.push(
                  `/add-record?vehicleId=${vehicleId}&recordId=${record.id}`
                )
              }
              onLongPress={() => handleDeleteRecord(record.id)}
              delayLongPress={500}
              activeOpacity={0.7}
            >
              <View style={styles.recordInfo}>
                <Text style={styles.recordTitle} numberOfLines={1}>
                  {record.type === "other"
                    ? record.title
                    : getMaintenanceTypeLabel(record.type, t)}
                </Text>
                <Text style={styles.recordDate} numberOfLines={1}>
                  {formatDate(record.date)} • {record.mileage.toLocaleString()}{" "}
                  {t("vehicles.km")}
                </Text>
                {record.cost !== undefined && (
                  <Text style={styles.recordCost}>
                    {currencySymbol}
                    {record.cost.toFixed(2)}
                  </Text>
                )}
                {record.notes && (
                  <Text style={styles.recordNotes} numberOfLines={2}>
                    {record.notes}
                  </Text>
                )}
              </View>
              <ChevronRight size={20} color={colors.border} />
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={10}
          removeClippedSubviews={true}
        />
      )}
    </View>
  );
};
