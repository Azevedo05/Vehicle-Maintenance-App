import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ArrowRightLeft, ListChecks } from "lucide-react-native";

import { BottomSheet } from "@/components/BottomSheet";
import { useTheme } from "@/contexts/ThemeContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { createStyles } from "@/styles/index.styles";

interface VehicleActionsProps {
  visible: boolean;
  onClose: () => void;
  onCompare: () => void;
  onBulkOperations: () => void;
}

export const VehicleActions = ({
  visible,
  onClose,
  onCompare,
  onBulkOperations,
}: VehicleActionsProps) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { t } = useLocalization();

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View style={styles.modalHeaderRow}>
        <Text style={styles.modalTitle}>{t("vehicles.actions_menu")}</Text>
      </View>

      <View style={styles.actionsList}>
        <TouchableOpacity
          style={styles.actionItem}
          onPress={() => {
            onClose();
            onCompare();
          }}
        >
          <View style={styles.actionIcon}>
            <ArrowRightLeft size={24} color={colors.primary} />
          </View>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>
              {t("vehicles.compare_vehicles")}
            </Text>
            <Text style={styles.actionDescription}>
              {t("vehicles.select_to_compare")}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionItem}
          onPress={() => {
            onClose();
            onBulkOperations();
          }}
        >
          <View style={styles.actionIcon}>
            <ListChecks size={24} color={colors.primary} />
          </View>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>
              {t("vehicles.bulk_operations")}
            </Text>
            <Text style={styles.actionDescription}>
              {t("vehicles.bulk_description")}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </BottomSheet>
  );
};
