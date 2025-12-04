import React from "react";
import { View, Text } from "react-native";
import { BarChart2 } from "lucide-react-native";

import { useTheme } from "@/contexts/ThemeContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { createStyles } from "@/components/styles/statistics.styles";

interface StatisticsEmptyProps {
  hasData: boolean;
}

export const StatisticsEmpty = ({ hasData }: StatisticsEmptyProps) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { t } = useLocalization();

  if (hasData) return null;

  return (
    <View style={styles.emptyContainer}>
      <BarChart2 size={64} color={colors.textSecondary} />
      <Text style={styles.emptyTitle}>{t("statistics.no_data")}</Text>
      <Text style={styles.emptyText}>{t("statistics.no_data_text")}</Text>
    </View>
  );
};
