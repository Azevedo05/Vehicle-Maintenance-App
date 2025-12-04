import React from "react";
import { View, Text } from "react-native";

import { useTheme } from "@/contexts/ThemeContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { createStyles } from "@/components/styles/statistics.styles";
import { getMaintenanceTypeLabel, MaintenanceType } from "@/types/maintenance";
import { Card } from "@/components/ui/Card";

interface StatisticsByTypeProps {
  typeStats: {
    type: MaintenanceType;
    totalSpent: number;
    count: number;
    vehicleBreakdown: { vehicleName: string; count: number }[];
  }[];
  currencySymbol: string;
}

export const StatisticsByType = ({
  typeStats,
  currencySymbol,
}: StatisticsByTypeProps) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { t } = useLocalization();

  if (typeStats.length === 0) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{t("statistics.by_type")}</Text>
      <Card style={styles.card} padding={16}>
        {typeStats.slice(0, 10).map((type, index) => (
          <View
            key={type.type}
            style={[
              styles.typeItem,
              index !== Math.min(typeStats.length, 10) - 1 &&
                styles.listItemBorder,
            ]}
          >
            <View style={styles.typeHeader}>
              <View style={styles.typeTitleRow}>
                <Text style={styles.listItemTitle}>
                  {getMaintenanceTypeLabel(type.type, t)}
                </Text>
                <Text style={styles.typeCountHeader}>({type.count})</Text>
              </View>
              <Text style={styles.listItemValue}>
                {currencySymbol}
                {type.totalSpent.toFixed(2)}
              </Text>
            </View>

            <Text style={styles.typeBreakdown}>
              {type.vehicleBreakdown
                .map((v) => `${v.vehicleName} (${v.count})`)
                .join(", ")}
            </Text>
          </View>
        ))}
      </Card>
    </View>
  );
};
