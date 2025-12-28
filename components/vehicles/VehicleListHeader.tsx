import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import {
  Archive,
  ArchiveRestore,
  SlidersHorizontal,
  MoreHorizontal,
} from "lucide-react-native";

import { useTheme } from "@/contexts/ThemeContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { createStyles } from "@/styles/index.styles";
import { ReorderModeButton } from "@/components/ui/ReorderModeButton";

interface VehicleListHeaderProps {
  showArchived: boolean;
  onToggleArchived: () => void;
  onOpenFilter: () => void;
  onOpenActions: () => void;
  isReorderMode?: boolean;
  onToggleReorderMode?: () => void;
  canReorder?: boolean;
  hasActiveFilters?: boolean;
}

export const VehicleListHeader = ({
  showArchived,
  onToggleArchived,
  onOpenFilter,
  onOpenActions,
  isReorderMode = false,
  onToggleReorderMode,
  canReorder = false,
  hasActiveFilters = false,
}: VehicleListHeaderProps) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { t } = useLocalization();

  return (
    <View style={styles.header}>
      <View style={styles.titleRow}>
        <Text style={styles.screenTitle}>{t("vehicles.title")}</Text>
        <TouchableOpacity onPress={onToggleArchived} activeOpacity={0.7}>
          {showArchived ? (
            <ArchiveRestore size={24} color={colors.warning} />
          ) : (
            <Archive size={24} color={colors.text} />
          )}
        </TouchableOpacity>
      </View>
      <View
        style={[styles.headerButtonsRow, { justifyContent: "space-between" }]}
      >
        <View style={{ flexDirection: "row", gap: 12 }}>
          <TouchableOpacity
            style={styles.iconHeaderButton}
            onPress={onOpenFilter}
            activeOpacity={0.8}
          >
            <SlidersHorizontal size={18} color={colors.text} />
            <Text style={styles.iconHeaderButtonText}>
              {t("vehicles.filter_menu")}
            </Text>
            {hasActiveFilters && <View style={styles.filterBadge} />}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconHeaderButton}
            onPress={onOpenActions}
            activeOpacity={0.8}
          >
            <MoreHorizontal size={18} color={colors.text} />
            <Text style={styles.iconHeaderButtonText}>
              {t("vehicles.actions_menu")}
            </Text>
          </TouchableOpacity>
        </View>
        {canReorder && onToggleReorderMode && (
          <ReorderModeButton
            isReorderMode={isReorderMode}
            onToggle={onToggleReorderMode}
          />
        )}
      </View>
    </View>
  );
};
