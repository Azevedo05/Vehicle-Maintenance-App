import { router } from "expo-router";
import { Bell, Filter, SlidersHorizontal } from "lucide-react-native";
import * as Notifications from "expo-notifications";
import * as Haptics from "expo-haptics";
import React, { useMemo, useState, useRef } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import { SafeAreaView } from "react-native-safe-area-context";

import { useLocalization } from "@/contexts/LocalizationContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useVehicles } from "@/contexts/VehicleContext";
import {
  getMaintenanceTypeLabel,
  MaintenanceType,
  MAINTENANCE_TYPES,
} from "@/types/maintenance";
import { usePreferences } from "@/contexts/PreferencesContext";
import { useNotifications } from "@/contexts/NotificationContext";
import { useAppAlert } from "@/contexts/AlertContext";
import { BottomSheet } from "@/components/BottomSheet";
import { Alert } from "react-native";
import { MaintenanceListSkeleton } from "@/components/maintenance/MaintenanceListSkeleton";
import { MaintenanceFilters } from "@/components/maintenance/MaintenanceFilters";
import { AnimatedItem } from "@/components/ui/AnimatedItem";
import { SwipeableRow } from "@/components/ui/SwipeableRow";
import { createStyles } from "@/components/styles/maintenance.styles";
import { ThemedBackground } from "@/components/ThemedBackground";
import { EmptyState } from "@/components/ui/EmptyState";

type MaintenanceSortOption =
  | "due_date_overdue"
  | "due_date_upcoming"
  | "type"
  | "vehicle";

type QuickFilter = "all" | "overdue" | "upcoming";

export default function MaintenanceScreen() {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const { formatDistance } = usePreferences();
  const {
    getUpcomingTasks,
    isLoading,
    vehicles,
    deleteTask,
    restoreLastSnapshot,
  } = useVehicles();
  const { notificationsEnabled } = useNotifications();
  const { showAlert, showToast } = useAppAlert();

  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedVehicleIds, setSelectedVehicleIds] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<MaintenanceType[]>([]);
  const [sortOption, setSortOption] =
    useState<MaintenanceSortOption>("due_date_overdue");
  const [quickFilter, setQuickFilter] = useState<QuickFilter>("all");

  const styles = createStyles(colors);

  const upcomingTasks = getUpcomingTasks();

  // Apply filters
  const filteredTasks = useMemo(() => {
    let tasks = upcomingTasks;

    // Apply vehicle and type filters
    if (selectedVehicleIds.length > 0) {
      tasks = tasks.filter((t) => selectedVehicleIds.includes(t.vehicle.id));
    }

    if (selectedTypes.length > 0) {
      tasks = tasks.filter((t) => selectedTypes.includes(t.task.type));
    }

    // Apply quick filter
    if (quickFilter === "overdue") {
      tasks = tasks.filter((t) => {
        const isOverdueDate =
          t.daysUntilDue !== undefined && t.daysUntilDue <= 0;
        const isOverdueMileage =
          t.milesUntilDue !== undefined && t.milesUntilDue <= 0;
        return isOverdueDate || isOverdueMileage;
      });
    } else if (quickFilter === "upcoming") {
      tasks = tasks.filter((t) => {
        const isUpcomingDate =
          t.daysUntilDue !== undefined &&
          t.daysUntilDue > 0 &&
          t.daysUntilDue <= 30;
        const isUpcomingMileage =
          t.milesUntilDue !== undefined &&
          t.milesUntilDue > 0 &&
          t.milesUntilDue <= 2000;
        return isUpcomingDate || isUpcomingMileage;
      });
    }

    // Sort tasks
    const sorted = [...tasks].sort((a, b) => {
      switch (sortOption) {
        case "due_date_overdue": {
          // Overdue first, then by days/miles until due
          const aDue = a.daysUntilDue ?? a.milesUntilDue ?? Infinity;
          const bDue = b.daysUntilDue ?? b.milesUntilDue ?? Infinity;
          return aDue - bDue;
        }
        case "due_date_upcoming": {
          // Upcoming first (reverse order)
          const aDue = a.daysUntilDue ?? a.milesUntilDue ?? -Infinity;
          const bDue = b.daysUntilDue ?? b.milesUntilDue ?? -Infinity;
          return bDue - aDue;
        }
        case "type":
          return getMaintenanceTypeLabel(a.task.type, t).localeCompare(
            getMaintenanceTypeLabel(b.task.type, t)
          );
        case "vehicle":
          return `${a.vehicle.make} ${a.vehicle.model}`.localeCompare(
            `${b.vehicle.make} ${b.vehicle.model}`
          );
        default:
          return 0;
      }
    });

    return sorted;
  }, [
    upcomingTasks,
    selectedVehicleIds,
    selectedTypes,
    quickFilter,
    sortOption,
    t,
  ]);

  const dueTasks = filteredTasks.filter((t) => t.isDue);
  const scheduledTasks = filteredTasks.filter((t) => !t.isDue);

  const overdueCount = dueTasks.filter((t) => {
    const isOverdueDate = t.daysUntilDue !== undefined && t.daysUntilDue <= 0;
    const isOverdueMileage =
      t.milesUntilDue !== undefined && t.milesUntilDue <= 0;
    return isOverdueDate || isOverdueMileage;
  }).length;

  // Combine tasks with section info for FlatList
  const listData = useMemo(() => {
    const data: {
      type: "header" | "task";
      section?: string;
      item?: (typeof dueTasks)[0] | (typeof scheduledTasks)[0];
    }[] = [];

    if (dueTasks.length > 0) {
      data.push({ type: "header", section: "due" });
      dueTasks.forEach((item) => {
        data.push({ type: "task", section: "due", item });
      });
    }

    if (scheduledTasks.length > 0) {
      data.push({ type: "header", section: "scheduled" });
      scheduledTasks.forEach((item) => {
        data.push({ type: "task", section: "scheduled", item });
      });
    }

    return data;
  }, [dueTasks, scheduledTasks]);

  const renderItemSeparator = ({
    leadingItem,
  }: {
    leadingItem: (typeof listData)[0];
  }) => {
    // Only show separator after task items, not after headers
    if (leadingItem?.type === "task") {
      return <View style={styles.itemSeparator} />;
    }
    return null;
  };

  const renderTaskItem = ({
    item: dataItem,
    index,
  }: {
    item: (typeof listData)[0];
    index: number;
  }) => {
    if (dataItem.type === "header") {
      return (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {dataItem.section === "due"
              ? t("maintenance.due_now")
              : t("maintenance.scheduled")}
          </Text>
        </View>
      );
    }

    if (!dataItem.item) return null;

    const item = dataItem.item;
    const isDueSection = dataItem.section === "due";

    // Determine specific status
    let isOverdue = false;
    let isDueSoon = false;

    if (isDueSection) {
      const isOverdueDate =
        item.daysUntilDue !== undefined && item.daysUntilDue <= 0;
      const isOverdueMileage =
        item.milesUntilDue !== undefined && item.milesUntilDue <= 0;
      isOverdue = isOverdueDate || isOverdueMileage;
      isDueSoon = !isOverdue; // If it's in the 'due' section but not overdue, it's due soon
    }

    return (
      <AnimatedItem index={index}>
        <SwipeableRow
          borderRadius={12}
          onDelete={() => {
            showAlert({
              title: t("common.delete"),
              message: t("maintenance.delete_confirm"),
              buttons: [
                { text: t("common.cancel"), style: "cancel" },
                {
                  text: t("common.delete"),
                  style: "destructive",
                  onPress: async () => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                    await deleteTask(item.task.id);
                    showToast({
                      message: t("maintenance.delete_success"),
                      actionLabel: t("common.undo"),
                      onAction: async () => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                        await restoreLastSnapshot();
                      },
                    });
                  },
                },
              ],
            });
          }}
        >
          <TouchableOpacity
            style={[
              styles.taskCard,
              isOverdue && styles.overdueTaskCard,
              isDueSoon && styles.dueSoonTaskCard,
            ]}
            onPress={() => router.push(`/vehicle/${item.vehicle.id}`)}
            activeOpacity={0.7}
          >
            <View style={styles.taskInfo}>
              <Text style={styles.taskTitle} numberOfLines={1}>
                {getMaintenanceTypeLabel(item.task.type, t)}
              </Text>
              <Text style={styles.taskVehicle} numberOfLines={1}>
                {item.vehicle.make} {item.vehicle.model}
              </Text>
              <Text
                style={
                  isOverdue
                    ? styles.taskOverdue
                    : isDueSoon
                    ? styles.taskDueSoon
                    : styles.taskScheduled
                }
              >
                {item.daysUntilDue !== undefined
                  ? item.daysUntilDue <= 0
                    ? t("maintenance.overdue")
                    : t("maintenance.due_on_date", {
                        date: new Date(
                          item.task.nextDueDate || 0
                        ).toLocaleDateString(),
                      })
                  : item.milesUntilDue !== undefined
                  ? item.milesUntilDue <= 0
                    ? t("maintenance.overdue")
                    : t("maintenance.due_at_km", {
                        km: formatDistance(item.task.nextDueMileage || 0),
                      })
                  : t("maintenance.due_soon")}
              </Text>
            </View>
          </TouchableOpacity>
        </SwipeableRow>
      </AnimatedItem>
    );
  };

  const renderListHeader = () => (
    <>
      <View style={styles.header}>
        <Text style={styles.screenTitle}>{t("maintenance.title")}</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.iconHeaderButton}
            onPress={() => setFilterModalVisible(true)}
            activeOpacity={0.7}
          >
            <SlidersHorizontal size={18} color={colors.text} />
            <Text style={styles.iconHeaderButtonText}>
              {t("maintenance.filters")}
            </Text>
            {(selectedVehicleIds.length > 0 || selectedTypes.length > 0) && (
              <View style={styles.filterBadge} />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconHeaderButton}
            onPress={() => {
              if (!notificationsEnabled) {
                showAlert({
                  title: t("settings.notifications"),
                  message: t("settings.notifications_enable_first"),
                });
                return;
              }
              router.push("/notification-settings");
            }}
            activeOpacity={0.7}
          >
            <Bell size={18} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.summaryCard}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>{t("maintenance.overdue")}</Text>
          <Text style={styles.summaryValue}>{overdueCount}</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>{t("maintenance.due_now")}</Text>
          <Text style={styles.summaryValue}>{dueTasks.length}</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>{t("maintenance.scheduled")}</Text>
          <Text style={styles.summaryValue}>{scheduledTasks.length}</Text>
        </View>
      </View>

      {/* Quick Filter Chips */}
      <View style={styles.quickFiltersRow}>
        {[
          {
            key: "all" as QuickFilter,
            label: t("maintenance.filter_all_tasks"),
          },
          {
            key: "overdue" as QuickFilter,
            label: t("maintenance.filter_overdue"),
          },
          {
            key: "upcoming" as QuickFilter,
            label: t("maintenance.filter_upcoming"),
          },
        ].map((filter) => (
          <TouchableOpacity
            key={filter.key}
            style={[
              styles.quickFilterChip,
              quickFilter === filter.key && styles.quickFilterChipActive,
            ]}
            onPress={() => setQuickFilter(filter.key)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.quickFilterChipText,
                quickFilter === filter.key && styles.quickFilterChipTextActive,
              ]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </>
  );

  const renderListEmpty = () => (
    <EmptyState
      icon={<Bell size={64} color={colors.textSecondary} />}
      title={t("maintenance.empty_title_all_done")}
      description={t("maintenance.empty_text_all_done")}
      style={styles.emptyState}
    />
  );

  if (isLoading) {
    return (
      <ThemedBackground>
        <SafeAreaView
          style={[styles.container, { backgroundColor: "transparent" }]}
          edges={["top"]}
        >
          <MaintenanceListSkeleton />
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
        <FlashList
          data={listData}
          renderItem={renderTaskItem}
          keyExtractor={(item, index) =>
            item.type === "header"
              ? `header-${item.section}-${index}`
              : `task-${item.item?.task.id}-${index}`
          }
          ItemSeparatorComponent={renderItemSeparator}
          ListHeaderComponent={renderListHeader}
          ListEmptyComponent={renderListEmpty}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        />

        {/* Filter Modal */}
        <MaintenanceFilters
          visible={filterModalVisible}
          onClose={() => setFilterModalVisible(false)}
          selectedVehicleIds={selectedVehicleIds}
          onSelectVehicle={(id) => {
            setSelectedVehicleIds((prev) =>
              prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
            );
          }}
          selectedTypes={selectedTypes}
          onSelectType={(type) => {
            setSelectedTypes((prev) =>
              prev.includes(type)
                ? prev.filter((t) => t !== type)
                : [...prev, type]
            );
          }}
          onClearFilters={() => {
            setSelectedVehicleIds([]);
            setSelectedTypes([]);
            setSortOption("due_date_overdue");
          }}
          vehicles={vehicles}
        />
      </SafeAreaView>
    </ThemedBackground>
  );
}
