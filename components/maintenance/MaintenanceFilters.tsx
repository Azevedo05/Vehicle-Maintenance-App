import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { ArrowUp, ArrowDown } from "lucide-react-native";

import { BottomSheet } from "@/components/BottomSheet";
import { useTheme } from "@/contexts/ThemeContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { createStyles } from "@/components/styles/maintenance.styles";
import { Vehicle } from "@/types/vehicle";
import {
  MaintenanceType,
  MAINTENANCE_TYPES,
  getMaintenanceTypeLabel,
} from "@/types/maintenance";

export type MaintenanceSortOption =
  | "due_date_overdue"
  | "due_date_upcoming"
  | "type"
  | "vehicle";

interface MaintenanceFiltersProps {
  visible: boolean;
  onClose: () => void;
  selectedVehicleIds: string[];
  onSelectVehicle: (id: string) => void;
  selectedTypes: MaintenanceType[];
  onSelectType: (type: MaintenanceType) => void;
  onClearFilters: () => void;
  vehicles: Vehicle[];
}

export const MaintenanceFilters = ({
  visible,
  onClose,
  selectedVehicleIds,
  onSelectVehicle,
  selectedTypes,
  onSelectType,
  onClearFilters,
  vehicles,
}: MaintenanceFiltersProps) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { t } = useLocalization();

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View style={styles.modalHeaderRow}>
        <Text style={styles.modalTitle}>{t("maintenance.filters")}</Text>
        <TouchableOpacity onPress={onClearFilters} activeOpacity={0.8}>
          <Text style={styles.modalHeaderLink}>
            {t("maintenance.clear_filters")}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.modalScrollView}
        contentContainerStyle={styles.modalScrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Vehicle Filter Section */}
        <View style={styles.filterSection}>
          <Text style={styles.filterSectionTitle}>
            {t("maintenance.filter_vehicle")}
          </Text>
          <View style={styles.categoryChips}>
            <TouchableOpacity
              style={[
                styles.categoryChip,
                selectedVehicleIds.length === 0 && styles.categoryChipActive,
              ]}
              onPress={() => onClearFilters()}
            >
              <Text
                numberOfLines={1}
                style={[
                  styles.categoryChipText,
                  selectedVehicleIds.length === 0 &&
                    styles.categoryChipTextActive,
                ]}
              >
                {t("vehicles.filter_all")}
              </Text>
            </TouchableOpacity>
            {vehicles.map((vehicle) => (
              <TouchableOpacity
                key={vehicle.id}
                style={[
                  styles.categoryChip,
                  selectedVehicleIds.includes(vehicle.id) &&
                    styles.categoryChipActive,
                ]}
                onPress={() => onSelectVehicle(vehicle.id)}
              >
                <Text
                  numberOfLines={1}
                  style={[
                    styles.categoryChipText,
                    selectedVehicleIds.includes(vehicle.id) &&
                      styles.categoryChipTextActive,
                  ]}
                >
                  {vehicle.make} {vehicle.model}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Type Filter Section */}
        <View style={styles.filterSection}>
          <Text style={styles.filterSectionTitle}>
            {t("maintenance.select_type")}
          </Text>
          <View style={styles.sortOptionsList}>
            <TouchableOpacity
              style={[
                styles.sortOptionItem,
                selectedTypes.length === 0 && styles.sortOptionItemActive,
              ]}
              onPress={() => onClearFilters()}
            >
              <Text
                style={[
                  styles.sortOptionText,
                  selectedTypes.length === 0 && styles.sortOptionTextActive,
                ]}
              >
                {t("vehicles.filter_all")}
              </Text>
              {selectedTypes.length === 0 && (
                <View style={styles.sortOptionIndicator} />
              )}
            </TouchableOpacity>
            {Object.entries(MAINTENANCE_TYPES).map(
              ([key, type], index, arr) => {
                const isSelected = selectedTypes.includes(
                  key as MaintenanceType
                );
                const isLast = index === arr.length - 1;
                return (
                  <TouchableOpacity
                    key={key}
                    style={[
                      styles.sortOptionItem,
                      isSelected && styles.sortOptionItemActive,
                      isLast && { borderBottomWidth: 0 },
                    ]}
                    onPress={() => onSelectType(key as MaintenanceType)}
                  >
                    <Text
                      style={[
                        styles.sortOptionText,
                        isSelected && styles.sortOptionTextActive,
                      ]}
                    >
                      {getMaintenanceTypeLabel(key as MaintenanceType, t)}
                    </Text>
                    {isSelected && <View style={styles.sortOptionIndicator} />}
                  </TouchableOpacity>
                );
              }
            )}
          </View>
        </View>
      </ScrollView>
    </BottomSheet>
  );
};
