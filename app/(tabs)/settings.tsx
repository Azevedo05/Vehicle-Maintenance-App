import {
  Bell,
  Moon,
  Settings as SettingsIcon,
  Sun,
  Download,
  Upload,
  Trash2,
  Info,
  Globe,
  DollarSign,
  Database,
  ChevronRight,
  Filter,
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as DocumentPicker from 'expo-document-picker';
import { router } from 'expo-router';

import { useLocalization } from '@/contexts/LocalizationContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { usePreferences, Currency, CURRENCY_SYMBOLS } from '@/contexts/PreferencesContext';
import { useVehicles } from '@/contexts/VehicleContext';
import {
  exportData,
  importData,
  clearAllData,
  APP_VERSION,
  exportCategoryData,
} from '@/utils/dataManagement';
import sampleData from '@/sample-data.json';
import { VEHICLE_CATEGORY_INFO, VehicleCategory } from '@/types/vehicle';

export default function SettingsScreen() {
  const { colors, themeMode, setThemeMode } = useTheme();
  const { t, language, changeLanguage } = useLocalization();
  const {
    notificationsEnabled, 
    permissionGranted,
    toggleNotifications
  } = useNotifications();
  const {
    distanceUnit,
    currency,
    setDistanceUnit,
    setCurrency,
  } = usePreferences();
  const {
    vehicles,
    tasks,
    records,
    fuelLogs,
    reloadData: reloadVehicleData,
  } = useVehicles();
  
  const [isTogglingNotifications, setIsTogglingNotifications] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [isCategoryExporting, setIsCategoryExporting] = useState(false);
  
  const styles = createStyles(colors);

  const handleToggleNotifications = async (value: boolean) => {
    setIsTogglingNotifications(true);
    const success = await toggleNotifications(value);
    setIsTogglingNotifications(false);
    
    if (!success && value) {
      Alert.alert(
        t('settings.notifications_permission'),
        t('settings.notifications_permission_text')
      );
    }
  };

  const handleExportCategory = async (category: VehicleCategory) => {
    const vehiclesInCategory = vehicles.filter(
      (vehicle) => (vehicle.category ?? 'other') === category
    );

    if (vehiclesInCategory.length === 0) {
      Alert.alert(
        t('settings.export_category'),
        t('settings.export_category_empty')
      );
      return;
    }

    setIsCategoryExporting(true);
    const success = await exportCategoryData(category, vehicles, tasks, records, fuelLogs);
    setIsCategoryExporting(false);
    setIsCategoryModalVisible(false);

    Alert.alert(
      success ? t('common.success') : t('common.error'),
      success ? t('settings.export_category_success') : t('settings.export_category_error')
    );
  };

  const handleExportData = async () => {
    setIsExporting(true);
    const success = await exportData();
    setIsExporting(false);
    
    if (success) {
      Alert.alert(
        t('settings.export_success'),
        t('settings.export_success_text')
      );
    } else {
      Alert.alert(
        t('settings.export_error'),
        t('settings.export_error_text')
      );
    }
  };

  const handleImportData = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/json', 'text/plain', '*/*'],
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return;
      }

      setIsImporting(true);
      const file = result.assets[0];
      
      // Read file content
      const response = await fetch(file.uri);
      const jsonString = await response.text();
      
      const success = await importData(jsonString);
      
      if (success) {
        // Reload all data immediately
        await reloadVehicleData();
        setIsImporting(false);
        
        Alert.alert(
          t('settings.import_success'),
          t('settings.import_success_text')
        );
      } else {
        setIsImporting(false);
        Alert.alert(
          t('settings.import_error'),
          t('settings.import_error_text')
        );
      }
    } catch {
      setIsImporting(false);
      Alert.alert(
        t('settings.import_error'),
        t('settings.import_error_text')
      );
    }
  };

  const handleLoadSampleData = async () => {
    Alert.alert(
      t('settings.load_sample_data'),
      t('settings.load_sample_data_text'),
      [
        {
          text: t('common.cancel'),
          style: 'cancel',
        },
        {
          text: t('common.confirm'),
          onPress: async () => {
            setIsImporting(true);
            try {
              // Convert sample data object to JSON string
              const jsonString = JSON.stringify(sampleData);
              const success = await importData(jsonString);
              
              if (success) {
                await reloadVehicleData();
                setIsImporting(false);
                Alert.alert(
                  t('settings.sample_loaded'),
                  t('settings.sample_loaded_text')
                );
              } else {
                setIsImporting(false);
                Alert.alert(t('common.error'), t('settings.import_error_text'));
              }
            } catch {
              setIsImporting(false);
              Alert.alert(t('common.error'), t('settings.import_error_text'));
            }
          },
        },
      ]
    );
  };

  const handleClearData = () => {
    Alert.alert(
      t('settings.clear_data_confirm'),
      t('settings.clear_data_confirm_text'),
      [
        {
          text: t('common.cancel'),
          style: 'cancel',
        },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: async () => {
            setIsClearing(true);
            const success = await clearAllData();
            
            if (success) {
              // Reload all data immediately
              await reloadVehicleData();
              setIsClearing(false);
              
              Alert.alert(
                t('settings.clear_success'),
                t('settings.clear_success_text')
              );
            } else {
              setIsClearing(false);
              Alert.alert(
                t('settings.clear_error'),
                t('settings.clear_error_text')
              );
            }
          },
        },
      ]
    );
  };


  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.screenTitle}>{t('settings.title')}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.theme')}</Text>
          <View style={styles.optionGroup}>
            <TouchableOpacity
              style={[
                styles.optionButton,
                themeMode === 'light' && styles.optionButtonActive,
              ]}
              onPress={() => setThemeMode('light')}
              activeOpacity={0.7}
            >
              <Sun
                size={20}
                color={themeMode === 'light' ? colors.primary : colors.text}
              />
              <Text
                style={[
                  styles.optionText,
                  themeMode === 'light' && styles.optionTextActive,
                ]}
              >
                {t('settings.theme_light')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.optionButton,
                themeMode === 'dark' && styles.optionButtonActive,
              ]}
              onPress={() => setThemeMode('dark')}
              activeOpacity={0.7}
            >
              <Moon
                size={20}
                color={themeMode === 'dark' ? colors.primary : colors.text}
              />
              <Text
                style={[
                  styles.optionText,
                  themeMode === 'dark' && styles.optionTextActive,
                ]}
              >
                {t('settings.theme_dark')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.optionButton,
                themeMode === 'system' && styles.optionButtonActive,
                styles.optionButtonLast,
              ]}
              onPress={() => setThemeMode('system')}
              activeOpacity={0.7}
            >
              <SettingsIcon
                size={20}
                color={themeMode === 'system' ? colors.primary : colors.text}
              />
              <Text
                style={[
                  styles.optionText,
                  themeMode === 'system' && styles.optionTextActive,
                ]}
              >
                {t('settings.theme_system')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.language')}</Text>
          <View style={styles.optionGroup}>
            <TouchableOpacity
              style={[
                styles.optionButton,
                language === 'en' && styles.optionButtonActive,
              ]}
              onPress={() => changeLanguage('en')}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.optionText,
                  language === 'en' && styles.optionTextActive,
                ]}
              >
                {t('settings.language_en')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.optionButton,
                language === 'pt-PT' && styles.optionButtonActive,
                styles.optionButtonLast,
              ]}
              onPress={() => changeLanguage('pt-PT')}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.optionText,
                  language === 'pt-PT' && styles.optionTextActive,
                ]}
              >
                {t('settings.language_pt')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.notifications')}</Text>
          <View style={styles.optionGroup}>
            <View style={[styles.optionButton, styles.optionButtonLast]}>
              <Bell size={20} color={notificationsEnabled ? colors.primary : colors.text} />
              <View style={styles.notificationContent}>
                <Text style={[styles.optionText, notificationsEnabled && styles.optionTextActive]}>
                  {t('settings.enable_notifications')}
                </Text>
                <Text style={styles.optionDescription}>
                  {t('settings.notifications_description')}
                </Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={handleToggleNotifications}
                disabled={isTogglingNotifications}
                trackColor={{ false: colors.border, true: colors.primary + '50' }}
                thumbColor={notificationsEnabled ? colors.primary : colors.placeholder}
              />
            </View>
          </View>
          
          {!permissionGranted && (
            <Text style={styles.permissionWarning}>
              ⚠️ {t('settings.notifications_permission_needed')}
            </Text>
          )}

          {notificationsEnabled && (
            <TouchableOpacity
              style={styles.advancedSettingsButton}
              onPress={() => router.push('/notification-settings')}
              activeOpacity={0.7}
            >
              <SettingsIcon size={18} color={colors.primary} />
              <Text style={styles.advancedSettingsText}>
                {t('settings.notification_settings')}
              </Text>
              <ChevronRight size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.units')}</Text>
          <View style={styles.optionGroup}>
            <View style={styles.optionButton}>
              <Globe size={20} color={colors.text} />
              <Text style={styles.optionText}>{t('settings.distance_unit')}</Text>
              <View style={styles.unitSelector}>
                <TouchableOpacity
                  style={[
                    styles.unitButton,
                    distanceUnit === 'km' && styles.unitButtonActive,
                  ]}
                  onPress={() => setDistanceUnit('km')}
                >
                  <Text
                    style={[
                      styles.unitButtonText,
                      distanceUnit === 'km' && styles.unitButtonTextActive,
                    ]}
                  >
                    km
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.unitButton,
                    distanceUnit === 'mi' && styles.unitButtonActive,
                  ]}
                  onPress={() => setDistanceUnit('mi')}
                >
                  <Text
                    style={[
                      styles.unitButtonText,
                      distanceUnit === 'mi' && styles.unitButtonTextActive,
                    ]}
                  >
                    mi
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={[styles.optionButton, styles.optionButtonLast]}>
              <DollarSign size={20} color={colors.text} />
              <Text style={styles.optionText}>{t('settings.currency')}</Text>
              <View style={styles.currencySelector}>
                {(['EUR', 'USD', 'GBP', 'BRL'] as Currency[]).map((curr) => (
                  <TouchableOpacity
                    key={curr}
                    style={[
                      styles.currencyButton,
                      currency === curr && styles.currencyButtonActive,
                    ]}
                    onPress={() => setCurrency(curr)}
                  >
                    <Text
                      style={[
                        styles.currencyButtonText,
                        currency === curr && styles.currencyButtonTextActive,
                      ]}
                    >
                      {CURRENCY_SYMBOLS[curr]}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.data_management')}</Text>
          <View style={styles.optionGroup}>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={handleExportData}
              disabled={isExporting}
              activeOpacity={0.7}
            >
              <Download size={20} color={colors.primary} />
              <View style={styles.notificationContent}>
                <Text style={[styles.optionText, { color: colors.primary }]}>
                  {t('settings.export_data')}
                </Text>
                <Text style={styles.optionDescription}>
                  {t('settings.export_data_description')}
                </Text>
              </View>
              {isExporting && <ActivityIndicator size="small" color={colors.primary} />}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionButton}
              onPress={handleImportData}
              disabled={isImporting}
              activeOpacity={0.7}
            >
              <Upload size={20} color={colors.primary} />
              <View style={styles.notificationContent}>
                <Text style={[styles.optionText, { color: colors.primary }]}>
                  {t('settings.import_data')}
                </Text>
                <Text style={styles.optionDescription}>
                  {t('settings.import_data_description')}
                </Text>
              </View>
              {isImporting && <ActivityIndicator size="small" color={colors.primary} />}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionButton}
              onPress={handleLoadSampleData}
              disabled={isImporting}
              activeOpacity={0.7}
            >
              <Database size={20} color={colors.success} />
              <View style={styles.notificationContent}>
                <Text style={[styles.optionText, { color: colors.success }]}>
                  {t('settings.load_sample_data')}
                </Text>
                <Text style={styles.optionDescription}>
                  {t('settings.load_sample_data_short')}
                </Text>
              </View>
              {isImporting && <ActivityIndicator size="small" color={colors.success} />}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => setIsCategoryModalVisible(true)}
              disabled={isCategoryExporting}
              activeOpacity={0.7}
            >
              <Filter size={20} color={colors.primary} />
              <View style={styles.notificationContent}>
                <Text style={[styles.optionText, { color: colors.primary }]}>
                  {t('settings.export_category')}
                </Text>
                <Text style={styles.optionDescription}>
                  {t('settings.export_category_description')}
                </Text>
              </View>
              {isCategoryExporting && (
                <ActivityIndicator size="small" color={colors.primary} />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.optionButton, styles.optionButtonLast]}
              onPress={handleClearData}
              disabled={isClearing}
              activeOpacity={0.7}
            >
              <Trash2 size={20} color={colors.error} />
              <View style={styles.notificationContent}>
                <Text style={[styles.optionText, { color: colors.error }]}>
                  {t('settings.clear_data')}
                </Text>
                <Text style={styles.optionDescription}>
                  {t('settings.clear_data_description')}
                </Text>
              </View>
              {isClearing && <ActivityIndicator size="small" color={colors.error} />}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.about')}</Text>
          <View style={styles.optionGroup}>
            <View style={[styles.optionButton, styles.optionButtonLast, styles.aboutSection]}>
              <Info size={24} color={colors.primary} />
              <View style={styles.aboutContent}>
                <Text style={styles.aboutTitle}>{t('settings.about_app_title')}</Text>
                <Text style={styles.aboutDescription}>
                  {t('settings.about_app_description')}
                </Text>
                
                <Text style={styles.aboutSectionTitle}>{t('settings.how_it_works')}</Text>
                
                <View style={styles.featureItem}>
                  <Text style={styles.featureBullet}>•</Text>
                  <Text style={styles.featureText}>{t('settings.feature_vehicles')}</Text>
                </View>
                
                <View style={styles.featureItem}>
                  <Text style={styles.featureBullet}>•</Text>
                  <Text style={styles.featureText}>{t('settings.feature_tasks')}</Text>
                </View>
                
                <View style={styles.featureItem}>
                  <Text style={styles.featureBullet}>•</Text>
                  <Text style={styles.featureText}>{t('settings.feature_records')}</Text>
                </View>
                
                <View style={styles.featureItem}>
                  <Text style={styles.featureBullet}>•</Text>
                  <Text style={styles.featureText}>{t('settings.feature_notifications')}</Text>
                </View>
                
                <View style={styles.featureItem}>
                  <Text style={styles.featureBullet}>•</Text>
                  <Text style={styles.featureText}>{t('settings.feature_backup')}</Text>
                </View>
                
                <View style={styles.versionContainer}>
                  <Text style={styles.versionLabel}>{t('settings.version')}</Text>
                  <Text style={styles.versionText}>{APP_VERSION}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={isCategoryModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsCategoryModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{t('settings.export_category')}</Text>
            <Text style={styles.modalDescription}>
              {t('settings.export_category_description')}
            </Text>
            {(Object.keys(VEHICLE_CATEGORY_INFO) as VehicleCategory[]).map((category) => (
              <TouchableOpacity
                key={category}
                style={styles.modalCategoryButton}
                onPress={() => handleExportCategory(category)}
                disabled={isCategoryExporting}
              >
                <Text style={styles.modalCategoryText}>
                  {t(`vehicles.category_${category}`)}
                </Text>
                <ChevronRight size={18} color={colors.textSecondary} />
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setIsCategoryModalVisible(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.modalCloseButtonText}>{t('common.cancel')}</Text>
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
      marginBottom: 32,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600' as const,
      color: colors.text,
      marginBottom: 12,
      marginLeft: 4,
    },
    optionGroup: {
      backgroundColor: colors.card,
      borderRadius: 16,
      overflow: 'hidden',
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    optionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      gap: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    optionButtonActive: {
      backgroundColor: colors.primary + '15',
    },
    optionButtonLast: {
      borderBottomWidth: 0,
    },
    optionText: {
      fontSize: 16,
      color: colors.text,
      flex: 1,
      flexShrink: 1,
    },
    optionTextActive: {
      fontWeight: '600' as const,
      color: colors.primary,
    },
    notificationContent: {
      flex: 1,
      marginRight: 12,
    },
    optionDescription: {
      fontSize: 13,
      color: colors.textSecondary,
      marginTop: 4,
    },
    permissionWarning: {
      fontSize: 13,
      color: colors.warning,
      marginTop: 8,
      marginLeft: 4,
    },
    advancedSettingsButton: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      marginTop: 12,
      backgroundColor: `${colors.primary}10`,
      borderRadius: 8,
      gap: 8,
    },
    advancedSettingsText: {
      flex: 1,
      fontSize: 14,
      fontWeight: '500',
      color: colors.primary,
    },
    unitSelector: {
      flexDirection: 'row',
      gap: 8,
    },
    unitButton: {
      paddingHorizontal: 16,
      paddingVertical: 6,
      borderRadius: 8,
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
    },
    unitButtonActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    unitButtonText: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: colors.text,
    },
    unitButtonTextActive: {
      color: '#FFFFFF',
    },
    currencySelector: {
      flexDirection: 'row',
      gap: 6,
    },
    currencyButton: {
      width: 40,
      height: 32,
      borderRadius: 8,
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    currencyButtonActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    currencyButtonText: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: colors.text,
    },
    currencyButtonTextActive: {
      color: '#FFFFFF',
    },
    aboutSection: {
      flexDirection: 'column',
      alignItems: 'flex-start',
      padding: 20,
      borderBottomWidth: 0,
    },
    aboutContent: {
      width: '100%',
      marginTop: 12,
    },
    aboutTitle: {
      fontSize: 18,
      fontWeight: '700' as const,
      color: colors.text,
      marginBottom: 8,
    },
    aboutDescription: {
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 20,
      marginBottom: 20,
    },
    aboutSectionTitle: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: colors.text,
      marginBottom: 12,
      marginTop: 8,
    },
    featureItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 12,
      paddingLeft: 4,
    },
    featureBullet: {
      fontSize: 18,
      marginRight: 12,
      lineHeight: 22,
    },
    featureText: {
      flex: 1,
      fontSize: 14,
      color: colors.text,
      lineHeight: 22,
    },
    versionContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 20,
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    versionLabel: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    versionText: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: colors.primary,
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
      backgroundColor: colors.card,
      borderRadius: 20,
      padding: 20,
      gap: 12,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: '700' as const,
      color: colors.text,
    },
    modalDescription: {
      color: colors.textSecondary,
    },
    modalCategoryButton: {
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    modalCategoryText: {
      fontSize: 16,
      color: colors.text,
    },
    modalCloseButton: {
      marginTop: 4,
      paddingVertical: 12,
      borderRadius: 12,
      backgroundColor: colors.surface,
      alignItems: 'center',
    },
    modalCloseButtonText: {
      color: colors.text,
      fontWeight: '600' as const,
    },
  });
