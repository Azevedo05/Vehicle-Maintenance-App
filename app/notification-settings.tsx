import { Stack, router } from 'expo-router';
import { 
  Clock, 
  Calendar, 
  Gauge, 
  History,
  ChevronRight,
  Trash2,
  Plus,
  X
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Modal,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useLocalization } from '@/contexts/LocalizationContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { usePreferences } from '@/contexts/PreferencesContext';

export default function NotificationSettingsScreen() {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const { notificationHistory, clearHistory } = useNotifications();
  const { notificationSettings, setNotificationSettings } = usePreferences();

  const [selectedTime, setSelectedTime] = useState(notificationSettings.notificationTime);
  const [dateIntervals, setDateIntervals] = useState<number[]>(notificationSettings.dateIntervals);
  const [mileageIntervals, setMileageIntervals] = useState<number[]>(notificationSettings.mileageIntervals);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showAddDateModal, setShowAddDateModal] = useState(false);
  const [showAddMileageModal, setShowAddMileageModal] = useState(false);
  const [newDateInterval, setNewDateInterval] = useState('');
  const [newMileageInterval, setNewMileageInterval] = useState('');

  const styles = createStyles(colors);

  const formatTime = (hour: number) => {
    return `${hour.toString().padStart(2, '0')}:00`;
  };

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const addDateInterval = () => {
    const value = parseInt(newDateInterval);
    if (!isNaN(value) && value > 0 && !dateIntervals.includes(value)) {
      const updated = [...dateIntervals, value].sort((a, b) => b - a);
      setDateIntervals(updated);
      setNewDateInterval('');
      setShowAddDateModal(false);
    } else {
      Alert.alert(t('common.error'), t('settings.invalid_interval'));
    }
  };

  const removeDateInterval = (value: number) => {
    setDateIntervals(dateIntervals.filter(v => v !== value));
  };

  const addMileageInterval = () => {
    const value = parseInt(newMileageInterval);
    if (!isNaN(value) && value > 0 && !mileageIntervals.includes(value)) {
      const updated = [...mileageIntervals, value].sort((a, b) => b - a);
      setMileageIntervals(updated);
      setNewMileageInterval('');
      setShowAddMileageModal(false);
    } else {
      Alert.alert(t('common.error'), t('settings.invalid_interval'));
    }
  };

  const removeMileageInterval = (value: number) => {
    setMileageIntervals(mileageIntervals.filter(v => v !== value));
  };

  const handleSaveSettings = async () => {
    try {
      if (dateIntervals.length === 0 || mileageIntervals.length === 0) {
        Alert.alert(t('common.error'), t('settings.need_intervals'));
        return;
      }

      await setNotificationSettings({
        notificationTime: selectedTime,
        dateIntervals,
        mileageIntervals,
      });

      Alert.alert(t('common.success'), t('settings.settings_saved'));
    } catch (error) {
      Alert.alert(t('common.error'), t('settings.settings_error'));
    }
  };

  const handleClearHistory = () => {
    Alert.alert(
      t('settings.clear_history'),
      t('settings.clear_history_confirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: clearHistory,
        },
      ]
    );
  };

  const formatHistoryDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: t('settings.notification_settings'),
          // Use the same background as other detail screens (e.g. vehicle details)
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
        }}
      />
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {/* Notification Time */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Clock size={20} color={colors.primary} />
              <Text style={styles.sectionTitle}>{t('settings.notification_time')}</Text>
            </View>
            <Text style={styles.sectionDescription}>
              {t('settings.notification_time_description')}
            </Text>
            
            <TouchableOpacity
              style={styles.timePickerButton}
              onPress={() => setShowTimePicker(true)}
            >
              <Clock size={24} color={colors.primary} />
              <Text style={styles.timePickerText}>{formatTime(selectedTime)}</Text>
              <Text style={styles.timePickerHint}>{t('settings.tap_to_change')}</Text>
            </TouchableOpacity>
          </View>

          {/* Date Intervals */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Calendar size={20} color={colors.primary} />
              <Text style={styles.sectionTitle}>{t('settings.date_intervals')}</Text>
            </View>
            <Text style={styles.sectionDescription}>
              {t('settings.date_intervals_description')}
            </Text>
            
            <View style={styles.intervalTags}>
              {dateIntervals.map((interval) => (
                <View key={interval} style={styles.intervalTag}>
                  <Text style={styles.intervalTagText}>
                    {interval} {t('settings.days_short')}
                  </Text>
                  <TouchableOpacity onPress={() => removeDateInterval(interval)}>
                    <X size={16} color={colors.text} />
                  </TouchableOpacity>
                </View>
              ))}
              
              <TouchableOpacity
                style={styles.addIntervalButton}
                onPress={() => setShowAddDateModal(true)}
              >
                <Plus size={20} color={colors.primary} />
                <Text style={styles.addIntervalButtonText}>{t('settings.add_interval')}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Mileage Intervals */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Gauge size={20} color={colors.primary} />
              <Text style={styles.sectionTitle}>{t('settings.mileage_intervals')}</Text>
            </View>
            <Text style={styles.sectionDescription}>
              {t('settings.mileage_intervals_description')}
            </Text>
            
            <View style={styles.intervalTags}>
              {mileageIntervals.map((interval) => (
                <View key={interval} style={styles.intervalTag}>
                  <Text style={styles.intervalTagText}>
                    {interval} km
                  </Text>
                  <TouchableOpacity onPress={() => removeMileageInterval(interval)}>
                    <X size={16} color={colors.text} />
                  </TouchableOpacity>
                </View>
              ))}
              
              <TouchableOpacity
                style={styles.addIntervalButton}
                onPress={() => setShowAddMileageModal(true)}
              >
                <Plus size={20} color={colors.primary} />
                <Text style={styles.addIntervalButtonText}>{t('settings.add_interval')}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSaveSettings}>
            <Text style={styles.saveButtonText}>{t('common.save')}</Text>
          </TouchableOpacity>

          {/* Notification History */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <History size={20} color={colors.primary} />
              <Text style={styles.sectionTitle}>{t('settings.notification_history')}</Text>
            </View>
            
            {notificationHistory.length > 0 ? (
              <>
                <TouchableOpacity style={styles.clearButton} onPress={handleClearHistory}>
                  <Trash2 size={16} color={colors.error} />
                  <Text style={styles.clearButtonText}>{t('settings.clear_history')}</Text>
                </TouchableOpacity>

                <View style={styles.historyList}>
                  {notificationHistory.slice(0, 20).map((item) => (
                    <View key={item.id} style={styles.historyItem}>
                      <View style={styles.historyContent}>
                        <Text style={styles.historyTitle}>{item.taskTitle}</Text>
                        <Text style={styles.historyVehicle}>{item.vehicleName}</Text>
                        <Text style={styles.historyDate}>{formatHistoryDate(item.sentAt)}</Text>
                        {item.snoozedUntil && (
                          <Text style={styles.historySnoozed}>
                            {t('settings.snoozed_until')} {formatHistoryDate(item.snoozedUntil)}
                          </Text>
                        )}
                      </View>
                      <ChevronRight size={16} color={colors.textSecondary} />
                    </View>
                  ))}
                </View>
              </>
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>{t('settings.no_notifications')}</Text>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Time Picker Modal */}
        <Modal
          visible={showTimePicker}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowTimePicker(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{t('settings.select_time')}</Text>
              <Text style={styles.modalDescription}>{t('settings.select_notification_time')}</Text>
              
              <FlatList
                data={hours}
                keyExtractor={(item) => item.toString()}
                style={styles.timeList}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.timeListItem,
                      selectedTime === item && styles.timeListItemActive,
                    ]}
                    onPress={() => {
                      setSelectedTime(item);
                      setShowTimePicker(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.timeListItemText,
                        selectedTime === item && styles.timeListItemTextActive,
                      ]}
                    >
                      {formatTime(item)}
                    </Text>
                  </TouchableOpacity>
                )}
              />
              
              <TouchableOpacity
                style={styles.timePickerCancelButton}
                onPress={() => setShowTimePicker(false)}
              >
                <Text style={styles.timePickerCancelButtonText}>{t('common.cancel')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Add Date Interval Modal */}
        <Modal
          visible={showAddDateModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowAddDateModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{t('settings.add_date_interval')}</Text>
              <Text style={styles.modalDescription}>{t('settings.days_before_notify')}</Text>
              
              <TextInput
                style={styles.modalInput}
                value={newDateInterval}
                onChangeText={setNewDateInterval}
                placeholder={t('settings.example_days')}
                placeholderTextColor={colors.placeholder}
                keyboardType="numeric"
                autoFocus
              />
              
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonCancel]}
                  onPress={() => {
                    setShowAddDateModal(false);
                    setNewDateInterval('');
                  }}
                >
                  <Text style={styles.modalButtonTextCancel}>{t('common.cancel')}</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonConfirm]}
                  onPress={addDateInterval}
                >
                  <Text style={styles.modalButtonTextConfirm}>{t('common.add')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Add Mileage Interval Modal */}
        <Modal
          visible={showAddMileageModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowAddMileageModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{t('settings.add_mileage_interval')}</Text>
              <Text style={styles.modalDescription}>{t('settings.km_before_notify')}</Text>
              
              <TextInput
                style={styles.modalInput}
                value={newMileageInterval}
                onChangeText={setNewMileageInterval}
                placeholder={t('settings.example_km')}
                placeholderTextColor={colors.placeholder}
                keyboardType="numeric"
                autoFocus
              />
              
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonCancel]}
                  onPress={() => {
                    setShowAddMileageModal(false);
                    setNewMileageInterval('');
                  }}
                >
                  <Text style={styles.modalButtonTextCancel}>{t('common.cancel')}</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonConfirm]}
                  onPress={addMileageInterval}
                >
                  <Text style={styles.modalButtonTextConfirm}>{t('common.add')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </>
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
      padding: 16,
    },
    section: {
      marginBottom: 24,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
      gap: 8,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
    },
    sectionDescription: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 12,
    },
    timeSelector: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    timeButton: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 8,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
    },
    timeButtonActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    timeButtonText: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.text,
    },
    timeButtonTextActive: {
      color: '#FFFFFF',
    },
    timePickerButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 12,
    },
    timePickerText: {
      fontSize: 24,
      fontWeight: '700',
      color: colors.primary,
    },
    timePickerHint: {
      flex: 1,
      fontSize: 13,
      color: colors.textSecondary,
      textAlign: 'right',
    },
    timeList: {
      maxHeight: 300,
      marginBottom: 16,
    },
    timeListItem: {
      padding: 16,
      borderRadius: 8,
      marginBottom: 4,
      backgroundColor: colors.background,
    },
    timeListItemActive: {
      backgroundColor: colors.primary,
    },
    timeListItemText: {
      fontSize: 18,
      fontWeight: '500',
      color: colors.text,
      textAlign: 'center',
    },
    timeListItemTextActive: {
      color: '#FFFFFF',
      fontWeight: '700',
    },
    timePickerCancelButton: {
      backgroundColor: colors.background,
      borderRadius: 8,
      padding: 14,
      alignItems: 'center',
      borderWidth: 2,
      borderColor: colors.border,
    },
    timePickerCancelButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
    },
    intervalTags: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    intervalTag: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primary + '20',
      borderRadius: 20,
      paddingVertical: 8,
      paddingHorizontal: 12,
      gap: 6,
    },
    intervalTagText: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.primary,
    },
    addIntervalButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: 20,
      paddingVertical: 8,
      paddingHorizontal: 12,
      gap: 4,
      borderWidth: 1,
      borderColor: colors.primary,
      borderStyle: 'dashed',
    },
    addIntervalButtonText: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.primary,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 16,
    },
    modalContent: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 24,
      width: '100%',
      maxWidth: 400,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 8,
    },
    modalDescription: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 16,
    },
    modalInput: {
      backgroundColor: colors.background,
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 16,
    },
    modalButtons: {
      flexDirection: 'row',
      gap: 12,
    },
    modalButton: {
      flex: 1,
      borderRadius: 8,
      padding: 14,
      alignItems: 'center',
    },
    modalButtonCancel: {
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
    },
    modalButtonConfirm: {
      backgroundColor: colors.primary,
    },
    modalButtonTextCancel: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
    },
    modalButtonTextConfirm: {
      fontSize: 16,
      fontWeight: '600',
      color: '#FFFFFF',
    },
    input: {
      backgroundColor: colors.card,
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
    },
    helperText: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 4,
    },
    saveButton: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      padding: 16,
      alignItems: 'center',
      marginBottom: 24,
    },
    saveButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#FFFFFF',
    },
    clearButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      padding: 12,
      borderRadius: 8,
      backgroundColor: `${colors.error}15`,
      marginBottom: 12,
    },
    clearButtonText: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.error,
    },
    historyList: {
      gap: 8,
    },
    historyItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 12,
      backgroundColor: colors.card,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    historyContent: {
      flex: 1,
    },
    historyTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 2,
    },
    historyVehicle: {
      fontSize: 13,
      color: colors.textSecondary,
      marginBottom: 2,
    },
    historyDate: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    historySnoozed: {
      fontSize: 12,
      color: colors.warning,
      marginTop: 2,
    },
    emptyState: {
      padding: 24,
      alignItems: 'center',
    },
    emptyText: {
      fontSize: 14,
      color: colors.textSecondary,
    },
  });

