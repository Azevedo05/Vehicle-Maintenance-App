import AsyncStorage from "@react-native-async-storage/async-storage";
import createContextHook from "@nkzw/create-context-hook";
import { useCallback, useEffect, useState } from "react";

export type DistanceUnit = "km" | "mi";
export type Currency =
  | "EUR"
  | "USD"
  | "GBP"
  | "BRL"
  | "JPY"
  | "CAD"
  | "AUD"
  | "CHF";

export interface NotificationInterval {
  days?: number;
  km?: number;
}

export interface NotificationSettings {
  notificationTime: number; // Hour of day (0-23)
  dateIntervals: number[]; // Days before (e.g., [7, 3, 1])
  overdueIntervals: number[]; // Days after (e.g., [1, 3, 7])
  overdueFrequency: "custom" | "daily" | "weekly" | "monthly";
}

export interface VehicleLayout {
  showQuickReminders: boolean;
  showMaintenanceOverview: boolean;
  showMaintenanceHistory: boolean;
  showFuelLogs: boolean;
}

interface Preferences {
  distanceUnit: DistanceUnit;
  currency: Currency;
  notificationSettings: NotificationSettings;
  vehicleLayout: VehicleLayout;
  isOnboardingCompleted: boolean;
}

const PREFERENCES_STORAGE_KEY = "@preferences";

const DEFAULT_PREFERENCES: Preferences = {
  distanceUnit: "km",
  currency: "EUR",
  notificationSettings: {
    notificationTime: 9, // 9 AM
    dateIntervals: [7, 3, 1], // 7, 3, and 1 day before
    overdueIntervals: [1, 3, 7], // 1, 3, and 7 days after
    overdueFrequency: "custom",
  },
  vehicleLayout: {
    showQuickReminders: true,
    showMaintenanceOverview: true,
    showMaintenanceHistory: true,
    showFuelLogs: true,
  },
  isOnboardingCompleted: false,
};

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  EUR: "€",
  USD: "$",
  GBP: "£",
  BRL: "R$",
  JPY: "¥",
  CAD: "CA$",
  AUD: "A$",
  CHF: "CHF",
};

export const DISTANCE_LABELS: Record<DistanceUnit, string> = {
  km: "Kilometers",
  mi: "Miles",
};

export const [PreferencesProvider, usePreferences] = createContextHook(() => {
  const [preferences, setPreferences] =
    useState<Preferences>(DEFAULT_PREFERENCES);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const stored = await AsyncStorage.getItem(PREFERENCES_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Force distanceUnit to km for now as the feature is disabled
        parsed.distanceUnit = "km";

        setPreferences({ ...DEFAULT_PREFERENCES, ...parsed });
      }
    } catch (error) {
      console.error("Error loading preferences:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const savePreferences = useCallback(async (newPreferences: Preferences) => {
    try {
      await AsyncStorage.setItem(
        PREFERENCES_STORAGE_KEY,
        JSON.stringify(newPreferences)
      );
      setPreferences(newPreferences);
    } catch (error) {
      console.error("Error saving preferences:", error);
    }
  }, []);

  const setDistanceUnit = useCallback(
    async (unit: DistanceUnit) => {
      await savePreferences({ ...preferences, distanceUnit: unit });
    },
    [preferences, savePreferences]
  );

  const setCurrency = useCallback(
    async (currency: Currency) => {
      await savePreferences({ ...preferences, currency });
    },
    [preferences, savePreferences]
  );

  const setNotificationSettings = useCallback(
    async (settings: NotificationSettings) => {
      await savePreferences({ ...preferences, notificationSettings: settings });
    },
    [preferences, savePreferences]
  );

  const completeOnboarding = useCallback(async () => {
    await savePreferences({ ...preferences, isOnboardingCompleted: true });
  }, [preferences, savePreferences]);

  // Helper functions for conversion
  const convertDistance = useCallback(
    (value: number, fromUnit: DistanceUnit = "km"): number => {
      if (fromUnit === preferences.distanceUnit) {
        return value;
      }
      // Convert km to miles or vice versa
      return fromUnit === "km" ? value * 0.621371 : value / 0.621371;
    },
    [preferences.distanceUnit]
  );

  const formatDistance = useCallback(
    (value: number, fromUnit: DistanceUnit = "km"): string => {
      const converted = convertDistance(value, fromUnit);
      return `${Math.round(converted).toLocaleString()} ${
        preferences.distanceUnit
      }`;
    },
    [convertDistance, preferences.distanceUnit]
  );

  const formatCurrency = useCallback(
    (value: number): string => {
      const symbol = CURRENCY_SYMBOLS[preferences.currency];
      return `${symbol}${value.toFixed(2)}`;
    },
    [preferences.currency]
  );

  const setVehicleLayout = useCallback(
    async (layout: VehicleLayout) => {
      await savePreferences({ ...preferences, vehicleLayout: layout });
    },
    [preferences, savePreferences]
  );

  return {
    preferences,
    isLoading,
    distanceUnit: preferences.distanceUnit,
    currency: preferences.currency,
    currencySymbol: CURRENCY_SYMBOLS[preferences.currency],
    notificationSettings: preferences.notificationSettings,
    vehicleLayout: preferences.vehicleLayout,
    isOnboardingCompleted: preferences.isOnboardingCompleted,
    setDistanceUnit,
    setCurrency,
    setNotificationSettings,
    setVehicleLayout,
    completeOnboarding,
    convertDistance,
    formatDistance,
    formatCurrency,
  };
});
