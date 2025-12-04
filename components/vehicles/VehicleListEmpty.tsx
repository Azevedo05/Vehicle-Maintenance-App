import React from "react";
import { View, Text } from "react-native";
import { Car } from "lucide-react-native";

import { useTheme } from "@/contexts/ThemeContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { createStyles } from "@/components/styles/index.styles";

interface VehicleListEmptyProps {
  hasVehicles: boolean;
}

export const VehicleListEmpty = ({ hasVehicles }: VehicleListEmptyProps) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { t } = useLocalization();

  if (!hasVehicles) {
    return (
      <View style={styles.emptyState}>
        <Car size={64} color={colors.placeholder} />
        <Text style={styles.emptyTitle}>{t("vehicles.empty_title")}</Text>
        <Text style={styles.emptyText}>{t("vehicles.empty_text")}</Text>
      </View>
    );
  }

  return (
    <View style={styles.emptyState}>
      <Car size={64} color={colors.placeholder} />
      <Text style={styles.emptyTitle}>{t("vehicles.no_results")}</Text>
      <Text style={styles.emptyText}>{t("vehicles.no_results_text")}</Text>
    </View>
  );
};
