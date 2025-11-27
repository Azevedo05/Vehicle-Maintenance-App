import React, { useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';

import { useLocalization } from '@/contexts/LocalizationContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useVehicles } from '@/contexts/VehicleContext';
import { usePreferences } from '@/contexts/PreferencesContext';
import { getMaintenanceTypeLabel, VEHICLE_CATEGORY_INFO } from '@/types/vehicle';
import {
  calculateOverallStats,
  calculateVehicleStats,
  calculateTypeStats,
  calculateMonthlyStats,
  calculateCategoryStats,
  calculateFuelStats,
  calculateFuelStatsByVehicle,
} from '@/utils/statistics';

export default function StatisticsScreen() {
  const { colors } = useTheme();
  const { t, language } = useLocalization();
  const { vehicles, records, fuelLogs } = useVehicles();
  const { currencySymbol } = usePreferences();

  const params = useLocalSearchParams<{ vehicleId?: string }>();
  const initialVehicleId =
    typeof params.vehicleId === 'string' && params.vehicleId.length > 0
      ? params.vehicleId
      : 'all';

  const styles = createStyles(colors);
  const [selectedFuelVehicle, setSelectedFuelVehicle] = useState<'all' | string>(initialVehicleId);
  const [selectedFuelRange, setSelectedFuelRange] = useState<'all' | '30d' | '90d'>('all');

  // Calculate all statistics
  const overallStats = calculateOverallStats(records);
  const vehicleStats = calculateVehicleStats(vehicles, records);
  const typeStats = calculateTypeStats(records, vehicles);
  const categoryStats = calculateCategoryStats(vehicles, records);
  const monthlyStats = calculateMonthlyStats(records);
  const filteredFuelLogs = useMemo(() => {
    let logs = fuelLogs;
    if (selectedFuelVehicle !== 'all') {
      logs = logs.filter((log) => log.vehicleId === selectedFuelVehicle);
    }
    if (selectedFuelRange !== 'all') {
      const days = selectedFuelRange === '30d' ? 30 : 90;
      const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
      logs = logs.filter((log) => log.date >= cutoff);
    }
    return logs;
  }, [fuelLogs, selectedFuelVehicle, selectedFuelRange]);

  const fuelStats = useMemo(() => calculateFuelStats(filteredFuelLogs), [filteredFuelLogs]);
  const fuelByVehicle = useMemo(
    () => calculateFuelStatsByVehicle(filteredFuelLogs, vehicles),
    [filteredFuelLogs, vehicles]
  );
  const locale = language === 'pt-PT' ? 'pt-PT' : 'en-US';

  // Get max value for chart scaling
  const maxMonthlySpent = Math.max(...monthlyStats.map((m) => m.totalSpent), 1);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.screenTitle}>{t('statistics.title')}</Text>
        </View>

        {/* Overview Cards */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('statistics.overview')}</Text>
          <View style={styles.cardGrid}>
            <View style={[styles.card, styles.cardHalf]}>
              <Text style={styles.cardLabel}>{t('statistics.total_spent')}</Text>
              <Text style={styles.cardValue}>
                {currencySymbol}{overallStats.totalSpent.toFixed(2)}
              </Text>
            </View>
            <View style={[styles.card, styles.cardHalf]}>
              <Text style={styles.cardLabel}>{t('statistics.total_maintenance')}</Text>
              <Text style={styles.cardValue}>{overallStats.totalMaintenance}</Text>
            </View>
            <View style={[styles.card, styles.cardHalf]}>
              <Text style={styles.cardLabel}>{t('statistics.monthly_average')}</Text>
              <Text style={styles.cardValue}>
                {currencySymbol}{overallStats.averageMonthlySpent.toFixed(2)}
              </Text>
              <Text style={styles.cardSubtext}>
                {t('statistics.per_month')}
              </Text>
            </View>
            <View style={[styles.card, styles.cardHalf]}>
              <Text style={styles.cardLabel}>{t('statistics.this_year')}</Text>
              <Text style={styles.cardValue}>
                {currencySymbol}{overallStats.thisYearSpent.toFixed(2)}
              </Text>
              <Text style={styles.cardSubtext}>
                {overallStats.thisYearCount} {t('statistics.maintenance_count')}
              </Text>
            </View>
          </View>
        </View>

        {/* By Vehicle */}
        {vehicleStats.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('statistics.by_vehicle')}</Text>
            <View style={styles.card}>
              {vehicleStats
                .sort((a, b) => b.totalSpent - a.totalSpent)
                .map((vehicle, index) => (
                  <TouchableOpacity
                    key={vehicle.vehicleId}
                    style={[
                      styles.listItem,
                      index !== vehicleStats.length - 1 && styles.listItemBorder,
                    ]}
                    onPress={() => router.push(`/vehicle/${vehicle.vehicleId}`)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.listItemLeft}>
                      <Text style={styles.listItemTitle}>{vehicle.vehicleName}</Text>
                      <Text style={styles.listItemSubtitle}>
                        {vehicle.maintenanceCount} {t('statistics.maintenance_count')}
                      </Text>
                    </View>
                    <View style={styles.listItemRight}>
                      <Text style={styles.listItemValue}>
                        {currencySymbol}{vehicle.totalSpent.toFixed(2)}
                      </Text>
                      <ChevronRight size={20} color={colors.textSecondary} />
                    </View>
                  </TouchableOpacity>
                ))}
            </View>
          </View>
        )}

        {/* By Type */}
        {typeStats.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('statistics.by_type')}</Text>
            <View style={styles.card}>
              {typeStats.slice(0, 10).map((type, index) => (
                <View
                  key={type.type}
                  style={[
                    styles.typeItem,
                    index !== Math.min(typeStats.length, 10) - 1 && styles.listItemBorder,
                  ]}
                >
                  <View style={styles.typeHeader}>
                    <Text style={styles.listItemTitle}>
                      {getMaintenanceTypeLabel(type.type, t)}
                    </Text>
                    <Text style={styles.listItemValue}>
                      {currencySymbol}{type.totalSpent.toFixed(2)}
                    </Text>
                  </View>
                  <Text style={styles.typeBreakdown}>
                    {type.count}× • {type.vehicleBreakdown.map((v) => `${v.vehicleName} (${v.count}×)`).join(' • ')}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* By Category */}
        {categoryStats.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('statistics.by_category')}</Text>
            <View style={styles.card}>
              {categoryStats.map((category, index) => {
                const info = VEHICLE_CATEGORY_INFO[category.category];
                return (
                  <View
                    key={category.category}
                    style={[
                      styles.listItem,
                      index !== categoryStats.length - 1 && styles.listItemBorder,
                    ]}
                  >
                    <View style={styles.listItemLeft}>
                      <View style={styles.categoryRow}>
                        <View
                          style={[
                            styles.categoryDot,
                            { backgroundColor: info?.color ?? colors.primary },
                          ]}
                        />
                        <Text style={styles.listItemTitle}>
                          {t(`vehicles.category_${category.category}`)}
                        </Text>
                      </View>
                      <Text style={styles.listItemSubtitle}>
                        {t('statistics.category_breakdown', {
                          vehicles: category.vehicleCount,
                          maintenance: category.maintenanceCount,
                        })}
                      </Text>
                    </View>
                    <Text style={styles.listItemValue}>
                      {currencySymbol}
                      {category.totalSpent.toFixed(2)}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Fuel Stats */}
        {fuelLogs.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('fuel.stats_title')}</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipRow}
            >
              <TouchableOpacity
                style={[
                  styles.chip,
                  selectedFuelVehicle === 'all' && styles.chipActive,
                ]}
                onPress={() => setSelectedFuelVehicle('all')}
              >
                <Text
                  style={[
                    styles.chipText,
                    selectedFuelVehicle === 'all' && styles.chipTextActive,
                  ]}
                >
                  {t('fuel.filter_all')}
                </Text>
              </TouchableOpacity>
              {vehicles.map((vehicle) => (
                <TouchableOpacity
                  key={vehicle.id}
                  style={[
                    styles.chip,
                    selectedFuelVehicle === vehicle.id && styles.chipActive,
                  ]}
                  onPress={() => setSelectedFuelVehicle(vehicle.id)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      selectedFuelVehicle === vehicle.id && styles.chipTextActive,
                    ]}
                  >
                    {vehicle.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.rangeRow}>
              {(['all', '30d', '90d'] as const).map((range) => (
                <TouchableOpacity
                  key={range}
                  style={[
                    styles.rangeChip,
                    selectedFuelRange === range && styles.rangeChipActive,
                  ]}
                  onPress={() => setSelectedFuelRange(range)}
                >
                  <Text
                    style={[
                      styles.rangeChipText,
                      selectedFuelRange === range && styles.rangeChipTextActive,
                    ]}
                  >
                    {t(`fuel.range_${range}`)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.fuelStatsGrid}>
              <View style={styles.fuelStatCard}>
                <Text style={styles.cardLabel}>{t('fuel.fill_ups')}</Text>
                <Text style={styles.cardValue}>{fuelStats.totalFillUps}</Text>
              </View>
              <View style={styles.fuelStatCard}>
                <Text style={styles.cardLabel}>{t('fuel.total_volume')}</Text>
                <Text style={styles.cardValue}>
                  {fuelStats.totalVolume.toFixed(1)} {t('fuel.volume_unit')}
                </Text>
              </View>
              <View style={styles.fuelStatCard}>
                <Text style={styles.cardLabel}>{t('fuel.total_spent')}</Text>
                <Text style={styles.cardValue}>
                  {currencySymbol}{fuelStats.totalCost.toFixed(2)}
                </Text>
              </View>
              <View style={styles.fuelStatCard}>
                <Text style={styles.cardLabel}>{t('fuel.last_fill')}</Text>
                <Text style={styles.cardValue}>
                  {fuelStats.lastFillDate
                    ? (() => {
                        const d = new Date(fuelStats.lastFillDate);
                        const day = String(d.getDate()).padStart(2, '0');
                        const month = String(d.getMonth() + 1).padStart(2, '0');
                        const year = d.getFullYear();
                        return `${day}/${month}/${year}`;
                      })()
                    : t('fuel.no_data')}
                </Text>
              </View>
            </View>

            {fuelByVehicle.length > 0 && (
              <View style={[styles.card, styles.cardSpacing]}>
                {fuelByVehicle.slice(0, 5).map((vehicle, index) => (
                  <View
                    key={vehicle.vehicleId}
                    style={[
                      styles.listItem,
                      index !== Math.min(fuelByVehicle.length, 5) - 1 && styles.listItemBorder,
                    ]}
                  >
                    <View style={styles.listItemLeft}>
                      <Text style={styles.listItemTitle}>{vehicle.vehicleName}</Text>
                      <Text style={styles.listItemSubtitle}>
                        {vehicle.fillUps} {t('fuel.fill_ups_short')} •{' '}
                        {vehicle.totalVolume.toFixed(1)} {t('fuel.volume_unit')}
                      </Text>
                    </View>
                    <Text style={styles.listItemValue}>
                      {currencySymbol}{vehicle.totalCost.toFixed(2)}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Insights */}
        {overallStats.mostFrequentType && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('statistics.insights')}</Text>
            <View style={styles.insightsCard}>
              <View style={styles.insightItem}>
                <View style={styles.insightContent}>
                  <Text style={styles.insightTitle}>{t('statistics.most_frequent')}</Text>
                  <Text style={styles.insightText}>
                    {getMaintenanceTypeLabel(overallStats.mostFrequentType, t)}
                  </Text>
                </View>
              </View>
              
              {overallStats.mostExpensiveType && (
                <View style={styles.insightItem}>
                  <View style={styles.insightContent}>
                    <Text style={styles.insightTitle}>{t('statistics.most_expensive')}</Text>
                    <Text style={styles.insightText}>
                      {getMaintenanceTypeLabel(overallStats.mostExpensiveType, t)}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Empty State */}
        {records.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📊</Text>
            <Text style={styles.emptyTitle}>{t('statistics.no_data')}</Text>
            <Text style={styles.emptyText}>{t('statistics.no_data_text')}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: 16,
      paddingBottom: 24,
    },
    header: {
      paddingTop: 8,
      marginBottom: 16,
    },
    screenTitle: {
      fontSize: 28,
      fontWeight: '700' as const,
      color: colors.text,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '700' as const,
      color: colors.text,
      marginBottom: 12,
    },
    cardGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 20,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    cardHalf: {
      width: '48%',
      minWidth: 150,
    },
    cardLabel: {
      fontSize: 13,
      color: colors.textSecondary,
      marginBottom: 8,
      fontWeight: '500' as const,
    },
    cardValue: {
      fontSize: 24,
      fontWeight: '700' as const,
      color: colors.text,
    },
    cardSubtext: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 4,
    },
    chart: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      height: 180,
    },
    chartColumn: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
    chartBarContainer: {
      height: 150,
      justifyContent: 'flex-end',
      alignItems: 'center',
      width: '80%',
    },
    chartBar: {
      width: '100%',
      borderTopLeftRadius: 4,
      borderTopRightRadius: 4,
      minHeight: 4,
    },
    chartLabel: {
      fontSize: 10,
      color: colors.textSecondary,
      marginTop: 8,
      textAlign: 'center',
    },
    listItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
    },
    listItemBorder: {
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    listItemLeft: {
      flex: 1,
      marginRight: 12,
    },
    categoryRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    categoryDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
    },
    listItemRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    listItemTitle: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: colors.text,
      marginBottom: 4,
    },
    listItemSubtitle: {
      fontSize: 13,
      color: colors.textSecondary,
    },
    listItemValue: {
      fontSize: 17,
      fontWeight: '700' as const,
      color: colors.primary,
    },
    typeItem: {
      paddingVertical: 12,
    },
    typeHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 6,
    },
    typeBreakdown: {
      fontSize: 13,
      color: colors.textSecondary,
      lineHeight: 18,
    },
    insightsCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 20,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
      gap: 16,
    },
    insightItem: {
      paddingVertical: 8,
    },
    insightContent: {
      flex: 1,
    },
    insightTitle: {
      fontSize: 13,
      color: colors.textSecondary,
      marginBottom: 4,
      fontWeight: '500' as const,
    },
    insightText: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: colors.text,
    },
    emptyContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 60,
      paddingHorizontal: 40,
    },
    emptyIcon: {
      fontSize: 64,
      marginBottom: 16,
    },
    emptyTitle: {
      fontSize: 20,
      fontWeight: '700' as const,
      color: colors.text,
      marginBottom: 8,
      textAlign: 'center',
    },
    emptyText: {
      fontSize: 15,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 22,
    },
    chipRow: {
      gap: 8,
      paddingVertical: 4,
      paddingRight: 16,
    },
    chip: {
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.card,
      marginRight: 8,
    },
    chipActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    chipText: {
      color: colors.text,
      fontWeight: '500' as const,
    },
    chipTextActive: {
      color: '#FFFFFF',
    },
    rangeRow: {
      flexDirection: 'row',
      gap: 12,
      marginVertical: 12,
    },
    rangeChip: {
      flex: 1,
      borderRadius: 12,
      paddingVertical: 10,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.card,
    },
    rangeChipActive: {
      borderColor: colors.primary,
      backgroundColor: colors.primary + '10',
    },
    rangeChipText: {
      color: colors.text,
      fontWeight: '600' as const,
    },
    rangeChipTextActive: {
      color: colors.primary,
    },
    fuelSummaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 12,
      marginBottom: 12,
    },
    summaryItem: {
      flex: 1,
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    summaryItemFull: {
      flex: 1,
      maxWidth: '100%',
    },
    summaryValue: {
      fontSize: 18,
      fontWeight: '700' as const,
      color: colors.text,
    },
    cardSpacing: {
      marginTop: 12,
    },
    fuelStatsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    fuelStatCard: {
      width: '48%',
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 16,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
      minHeight: 100,
      justifyContent: 'center',
    },
  });

