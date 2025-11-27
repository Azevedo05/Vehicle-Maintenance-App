import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
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
import { useTheme } from '@/contexts/ThemeContext';
import { useLocalization } from '@/contexts/LocalizationContext';
import { usePreferences } from '@/contexts/PreferencesContext';
import { useAppAlert } from '@/contexts/AlertContext';
import { FuelType } from '@/types/vehicle';

export default function AddFuelLogScreen() {
  const { vehicleId } = useLocalSearchParams();
  const {
    addFuelLog,
    getVehicleById,
    updateVehicle,
    restoreLastSnapshot,
  } = useVehicles();
  const { colors } = useTheme();
  const { t } = useLocalization();
  const { currencySymbol } = usePreferences();
  const { showToast } = useAppAlert();

  const vehicle = vehicleId ? getVehicleById(vehicleId as string) : null;

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [fuelType, setFuelType] = useState<FuelType>('gasoline_95');
  const [volume, setVolume] = useState('');
  const [totalCost, setTotalCost] = useState('');
  const [station, setStation] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!vehicle) {
    const styles = createStyles(colors);
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{t('vehicles.not_found')}</Text>
      </View>
    );
  }

  const handleSubmit = async () => {
    if (!date || !volume.trim() || !totalCost.trim()) {
      Alert.alert(t('vehicles.missing_info'), t('vehicles.fill_required'));
      return;
    }

    const volumeValue = parseFloat(volume);
    const totalCostValue = parseFloat(totalCost);

    if (isNaN(volumeValue) || volumeValue <= 0) {
      Alert.alert(t('fuel.invalid_volume_title'), t('fuel.invalid_volume_text'));
      return;
    }

    if (isNaN(totalCostValue) || totalCostValue <= 0) {
      Alert.alert(t('fuel.invalid_cost_title'), t('fuel.invalid_cost_text'));
      return;
    }

    setIsSubmitting(true);
    try {
      await addFuelLog({
        vehicleId: vehicleId as string,
        date: new Date(date).getTime(),
        fuelType,
        volume: volumeValue,
        totalCost: totalCostValue,
        pricePerUnit: totalCostValue / volumeValue,
        station: station.trim() || undefined,
        notes: notes.trim() || undefined,
      });

      router.back();
      
      setTimeout(() => {
        showToast({
          message: t('fuel.add_success'),
          actionLabel: t('common.undo'),
          onAction: async () => {
            await restoreLastSnapshot();
          },
        });
      }, 150);
    } catch (error) {
      console.error('Error adding fuel log:', error);
      Alert.alert(t('common.error'), t('fuel.save_error'));
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              {t('fuel.date_label')} <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={date}
              onChangeText={setDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={colors.placeholder}
            />
          </View>

          {/* Fuel type chips */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('fuel.type_label')}</Text>
            <View style={styles.typeRow}>
              {(['gasoline_95', 'gasoline_98', 'diesel', 'diesel_additive', 'gpl', 'electric'] as FuelType[]).map(
                (type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.typeChip,
                      fuelType === type && styles.typeChipActive,
                    ]}
                    onPress={() => setFuelType(type)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.typeChipText,
                        fuelType === type && styles.typeChipTextActive,
                      ]}
                    >
                      {t(`fuel.type_${type}`)}
                    </Text>
                  </TouchableOpacity>
                )
              )}
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.rowItem]}>
            <Text style={styles.label}>
              {t('fuel.volume_label', { unit: t('fuel.volume_unit') })}{' '}
              <Text style={styles.required}>*</Text>
            </Text>
              <TextInput
                style={styles.input}
                value={volume}
                onChangeText={setVolume}
                placeholder={t('fuel.volume_placeholder')}
                placeholderTextColor={colors.placeholder}
                keyboardType="decimal-pad"
              />
            </View>
            <View style={[styles.inputGroup, styles.rowItem]}>
              <Text style={styles.label}>
                {t('fuel.total_cost_label', { currency: currencySymbol })}{' '}
                <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={totalCost}
                onChangeText={setTotalCost}
                placeholder="70.00"
                placeholderTextColor={colors.placeholder}
                keyboardType="decimal-pad"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('fuel.station_label')}</Text>
            <TextInput
              style={styles.input}
              value={station}
              onChangeText={setStation}
              placeholder={t('fuel.station_placeholder')}
              placeholderTextColor={colors.placeholder}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('fuel.notes_label')}</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={notes}
              onChangeText={setNotes}
              placeholder={t('fuel.notes_placeholder')}
              placeholderTextColor={colors.placeholder}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
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
              {isSubmitting ? t('fuel.saving') : t('fuel.save')}
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
      gap: 16,
    },
    inputGroup: {
      gap: 8,
    },
    label: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: colors.text,
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
    typeRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    typeChip: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
    },
    typeChipActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    typeChipText: {
      fontSize: 13,
      color: colors.text,
      fontWeight: '500' as const,
    },
    typeChipTextActive: {
      color: '#FFFFFF',
    },
    row: {
      flexDirection: 'row',
      gap: 12,
    },
    rowItem: {
      flex: 1,
    },
    footer: {
      padding: 16,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      backgroundColor: colors.background,
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

