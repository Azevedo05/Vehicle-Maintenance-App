import { router } from "expo-router";
import {
  Archive,
  BarChart3,
  Car,
  Fuel,
  MoreHorizontal,
  Plus,
  SlidersHorizontal,
  Wrench,
} from "lucide-react-native";
import React, { useEffect, useState, useMemo } from "react";
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";

import { useLocalization } from "@/contexts/LocalizationContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useVehicles } from "@/contexts/VehicleContext";
import { VEHICLE_CATEGORY_INFO, VehicleCategory } from "@/types/vehicle";

export default function VehiclesScreen() {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const { vehicles, isLoading, getUpcomingTasks } = useVehicles();
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<
    VehicleCategory[]
  >([]);
  const [showArchived, setShowArchived] = useState(false);
  const [actionVehicleId, setActionVehicleId] = useState<string | null>(null);
  const [isFilterMenuVisible, setFilterMenuVisible] = useState(false);
  const [isActionsMenuVisible, setActionsMenuVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const styles = createStyles(colors);

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((vehicle) => {
      const vehicleCategory = vehicle.category ?? "other";
      const isArchived = !!vehicle.archived;
      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(vehicleCategory);
      const matchesArchive = showArchived ? true : !isArchived;

      return matchesCategory && matchesArchive;
    });
  }, [vehicles, selectedCategories, showArchived]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  const renderItemSeparator = () => <View style={styles.itemSeparator} />;

  const renderVehicleItem = ({ item: vehicle }: { item: typeof filteredVehicles[0] }) => {
              const upcomingTasks = getUpcomingTasks(vehicle.id);
              const dueTasks = upcomingTasks.filter((t) => {
                const isOverdueDate =
                  t.daysUntilDue !== undefined && t.daysUntilDue <= 0;
                const isOverdueMileage =
                  t.milesUntilDue !== undefined && t.milesUntilDue <= 0;
                return t.isDue || isOverdueDate || isOverdueMileage;
              });

              const categoryInfo =
                vehicle.category && VEHICLE_CATEGORY_INFO[vehicle.category];

              return (
                <TouchableOpacity
                  style={styles.vehicleCard}
                  onPress={() => router.push(`/vehicle/${vehicle.id}`)}
                  onLongPress={() => setActionVehicleId(vehicle.id)}
                  delayLongPress={250}
                  activeOpacity={0.7}
                >
                  {vehicle.photo ? (
                    <Image
                      source={{ uri: vehicle.photo }}
                      style={styles.vehicleImage}
                      contentFit="cover"
                    />
                  ) : (
                    <View style={styles.vehicleImagePlaceholder}>
                      <Car size={32} color="#8E8E93" />
                    </View>
                  )}
                  <View style={styles.vehicleInfo}>
                    <View style={styles.vehicleHeaderRow}>
                      <Text style={styles.vehicleName} numberOfLines={1}>
                        {vehicle.name}
                      </Text>
                      {vehicle.archived && (
                        <View style={styles.archivedBadge}>
                          <Text style={styles.archivedBadgeText}>
                            {t("vehicles.archived")}
                          </Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.vehicleDetails} numberOfLines={1}>
                      {vehicle.make} {vehicle.model} {vehicle.year}
                    </Text>
                    <Text style={styles.vehicleMileage}>
                      {vehicle.currentMileage.toLocaleString()} km
                    </Text>
                    {categoryInfo && (
                      <View style={styles.categoryBadge}>
                        <categoryInfo.Icon
                          size={14}
                          color={categoryInfo.color}
                        />
                        <Text style={styles.categoryBadgeText}>
                          {t(`vehicles.category_${vehicle.category}`)}
                        </Text>
                      </View>
                    )}
                  </View>
                  {dueTasks.length > 0 && (
                    <View style={styles.alertBadge}>
                      <Text style={styles.alertBadgeText}>
                        {dueTasks.length}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
  };

  const renderListHeader = () => (
    <View style={styles.header}>
      <Text style={styles.screenTitle}>{t("vehicles.title")}</Text>
      <View style={styles.headerButtonsRow}>
        <TouchableOpacity
          style={styles.iconHeaderButton}
          onPress={() => setFilterMenuVisible(true)}
          activeOpacity={0.8}
        >
          <SlidersHorizontal size={18} color={colors.text} />
          <Text style={styles.iconHeaderButtonText}>
            {t("vehicles.filter_menu")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconHeaderButton}
          onPress={() => setActionsMenuVisible(true)}
          activeOpacity={0.8}
        >
          <MoreHorizontal size={18} color={colors.text} />
          <Text style={styles.iconHeaderButtonText}>
            {t("vehicles.actions_menu")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderListEmpty = () => {
    if (vehicles.length === 0) {
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
        <Text style={styles.emptyText}>
          {t("vehicles.no_results_text")}
        </Text>
          </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <FlatList
        data={filteredVehicles}
        renderItem={renderVehicleItem}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={renderItemSeparator}
        ListHeaderComponent={renderListHeader}
        ListEmptyComponent={renderListEmpty}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={10}
        removeClippedSubviews={true}
      />

      {!isKeyboardVisible && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push("/add-vehicle")}
          activeOpacity={0.8}
        >
          <Plus size={28} color="#FFFFFF" />
        </TouchableOpacity>
      )}

      {/* Filters menu */}
      <Modal
        visible={isFilterMenuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setFilterMenuVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>{t("vehicles.filter_menu")}</Text>
              <TouchableOpacity
                onPress={() => {
                  setSelectedCategories([]);
                  setShowArchived(false);
                  setFilterMenuVisible(false);
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.modalHeaderLink}>
                  {t("vehicles.clear_filters")}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.filterChips}>
              <TouchableOpacity
                style={[
                  styles.filterChip,
                  selectedCategories.length === 0 && styles.filterChipActive,
                ]}
                onPress={() => setSelectedCategories([])}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    selectedCategories.length === 0 &&
                      styles.filterChipTextActive,
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
                        styles.filterChip,
                        isActive && styles.filterChipActive,
                      ]}
                      onPress={() =>
                        setSelectedCategories((prev) =>
                          prev.includes(category)
                            ? prev.filter((c) => c !== category)
                            : [...prev, category]
                        )
                      }
                    >
                      <Icon size={16} color={isActive ? "#FFFFFF" : color} />
                      <Text
                        style={[
                          styles.filterChipText,
                          isActive && styles.filterChipTextActive,
                        ]}
                      >
                        {t(`vehicles.category_${category}`)}
                      </Text>
                    </TouchableOpacity>
                  );
                }
              )}
            </View>

            <View style={styles.filterActionsRow}>
              <TouchableOpacity
                style={[
                  styles.filterChip,
                  showArchived && styles.filterChipActive,
                ]}
                onPress={() => setShowArchived((prev) => !prev)}
                activeOpacity={0.8}
              >
                <Archive
                  size={16}
                  color={showArchived ? "#FFFFFF" : colors.text}
                />
                <Text
                  style={[
                    styles.filterChipText,
                    showArchived && styles.filterChipTextActive,
                  ]}
                >
                  {showArchived
                    ? t("vehicles.hide_archived")
                    : t("vehicles.show_archived")}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => setFilterMenuVisible(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.modalCancelText}>{t("common.close")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Actions menu (compare / bulk) */}
      <Modal
        visible={isActionsMenuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setActionsMenuVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{t("vehicles.actions_menu")}</Text>
            <TouchableOpacity
              style={styles.modalAction}
              onPress={() => {
                setActionsMenuVisible(false);
                router.push("/vehicles/compare");
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.modalActionText}>
                {t("vehicles.compare_vehicles")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalAction}
              onPress={() => {
                setActionsMenuVisible(false);
                router.push("/vehicles/bulk");
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.modalActionText}>
                {t("vehicles.bulk_operations")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => setActionsMenuVisible(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.modalCancelText}>{t("common.close")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Quick actions popup for long-press on vehicle card */}
      <Modal
        visible={!!actionVehicleId}
        transparent
        animationType="fade"
        onRequestClose={() => setActionVehicleId(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{t("vehicles.quick_actions")}</Text>
            <View style={styles.quickRow}>
              <TouchableOpacity
                style={styles.quickItem}
                onPress={() => {
                  if (actionVehicleId) {
                    router.push(`/add-task?vehicleId=${actionVehicleId}`);
                  }
                  setActionVehicleId(null);
                }}
                activeOpacity={0.8}
              >
                <View style={styles.quickIconButton}>
                  <Wrench size={20} color="#FFFFFF" />
                </View>
                <Text style={styles.quickLabel}>
                  {t("vehicles.quick_add_maintenance")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.quickItem}
                onPress={() => {
                  if (actionVehicleId) {
                    router.push(`/add-fuel-log?vehicleId=${actionVehicleId}`);
                  }
                  setActionVehicleId(null);
                }}
                activeOpacity={0.8}
              >
                <View style={styles.quickIconButton}>
                  <Fuel size={20} color="#FFFFFF" />
                </View>
                <Text style={styles.quickLabel}>
                  {t("vehicles.quick_add_fuel")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.quickItem}
                onPress={() => {
                  if (actionVehicleId) {
                    router.push(`/statistics?vehicleId=${actionVehicleId}`);
                  }
                  setActionVehicleId(null);
                }}
                activeOpacity={0.8}
              >
                <View style={styles.quickIconButton}>
                  <BarChart3 size={20} color="#FFFFFF" />
                </View>
                <Text style={styles.quickLabel}>
                  {t("vehicles.quick_view_stats")}
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => setActionVehicleId(null)}
              activeOpacity={0.8}
            >
              <Text style={styles.modalCancelText}>{t("common.cancel")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.background,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: 16,
      paddingBottom: 100,
    },
    header: {
      paddingTop: 8,
      marginBottom: 12,
    },
    screenTitle: {
      fontSize: 28,
      fontWeight: "700" as const,
      color: colors.text,
      marginBottom: 24,
    },
    headerButtonsRow: {
      flexDirection: "row",
      justifyContent: "flex-start",
      gap: 12,
    },
    iconHeaderButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 999,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 6,
    },
    iconHeaderButtonText: {
      fontSize: 13,
      color: colors.text,
      fontWeight: "500" as const,
    },
    filterSection: {
      marginBottom: 14,
      gap: 8,
    },
    filterChips: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      paddingVertical: 4,
    },
    filterChip: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.card,
      marginRight: 4,
    },
    filterActionsRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
      marginTop: 12,
      marginBottom: 16,
    },
    clearFiltersButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 999,
      backgroundColor: "transparent",
    },
    clearFiltersText: {
      fontSize: 13,
      color: colors.textSecondary,
      fontWeight: "500" as const,
      textDecorationLine: "underline",
    },
    filterChipActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    filterChipText: {
      color: colors.text,
      fontWeight: "500" as const,
    },
    filterChipTextActive: {
      color: "#FFFFFF",
    },
    modalHeaderRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },
    modalHeaderLink: {
      fontSize: 13,
      color: colors.primary,
      fontWeight: "500" as const,
      textDecorationLine: "underline",
    },
    toggleButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.card,
      alignSelf: "flex-start",
    },
    toggleButtonActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    toggleButtonText: {
      color: colors.text,
      fontWeight: "600" as const,
    },
    toggleButtonTextActive: {
      color: "#FFFFFF",
    },
    emptyState: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 100,
    },
    emptyTitle: {
      fontSize: 24,
      fontWeight: "600" as const,
      color: colors.text,
      marginTop: 16,
      marginBottom: 8,
    },
    emptyText: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: "center",
      paddingHorizontal: 40,
    },
    vehicleList: {
      gap: 12,
    },
    itemSeparator: {
      height: 12,
    },
    vehicleCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      flexDirection: "row",
      alignItems: "center",
      padding: 12,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    vehicleImage: {
      width: 80,
      height: 80,
      borderRadius: 12,
      backgroundColor: colors.border,
    },
    vehicleImagePlaceholder: {
      width: 80,
      height: 80,
      borderRadius: 12,
      backgroundColor: colors.border,
      justifyContent: "center",
      alignItems: "center",
    },
    vehicleInfo: {
      flex: 1,
      marginLeft: 12,
      minWidth: 0,
    },
    vehicleHeaderRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    vehicleName: {
      fontSize: 18,
      fontWeight: "600" as const,
      color: colors.text,
      marginBottom: 4,
      flexShrink: 1,
    },
    archivedBadge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 10,
      backgroundColor: colors.warning + "30",
    },
    archivedBadgeText: {
      fontSize: 12,
      color: colors.warning,
      fontWeight: "600" as const,
    },
    vehicleDetails: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 2,
      flexShrink: 1,
    },
    vehicleMileage: {
      fontSize: 14,
      fontWeight: "500" as const,
      color: colors.primary,
    },
    categoryBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      marginTop: 6,
    },
    categoryBadgeText: {
      fontSize: 12,
      color: colors.textSecondary,
      fontWeight: "500" as const,
    },
    alertBadge: {
      backgroundColor: colors.error,
      borderRadius: 12,
      width: 24,
      height: 24,
      justifyContent: "center",
      alignItems: "center",
      marginLeft: 8,
    },
    alertBadgeText: {
      color: "#FFFFFF",
      fontSize: 12,
      fontWeight: "700" as const,
    },
    addButton: {
      position: "absolute",
      right: 16,
      bottom: 16,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: colors.primary,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "#00000080",
      justifyContent: "center",
      alignItems: "center",
      padding: 24,
    },
    modalCard: {
      width: "100%",
      maxWidth: 360,
      backgroundColor: colors.card,
      borderRadius: 20,
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    modalTitle: {
      fontSize: 16,
      fontWeight: "600" as const,
      color: colors.textSecondary,
      marginBottom: 12,
    },
    modalAction: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.card,
      marginTop: 8,
    },
    modalActionText: {
      fontSize: 15,
      color: colors.text,
      fontWeight: "500" as const,
    },
    quickRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 4,
      marginBottom: 4,
      gap: 12,
    },
    quickItem: {
      flex: 1,
      alignItems: "center",
      gap: 8,
    },
    quickIconButton: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.primary,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 6,
      elevation: 3,
    },
    quickLabel: {
      fontSize: 12,
      color: colors.text,
      textAlign: "center",
      fontWeight: "500" as const,
    },
    modalCancel: {
      marginTop: 8,
      paddingVertical: 12,
    },
    modalCancelText: {
      fontSize: 16,
      fontWeight: "600" as const,
      color: colors.primary,
      textAlign: "center",
    },
  });
