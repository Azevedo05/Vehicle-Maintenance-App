import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  Keyboard,
  TouchableOpacity,
  View,
  Text,
  useWindowDimensions,
  ScrollView,
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Plus,
  Car,
  ChevronUp,
  ChevronDown,
  GripVertical,
  Check,
} from "lucide-react-native";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import Svg, { Path } from "react-native-svg";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from "react-native-reanimated";
import Sortable, {
  type SortableGridRenderItem,
  type OrderChangeCallback,
} from "react-native-sortables";

import { useLocalization } from "@/contexts/LocalizationContext";
import { useTheme } from "@/contexts/ThemeContext";
import { usePreferences } from "@/contexts/PreferencesContext";
import { useVehicles } from "@/contexts/VehicleContext";
import { useAppAlert } from "@/contexts/AlertContext";
import { Vehicle, VehicleCategory, VehicleSortOption } from "@/types/vehicle";
import { createStyles } from "@/styles/index.styles";

import { VehicleListItem } from "@/components/vehicles/VehicleListItem";
import { VehicleListHeader } from "@/components/vehicles/VehicleListHeader";
import { VehicleListEmpty } from "@/components/vehicles/VehicleListEmpty";
import { VehicleFilters } from "@/components/vehicles/VehicleFilters";
import { VehicleActions } from "@/components/vehicles/VehicleActions";
import { VehicleQuickActions } from "@/components/vehicles/VehicleQuickActions";
import { VehicleListSkeleton } from "@/components/vehicles/VehicleListSkeleton";
import { VehicleListFooter } from "@/components/vehicles/VehicleListFooter";
import { AnimatedItem } from "@/components/ui/AnimatedItem";
import { SwipeableRow } from "@/components/ui/SwipeableRow";
import { VehicleImage } from "@/components/ui/VehicleImage";
import { ThemedBackground } from "@/components/ThemedBackground";

export default function VehiclesScreen() {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const { formatDistance, hapticsEnabled } = usePreferences();
  const {
    vehicles,
    isLoading,
    getRecordsByVehicle,
    deleteVehicle,
    updateVehicle,
    deleteVehiclesBulk,
    reorderVehicles,
    restoreLastSnapshot,
  } = useVehicles();
  const { showAlert, showToast } = useAppAlert();
  // const { width, height } = useWindowDimensions(); // Removed duplicate declaration if exists elsewhere, checking if used later

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<
    VehicleCategory[]
  >([]);
  const [showArchived, setShowArchived] = useState(false);
  const [actionVehicleId, setActionVehicleId] = useState<string | null>(null);
  const [isFilterMenuVisible, setFilterMenuVisible] = useState(false);
  const { width, height } = useWindowDimensions();
  const [isActionsMenuVisible, setActionsMenuVisible] = useState(false);
  const [isQuickActionsMenuVisible, setQuickActionsModalVisible] =
    useState(false);
  const [selectionMode, setSelectionMode] = useState(false); // Kept for future use if needed, though not fully implemented in extraction
  const [sortOption, setSortOption] = useState<VehicleSortOption>("custom");
  const [isReorderMode, setIsReorderMode] = useState(false);
  const flatListRef = React.useRef<any>(null);

  const handleScrollToTop = () => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

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
    const filtered = vehicles.filter((vehicle) => {
      const vehicleCategory = vehicle.category ?? "other";
      const isArchived = !!vehicle.archived;
      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(vehicleCategory);
      const matchesArchive = showArchived ? true : !isArchived;

      return matchesCategory && matchesArchive;
    });

    // Sort vehicles
    const sorted = [...filtered].sort((a, b) => {
      switch (sortOption) {
        case "newest":
          return b.createdAt - a.createdAt;
        case "oldest":
          return a.createdAt - b.createdAt;
        case "name_az":
          return `${a.make} ${a.model}`.localeCompare(`${b.make} ${b.model}`);
        case "name_za":
          return `${b.make} ${b.model}`.localeCompare(`${a.make} ${a.model}`);
        case "year_new":
          return b.year - a.year;
        case "year_old":
          return a.year - b.year;
        case "mileage_high":
          return b.currentMileage - a.currentMileage;
        case "mileage_low":
          return a.currentMileage - b.currentMileage;
        case "last_maintenance": {
          const aRecords = getRecordsByVehicle(a.id);
          const bRecords = getRecordsByVehicle(b.id);
          const aLastDate =
            aRecords.length > 0 ? Math.max(...aRecords.map((r) => r.date)) : 0;
          const bLastDate =
            bRecords.length > 0 ? Math.max(...bRecords.map((r) => r.date)) : 0;
          return bLastDate - aLastDate;
        }
        case "custom":
          return (
            (a.customOrder ?? Number.MAX_SAFE_INTEGER) -
            (b.customOrder ?? Number.MAX_SAFE_INTEGER)
          );
        default:
          return 0;
      }
    });

    return sorted;
  }, [
    vehicles,
    selectedCategories,
    showArchived,
    sortOption,
    getRecordsByVehicle,
  ]);

  // Animation for the FAB
  const fabScale = useSharedValue(1);

  useEffect(() => {
    if (filteredVehicles.length === 0 && !isLoading) {
      fabScale.value = withRepeat(
        withSequence(
          withTiming(1.1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true // Reverse
      );
    } else {
      fabScale.value = withTiming(1);
    }
  }, [filteredVehicles.length, isLoading]);

  const animatedFabStyle = useAnimatedStyle(() => ({
    transform: [{ scale: fabScale.value }],
  }));

  const handleToggleReorderMode = () => {
    if (!isReorderMode && filteredVehicles.length > 0) {
      // Entering reorder mode
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setSortOption("custom");

      // Normalize order on entry
      // const currentIds = filteredVehicles.map((v) => v.id);
      // reorderVehicles(currentIds);
    }
    setIsReorderMode((prev) => !prev);
  };

  const renderItemSeparator = () => <View style={styles.itemSeparator} />;

  // Render function for normal mode (FlatList)
  const renderNormalItem = ({
    item,
    index,
  }: {
    item: Vehicle;
    index: number;
  }) => (
    <AnimatedItem index={index}>
      <VehicleListItem
        vehicle={item}
        onLongPress={(id) => {
          setActionVehicleId(id);
          setQuickActionsModalVisible(true);
        }}
      />
    </AnimatedItem>
  );

  // Render function for draggable mode (react-native-sortables)
  const renderSortableItem = useCallback<SortableGridRenderItem<Vehicle>>(
    ({ item }) => (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          height: 56,
          paddingHorizontal: 16,
        }}
      >
        {/* Card */}
        <View
          style={{
            flex: 1,
            backgroundColor: colors.card,
            borderRadius: 14,
            paddingVertical: 12,
            paddingHorizontal: 14,
            flexDirection: "row",
            alignItems: "center",
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          {/* Vehicle Info - Just text, no icon */}
          <Text
            style={{
              flex: 1,
              color: colors.text,
              fontSize: 15,
              fontWeight: "600",
              fontFamily: "Inter_600SemiBold",
            }}
            numberOfLines={1}
          >
            {item.make} {item.model}
          </Text>
        </View>

        {/* Drag Handle - Right side */}
        <Sortable.Handle>
          <View
            style={{
              width: 40,
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
              marginLeft: 8,
            }}
          >
            <GripVertical size={20} color={colors.textSecondary} />
          </View>
        </Sortable.Handle>
      </View>
    ),
    [colors]
  );

  // Handle drag end callback - persist new order
  const handleDragEnd = useCallback(
    ({ indexToKey }: { indexToKey: string[] }) => {
      if (hapticsEnabled) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      // indexToKey contains vehicle ids in the new order
      reorderVehicles(indexToKey);
    },
    [hapticsEnabled, reorderVehicles]
  );

  const renderListHeader = () => (
    <VehicleListHeader
      showArchived={showArchived}
      onToggleArchived={() => setShowArchived((prev) => !prev)}
      onOpenFilter={() => setFilterMenuVisible(true)}
      onOpenActions={() => setActionsMenuVisible(true)}
      isReorderMode={isReorderMode}
      onToggleReorderMode={handleToggleReorderMode}
      canReorder={filteredVehicles.length > 1}
      hasActiveFilters={selectedCategories.length > 0}
    />
  );

  if (isLoading) {
    return (
      <ThemedBackground>
        <SafeAreaView
          style={[styles.container, { backgroundColor: "transparent" }]}
          edges={["top"]}
        >
          <View style={styles.scrollContent}>
            <VehicleListHeader
              showArchived={showArchived}
              onToggleArchived={() => setShowArchived((prev) => !prev)}
              onOpenFilter={() => setFilterMenuVisible(true)}
              onOpenActions={() => setActionsMenuVisible(true)}
            />
            <View style={{ height: 16 }} />
            <VehicleListSkeleton />
          </View>
        </SafeAreaView>
      </ThemedBackground>
    );
  }

  return (
    <ThemedBackground>
      <SafeAreaView
        style={[styles.container, { backgroundColor: "transparent" }]}
        edges={["top"]}
      >
        {isReorderMode ? (
          <View style={{ flex: 1 }}>
            {/* Header with title and confirm button */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingHorizontal: 16,
                paddingTop: 8,
                paddingBottom: 16,
              }}
            >
              <View>
                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: "700",
                    fontFamily: "Inter_700Bold",
                    color: colors.text,
                  }}
                >
                  {t("vehicles.reorderTitle", "Reordenar")}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: "Inter_400Regular",
                    color: colors.textSecondary,
                    marginTop: 4,
                  }}
                >
                  {t("vehicles.reorderHint", "Arraste para reordenar")}
                </Text>
              </View>
              <TouchableOpacity
                onPress={handleToggleReorderMode}
                style={{
                  backgroundColor: colors.primary,
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                activeOpacity={0.8}
              >
                <Check size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {/* Sortable List */}
            {filteredVehicles.length > 0 ? (
              <Sortable.Grid
                columns={1}
                data={filteredVehicles}
                renderItem={renderSortableItem}
                customHandle
                rowGap={8}
                dragActivationDelay={0}
                overDrag="none"
                onDragEnd={handleDragEnd}
                onDragStart={() => {
                  if (hapticsEnabled) {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  }
                }}
              />
            ) : (
              <VehicleListEmpty hasVehicles={vehicles.length > 0} />
            )}
          </View>
        ) : (
          <FlashList
            ref={flatListRef}
            data={filteredVehicles}
            renderItem={renderNormalItem}
            keyExtractor={(item) => item.id}
            ItemSeparatorComponent={renderItemSeparator}
            ListHeaderComponent={renderListHeader}
            ListFooterComponent={
              <VehicleListFooter
                visible={filteredVehicles.length > 2}
                onScrollToTop={handleScrollToTop}
              />
            }
            ListEmptyComponent={
              <VehicleListEmpty hasVehicles={vehicles.length > 0} />
            }
            contentContainerStyle={[styles.scrollContent, { flexGrow: 1 }]}
            showsVerticalScrollIndicator={false}
          />
        )}

        {!isKeyboardVisible && !isReorderMode && (
          <Animated.View
            style={[styles.addButton, animatedFabStyle, { zIndex: 999 }]}
          >
            <TouchableOpacity
              style={{
                width: "100%",
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => {
                if (hapticsEnabled) {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                }
                router.push("/add-vehicle");
              }}
              activeOpacity={0.8}
            >
              <Plus size={28} color="#FFFFFF" />
            </TouchableOpacity>
          </Animated.View>
        )}

        <VehicleFilters
          visible={isFilterMenuVisible}
          onClose={() => setFilterMenuVisible(false)}
          selectedCategories={selectedCategories}
          onSelectCategory={(category) => {
            setSelectedCategories((prev) =>
              prev.includes(category)
                ? prev.filter((c) => c !== category)
                : [...prev, category]
            );
          }}
          sortOption={sortOption}
          onSelectSort={setSortOption}
          onClearFilters={() => {
            setSelectedCategories([]);
            setShowArchived(false);
            setSortOption("custom");
          }}
        />

        <VehicleActions
          visible={isActionsMenuVisible}
          onClose={() => setActionsMenuVisible(false)}
          onCompare={() => {
            setActionsMenuVisible(false);
            router.push("/vehicles/compare");
          }}
          onBulkOperations={() => {
            setActionsMenuVisible(false);
            router.push("/vehicles/bulk");
          }}
        />

        <VehicleQuickActions
          visible={isQuickActionsMenuVisible}
          onClose={() => {
            setQuickActionsModalVisible(false);
            setActionVehicleId(null);
          }}
          vehicleId={actionVehicleId}
        />
      </SafeAreaView>
    </ThemedBackground>
  );
}
