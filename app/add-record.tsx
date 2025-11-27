import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useVehicles } from '@/contexts/VehicleContext';
import { MAINTENANCE_TYPES, MaintenanceType, getMaintenanceTypeLabel } from '@/types/vehicle';
import { useTheme } from '@/contexts/ThemeContext';
import { useAppAlert } from '@/contexts/AlertContext';
import { useLocalization } from '@/contexts/LocalizationContext';

export default function AddRecordScreen() {
  const { vehicleId, taskId } = useLocalSearchParams();
  const { addRecord, getVehicleById, tasks, updateVehicle, restoreLastSnapshot } = useVehicles();
  const { colors } = useTheme();
  const { t } = useLocalization();
  const { showToast } = useAppAlert();

  const vehicle = vehicleId ? getVehicleById(vehicleId as string) : null;
  const task = taskId ? tasks.find((t) => t.id === taskId) : null;

  const [selectedType, setSelectedType] = useState<MaintenanceType>(
    task?.type || 'oil_change'
  );
  const [title, setTitle] = useState(task?.title || t('maintenance.types.oil_change'));
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [mileage, setMileage] = useState(vehicle?.currentMileage.toString() || '0');
  const [cost, setCost] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (task) {
      setSelectedType(task.type);
      setTitle(task.title);
    }
  }, [task]);

  const handleTypeSelect = (type: MaintenanceType) => {
    setSelectedType(type);
    setTitle(getMaintenanceTypeLabel(type, t));
  };

  const handleSubmit = async () => {
    if (!vehicleId || !title.trim() || !date || !mileage.trim()) {
      Alert.alert(t('vehicles.missing_info'), t('vehicles.fill_required'));
      return;
    }

    const mileageNum = parseInt(mileage);
    if (isNaN(mileageNum) || mileageNum < 0) {
      Alert.alert(t('vehicles.invalid_mileage'), t('vehicles.valid_mileage_text'));
      return;
    }

    const costNum = cost.trim() ? parseFloat(cost) : undefined;
    if (costNum !== undefined && (isNaN(costNum) || costNum < 0)) {
      Alert.alert(t('maintenance.invalid_cost'), t('maintenance.invalid_cost_text'));
      return;
    }

    setIsSubmitting(true);
    try {
      const recordTitle = title.trim();
      await addRecord({
        vehicleId: vehicleId as string,
        taskId: taskId as string | undefined,
        type: selectedType,
        title: recordTitle,
        date: new Date(date).getTime(),
        mileage: mileageNum,
        cost: costNum,
        location: location.trim() || undefined,
        notes: notes.trim() || undefined,
      });

      if (vehicle && vehicle.currentMileage < mileageNum) {
        await updateVehicle(vehicleId as string, { currentMileage: mileageNum });
      }

      router.back();
      
      setTimeout(() => {
        showToast({
          message: t('maintenance.add_record_success', { title: recordTitle }),
          actionLabel: t('common.undo'),
          onAction: async () => {
            await restoreLastSnapshot();
          },
        });
      }, 150);
    } catch (error) {
      console.error('Error adding record:', error);
      Alert.alert(t('common.error'), t('maintenance.log_error'));
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
          {!task && (
            <>
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
            </>
          )}

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                {t('maintenance.title_field')} <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder={t('maintenance.task_name')}
                placeholderTextColor={colors.placeholder}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                {t('maintenance.date')} <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={date}
                onChangeText={setDate}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={colors.placeholder}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                {t('maintenance.mileage')} ({t('vehicles.km')}) <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={mileage}
                onChangeText={setMileage}
                placeholder={t('vehicles.mileage_placeholder')}
                placeholderTextColor={colors.placeholder}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('maintenance.cost')}</Text>
              <TextInput
                style={styles.input}
                value={cost}
                onChangeText={setCost}
                placeholder="e.g., 45.00"
                placeholderTextColor={colors.placeholder}
                keyboardType="decimal-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('maintenance.location')}</Text>
              <TextInput
                style={styles.input}
                value={location}
                onChangeText={setLocation}
                placeholder="e.g., Main Street Garage"
                placeholderTextColor={colors.placeholder}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('maintenance.notes')}</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={notes}
                onChangeText={setNotes}
                placeholder={t('maintenance.notes')}
                placeholderTextColor={colors.placeholder}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
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
              {isSubmitting ? t('maintenance.logging') : t('maintenance.log_maintenance')}
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
    textArea: {
      minHeight: 100,
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
  });
