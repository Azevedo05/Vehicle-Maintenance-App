import AsyncStorage from "@react-native-async-storage/async-storage";
import { Vehicle, FuelLog } from "@/types/vehicle";
import { MaintenanceTask, MaintenanceRecord } from "@/types/maintenance";
import { Reminder } from "@/components/vehicle-details/quick-reminders/types";

export const STORAGE_KEYS = {
  VEHICLES: "@vehicles",
  TASKS: "@maintenance_tasks",
  RECORDS: "@maintenance_records",
  FUEL_LOGS: "@fuel_logs",
  QUICK_REMINDERS: "@quick_reminders",
};

export const VehicleStorage = {
  async saveVehicles(vehicles: Vehicle[]) {
    await AsyncStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(vehicles));
  },
  async saveTasks(tasks: MaintenanceTask[]) {
    await AsyncStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  },
  async saveRecords(records: MaintenanceRecord[]) {
    await AsyncStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(records));
  },
  async saveFuelLogs(fuelLogs: FuelLog[]) {
    await AsyncStorage.setItem(
      STORAGE_KEYS.FUEL_LOGS,
      JSON.stringify(fuelLogs)
    );
  },
  async saveQuickReminders(reminders: Reminder[]) {
    await AsyncStorage.setItem(
      STORAGE_KEYS.QUICK_REMINDERS,
      JSON.stringify(reminders)
    );
  },
  async loadAllData() {
    const [
      vehiclesData,
      tasksData,
      recordsData,
      fuelLogsData,
      quickRemindersData,
    ] = await Promise.all([
      AsyncStorage.getItem(STORAGE_KEYS.VEHICLES),
      AsyncStorage.getItem(STORAGE_KEYS.TASKS),
      AsyncStorage.getItem(STORAGE_KEYS.RECORDS),
      AsyncStorage.getItem(STORAGE_KEYS.FUEL_LOGS),
      AsyncStorage.getItem(STORAGE_KEYS.QUICK_REMINDERS),
    ]);

    return {
      vehicles: vehiclesData ? JSON.parse(vehiclesData) : [],
      tasks: tasksData ? JSON.parse(tasksData) : [],
      records: recordsData ? JSON.parse(recordsData) : [],
      fuelLogs: fuelLogsData ? JSON.parse(fuelLogsData) : [],
      quickReminders: quickRemindersData
        ? JSON.parse(quickRemindersData)
        : null,
    };
  },
};
