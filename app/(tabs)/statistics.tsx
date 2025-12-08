import React from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useLocalization } from "@/contexts/LocalizationContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useVehicles } from "@/contexts/VehicleContext";
import { usePreferences } from "@/contexts/PreferencesContext";
import {
  calculateOverallStats,
  calculateVehicleStats,
  calculateTypeStats,
  calculateCategoryStats,
} from "@/utils/statistics";
import { createStyles } from "@/components/styles/statistics.styles";

import { StatisticsOverview } from "@/components/statistics/StatisticsOverview";
import { StatisticsByVehicle } from "@/components/statistics/StatisticsByVehicle";
import { StatisticsByType } from "@/components/statistics/StatisticsByType";
import { StatisticsByCategory } from "@/components/statistics/StatisticsByCategory";
import { StatisticsFuel } from "@/components/statistics/StatisticsFuel";

import { StatisticsEmpty } from "@/components/statistics/StatisticsEmpty";

export default function StatisticsScreen() {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const { vehicles, records, fuelLogs } = useVehicles();
  const { currencySymbol } = usePreferences();

  const styles = createStyles(colors);

  // Calculate all statistics
  const overallStats = calculateOverallStats(records);
  const vehicleStats = calculateVehicleStats(vehicles, records);
  const typeStats = calculateTypeStats(records, vehicles);
  const categoryStats = calculateCategoryStats(vehicles, records);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.screenTitle}>{t("statistics.title")}</Text>
        </View>

        <StatisticsOverview
          overallStats={overallStats}
          currencySymbol={currencySymbol}
        />

        <StatisticsByVehicle
          vehicleStats={vehicleStats}
          currencySymbol={currencySymbol}
        />

        <StatisticsByType
          typeStats={typeStats}
          currencySymbol={currencySymbol}
        />

        <StatisticsByCategory
          categoryStats={categoryStats}
          currencySymbol={currencySymbol}
        />

        <StatisticsFuel
          fuelLogs={fuelLogs}
          vehicles={vehicles}
          currencySymbol={currencySymbol}
        />

        <StatisticsEmpty hasData={records.length > 0} />
      </ScrollView>
    </SafeAreaView>
  );
}
