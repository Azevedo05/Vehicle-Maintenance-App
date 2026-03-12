import { useState } from 'react';
import { Platform } from 'react-native';
import * as Calendar from 'expo-calendar';
import { useLocalization } from '@/contexts/LocalizationContext';
import { useAppAlert } from '@/contexts/AlertContext';
import Toast from 'react-native-toast-message';

export const useCalendarExport = () => {
  const { t } = useLocalization();
  const { showAlert } = useAppAlert();
  const [isExporting, setIsExporting] = useState(false);

  const getDefaultCalendarSource = async () => {
    const defaultCalendar = await Calendar.getDefaultCalendarAsync();
    return defaultCalendar.source;
  };

  const createCalendar = async () => {
    const defaultCalendarSource =
      Platform.OS === 'ios'
        ? await getDefaultCalendarSource()
        : { isLocalAccount: true, name: 'Vehicle App', type: Calendar.SourceType.LOCAL };

    const newCalendarID = await Calendar.createCalendarAsync({
      title: 'Vehicle Maintenance',
      color: '#3b82f6',
      entityType: Calendar.EntityTypes.EVENT,
      sourceId: defaultCalendarSource.id,
      source: defaultCalendarSource,
      name: 'internalCalendarName',
      ownerAccount: 'personal',
      accessLevel: Calendar.CalendarAccessLevel.OWNER,
    });
    return newCalendarID;
  };

  const getCalendarId = async () => {
    const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
    
    // Look for an existing writable calendar we created based on title
    const existingAppCalendar = calendars.find(c => c.title === 'Vehicle Maintenance');
    if (existingAppCalendar) return existingAppCalendar.id;

    // Check if there is already a default calendar configured in the system that allows modifications (iOS only)
    if (Platform.OS === 'ios') {
      const defaultCalendar = await Calendar.getDefaultCalendarAsync();
      if (defaultCalendar && defaultCalendar.allowsModifications) {
          return defaultCalendar.id;
      }
    }

    // Try to find the user's primary calendar
    const primaryCalendar = calendars.find(c => c.allowsModifications && c.isPrimary);
    if (primaryCalendar) return primaryCalendar.id;
    
    // Fallback to any writable calendar
    const anyWritableCalendar = calendars.find(c => c.allowsModifications);
    if (anyWritableCalendar) return anyWritableCalendar.id;

    // If absolutely no editable calendars found, try to create one (iOS mostly)
    if (Platform.OS === 'ios') {
      return await createCalendar();
    }
    
    throw new Error('No writable calendar found');
  };

  const exportToCalendar = async (
    title: string, 
    date: Date, 
    notes?: string, 
    location?: string
  ): Promise<string | null> => {
    setIsExporting(true);
    try {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      
      if (status !== 'granted') {
        showAlert({
          title: t('common.error'),
          message: t('maintenance.add_to_calendar_error'),
        });
        setIsExporting(false);
        return null;
      }

      const calendarId = await getCalendarId();
      if (!calendarId) throw new Error('No calendar ID found');
      
      // Events start at 9am and last 1 hour, or as an all-day event
      const startDate = new Date(date);
      startDate.setHours(9, 0, 0, 0);
      
      const endDate = new Date(startDate);
      endDate.setHours(10, 0, 0, 0);

      const eventId = await Calendar.createEventAsync(calendarId, {
        title,
        startDate,
        endDate,
        allDay: true,
        notes: notes || '',
        location: location || '',
      });

      Toast.show({
        type: 'success',
        text1: t('maintenance.add_to_calendar_success') || 'Added to calendar',
        props: { toastId: Date.now() },
      });
      
      return eventId;
    } catch (error) {
      console.error('Failed to export to calendar:', error);
      
      showAlert({
        title: t('common.error'),
        message: t('maintenance.add_to_calendar_error'),
      });
      return null;
    } finally {
      setIsExporting(false);
    }
  };

  const removeFromCalendar = async (eventId: string): Promise<boolean> => {
    setIsExporting(true);
    try {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      
      if (status !== 'granted') {
        showAlert({
          title: t('common.error'),
          message: t('maintenance.add_to_calendar_error'),
        });
        return false;
      }

      await Calendar.deleteEventAsync(eventId);
      
      Toast.show({
        type: 'success',
        text1: t('maintenance.remove_from_calendar_success'),
        props: { toastId: Date.now() },
      });
      
      return true;
    } catch (error) {
      console.error('Failed to remove from calendar:', error);
      // Don't show alert if event not found, just return false
      return false;
    } finally {
      setIsExporting(false);
    }
  };

  return {
    exportToCalendar,
    removeFromCalendar,
    isExporting
  };
};
