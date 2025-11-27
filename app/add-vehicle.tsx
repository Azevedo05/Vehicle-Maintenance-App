import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { Camera, X } from 'lucide-react-native';
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
import { Image } from 'expo-image';

import { useLocalization } from '@/contexts/LocalizationContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useVehicles } from '@/contexts/VehicleContext';
import { useAppAlert } from '@/contexts/AlertContext';
import { VehicleCategory, VEHICLE_CATEGORY_INFO } from '@/types/vehicle';

export default function AddVehicleScreen() {
  const { addVehicle, restoreLastSnapshot } = useVehicles();
  const { colors } = useTheme();
  const { t } = useLocalization();
  const { showToast } = useAppAlert();
  const [name, setName] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [currentMileage, setCurrentMileage] = useState('');
  const [photo, setPhoto] = useState<string | undefined>();
  const [category, setCategory] = useState<VehicleCategory | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const styles = createStyles(colors);

  const pickImage = async () => {
    const { status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(t('vehicles.permission_needed'), t('vehicles.permission_text'));
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!name.trim() || !make.trim() || !model.trim() || !year.trim() || !currentMileage.trim() || !category) {
      Alert.alert(t('vehicles.missing_info'), t('vehicles.fill_required'));
      return;
    }

    const yearNum = parseInt(year);
    if (isNaN(yearNum) || yearNum < 1900 || yearNum > new Date().getFullYear() + 1) {
      Alert.alert(t('vehicles.invalid_year'), t('vehicles.valid_year_text'));
      return;
    }

    const mileageNum = parseInt(currentMileage);
    if (isNaN(mileageNum) || mileageNum < 0) {
      Alert.alert(t('vehicles.invalid_mileage'), t('vehicles.valid_mileage_text'));
      return;
    }

    setIsSubmitting(true);
    try {
      const newVehicle = await addVehicle({
        name: name.trim(),
        make: make.trim(),
        model: model.trim(),
        year: yearNum,
        licensePlate: licensePlate.trim() || undefined,
        currentMileage: mileageNum,
        photo,
        category,
      });
      
      router.back();
      
      setTimeout(() => {
        showToast({
          message: t('vehicles.add_success', { name: newVehicle.name }),
          actionLabel: t('common.undo'),
          onAction: async () => {
            await restoreLastSnapshot();
          },
        });
      }, 150);
    } catch (error) {
      console.error('Error adding vehicle:', error);
      Alert.alert(t('common.error'), t('vehicles.add_error'));
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <TouchableOpacity
            style={styles.photoSection}
            onPress={pickImage}
            activeOpacity={0.7}
          >
            {photo ? (
              <View style={styles.photoContainer}>
                <Image source={{ uri: photo }} style={styles.photo} contentFit="cover" />
                <TouchableOpacity
                  style={styles.removePhotoButton}
                  onPress={(e) => {
                    e.stopPropagation();
                    setPhoto(undefined);
                  }}
                >
                  <X size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.photoPlaceholder}>
                <Camera size={32} color={colors.textSecondary} />
                <Text style={styles.photoPlaceholderText}>{t('vehicles.add_photo')}</Text>
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                {t('vehicles.name')} <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder={t('vehicles.name_placeholder')}
                placeholderTextColor={colors.placeholder}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                {t('vehicles.make')} <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={make}
                onChangeText={setMake}
                placeholder={t('vehicles.make_placeholder')}
                placeholderTextColor={colors.placeholder}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                {t('vehicles.model')} <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={model}
                onChangeText={setModel}
                placeholder={t('vehicles.model_placeholder')}
                placeholderTextColor={colors.placeholder}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                {t('vehicles.year')} <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={year}
                onChangeText={setYear}
                placeholder={t('vehicles.year_placeholder')}
                placeholderTextColor={colors.placeholder}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('vehicles.license_plate')}</Text>
              <TextInput
                style={styles.input}
                value={licensePlate}
                onChangeText={setLicensePlate}
                placeholder={t('vehicles.license_placeholder')}
                placeholderTextColor={colors.placeholder}
                autoCapitalize="characters"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                {t('vehicles.current_mileage')} ({t('vehicles.km')}) <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={currentMileage}
                onChangeText={setCurrentMileage}
                placeholder={t('vehicles.mileage_placeholder')}
                placeholderTextColor={colors.placeholder}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                {t('vehicles.category')} <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.categoryGrid}>
                {(Object.keys(VEHICLE_CATEGORY_INFO) as VehicleCategory[]).map((cat) => {
                  const info = VEHICLE_CATEGORY_INFO[cat];
                  const IconComponent = info.Icon;
                  return (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.categoryButton,
                        category === cat && styles.categoryButtonActive,
                        { borderColor: category === cat ? info.color : colors.border },
                      ]}
                      onPress={() => setCategory(category === cat ? undefined : cat)}
                    >
                      <IconComponent 
                        size={20} 
                        color={category === cat ? info.color : colors.textSecondary} 
                      />
                      <Text style={[
                        styles.categoryLabel,
                        category === cat && { color: info.color },
                      ]}>
                        {t(`vehicles.category_${cat}`)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
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
              {isSubmitting ? t('vehicles.adding') : t('vehicles.add')}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
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
    photoSection: {
      alignItems: 'center',
      marginBottom: 24,
    },
    photoContainer: {
      position: 'relative' as const,
    },
    photo: {
      width: 200,
      height: 150,
      borderRadius: 12,
      backgroundColor: colors.border,
    },
    removePhotoButton: {
      position: 'absolute' as const,
      top: 8,
      right: 8,
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
    },
    photoPlaceholder: {
      width: 200,
      height: 150,
      borderRadius: 12,
      backgroundColor: colors.surface,
      borderWidth: 2,
      borderColor: colors.border,
      borderStyle: 'dashed' as const,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
    },
    photoPlaceholderText: {
      marginTop: 8,
      fontSize: 14,
      color: colors.textSecondary,
      fontWeight: '500' as const,
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
      alignItems: 'center' as const,
    },
    submitButtonDisabled: {
      opacity: 0.5,
    },
    submitButtonText: {
      color: '#FFFFFF',
      fontSize: 17,
      fontWeight: '600' as const,
    },
    categoryGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    categoryButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
      paddingHorizontal: 14,
      borderRadius: 8,
      borderWidth: 2,
      gap: 6,
      minWidth: '48%',
      flex: 1,
    },
    categoryButtonActive: {
      backgroundColor: colors.card,
    },
    categoryLabel: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.text,
    },
  });
