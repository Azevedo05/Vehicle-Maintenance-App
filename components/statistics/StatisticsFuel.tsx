import React, { useMemo, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { ChevronRight } from "lucide-react-native";

import { useTheme } from "@/contexts/ThemeContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { createStyles } from "@/styles/statistics.styles";
import { FuelLog, Vehicle } from "@/types/vehicle";
import {
  calculateFuelStats,
  calculateFuelStatsByVehicle,
} from "@/utils/statistics";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";

interface StatisticsFuelProps {
  fuelLogs: FuelLog[];
  vehicles: Vehicle[];
  currencySymbol: string;
}

export const StatisticsFuel = ({
  fuelLogs,
  vehicles,
  currencySymbol,
}: StatisticsFuelProps) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { t } = useLocalization();

  const [selectedFuelVehicle, setSelectedFuelVehicle] = useState<
    "all" | string
  >("all");
  const [selectedFuelRange, setSelectedFuelRange] = useState<
    "all" | "30d" | "90d"
  >("all");

  const filteredFuelLogs = useMemo(() => {
    let logs = fuelLogs;
    if (selectedFuelVehicle !== "all") {
      logs = logs.filter((log) => log.vehicleId === selectedFuelVehicle);
    }
    if (selectedFuelRange !== "all") {
      const days = selectedFuelRange === "30d" ? 30 : 90;
      const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
      logs = logs.filter((log) => log.date >= cutoff);
    }
    return logs;
  }, [fuelLogs, selectedFuelVehicle, selectedFuelRange]);

  const fuelStats = useMemo(
    () => calculateFuelStats(filteredFuelLogs),
    [filteredFuelLogs]
  );
  const fuelByVehicle = useMemo(
    () => calculateFuelStatsByVehicle(filteredFuelLogs, vehicles),
    [filteredFuelLogs, vehicles]
  );

  if (fuelLogs.length === 0) return null;

  return (
    <View style={[styles.section, { marginBottom: 0 }]}>
      <Text style={styles.sectionTitle}>{t("fuel.stats_title")}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipRow}
      >
        <Chip
          label={t("fuel.filter_all")}
          active={selectedFuelVehicle === "all"}
          onPress={() => setSelectedFuelVehicle("all")}
          style={styles.chip}
        />
        {vehicles.map((vehicle) => (
          <Chip
            key={vehicle.id}
            label={`${vehicle.make} ${vehicle.model}`}
            active={selectedFuelVehicle === vehicle.id}
            onPress={() => setSelectedFuelVehicle(vehicle.id)}
            style={styles.chip}
          />
        ))}
      </ScrollView>

      <View style={styles.rangeRow}>
        {(["all", "30d", "90d"] as const).map((range) => (
          <TouchableOpacity
            key={range}
            style={[
              styles.rangeChip,
              selectedFuelRange === range && styles.rangeChipActive,
            ]}
            onPress={() => setSelectedFuelRange(range)}
          >
            <Text
              style={[
                styles.rangeChipText,
                selectedFuelRange === range && styles.rangeChipTextActive,
              ]}
            >
              {t(`fuel.range_${range}`)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={[styles.fuelStatsGrid, { marginBottom: 0 }]}>
        <Card style={styles.fuelStatCard}>
          <Text style={styles.cardLabel}>{t("fuel.fill_ups")}</Text>
          <Text style={styles.cardValue}>{fuelStats.totalFillUps}</Text>
        </Card>
        <Card style={styles.fuelStatCard}>
          <Text style={styles.cardLabel}>{t("fuel.last_fill")}</Text>
          <Text style={styles.cardValue}>
            {fuelStats.lastFillDate
              ? (() => {
                  const d = new Date(fuelStats.lastFillDate);
                  const day = String(d.getDate()).padStart(2, "0");
                  const month = String(d.getMonth() + 1).padStart(2, "0");
                  const year = d.getFullYear();
                  return `${day}/${month}/${year}`;
                })()
              : t("fuel.no_data")}
          </Text>
        </Card>
        <Card style={styles.fuelStatCard}>
          <Text style={styles.cardLabel}>{t("fuel.total_volume")}</Text>
          <Text style={styles.cardValue}>
            {fuelStats.totalVolumeL > 0 &&
              `${fuelStats.totalVolumeL.toFixed(1)} ${t("fuel.volume_unit")}`}
            {fuelStats.totalVolumeL > 0 && fuelStats.totalVolumeKWh > 0 && "\n"}
            {fuelStats.totalVolumeKWh > 0 &&
              `${fuelStats.totalVolumeKWh.toFixed(1)} ${t(
                "fuel.volume_unit_electric"
              )}`}
            {fuelStats.totalVolumeL === 0 &&
              fuelStats.totalVolumeKWh === 0 &&
              `0 ${t("fuel.volume_unit")}`}
          </Text>
        </Card>
        <Card style={styles.fuelStatCard}>
          <Text style={styles.cardLabel}>{t("fuel.average_volume")}</Text>
          <Text style={styles.cardValue}>
            {fuelStats.averageVolumeL > 0 &&
              `${fuelStats.averageVolumeL.toFixed(1)} ${t("fuel.volume_unit")}`}
            {fuelStats.averageVolumeL > 0 &&
              fuelStats.averageVolumeKWh > 0 &&
              "\n"}
            {fuelStats.averageVolumeKWh > 0 &&
              `${fuelStats.averageVolumeKWh.toFixed(1)} ${t(
                "fuel.volume_unit_electric"
              )}`}
            {fuelStats.averageVolumeL === 0 &&
              fuelStats.averageVolumeKWh === 0 &&
              `0 ${t("fuel.volume_unit")}`}
          </Text>
        </Card>
        <Card style={styles.fuelStatCard}>
          <Text style={styles.cardLabel}>{t("fuel.total_spent")}</Text>
          <Text style={styles.cardValue}>
            {fuelStats.totalCost.toFixed(2)}
            {currencySymbol}
          </Text>
        </Card>
        <Card style={styles.fuelStatCard}>
          <Text style={styles.cardLabel}>{t("fuel.avg_cost_fill")}</Text>
          <Text style={styles.cardValue}>
            {fuelStats.averageCostPerFill.toFixed(2)}
            {currencySymbol}
          </Text>
        </Card>
      </View>

      {fuelByVehicle.length > 0 && (
        <Card style={[styles.card, { marginTop: 16 }]} padding={0}>
          {fuelByVehicle.slice(0, 5).map((vehicle, index) => (
            <TouchableOpacity
              key={vehicle.vehicleId}
              style={[
                styles.typeItem,
                index !== Math.min(fuelByVehicle.length, 5) - 1 &&
                  styles.listItemBorder,
              ]}
              onPress={() => router.push(`/vehicle/${vehicle.vehicleId}`)}
              activeOpacity={0.7}
            >
              <View style={styles.typeHeader}>
                <Text style={styles.listItemTitle}>{vehicle.vehicleName}</Text>
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
                >
                  <Text style={styles.listItemValue}>
                    {vehicle.totalCost.toFixed(2)}
                    {currencySymbol}
                  </Text>
                  <ChevronRight size={16} color={colors.textSecondary} />
                </View>
              </View>
              <Text style={styles.listItemSubtitle}>
                {vehicle.fillUps}{" "}
                {vehicle.fuelType === "electric"
                  ? t("fuel.fill_ups_short_electric")
                  : t("fuel.fill_ups_short")}{" "}
                •{" "}
                {vehicle.totalVolumeL > 0 &&
                  `${vehicle.totalVolumeL.toFixed(1)} ${t("fuel.volume_unit")}`}
                {vehicle.totalVolumeL > 0 &&
                  vehicle.totalVolumeKWh > 0 &&
                  " + "}
                {vehicle.totalVolumeKWh > 0 &&
                  `${vehicle.totalVolumeKWh.toFixed(1)} ${t(
                    "fuel.volume_unit_electric"
                  )}`}
              </Text>
            </TouchableOpacity>
          ))}
        </Card>
      )}
    </View>
  );
};
