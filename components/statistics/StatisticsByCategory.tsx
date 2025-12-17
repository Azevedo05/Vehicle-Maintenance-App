import React from "react";
import { View, Text } from "react-native";

import { useTheme } from "@/contexts/ThemeContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { createStyles } from "@/components/styles/statistics.styles";
import { VEHICLE_CATEGORY_INFO, VehicleCategory } from "@/types/vehicle";
import { Card } from "@/components/ui/Card";

interface StatisticsByCategoryProps {
  categoryStats: {
    category: VehicleCategory;
    totalSpent: number;
    vehicleCount: number;
    maintenanceCount: number;
  }[];
  currencySymbol: string;
}

export const StatisticsByCategory = ({
  categoryStats,
  currencySymbol,
}: StatisticsByCategoryProps) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { t } = useLocalization();

  if (categoryStats.length === 0) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{t("statistics.by_category")}</Text>
      <Card style={styles.card} padding={0}>
        {categoryStats.map((category, index) => {
          const info = VEHICLE_CATEGORY_INFO[category.category];
          return (
            <View
              key={category.category}
              style={[
                styles.listItem,
                index !== categoryStats.length - 1 && styles.listItemBorder,
              ]}
            >
              <View style={styles.listItemLeft}>
                <View>
                  <View style={styles.categoryRow}>
                    <View
                      style={[
                        styles.categoryDot,
                        { backgroundColor: info?.color ?? colors.primary },
                      ]}
                    />
                    <Text style={styles.listItemTitle}>
                      {t(`vehicles.category_${category.category}`)}
                    </Text>
                  </View>
                  <Text style={styles.listItemSubtitle}>
                    {t("statistics.category_breakdown", {
                      vehicles: category.vehicleCount,
                      maintenance: category.maintenanceCount,
                    })}
                  </Text>
                </View>
              </View>
              <Text style={styles.listItemValue}>
                {category.totalSpent.toFixed(2)}
                {currencySymbol}
              </Text>
            </View>
          );
        })}
      </Card>
    </View>
  );
};
