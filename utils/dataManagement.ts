import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { Platform } from "react-native";

import { FuelLog, Vehicle, VehicleCategory } from "@/types/vehicle";
import { MaintenanceRecord, MaintenanceTask } from "@/types/maintenance";

interface AppData {
  vehicles: string | any[] | null;
  tasks: string | any[] | null;
  records: string | any[] | null;
  fuelLogs: string | any[] | null;
  preferences: string | object | null;
  theme: string | null;
  language: string | null;
  notifications: string | boolean | null;
  images?: Record<string, string>; // Filename -> Base64
  exportDate: string;
  version: string;
}

const STORAGE_KEYS = {
  VEHICLES: "@vehicles",
  TASKS: "@maintenance_tasks",
  RECORDS: "@maintenance_records",
  FUEL_LOGS: "@fuel_logs",
  PREFERENCES: "@preferences",
  THEME: "@theme_mode",
  LANGUAGE: "@language",
  NOTIFICATIONS: "@notifications_enabled",
};

const APP_VERSION = "1.0.0";

const createPayload = (overrides?: Partial<AppData>): AppData => ({
  vehicles: overrides?.vehicles ?? null,
  tasks: overrides?.tasks ?? null,
  records: overrides?.records ?? null,
  fuelLogs: overrides?.fuelLogs ?? null,
  preferences: overrides?.preferences ?? null,
  theme: overrides?.theme ?? null,
  language: overrides?.language ?? null,
  notifications: overrides?.notifications ?? null,
  images: overrides?.images,
  exportDate: new Date().toISOString(),
  version: APP_VERSION,
});

const saveExportFile = async (
  jsonData: string,
  suffix: string
): Promise<boolean> => {
  const datePart = new Date().toISOString().split("T")[0];
  const safeSuffix = suffix.replace(/\s+/g, "-").toLowerCase();
  const fileName = `vehicle-maintenance-${safeSuffix}-${datePart}.json`;

  if (Platform.OS === "web") {
    try {
      const blob = new Blob([jsonData], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(url);
      return true;
    } catch (error) {
      console.error("Error exporting data on web:", error);
      return false;
    }
  }

  try {
    const fileUri = `${FileSystem.documentDirectory}${fileName}`;
    await FileSystem.writeAsStringAsync(fileUri, jsonData);

    const canShare = await Sharing.isAvailableAsync();
    if (canShare) {
      await Sharing.shareAsync(fileUri, {
        mimeType: "application/json",
        dialogTitle: "Export Vehicle Maintenance Data",
        UTI: "public.json",
      });
    }
    return true;
  } catch (error) {
    console.error("Error exporting data on device:", error);
    return false;
  }
};

/**
 * Export all app data to a JSON file
 */
/**
 * Export all app data to a JSON file
 */
export async function exportData(): Promise<boolean> {
  try {
    const vehiclesJson = await AsyncStorage.getItem(STORAGE_KEYS.VEHICLES);
    const vehicles: Vehicle[] = vehiclesJson ? JSON.parse(vehiclesJson) : [];
    const images: Record<string, string> = {};

    // Process images
    if (vehicles.length > 0) {
      for (const vehicle of vehicles) {
        if (vehicle.photo) {
          try {
            // Extract filename from URI
            const filename = vehicle.photo.split("/").pop();
            if (filename) {
              // Read file as Base64
              const base64 = await FileSystem.readAsStringAsync(vehicle.photo, {
                encoding: FileSystem.EncodingType.Base64,
              });
              images[filename] = base64;
            }
          } catch (err) {
            console.warn(
              `Failed to export image for vehicle ${vehicle.id}`,
              err
            );
          }
        }
      }
    }

    // Gather all data from AsyncStorage
    const data: AppData = {
      vehicles: vehiclesJson,
      tasks: await AsyncStorage.getItem(STORAGE_KEYS.TASKS),
      records: await AsyncStorage.getItem(STORAGE_KEYS.RECORDS),
      fuelLogs: await AsyncStorage.getItem(STORAGE_KEYS.FUEL_LOGS),
      preferences: await AsyncStorage.getItem(STORAGE_KEYS.PREFERENCES),
      theme: await AsyncStorage.getItem(STORAGE_KEYS.THEME),
      language: await AsyncStorage.getItem(STORAGE_KEYS.LANGUAGE),
      notifications: await AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATIONS),
      images: Object.keys(images).length > 0 ? images : undefined,
      exportDate: new Date().toISOString(),
      version: APP_VERSION,
    };

    const jsonData = JSON.stringify(data, null, 2);
    return await saveExportFile(jsonData, "backup");
  } catch (error) {
    console.error("Error exporting data:", error);
    return false;
  }
}

const filterDataByVehicleIds = (
  vehicleIds: string[],
  vehicles: Vehicle[],
  tasks: MaintenanceTask[],
  records: MaintenanceRecord[]
) => {
  const idSet = new Set(vehicleIds);
  const filteredVehicles = vehicles.filter((v) => idSet.has(v.id));
  const filteredTasks = tasks.filter((t) => idSet.has(t.vehicleId));
  const filteredRecords = records.filter((r) => idSet.has(r.vehicleId));

  return {
    filteredVehicles,
    filteredTasks,
    filteredRecords,
  };
};

const filterFuelLogsByVehicleIds = (
  fuelLogs: FuelLog[],
  vehicleIds: string[]
) => {
  if (!fuelLogs || fuelLogs.length === 0) return [];
  const idSet = new Set(vehicleIds);
  return fuelLogs.filter((log) => idSet.has(log.vehicleId));
};

export async function exportCategoryData(
  category: VehicleCategory,
  vehicles: Vehicle[],
  tasks: MaintenanceTask[],
  records: MaintenanceRecord[],
  fuelLogs: FuelLog[]
): Promise<boolean> {
  const categoryVehicles = vehicles.filter(
    (vehicle) => (vehicle.category ?? "other") === category
  );

  if (categoryVehicles.length === 0) {
    return false;
  }

  const ids = categoryVehicles.map((v) => v.id);
  const { filteredTasks, filteredRecords } = filterDataByVehicleIds(
    ids,
    vehicles,
    tasks,
    records
  );
  const filteredFuelLogs = filterFuelLogsByVehicleIds(fuelLogs, ids);

  const images: Record<string, string> = {};
  for (const vehicle of categoryVehicles) {
    if (vehicle.photo) {
      try {
        const filename = vehicle.photo.split("/").pop();
        if (filename) {
          const base64 = await FileSystem.readAsStringAsync(vehicle.photo, {
            encoding: FileSystem.EncodingType.Base64,
          });
          images[filename] = base64;
        }
      } catch (err) {
        console.warn(`Failed to export image for vehicle ${vehicle.id}`, err);
      }
    }
  }

  const payload = createPayload({
    vehicles: categoryVehicles,
    tasks: filteredTasks,
    records: filteredRecords,
    fuelLogs: filteredFuelLogs,
    images: Object.keys(images).length > 0 ? images : undefined,
  });

  return saveExportFile(
    JSON.stringify(payload, null, 2),
    `category-${category}`
  );
}

export async function exportVehiclesByIds(
  vehicleIds: string[],
  vehicles: Vehicle[],
  tasks: MaintenanceTask[],
  records: MaintenanceRecord[],
  fuelLogs: FuelLog[]
): Promise<boolean> {
  if (vehicleIds.length === 0) {
    return false;
  }

  const { filteredVehicles, filteredTasks, filteredRecords } =
    filterDataByVehicleIds(vehicleIds, vehicles, tasks, records);
  const filteredFuelLogs = filterFuelLogsByVehicleIds(fuelLogs, vehicleIds);

  if (filteredVehicles.length === 0) {
    return false;
  }

  const images: Record<string, string> = {};
  for (const vehicle of filteredVehicles) {
    if (vehicle.photo) {
      try {
        const filename = vehicle.photo.split("/").pop();
        if (filename) {
          const base64 = await FileSystem.readAsStringAsync(vehicle.photo, {
            encoding: FileSystem.EncodingType.Base64,
          });
          images[filename] = base64;
        }
      } catch (err) {
        console.warn(`Failed to export image for vehicle ${vehicle.id}`, err);
      }
    }
  }

  const payload = createPayload({
    vehicles: filteredVehicles,
    tasks: filteredTasks,
    records: filteredRecords,
    fuelLogs: filteredFuelLogs,
    images: Object.keys(images).length > 0 ? images : undefined,
  });

  return saveExportFile(
    JSON.stringify(payload, null, 2),
    `selection-${filteredVehicles.length}`
  );
}

/**
 * Import data from a JSON backup file
 */
/**
 * Import data from a JSON backup file
 */
export async function importData(jsonString: string): Promise<boolean> {
  try {
    const data: AppData = JSON.parse(jsonString);

    // Validate data structure
    if (!data.exportDate || !data.version) {
      throw new Error("Invalid backup file format");
    }

    // Helper to ensure data is a string (for AsyncStorage)
    const ensureString = (value: any): string => {
      if (typeof value === "string") {
        return value;
      }
      return JSON.stringify(value);
    };

    // Import images first if they exist
    if (data.images) {
      const imagesDir = `${FileSystem.documentDirectory}images/`;
      const dirInfo = await FileSystem.getInfoAsync(imagesDir);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(imagesDir, { intermediates: true });
      }

      for (const [filename, base64] of Object.entries(data.images)) {
        try {
          const fileUri = `${imagesDir}${filename}`;
          await FileSystem.writeAsStringAsync(fileUri, base64, {
            encoding: FileSystem.EncodingType.Base64,
          });
        } catch (err) {
          console.warn(`Failed to import image ${filename}`, err);
        }
      }
    }

    // Process vehicles to update image paths
    let vehiclesData = data.vehicles;
    if (vehiclesData && data.images) {
      try {
        const vehicles: Vehicle[] =
          typeof vehiclesData === "string"
            ? JSON.parse(vehiclesData)
            : vehiclesData;

        const updatedVehicles = vehicles.map((v) => {
          if (v.photo) {
            const filename = v.photo.split("/").pop();
            if (filename && data.images && data.images[filename]) {
              // Update path to local document directory
              return {
                ...v,
                photo: `${FileSystem.documentDirectory}images/${filename}`,
              };
            }
          }
          return v;
        });
        vehiclesData = JSON.stringify(updatedVehicles);
      } catch (err) {
        console.warn("Error processing vehicle images during import", err);
      }
    }

    // Import all data
    const promises: Promise<void>[] = [];

    if (vehiclesData) {
      promises.push(
        AsyncStorage.setItem(STORAGE_KEYS.VEHICLES, ensureString(vehiclesData))
      );
    }
    if (data.tasks) {
      promises.push(
        AsyncStorage.setItem(STORAGE_KEYS.TASKS, ensureString(data.tasks))
      );
    }
    if (data.records) {
      promises.push(
        AsyncStorage.setItem(STORAGE_KEYS.RECORDS, ensureString(data.records))
      );
    }
    if (data.fuelLogs) {
      promises.push(
        AsyncStorage.setItem(
          STORAGE_KEYS.FUEL_LOGS,
          ensureString(data.fuelLogs)
        )
      );
    }
    if (data.preferences) {
      promises.push(
        AsyncStorage.setItem(
          STORAGE_KEYS.PREFERENCES,
          ensureString(data.preferences)
        )
      );
    }
    if (data.theme) {
      promises.push(
        AsyncStorage.setItem(STORAGE_KEYS.THEME, ensureString(data.theme))
      );
    }
    if (data.language) {
      promises.push(
        AsyncStorage.setItem(STORAGE_KEYS.LANGUAGE, ensureString(data.language))
      );
    }
    if (data.notifications) {
      promises.push(
        AsyncStorage.setItem(
          STORAGE_KEYS.NOTIFICATIONS,
          ensureString(data.notifications)
        )
      );
    }

    await Promise.all(promises);
    return true;
  } catch (error) {
    console.error("Error importing data:", error);
    return false;
  }
}

/**
 * Clear all app data
 */
export async function clearAllData(): Promise<boolean> {
  try {
    // Clear all main storage keys
    const keys = Object.values(STORAGE_KEYS);

    // Also clear notification-specific keys
    const notificationKeys = [
      "@notifications_enabled",
      "@notification_history",
    ];

    const allKeys = [...keys, ...notificationKeys];
    await AsyncStorage.multiRemove(allKeys);
    return true;
  } catch (error) {
    console.error("Error clearing data:", error);
    return false;
  }
}

/**
 * Get the size of stored data in bytes
 */
export async function getDataSize(): Promise<number> {
  try {
    const keys = Object.values(STORAGE_KEYS);
    const items = await AsyncStorage.multiGet(keys);

    let totalSize = 0;
    items.forEach(([_, value]) => {
      if (value) {
        // Approximate size in bytes (UTF-16)
        totalSize += value.length * 2;
      }
    });

    return totalSize;
  } catch (error) {
    console.error("Error getting data size:", error);
    return 0;
  }
}

/**
 * Format bytes to human-readable string
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export { APP_VERSION };
