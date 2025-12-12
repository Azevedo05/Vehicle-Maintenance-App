import React from "react";
import { BarChart2 } from "lucide-react-native";

import { useTheme } from "@/contexts/ThemeContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { EmptyState } from "@/components/ui/EmptyState";

interface StatisticsEmptyProps {
  hasData: boolean;
}

export const StatisticsEmpty = ({ hasData }: StatisticsEmptyProps) => {
  const { colors } = useTheme();
  const { t } = useLocalization();

  if (hasData) return null;

  return (
    <EmptyState
      icon={<BarChart2 size={64} color={colors.textSecondary} />}
      title={t("statistics.no_data")}
      description={t("statistics.no_data_text")}
    />
  );
};
