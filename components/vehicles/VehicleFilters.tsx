import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { ArrowUp, ArrowDown } from "lucide-react-native";

import { BottomSheet } from "@/components/BottomSheet";
import { useTheme } from "@/contexts/ThemeContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { createStyles } from "@/styles/index.styles";
import {
  VEHICLE_CATEGORY_INFO,
  VehicleCategory,
  VehicleSortOption,
} from "@/types/vehicle";

interface VehicleFiltersProps {
  visible: boolean;
  onClose: () => void;
  selectedCategories: VehicleCategory[];
  onSelectCategory: (category: VehicleCategory) => void;
  sortOption: VehicleSortOption;
  onSelectSort: (option: VehicleSortOption) => void;
  onClearFilters: () => void;
}

export const VehicleFilters = ({
  visible,
  onClose,
  selectedCategories,
  onSelectCategory,
  sortOption,
  onSelectSort,
  onClearFilters,
}: VehicleFiltersProps) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { t } = useLocalization();

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View style={styles.modalHeaderRow}>
        <Text style={styles.modalTitle}>{t("vehicles.filter_menu")}</Text>
        <TouchableOpacity onPress={onClearFilters} activeOpacity={0.8}>
          <Text style={styles.modalHeaderLink}>
            {t("vehicles.clear_filters")}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.modalScrollView}
        contentContainerStyle={styles.modalScrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Category Filter Section */}
        <View style={styles.filterSection}>
          <Text style={styles.filterSectionTitle}>
            {t("vehicles.filter_by_category")}
          </Text>
          <View style={styles.categoryChips}>
            <TouchableOpacity
              style={[
                styles.categoryChip,
                selectedCategories.length === 0 && styles.categoryChipActive,
              ]}
              onPress={() => onClearFilters()}
            >
              <Text
                numberOfLines={1}
                style={[
                  styles.categoryChipText,
                  selectedCategories.length === 0 &&
                    styles.categoryChipTextActive,
                ]}
              >
                {t("vehicles.filter_all")}
              </Text>
            </TouchableOpacity>
            {(Object.keys(VEHICLE_CATEGORY_INFO) as VehicleCategory[]).map(
              (category) => {
                const { Icon, color } = VEHICLE_CATEGORY_INFO[category];
                const isActive = selectedCategories.includes(category);
                return (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryChip,
                      isActive && styles.categoryChipActive,
                    ]}
                    onPress={() => onSelectCategory(category)}
                  >
                    <Icon
                      size={16}
                      color={isActive ? "#FFFFFF" : colors.text}
                    />
                    <Text
                      numberOfLines={1}
                      style={[
                        styles.categoryChipText,
                        isActive && styles.categoryChipTextActive,
                      ]}
                    >
                      {t(`vehicles.category_${category}`)}
                    </Text>
                  </TouchableOpacity>
                );
              }
            )}
          </View>
        </View>

        {/* Sorting Section */}
        <View style={styles.filterSection}>
          <Text style={styles.filterSectionTitle}>{t("vehicles.sort_by")}</Text>
          <View style={styles.sortOptionsList}>
            {[
              {
                id: "date",
                label: t("vehicles.sort_date_added") || "Date Added",
                options: { asc: "oldest", desc: "newest" },
                default: "desc",
              },
              {
                id: "name",
                label: t("vehicles.sort_name") || "Name",
                options: { asc: "name_az", desc: "name_za" },
                default: "asc",
              },
              {
                id: "year",
                label: t("vehicles.sort_year") || "Year",
                options: { asc: "year_old", desc: "year_new" },
                default: "desc",
              },
              {
                id: "mileage",
                label: t("vehicles.sort_mileage") || "Mileage",
                options: { asc: "mileage_low", desc: "mileage_high" },
                default: "desc",
              },
            ].map((group) => {
              const isAsc = sortOption === group.options.asc;
              const isDesc = sortOption === group.options.desc;
              const isActive = isAsc || isDesc;
              const currentDirection = isAsc ? "asc" : "desc";

              return (
                <TouchableOpacity
                  key={group.id}
                  style={[
                    styles.sortOptionItem,
                    isActive && styles.sortOptionItemActive,
                  ]}
                  onPress={() => {
                    if (isActive) {
                      // Toggle direction
                      onSelectSort(
                        currentDirection === "asc"
                          ? (group.options.desc as VehicleSortOption)
                          : (group.options.asc as VehicleSortOption)
                      );
                    } else {
                      // Select default
                      onSelectSort(
                        group.options[
                          group.default as "asc" | "desc"
                        ] as VehicleSortOption
                      );
                    }
                  }}
                >
                  <Text
                    style={[
                      styles.sortOptionText,
                      isActive && styles.sortOptionTextActive,
                    ]}
                  >
                    {group.label}
                  </Text>
                  {isActive && (
                    <View style={styles.sortDirectionBadge}>
                      <Text style={styles.sortDirectionText}>
                        {currentDirection === "asc"
                          ? t("common.ascending") || "Asc"
                          : t("common.descending") || "Desc"}
                      </Text>
                      {currentDirection === "asc" ? (
                        <ArrowUp size={16} color={colors.primary} />
                      ) : (
                        <ArrowDown size={16} color={colors.primary} />
                      )}
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
            {/* Last Maintenance (Standalone) */}
            <TouchableOpacity
              style={[
                styles.sortOptionItem,
                sortOption === "last_maintenance" &&
                  styles.sortOptionItemActive,
                { borderBottomWidth: 0 },
              ]}
              onPress={() => onSelectSort("last_maintenance")}
            >
              <Text
                style={[
                  styles.sortOptionText,
                  sortOption === "last_maintenance" &&
                    styles.sortOptionTextActive,
                ]}
              >
                {t("vehicles.sort_last_maintenance")}
              </Text>
              {sortOption === "last_maintenance" && (
                <View style={styles.sortOptionIndicator} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </BottomSheet>
  );
};
