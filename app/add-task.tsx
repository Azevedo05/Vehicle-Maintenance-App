import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useVehicles } from '@/contexts/VehicleContext';
import { MAINTENANCE_TYPES, MaintenanceType, getMaintenanceTypeLabel } from '@/types/vehicle';
import { useTheme } from '@/contexts/ThemeContext';
import { useLocalization } from '@/contexts/LocalizationContext';
import { useAppAlert } from '@/contexts/AlertContext';

export default function AddTaskScreen() {
  const { vehicleId } = useLocalSearchParams();
  const { addTask, getVehicleById, restoreLastSnapshot } = useVehicles();
  const { colors } = useTheme();
  const { t } = useLocalization();
  const { showToast } = useAppAlert();

  const vehicle = vehicleId ? getVehicleById(vehicleId as string) : null;

  const [selectedType, setSelectedType] = useState<MaintenanceType>('oil_change');
  const [title, setTitle] = useState(t('maintenance.types.oil_change'));
  const [intervalType, setIntervalType] = useState<'mileage' | 'date'>('mileage');
  const [intervalValue, setIntervalValue] = useState('5000');
  const [lastMileage, setLastMileage] = useState(vehicle?.currentMileage.toString() || '0');
  const [isRecurring, setIsRecurring] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTypeSelect = (type: MaintenanceType) => {
    setSelectedType(type);
    const typeInfo = MAINTENANCE_TYPES[type];
    setTitle(getMaintenanceTypeLabel(type, t));
    setIntervalType(typeInfo.intervalType);
    setIntervalValue(typeInfo.defaultInterval.toString());
  };

  const handleIntervalTypeChange = (type: 'mileage' | 'date') => {
    setIntervalType(type);
    // Use the recommended value for current maintenance type when switching
    const typeInfo = MAINTENANCE_TYPES[selectedType];
    if (typeInfo.intervalType === type) {
      setIntervalValue(typeInfo.defaultInterval.toString());
    } else {
      // Generic defaults if type doesn't match
      setIntervalValue(type === 'mileage' ? '10000' : '365');
    }
  };

  const handleUseRecommended = () => {
    const typeInfo = MAINTENANCE_TYPES[selectedType];
    setIntervalValue(typeInfo.defaultInterval.toString());
    setIntervalType(typeInfo.intervalType);
  };

  const getRecommendedText = () => {
    const typeInfo = MAINTENANCE_TYPES[selectedType];
    const value = typeInfo.defaultInterval;
    if (typeInfo.intervalType === 'mileage') {
      return t('maintenance.recommended_km', { km: value.toLocaleString() });
    } else {
      const months = Math.round(value / 30);
      return t('maintenance.recommended_months', { months });
    }
  };

  const handleSubmit = async () => {
    if (!vehicleId || !title.trim() || !intervalValue.trim()) {
      Alert.alert(t('vehicles.missing_info'), t('vehicles.fill_required'));
      return;
    }

    const interval = parseInt(intervalValue);
    if (isNaN(interval) || interval <= 0) {
      Alert.alert(
        t('maintenance.invalid_interval'),
        t('maintenance.invalid_interval_text', { type: intervalType === 'mileage' ? t('maintenance.interval_mileage') : t('maintenance.interval_date') })
      );
      return;
    }

    const lastMileageNum = parseInt(lastMileage);
    if (intervalType === 'mileage' && (isNaN(lastMileageNum) || lastMileageNum < 0)) {
      Alert.alert(t('vehicles.invalid_mileage'), t('vehicles.valid_mileage_text'));
      return;
    }

    setIsSubmitting(true);
    try {
      const now = Date.now();
      const taskTitle = title.trim();
      await addTask({
        vehicleId: vehicleId as string,
        type: selectedType,
        title: taskTitle,
        intervalType,
        intervalValue: interval,
        lastCompletedMileage: intervalType === 'mileage' ? lastMileageNum : undefined,
        lastCompletedDate: intervalType === 'date' ? now : undefined,
        nextDueMileage: intervalType === 'mileage' ? lastMileageNum + interval : undefined,
        nextDueDate: intervalType === 'date' ? now + interval * 24 * 60 * 60 * 1000 : undefined,
        isRecurring: isRecurring,
        isCompleted: false,
      });
      
      router.back();
      
      setTimeout(() => {
        showToast({
          message: t('maintenance.add_task_success', { title: taskTitle }),
          actionLabel: t('common.undo'),
          onAction: async () => {
            await restoreLastSnapshot();
          },
        });
      }, 150);
    } catch (error) {
      console.error('Error adding task:', error);
      Alert.alert(t('common.error'), t('maintenance.add_error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!vehicle) {
    const errorStyles = createStyles(colors);
    return (
      <View style={errorStyles.errorContainer}>
        <Text style={errorStyles.errorText}>{t('vehicles.not_found')}</Text>
      </View>
    );
  }

  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.sectionTitle}>{t('maintenance.select_type')}</Text>
          <View style={styles.typeGrid}>
            {(Object.keys(MAINTENANCE_TYPES) as MaintenanceType[]).map((type) => {
              const isSelected = selectedType === type;
              return (
                <TouchableOpacity
                  key={type}
                  style={[styles.typeCard, isSelected && styles.typeCardSelected]}
                  onPress={() => handleTypeSelect(type)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.typeLabel, isSelected && styles.typeLabelSelected]} numberOfLines={2}>
                    {getMaintenanceTypeLabel(type, t)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                {t('maintenance.task_name')} <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={title}
                placeholder={t('maintenance.task_name')}
                placeholderTextColor={colors.placeholder}
                editable={false}
              />
            </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>{t('maintenance.interval_type')}</Text>
                <View style={styles.segmentedControl}>
                  <TouchableOpacity
                    style={[
                      styles.segment,
                      intervalType === 'mileage' && styles.segmentSelected,
                    ]}
                    onPress={() => handleIntervalTypeChange('mileage')}
                  >
                    <Text
                      style={[
                        styles.segmentText,
                        intervalType === 'mileage' && styles.segmentTextSelected,
                      ]}
                    >
                      {t('maintenance.interval_mileage')}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.segment, intervalType === 'date' && styles.segmentSelected]}
                    onPress={() => handleIntervalTypeChange('date')}
                  >
                    <Text
                      style={[
                        styles.segmentText,
                        intervalType === 'date' && styles.segmentTextSelected,
                      ]}
                    >
                      {t('maintenance.interval_date')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

            <View style={styles.inputGroup}>
              <View style={styles.labelWithAction}>
                <Text style={styles.label}>
                  {t('maintenance.interval')} ({intervalType === 'mileage' ? t('vehicles.km') : t('maintenance.interval_date').toLowerCase()}){' '}
                  <Text style={styles.required}>*</Text>
                </Text>
                <TouchableOpacity 
                  style={styles.recommendedButton}
                  onPress={handleUseRecommended}
                  activeOpacity={0.7}
                >
                  <Text style={styles.recommendedButtonText}>
                    {t('maintenance.use_recommended')}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.recommendedHint}>
                <Text style={styles.recommendedHintText}>
                  💡 {getRecommendedText()}
                </Text>
              </View>
              <TextInput
                style={styles.input}
                value={intervalValue}
                onChangeText={setIntervalValue}
                placeholder={intervalType === 'mileage' ? 'e.g., 10000' : 'e.g., 365'}
                placeholderTextColor={colors.placeholder}
                keyboardType="numeric"
              />
            </View>

            {intervalType === 'mileage' && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  {t('maintenance.last_completed_mileage')} ({t('vehicles.km')}) <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  value={lastMileage}
                  onChangeText={setLastMileage}
                  placeholder="e.g., 45000"
                  placeholderTextColor={colors.placeholder}
                  keyboardType="numeric"
                />
              </View>
            )}

            <View style={styles.inputGroup}>
              <View style={styles.switchRow}>
                <View style={styles.switchLabelContainer}>
                  <Text style={styles.label}>{t('maintenance.recurring_task')}</Text>
                  <Text style={styles.switchDescription}>
                    {t('maintenance.recurring_description')}
                  </Text>
                </View>
                <Switch
                  value={isRecurring}
                  onValueChange={setIsRecurring}
                  trackColor={{ false: colors.border, true: colors.primary + '50' }}
                  thumbColor={isRecurring ? colors.primary : colors.placeholder}
                />
              </View>
            </View>

            {isRecurring && (
              <View style={styles.infoCard}>
                <Text style={styles.infoText}>
                  {intervalType === 'mileage'
                    ? t('maintenance.next_due_at', { mileage: (parseInt(lastMileage) + parseInt(intervalValue || '0')).toLocaleString() })
                    : t('maintenance.next_due_in', { days: intervalValue })}
                </Text>
              </View>
            )}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={isSubmitting}
            activeOpacity={0.8}
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting ? t('vehicles.adding') : t('maintenance.add_task')}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      backgroundColor: colors.background,
    },
    errorText: {
      fontSize: 18,
      fontWeight: '600' as const,
      color: colors.text,
    },
    keyboardView: {
      flex: 1,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      padding: 16,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '700' as const,
      color: colors.text,
      marginBottom: 16,
    },
    typeGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginBottom: 24,
      justifyContent: 'space-between',
    },
    typeCard: {
      width: '31%',
      minWidth: 90,
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 12,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: 'transparent',
      minHeight: 60,
    },
    typeCardSelected: {
      borderColor: colors.primary,
      backgroundColor: colors.primary + '15',
    },
    typeLabel: {
      fontSize: 12,
      fontWeight: '600' as const,
      color: colors.textSecondary,
      textAlign: 'center',
      flexShrink: 1,
    },
    typeLabelSelected: {
      color: colors.primary,
    },
    form: {
      gap: 16,
    },
    inputGroup: {
      gap: 8,
    },
    label: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: colors.text,
      flexShrink: 1,
      flexWrap: 'wrap',
    },
    labelWithAction: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 4,
    },
    recommendedButton: {
      backgroundColor: colors.primary + '15',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.primary + '30',
    },
    recommendedButtonText: {
      fontSize: 12,
      fontWeight: '600' as const,
      color: colors.primary,
    },
    recommendedHint: {
      backgroundColor: colors.warning + '10',
      borderRadius: 8,
      padding: 8,
      marginBottom: 8,
      borderLeftWidth: 3,
      borderLeftColor: colors.warning,
    },
    recommendedHintText: {
      fontSize: 13,
      color: colors.text,
      fontWeight: '500' as const,
    },
    required: {
      color: colors.error,
    },
    input: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      fontSize: 16,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
    },
    segmentedControl: {
      flexDirection: 'row',
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 4,
      borderWidth: 1,
      borderColor: colors.border,
    },
    segment: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
    },
    segmentSelected: {
      backgroundColor: colors.primary,
    },
    segmentText: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: colors.textSecondary,
    },
    segmentTextSelected: {
      color: '#FFFFFF',
    },
    infoCard: {
      backgroundColor: colors.primary + '15',
      borderRadius: 12,
      padding: 16,
      borderLeftWidth: 4,
      borderLeftColor: colors.primary,
    },
    infoText: {
      fontSize: 14,
      color: colors.primary,
      fontWeight: '500' as const,
      flexShrink: 1,
      flexWrap: 'wrap',
    },
    footer: {
      padding: 16,
      backgroundColor: colors.background,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    submitButton: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      padding: 16,
      alignItems: 'center',
    },
    submitButtonDisabled: {
      opacity: 0.5,
    },
    submitButtonText: {
      color: '#FFFFFF',
      fontSize: 17,
      fontWeight: '600' as const,
    },
    switchRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    switchLabelContainer: {
      flex: 1,
      marginRight: 12,
    },
    switchDescription: {
      fontSize: 13,
      color: colors.textSecondary,
      marginTop: 4,
    },
  });
