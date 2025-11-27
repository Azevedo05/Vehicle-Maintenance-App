import { router } from 'expo-router';
import { Bell, Filter } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useLocalization } from '@/contexts/LocalizationContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useVehicles } from '@/contexts/VehicleContext';
import { getMaintenanceTypeLabel, MaintenanceType, MAINTENANCE_TYPES } from '@/types/vehicle';
import { useNotifications } from '@/contexts/NotificationContext';
import { useAppAlert } from '@/contexts/AlertContext';

export default function MaintenanceScreen() {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const { getUpcomingTasks, isLoading, vehicles } = useVehicles();
  const { notificationsEnabled } = useNotifications();
  const { showAlert } = useAppAlert();

  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<MaintenanceType | null>(null);

  const styles = createStyles(colors);

  const upcomingTasks = getUpcomingTasks();
  
  // Apply filters
  const filteredTasks = useMemo(() => {
    let tasks = upcomingTasks;
    
    if (selectedVehicleId) {
      tasks = tasks.filter((t) => t.vehicle.id === selectedVehicleId);
    }
    
    if (selectedType) {
      tasks = tasks.filter((t) => t.task.type === selectedType);
    }
    
    return tasks;
  }, [upcomingTasks, selectedVehicleId, selectedType]);

  const dueTasks = filteredTasks.filter((t) => t.isDue);
  const scheduledTasks = filteredTasks.filter((t) => !t.isDue);
  
  const overdueCount = dueTasks.filter((t) => {
    const isOverdueDate = t.daysUntilDue !== undefined && t.daysUntilDue <= 0;
    const isOverdueMileage = t.milesUntilDue !== undefined && t.milesUntilDue <= 0;
    return isOverdueDate || isOverdueMileage;
  }).length;

  // Combine tasks with section info for FlatList
  const listData = useMemo(() => {
    const data: { type: 'header' | 'task'; section?: string; item?: typeof dueTasks[0] | typeof scheduledTasks[0] }[] = [];
    
    if (dueTasks.length > 0) {
      data.push({ type: 'header', section: 'due' });
      dueTasks.forEach((item) => {
        data.push({ type: 'task', section: 'due', item });
      });
    }
    
    if (scheduledTasks.length > 0) {
      data.push({ type: 'header', section: 'scheduled' });
      scheduledTasks.forEach((item) => {
        data.push({ type: 'task', section: 'scheduled', item });
      });
    }
    
    return data;
  }, [dueTasks, scheduledTasks]);

  const renderItemSeparator = ({ leadingItem }: { leadingItem: typeof listData[0] }) => {
    // Only show separator after task items, not after headers
    if (leadingItem?.type === 'task') {
      return <View style={styles.itemSeparator} />;
    }
    return null;
  };

  const renderTaskItem = ({ item: dataItem }: { item: typeof listData[0] }) => {
    if (dataItem.type === 'header') {
    return (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {dataItem.section === 'due' 
              ? t('maintenance.due_now') 
              : t('maintenance.scheduled')}
          </Text>
      </View>
    );
  }

    if (!dataItem.item) return null;

    const item = dataItem.item;
    const isDue = dataItem.section === 'due';

  return (
      <TouchableOpacity
        style={[styles.taskCard, isDue && styles.dueTaskCard]}
        onPress={() => router.push(`/vehicle/${item.vehicle.id}`)}
        activeOpacity={0.7}
      >
        <View style={styles.taskInfo}>
          <Text style={styles.taskTitle} numberOfLines={1}>
            {getMaintenanceTypeLabel(item.task.type, t)}
          </Text>
          <Text style={styles.taskVehicle} numberOfLines={1}>{item.vehicle.name}</Text>
          <Text style={isDue ? styles.taskDue : styles.taskScheduled}>
            {item.daysUntilDue !== undefined
              ? item.daysUntilDue <= 0
                ? t('maintenance.overdue')
                : isDue
                  ? t('maintenance.due_in_days', { days: item.daysUntilDue })
                  : t('maintenance.in_days', { days: item.daysUntilDue })
              : item.milesUntilDue !== undefined
                ? item.milesUntilDue <= 0
                  ? t('maintenance.overdue')
                  : isDue
                    ? t('maintenance.due_in_km', { km: item.milesUntilDue })
                    : t('maintenance.in_km', { km: item.milesUntilDue })
                : t('maintenance.due_soon')}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderListHeader = () => (
    <>
        <View style={styles.header}>
          <Text style={styles.screenTitle}>{t('maintenance.title')}</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.headerIconButton}
            onPress={() => setFilterModalVisible(true)}
            activeOpacity={0.7}
          >
            <Filter size={20} color={colors.primary} />
            {(selectedVehicleId || selectedType) && (
              <View style={styles.filterBadge} />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerIconButton}
            onPress={() => {
              if (!notificationsEnabled) {
                showAlert({
                  title: t('settings.notifications'),
                  message: t('settings.notifications_enable_first'),
                });
                return;
              }
              router.push('/notification-settings');
            }}
            activeOpacity={0.7}
          >
            <Bell size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>
        </View>

      {(dueTasks.length > 0 || scheduledTasks.length > 0) && (
        <View style={styles.summaryCard}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>{t('maintenance.overdue')}</Text>
            <Text style={styles.summaryValue}>{overdueCount}</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>{t('maintenance.due_now')}</Text>
            <Text style={styles.summaryValue}>{dueTasks.length}</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>{t('maintenance.scheduled')}</Text>
            <Text style={styles.summaryValue}>{scheduledTasks.length}</Text>
          </View>
        </View>
      )}
    </>
  );

  const renderListEmpty = () => (
          <View style={styles.emptyState}>
            <Bell size={64} color={colors.placeholder} />
            <Text style={styles.emptyTitle}>{t('maintenance.empty_title_all_done')}</Text>
            <Text style={styles.emptyText}>
              {t('maintenance.empty_text_all_done')}
            </Text>
          </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

                  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <FlatList
        data={listData}
        renderItem={renderTaskItem}
        keyExtractor={(item, index) => 
          item.type === 'header' 
            ? `header-${item.section}-${index}` 
            : `task-${item.item?.task.id}-${index}`
        }
        ItemSeparatorComponent={renderItemSeparator}
        ListHeaderComponent={renderListHeader}
        ListEmptyComponent={renderListEmpty}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={10}
      />

      {/* Filter Modal */}
      <Modal
        visible={filterModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>{t('maintenance.filters')}</Text>
              <TouchableOpacity
                onPress={() => {
                  setSelectedVehicleId(null);
                  setSelectedType(null);
                  setFilterModalVisible(false);
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.modalHeaderLink}>
                  {t('vehicles.clear_filters')}
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView 
              style={styles.modalScrollView}
              contentContainerStyle={styles.modalScrollContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>{t('vehicles.title')}</Text>
                <View style={styles.filterChips}>
                  <TouchableOpacity
                    style={[
                      styles.filterChip,
                      !selectedVehicleId && styles.filterChipActive,
                    ]}
                    onPress={() => setSelectedVehicleId(null)}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        !selectedVehicleId && styles.filterChipTextActive,
                      ]}
                    >
                      {t('vehicles.filter_all')}
                    </Text>
                  </TouchableOpacity>
                  {vehicles.map((vehicle) => (
                    <TouchableOpacity
                      key={vehicle.id}
                      style={[
                        styles.filterChip,
                        selectedVehicleId === vehicle.id && styles.filterChipActive,
                      ]}
                      onPress={() => setSelectedVehicleId(vehicle.id)}
                    >
                      <Text
                        style={[
                          styles.filterChipText,
                          selectedVehicleId === vehicle.id && styles.filterChipTextActive,
                        ]}
                      >
                        {vehicle.name}
                        </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>{t('maintenance.select_type')}</Text>
                <View style={styles.filterChips}>
                  <TouchableOpacity
                    style={[
                      styles.filterChip,
                      !selectedType && styles.filterChipActive,
                    ]}
                    onPress={() => setSelectedType(null)}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        !selectedType && styles.filterChipTextActive,
                      ]}
                    >
                      {t('vehicles.filter_all')}
                    </Text>
                  </TouchableOpacity>
                  {Object.entries(MAINTENANCE_TYPES).map(([key, type]) => (
                    <TouchableOpacity
                      key={key}
                      style={[
                        styles.filterChip,
                        selectedType === key && styles.filterChipActive,
                      ]}
                      onPress={() => setSelectedType(key as MaintenanceType)}
                    >
                      <Text
                        style={[
                          styles.filterChipText,
                          selectedType === key && styles.filterChipTextActive,
                        ]}
                      >
                        {getMaintenanceTypeLabel(key as MaintenanceType, t)}
                        </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
      </ScrollView>

            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => setFilterModalVisible(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.modalCancelText}>{t('common.close')}</Text>
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
      justifyContent: 'center',
      alignItems: 'center',
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
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    screenTitle: {
      fontSize: 28,
      fontWeight: '700' as const,
      color: colors.text,
    },
    headerIconButton: {
      padding: 6,
      borderRadius: 999,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 100,
    },
    emptyTitle: {
      fontSize: 24,
      fontWeight: '600' as const,
      color: colors.text,
      marginTop: 16,
      marginBottom: 8,
    },
    emptyText: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center',
      paddingHorizontal: 40,
    },
    section: {
      marginTop: 8,
      marginBottom: 8,
    },
    itemSeparator: {
      height: 12,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '700' as const,
      color: colors.text,
      marginBottom: 8,
    },
    taskCard: {
      backgroundColor: colors.card,
      borderRadius: 12,
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    dueTaskCard: {
      borderWidth: 1,
      borderColor: colors.error,
    },
    taskInfo: {
      flex: 1,
      minWidth: 0,
    },
    taskTitle: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: colors.text,
      marginBottom: 2,
      flexShrink: 1,
    },
    taskVehicle: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 2,
      flexShrink: 1,
    },
    taskDue: {
      fontSize: 14,
      fontWeight: '500' as const,
      color: colors.error,
    },
    taskScheduled: {
      fontSize: 14,
      color: colors.primary,
    },
    headerButtons: {
      flexDirection: 'row',
      gap: 8,
    },
    filterBadge: {
      position: 'absolute',
      top: 0,
      right: 0,
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.error,
    },
    summaryCard: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    summaryItem: {
      alignItems: 'center',
      flex: 1,
    },
    summaryLabel: {
      fontSize: 12,
      color: colors.textSecondary,
      marginBottom: 4,
    },
    summaryValue: {
      fontSize: 24,
      fontWeight: '700' as const,
      color: colors.text,
    },
    summaryDivider: {
      width: 1,
      height: 40,
      backgroundColor: colors.border,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: '#00000080',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 24,
    },
    modalCard: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: colors.card,
      borderRadius: 20,
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderWidth: 1,
      borderColor: colors.border,
      maxHeight: '80%',
    },
    modalHeaderRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: '700' as const,
      color: colors.text,
    },
    modalHeaderLink: {
      fontSize: 13,
      color: colors.primary,
      fontWeight: '500' as const,
      textDecorationLine: 'underline',
    },
    modalScrollView: {
      maxHeight: 400,
    },
    modalScrollContent: {
      paddingBottom: 0,
    },
    filterSection: {
      marginBottom: 14,
      gap: 8,
    },
    filterSectionTitle: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: colors.text,
      marginBottom: 12,
      marginLeft: 4,
    },
    filterChips: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 4,
      paddingVertical: 4,
    },
    filterChip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: 10,
      paddingVertical: 7,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.card,
    },
    filterChipActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    filterChipText: {
      color: colors.text,
      fontWeight: '500' as const,
    },
    filterChipTextActive: {
      color: '#FFFFFF',
    },
    modalCancel: {
      marginTop: 8,
      paddingVertical: 12,
    },
    modalCancelText: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: colors.primary,
      textAlign: 'center',
    },
  });
