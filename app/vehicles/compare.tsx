import { Check, Car } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useLocalization } from "@/contexts/LocalizationContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useVehicles } from "@/contexts/VehicleContext";
import { usePreferences } from "@/contexts/PreferencesContext";
import { useAppAlert } from "@/contexts/AlertContext";
import { VEHICLE_CATEGORY_INFO } from "@/types/vehicle";
import { ThemedBackground } from "@/components/ThemedBackground";

const MAX_SELECTION = 4;

export default function CompareVehiclesScreen() {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const { currencySymbol } = usePreferences();
  const { vehicles, records, getUpcomingTasks } = useVehicles();
  const { showAlert } = useAppAlert();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const styles = createStyles(colors);

  const toggleSelection = (vehicleId: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(vehicleId)) {
        return prev.filter((id) => id !== vehicleId);
      }

      if (prev.length >= MAX_SELECTION) {
        showAlert({
          title: t("vehicles.selection_limit_title"),
          message: t("vehicles.selection_limit_text", { count: MAX_SELECTION }),
        });
        return prev;
      }

      return [...prev, vehicleId];
    });
  };

  const comparisonData = useMemo(() => {
    return selectedIds
      .map((id) => {
        const vehicle = vehicles.find((v) => v.id === id);
        if (!vehicle) return null;

        const vehicleRecords = records
          .filter((record) => record.vehicleId === id)
          .sort((a, b) => b.date - a.date);
        const totalSpent = vehicleRecords.reduce(
          (sum, record) => sum + (record.cost || 0),
          0
        );
        const lastMaintenance = vehicleRecords[0]?.date;

        const tasks = getUpcomingTasks(vehicle.id);
        const overdueTasks = tasks.filter((task) => {
          const isOverdueDate =
            task.daysUntilDue !== undefined && task.daysUntilDue <= 0;
          const isOverdueMileage =
            task.milesUntilDue !== undefined && task.milesUntilDue <= 0;
          return isOverdueDate || isOverdueMileage;
        }).length;
        const upcomingTasks = Math.max(tasks.length - overdueTasks, 0);

        return {
          id,
          name: `${vehicle.make} ${vehicle.model}`,
          make: vehicle.make,
          model: vehicle.model,
          category: vehicle.category,
          archived: vehicle.archived,
          totalSpent,
          maintenanceCount: vehicleRecords.length,
          lastMaintenance,
          currentMileage: vehicle.currentMileage,
          overdueTasks,
          upcomingTasks,
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);
  }, [selectedIds, vehicles, records, getUpcomingTasks]);

  const formatDate = (timestamp?: number) => {
    if (!timestamp) {
      return t("vehicles.no_records_short");
    }
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const selectedCountLabel = t("vehicles.selected_count", {
    count: selectedIds.length,
  });

  return (
    <ThemedBackground>
      <SafeAreaView
        style={[styles.container, { backgroundColor: "transparent" }]}
        edges={["bottom"]}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.subtitle}>
              {t("vehicles.compare_description")}
            </Text>
          </View>

          <View style={styles.selectionInfo}>
            <Text style={styles.selectionText}>{selectedCountLabel}</Text>
            <TouchableOpacity
              style={[
                styles.clearButton,
                selectedIds.length === 0 && styles.clearButtonDisabled,
              ]}
              onPress={() => setSelectedIds([])}
              disabled={selectedIds.length === 0}
            >
              <Text
                style={[
                  styles.clearButtonText,
                  selectedIds.length === 0 && styles.clearButtonTextDisabled,
                ]}
              >
                {t("vehicles.clear_selection")}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.listCard}>
            {vehicles.length === 0 ? (
              <View style={styles.emptyList}>
                <Car size={48} color={colors.placeholder} />
                <Text style={styles.emptyListText}>
                  {t("vehicles.empty_text")}
                </Text>
              </View>
            ) : (
              vehicles.map((vehicle) => {
                const isSelected = selectedIds.includes(vehicle.id);
                const categoryInfo =
                  vehicle.category && VEHICLE_CATEGORY_INFO[vehicle.category];

                return (
                  <TouchableOpacity
                    key={vehicle.id}
                    style={[
                      styles.listItem,
                      isSelected && styles.listItemSelected,
                      vehicle.archived && styles.listItemArchived,
                    ]}
                    onPress={() => toggleSelection(vehicle.id)}
                    activeOpacity={0.8}
                  >
                    <View
                      style={[
                        styles.checkbox,
                        isSelected && styles.checkboxActive,
                      ]}
                    >
                      {isSelected && <Check size={16} color="#FFFFFF" />}
                    </View>
                    <View style={styles.itemInfo}>
                      <View style={styles.itemHeader}>
                        <Text style={styles.itemTitle} numberOfLines={1}>
                          {vehicle.make} {vehicle.model}
                        </Text>
                        {vehicle.archived && (
                          <Text style={styles.archivedTag}>
                            {t("vehicles.archived")}
                          </Text>
                        )}
                      </View>
                      <Text style={styles.itemSubtitle} numberOfLines={1}>
                        {vehicle.make} {vehicle.model} •{" "}
                        {vehicle.currentMileage.toLocaleString()} km
                      </Text>
                      {categoryInfo && (
                        <Text style={styles.itemCategory}>
                          {t(`vehicles.category_${vehicle.category}`)}
                        </Text>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })
            )}
          </View>

          <View style={styles.comparisonSection}>
            <Text style={styles.sectionTitle}>{t("vehicles.comparison")}</Text>

            {comparisonData.length < 2 ? (
              <View style={styles.comparisonEmpty}>
                <Text style={styles.comparisonEmptyText}>
                  {t("vehicles.select_two_prompt")}
                </Text>
              </View>
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.comparisonCards}
              >
                {comparisonData.map((vehicle) => (
                  <View key={vehicle.id} style={styles.comparisonCard}>
                    <Text style={styles.cardName} numberOfLines={1}>
                      {vehicle.make} {vehicle.model}
                    </Text>
                    <View style={styles.metricRow}>
                      <Text style={styles.metricLabel}>
                        {t("statistics.total_spent")}
                      </Text>
                      <Text style={styles.metricValue}>
                        {vehicle.totalSpent.toFixed(2)}
                        {currencySymbol}
                      </Text>
                    </View>
                    <View style={styles.metricRow}>
                      <Text style={styles.metricLabel}>
                        {t("statistics.total_maintenance")}
                      </Text>
                      <Text style={styles.metricValue}>
                        {vehicle.maintenanceCount}
                      </Text>
                    </View>
                    <View style={styles.metricRow}>
                      <Text style={styles.metricLabel}>
                        {t("vehicles.last_maintenance")}
                      </Text>
                      <Text style={styles.metricValue}>
                        {formatDate(vehicle.lastMaintenance)}
                      </Text>
                    </View>
                    <View style={styles.metricRow}>
                      <Text style={styles.metricLabel}>
                        {t("vehicles.overdue_tasks")}
                      </Text>
                      <Text style={styles.metricValue}>
                        {vehicle.overdueTasks}
                      </Text>
                    </View>
                    <View style={styles.metricRow}>
                      <Text style={styles.metricLabel}>
                        {t("vehicles.upcoming_tasks")}
                      </Text>
                      <Text style={styles.metricValue}>
                        {vehicle.upcomingTasks}
                      </Text>
                    </View>
                    <View style={styles.metricRow}>
                      <Text style={styles.metricLabel}>
                        {t("vehicles.current_mileage")}
                      </Text>
                      <Text style={styles.metricValue}>
                        {vehicle.currentMileage.toLocaleString()} km
                      </Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </ThemedBackground>
  );
}

const createStyles = (colors: ReturnType<typeof useTheme>["colors"]) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      padding: 16,
      paddingBottom: 32,
      gap: 16,
    },
    header: {
      gap: 6,
    },
    title: {
      fontSize: 28,
      fontWeight: "700" as const,
      color: colors.text,
    },
    subtitle: {
      fontSize: 15,
      color: colors.textSecondary,
      lineHeight: 20,
    },
    selectionInfo: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    selectionText: {
      fontSize: 15,
      color: colors.textSecondary,
    },
    clearButton: {
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    clearButtonDisabled: {
      opacity: 0.4,
    },
    clearButtonText: {
      fontSize: 14,
      fontWeight: "600" as const,
      color: colors.text,
    },
    clearButtonTextDisabled: {
      color: colors.textSecondary,
    },
    listCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 8,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 8,
    },
    emptyList: {
      alignItems: "center",
      paddingVertical: 32,
      gap: 12,
    },
    emptyListText: {
      color: colors.textSecondary,
      textAlign: "center",
    },
    listItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      padding: 12,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    listItemSelected: {
      borderColor: colors.primary,
      backgroundColor: colors.primary + "10",
    },
    listItemArchived: {
      opacity: 0.6,
    },
    checkbox: {
      width: 24,
      height: 24,
      borderRadius: 8,
      borderWidth: 2,
      borderColor: colors.border,
      justifyContent: "center",
      alignItems: "center",
    },
    checkboxActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    itemInfo: {
      flex: 1,
      minWidth: 0,
      gap: 4,
    },
    itemHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    itemTitle: {
      fontSize: 16,
      fontWeight: "600" as const,
      color: colors.text,
      flex: 1,
    },
    archivedTag: {
      fontSize: 12,
      color: colors.warning,
      fontWeight: "600" as const,
    },
    itemSubtitle: {
      fontSize: 13,
      color: colors.textSecondary,
    },
    itemCategory: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    comparisonSection: {
      gap: 12,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: "700" as const,
      color: colors.text,
    },
    comparisonEmpty: {
      padding: 20,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.card,
    },
    comparisonEmptyText: {
      textAlign: "center",
      color: colors.textSecondary,
      lineHeight: 20,
    },
    comparisonCards: {
      gap: 10,
    },
    comparisonCard: {
      width: 220,
      paddingVertical: 12,
      paddingHorizontal: 8,
      borderRadius: 16,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 10,
    },
    cardName: {
      fontSize: 17,
      fontWeight: "700" as const,
      color: colors.text,
      marginBottom: 6,
    },
    metricRow: {
      marginTop: 4,
      width: "100%",
      paddingHorizontal: 2,
    },
    metricLabel: {
      fontSize: 11,
      color: colors.textSecondary,
      textAlign: "left",
    },
    metricValue: {
      fontSize: 15,
      fontWeight: "700" as const,
      color: colors.text,
      textAlign: "right",
      marginTop: 0,
    },
  });
