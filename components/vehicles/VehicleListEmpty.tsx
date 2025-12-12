import React from "react";
import { StyleSheet, View } from "react-native";
import { Car } from "lucide-react-native";

import { useTheme } from "@/contexts/ThemeContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { EmptyState } from "@/components/ui/EmptyState";

interface VehicleListEmptyProps {
  hasVehicles: boolean;
}

export const VehicleListEmpty = ({ hasVehicles }: VehicleListEmptyProps) => {
  const { colors } = useTheme();
  const { t } = useLocalization();

  if (!hasVehicles) {
    return (
      <View style={styles.container}>
        <EmptyState
          icon={
            <Car size={64} color={colors.textSecondary} strokeWidth={1.5} />
          }
          title={t("vehicles.empty_title")}
          description={t("vehicles.empty_text")}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <EmptyState
        icon={<Car size={64} color={colors.placeholder} strokeWidth={1.5} />}
        title={t("vehicles.no_results")}
        description={t("vehicles.no_results_text")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingBottom: 160,
  },
});
