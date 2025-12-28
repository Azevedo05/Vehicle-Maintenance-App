import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ChevronRight } from "lucide-react-native";
import { router } from "expo-router";

import { useTheme } from "@/contexts/ThemeContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { createStyles } from "@/styles/statistics.styles";
import { Card } from "@/components/ui/Card";

interface StatisticsByVehicleProps {
  vehicleStats: {
    vehicleId: string;
    vehicleName: string;
    totalSpent: number;
    maintenanceCount: number;
  }[];
  currencySymbol: string;
}

export const StatisticsByVehicle = ({
  vehicleStats,
  currencySymbol,
}: StatisticsByVehicleProps) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { t } = useLocalization();

  if (vehicleStats.length === 0) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{t("statistics.by_vehicle")}</Text>
      <Card style={styles.card} padding={0}>
        {vehicleStats
          .sort((a, b) => b.totalSpent - a.totalSpent)
          .map((vehicle, index) => (
            <TouchableOpacity
              key={vehicle.vehicleId}
              style={[
                styles.listItem,
                index !== vehicleStats.length - 1 && styles.listItemBorder,
              ]}
              onPress={() => router.push(`/vehicle/${vehicle.vehicleId}`)}
              activeOpacity={0.7}
            >
              <View style={styles.listItemLeft}>
                <View>
                  <Text style={styles.listItemTitle}>
                    {vehicle.vehicleName}
                  </Text>
                  <Text style={styles.listItemSubtitle}>
                    {vehicle.maintenanceCount}{" "}
                    {t("statistics.maintenance_count")}
                  </Text>
                </View>
              </View>
              <View style={styles.listItemRight}>
                <Text style={styles.listItemValue}>
                  {vehicle.totalSpent.toFixed(2)}
                  {currencySymbol}
                </Text>
                <ChevronRight size={20} color={colors.textSecondary} />
              </View>
            </TouchableOpacity>
          ))}
      </Card>
    </View>
  );
};
