import React from "react";
import { View, Text } from "react-native";

import { useTheme } from "@/contexts/ThemeContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { createStyles } from "@/styles/statistics.styles";
import { Card } from "@/components/ui/Card";

interface StatisticsOverviewProps {
  overallStats: {
    totalSpent: number;
    totalMaintenance: number;
    averageMonthlySpent: number;
    thisYearSpent: number;
    thisYearCount: number;
  };
  currencySymbol: string;
}

export const StatisticsOverview = ({
  overallStats,
  currencySymbol,
}: StatisticsOverviewProps) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { t } = useLocalization();

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{t("statistics.overview")}</Text>
      <View style={styles.cardGrid}>
        <Card style={[styles.card, styles.cardHalf]}>
          <Text style={styles.cardLabel}>{t("statistics.total_spent")}</Text>
          <Text style={styles.cardValue}>
            {overallStats.totalSpent.toFixed(2)}
            {currencySymbol}
          </Text>
        </Card>
        <Card style={[styles.card, styles.cardHalf]}>
          <Text style={styles.cardLabel}>
            {t("statistics.total_maintenance")}
          </Text>
          <Text style={styles.cardValue}>{overallStats.totalMaintenance}</Text>
        </Card>
        <Card style={[styles.card, styles.cardHalf]}>
          <Text style={styles.cardLabel}>
            {t("statistics.monthly_average")}
          </Text>
          <Text style={styles.cardValue}>
            {overallStats.averageMonthlySpent.toFixed(2)}
            {currencySymbol}
          </Text>
          <Text style={styles.cardSubtext}>{t("statistics.per_month")}</Text>
        </Card>
        <Card style={[styles.card, styles.cardHalf]}>
          <Text style={styles.cardLabel}>{t("statistics.this_year")}</Text>
          <Text style={styles.cardValue}>
            {overallStats.thisYearSpent.toFixed(2)}
            {currencySymbol}
          </Text>
          <Text style={styles.cardSubtext}>
            {overallStats.thisYearCount} {t("statistics.maintenance_count")}
          </Text>
        </Card>
      </View>
    </View>
  );
};
