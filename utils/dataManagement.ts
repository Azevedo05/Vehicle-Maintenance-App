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
 * Load sample data into the app
 */
export async function loadSampleData(): Promise<boolean> {
  try {
    // We use require here to load the JSON file directly
    const sampleData = require("../sample-data.json");
    const jsonString = JSON.stringify(sampleData);
    return await importData(jsonString);
  } catch (error) {
    console.error("Error loading sample data:", error);
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

import {
  SEED_VEHICLES,
  SEED_TASKS,
  SEED_RECORDS,
  SEED_FUEL,
} from "@/utils/seedData";

/**
 * Inject seed data into the app (merging with existing data)
 */
export async function injectSeedData(): Promise<boolean> {
  try {
    // 1. Get existing data
    const existingVehiclesStr = await AsyncStorage.getItem(
      STORAGE_KEYS.VEHICLES
    );
    const existingTasksStr = await AsyncStorage.getItem(STORAGE_KEYS.TASKS);
    const existingRecordsStr = await AsyncStorage.getItem(STORAGE_KEYS.RECORDS);
    const existingFuelLogsStr = await AsyncStorage.getItem(
      STORAGE_KEYS.FUEL_LOGS
    );

    const existingVehicles: Vehicle[] = existingVehiclesStr
      ? JSON.parse(existingVehiclesStr)
      : [];
    const existingTasks: MaintenanceTask[] = existingTasksStr
      ? JSON.parse(existingTasksStr)
      : [];
    const existingRecords: MaintenanceRecord[] = existingRecordsStr
      ? JSON.parse(existingRecordsStr)
      : [];
    const existingFuelLogs: FuelLog[] = existingFuelLogsStr
      ? JSON.parse(existingFuelLogsStr)
      : [];

    // 1.5 Process Seed Images
    // We expect images to be in assets/temp_images/ and we need to move them to document directory
    const seedImagesDir = `${FileSystem.documentDirectory}images/`;
    const dirInfo = await FileSystem.getInfoAsync(seedImagesDir);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(seedImagesDir, {
        intermediates: true,
      });
    }

    // Mapping of seed filenames to copied local URIs
    const processedSeedVehicles = await Promise.all(
      SEED_VEHICLES.map(async (v: Vehicle) => {
        if (!v.photo) return v;

        try {
          // Workaround: We will use Image.resolveAssetSource to get the URI (which might be a remote metro URL in dev)
          // and then download/copy it to the document directory.

          let asset: any = null;
          // Image assets missing, skipping image injection for now
          asset = null;
          
          if (v.photo === "tesla_model_3_blue_1765127312244.png") {
             asset = require("../assets/temp_images/tesla_model_3_blue_1765127312244.png");
          } else if (v.photo === "ford_transit_white_v2_1765128177999.png") {
             asset = require("../assets/temp_images/ford_transit_white_v2_1765128177999.png");
          } else if (v.photo === "volvo_xc90_green_1765127340928.png") {
             asset = require("../assets/temp_images/volvo_xc90_green_1765127340928.png");
          }
          

          if (asset) {
            const { Image } = require("react-native");
            const source = Image.resolveAssetSource(asset);
            const uri = source.uri;

            const targetFilename = `seed_${Date.now()}_${v.photo}`;
            const targetUri = `${seedImagesDir}${targetFilename}`;

            // In dev (Metro), the uri is http://... so we must download it.
            // In prod, it might be file:// or asset://. downloadAsync handles http.
            // copyAsync handles file://.
            // We'll try downloadAsync first as it's most likely in dev.

            if (uri.startsWith("http")) {
              await FileSystem.downloadAsync(uri, targetUri);
            } else {
              await FileSystem.copyAsync({ from: uri, to: targetUri });
            }

            return { ...v, photo: targetUri };
          }
        } catch (e) {
          console.warn("Failed to copy seed image", e);
        }
        return v;
      })
    );

    // 2. Merge data (avoiding duplicates if IDs match, though seed IDs are unique "seed_...")
    // We filter out any seed data that might already exist to avoid duplication on multiple injections
    const newVehicles = [
      ...existingVehicles,
      ...processedSeedVehicles.filter(
        (sv: Vehicle) => !existingVehicles.some((ev) => ev.id === sv.id)
      ),
    ];
    const newTasks = [
      ...existingTasks,
      ...SEED_TASKS.filter(
        (st: MaintenanceTask) => !existingTasks.some((et) => et.id === st.id)
      ),
    ];
    const newRecords = [
      ...existingRecords,
      ...SEED_RECORDS.filter(
        (sr: MaintenanceRecord) =>
          !existingRecords.some((er) => er.id === sr.id)
      ),
    ];
    const newFuelLogs = [
      ...existingFuelLogs,
      ...SEED_FUEL.filter(
        (sl: FuelLog) => !existingFuelLogs.some((el) => el.id === sl.id)
      ),
    ];

    // 3. Save back to storage
    await AsyncStorage.multiSet([
      [STORAGE_KEYS.VEHICLES, JSON.stringify(newVehicles)],
      [STORAGE_KEYS.TASKS, JSON.stringify(newTasks)],
      [STORAGE_KEYS.RECORDS, JSON.stringify(newRecords)],
      [STORAGE_KEYS.FUEL_LOGS, JSON.stringify(newFuelLogs)],
    ]);

    return true;
  } catch (error) {
    console.error("Error injecting seed data:", error);
    return false;
  }
}
