import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { useCallback, useEffect, useRef, useState } from 'react';

import {
  FuelLog,
  MaintenanceRecord,
  MaintenanceTask,
  Vehicle,
} from '@/types/vehicle';

const STORAGE_KEYS = {
  VEHICLES: '@vehicles',
  TASKS: '@maintenance_tasks',
  RECORDS: '@maintenance_records',
  FUEL_LOGS: '@fuel_logs',
};

export const [VehicleProvider, useVehicles] = createContextHook(() => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [tasks, setTasks] = useState<MaintenanceTask[]>([]);
  const [records, setRecords] = useState<MaintenanceRecord[]>([]);
  const [fuelLogs, setFuelLogs] = useState<FuelLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const lastSnapshotRef = useRef<{
    vehicles: Vehicle[];
    tasks: MaintenanceTask[];
    records: MaintenanceRecord[];
    fuelLogs: FuelLog[];
  } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [vehiclesData, tasksData, recordsData, fuelLogsData] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.VEHICLES),
        AsyncStorage.getItem(STORAGE_KEYS.TASKS),
        AsyncStorage.getItem(STORAGE_KEYS.RECORDS),
        AsyncStorage.getItem(STORAGE_KEYS.FUEL_LOGS),
      ]);

      if (vehiclesData) setVehicles(JSON.parse(vehiclesData));
      else setVehicles([]);
      
      if (tasksData) setTasks(JSON.parse(tasksData));
      else setTasks([]);
      
      if (recordsData) setRecords(JSON.parse(recordsData));
      else setRecords([]);

      if (fuelLogsData) setFuelLogs(JSON.parse(fuelLogsData));
      else setFuelLogs([]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const reloadData = useCallback(async () => {
    setIsLoading(true);
    await loadData();
  }, []);

  const saveVehicles = useCallback(async (newVehicles: Vehicle[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(newVehicles));
      setVehicles(newVehicles);
    } catch (error) {
      console.error('Error saving vehicles:', error);
    }
  }, []);

  const saveTasks = useCallback(async (newTasks: MaintenanceTask[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(newTasks));
      setTasks(newTasks);
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  }, []);

  const saveRecords = useCallback(async (newRecords: MaintenanceRecord[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(newRecords));
      setRecords(newRecords);
    } catch (error) {
      console.error('Error saving records:', error);
    }
  }, []);

  const saveFuelLogs = useCallback(async (newFuelLogs: FuelLog[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.FUEL_LOGS, JSON.stringify(newFuelLogs));
      setFuelLogs(newFuelLogs);
    } catch (error) {
      console.error('Error saving fuel logs:', error);
    }
  }, []);

  const takeSnapshot = useCallback(() => {
    // Fazer cópias dos arrays para evitar problemas de referência
    const snapshot = {
      vehicles: [...vehicles],
      tasks: [...tasks],
      records: [...records],
      fuelLogs: [...fuelLogs],
    };
    lastSnapshotRef.current = snapshot;
  }, [vehicles, tasks, records, fuelLogs]);

  const restoreLastSnapshot = useCallback(async () => {
    const snapshot = lastSnapshotRef.current;
    if (!snapshot) {
      return;
    }

    await Promise.all([
      saveVehicles(snapshot.vehicles),
      saveTasks(snapshot.tasks),
      saveRecords(snapshot.records),
      saveFuelLogs(snapshot.fuelLogs),
    ]);

    lastSnapshotRef.current = null;
  }, [saveVehicles, saveTasks, saveRecords, saveFuelLogs]);

  const addVehicle = useCallback(
    async (vehicle: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>) => {
      takeSnapshot();
      const newVehicle: Vehicle = {
        ...vehicle,
        archived: vehicle.archived ?? false,
        id: Date.now().toString(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      await saveVehicles([...vehicles, newVehicle]);
      return newVehicle;
    },
    [vehicles, saveVehicles, takeSnapshot]
  );

  const updateVehicle = useCallback(
    async (id: string, updates: Partial<Vehicle>) => {
      takeSnapshot();
      const updatedVehicles = vehicles.map((v) =>
        v.id === id ? { ...v, ...updates, updatedAt: Date.now() } : v
      );
      await saveVehicles(updatedVehicles);
    },
    [vehicles, saveVehicles, takeSnapshot]
  );

  const deleteVehicle = useCallback(
    async (id: string) => {
      takeSnapshot();
      await saveVehicles(vehicles.filter((v) => v.id !== id));
      await saveTasks(tasks.filter((t) => t.vehicleId !== id));
      await saveRecords(records.filter((r) => r.vehicleId !== id));
      await saveFuelLogs(fuelLogs.filter((f) => f.vehicleId !== id));
    },
    [vehicles, tasks, records, fuelLogs, saveVehicles, saveTasks, saveRecords, saveFuelLogs, takeSnapshot]
  );

  const setVehicleArchived = useCallback(
    async (id: string, archived: boolean) => {
      takeSnapshot();
      const updatedVehicles = vehicles.map((v) =>
        v.id === id ? { ...v, archived, updatedAt: Date.now() } : v
      );
      await saveVehicles(updatedVehicles);
    },
    [vehicles, saveVehicles, takeSnapshot]
  );

  const setVehiclesArchived = useCallback(
    async (ids: string[], archived: boolean) => {
      if (ids.length === 0) return;
      takeSnapshot();
      const idSet = new Set(ids);
      const updatedVehicles = vehicles.map((v) =>
        idSet.has(v.id) ? { ...v, archived, updatedAt: Date.now() } : v
      );
      await saveVehicles(updatedVehicles);
    },
    [vehicles, saveVehicles, takeSnapshot]
  );

  const deleteVehiclesBulk = useCallback(
    async (ids: string[]) => {
      if (ids.length === 0) return;

      // Save current state before a destructive bulk operation
      takeSnapshot();
      const idSet = new Set(ids);
      await saveVehicles(vehicles.filter((v) => !idSet.has(v.id)));
      await saveTasks(tasks.filter((t) => !idSet.has(t.vehicleId)));
      await saveRecords(records.filter((r) => !idSet.has(r.vehicleId)));
      await saveFuelLogs(fuelLogs.filter((f) => !idSet.has(f.vehicleId)));
    },
    [vehicles, tasks, records, fuelLogs, saveVehicles, saveTasks, saveRecords, saveFuelLogs, takeSnapshot]
  );

  const addTask = useCallback(
    async (task: Omit<MaintenanceTask, 'id' | 'createdAt' | 'updatedAt'>) => {
      takeSnapshot();
      const newTask: MaintenanceTask = {
        ...task,
        id: Date.now().toString(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      await saveTasks([...tasks, newTask]);
      return newTask;
    },
    [tasks, saveTasks, takeSnapshot]
  );

  const updateTask = useCallback(
    async (id: string, updates: Partial<MaintenanceTask>) => {
      takeSnapshot();
      const updatedTasks = tasks.map((t) =>
        t.id === id ? { ...t, ...updates, updatedAt: Date.now() } : t
      );
      await saveTasks(updatedTasks);
    },
    [tasks, saveTasks, takeSnapshot]
  );

  const deleteTask = useCallback(
    async (id: string) => {
      takeSnapshot();
      await saveTasks(tasks.filter((t) => t.id !== id));
    },
    [tasks, saveTasks, takeSnapshot]
  );

  const addRecord = useCallback(
    async (record: Omit<MaintenanceRecord, 'id' | 'createdAt'>) => {
      takeSnapshot();
      const newRecord: MaintenanceRecord = {
        ...record,
        id: Date.now().toString(),
        createdAt: Date.now(),
      };
      await saveRecords([...records, newRecord]);

      if (record.taskId) {
        const task = tasks.find((t) => t.id === record.taskId);
        if (task) {
          if (task.isRecurring) {
            // For recurring tasks, update the next due date/mileage
            const updates: Partial<MaintenanceTask> = {
              lastCompletedDate: record.date,
              lastCompletedMileage: record.mileage,
            };

            if (task.intervalType === 'mileage') {
              updates.nextDueMileage = record.mileage + task.intervalValue;
            } else {
              updates.nextDueDate = record.date + task.intervalValue * 24 * 60 * 60 * 1000;
            }

            await updateTask(record.taskId, updates);
          } else {
            // For non-recurring tasks, mark as completed
            await updateTask(record.taskId, { isCompleted: true });
          }
        }
      }

      return newRecord;
    },
    [records, tasks, saveRecords, updateTask, takeSnapshot]
  );

  const deleteRecord = useCallback(
    async (id: string) => {
      takeSnapshot();
      await saveRecords(records.filter((r) => r.id !== id));
    },
    [records, saveRecords, takeSnapshot]
  );

  const addFuelLog = useCallback(
    async (log: Omit<FuelLog, 'id' | 'createdAt'>) => {
      takeSnapshot();
      const newLog: FuelLog = {
        ...log,
        id: Date.now().toString(),
        createdAt: Date.now(),
      };
      await saveFuelLogs([newLog, ...fuelLogs]);
      return newLog;
    },
    [fuelLogs, saveFuelLogs, takeSnapshot]
  );

  const deleteFuelLog = useCallback(
    async (id: string) => {
      takeSnapshot();
      await saveFuelLogs(fuelLogs.filter((log) => log.id !== id));
    },
    [fuelLogs, saveFuelLogs, takeSnapshot]
  );

  const getVehicleById = useCallback(
    (id: string) => vehicles.find((v) => v.id === id),
    [vehicles]
  );

  const getTasksByVehicle = useCallback(
    (vehicleId: string) => tasks.filter((t) => t.vehicleId === vehicleId),
    [tasks]
  );

  const getRecordsByVehicle = useCallback(
    (vehicleId: string) =>
      records
        .filter((r) => r.vehicleId === vehicleId)
        .sort((a, b) => b.date - a.date),
    [records]
  );

  const getRecordById = useCallback(
    (id: string) => records.find((r) => r.id === id),
    [records]
  );

  const getFuelLogsByVehicle = useCallback(
    (vehicleId: string) =>
      fuelLogs
        .filter((log) => log.vehicleId === vehicleId)
        .sort((a, b) => b.date - a.date),
    [fuelLogs]
  );

  const getUpcomingTasks = useCallback(
    (vehicleId?: string) => {
      const now = Date.now();
      const filteredTasks = vehicleId
        ? tasks.filter((t) => t.vehicleId === vehicleId && !t.isCompleted)
        : tasks.filter((t) => !t.isCompleted);

      return filteredTasks
        .map((task) => {
          const vehicle = vehicles.find((v) => v.id === task.vehicleId);
          if (!vehicle) return null;

          let isDue = false;
          let daysUntilDue: number | undefined;
          let milesUntilDue: number | undefined;

          if (task.intervalType === 'date' && task.nextDueDate) {
            const daysMs = task.nextDueDate - now;
            daysUntilDue = Math.floor(daysMs / (24 * 60 * 60 * 1000));
            isDue = daysUntilDue <= 7;
          } else if (task.intervalType === 'mileage' && task.nextDueMileage) {
            milesUntilDue = task.nextDueMileage - vehicle.currentMileage;
            isDue = milesUntilDue <= 500;
          }

          return {
            task,
            vehicle,
            isDue,
            daysUntilDue,
            milesUntilDue,
          };
        })
        .filter((item): item is NonNullable<typeof item> => item !== null)
        .sort((a, b) => {
          if (a.isDue !== b.isDue) return a.isDue ? -1 : 1;
          if (a.daysUntilDue !== undefined && b.daysUntilDue !== undefined) {
            return a.daysUntilDue - b.daysUntilDue;
          }
          if (a.milesUntilDue !== undefined && b.milesUntilDue !== undefined) {
            return a.milesUntilDue - b.milesUntilDue;
          }
          return 0;
        });
    },
    [tasks, vehicles]
  );

  return {
    vehicles,
    tasks,
    records,
    fuelLogs,
    isLoading,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    deleteVehiclesBulk,
    addTask,
    updateTask,
    deleteTask,
    addRecord,
    deleteRecord,
    addFuelLog,
    deleteFuelLog,
    restoreLastSnapshot,
    getVehicleById,
    getTasksByVehicle,
    getRecordsByVehicle,
    getRecordById,
    getFuelLogsByVehicle,
    getUpcomingTasks,
    reloadData,
    setVehicleArchived,
    setVehiclesArchived,
  };
});
