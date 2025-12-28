import { FuelLog, Vehicle } from "@/types/vehicle";
import { MaintenanceRecord, MaintenanceTask } from "@/types/maintenance";
import { Reminder } from "@/components/vehicle-details/quick-reminders/types";
import { VehicleStorage } from "@/services/VehicleStorage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import createContextHook from "@nkzw/create-context-hook";
import { useCallback, useEffect, useRef, useState } from "react";

export const [VehicleProvider, useVehicles] = createContextHook(() => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [tasks, setTasks] = useState<MaintenanceTask[]>([]);
  const [records, setRecords] = useState<MaintenanceRecord[]>([]);
  const [fuelLogs, setFuelLogs] = useState<FuelLog[]>([]);
  const [quickReminders, setQuickReminders] = useState<Reminder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const lastSnapshotRef = useRef<{
    vehicles: Vehicle[];
    tasks: MaintenanceTask[];
    records: MaintenanceRecord[];
    fuelLogs: FuelLog[];
    quickReminders: Reminder[];
  } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await VehicleStorage.loadAllData();
      setVehicles(data.vehicles);
      setTasks(data.tasks);
      setRecords(data.records);
      setFuelLogs(data.fuelLogs);

      if (data.quickReminders) {
        setQuickReminders(data.quickReminders);
      } else {
        // Migração de lembretes antigos
        if (data.vehicles.length > 0) {
          const migratedReminders: Reminder[] = [];
          for (const v of data.vehicles) {
            const legacyData = await AsyncStorage.getItem(
              `@quick_reminders_${v.id}`
            );
            if (legacyData) {
              const parsed = JSON.parse(legacyData);
              migratedReminders.push(
                ...parsed.map((r: Reminder) => ({ ...r, vehicleId: v.id }))
              );
            }
          }
          if (migratedReminders.length > 0) {
            setQuickReminders(migratedReminders);
            await VehicleStorage.saveQuickReminders(migratedReminders);
          } else {
            setQuickReminders([]);
          }
        } else {
          setQuickReminders([]);
        }
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const reloadData = useCallback(async () => {
    setIsLoading(true);
    await loadData();
  }, []);

  const saveVehicles = useCallback(async (newVehicles: Vehicle[]) => {
    await VehicleStorage.saveVehicles(newVehicles);
    setVehicles(newVehicles);
  }, []);

  const saveTasks = useCallback(async (newTasks: MaintenanceTask[]) => {
    await VehicleStorage.saveTasks(newTasks);
    setTasks(newTasks);
  }, []);

  const saveRecords = useCallback(async (newRecords: MaintenanceRecord[]) => {
    await VehicleStorage.saveRecords(newRecords);
    setRecords(newRecords);
  }, []);

  const saveFuelLogs = useCallback(async (newFuelLogs: FuelLog[]) => {
    await VehicleStorage.saveFuelLogs(newFuelLogs);
    setFuelLogs(newFuelLogs);
  }, []);

  const saveQuickReminders = useCallback(async (newReminders: Reminder[]) => {
    await VehicleStorage.saveQuickReminders(newReminders);
    setQuickReminders(newReminders);
  }, []);

  const takeSnapshot = useCallback(() => {
    // Fazer cópias dos arrays para evitar problemas de referência
    const snapshot = {
      vehicles: [...vehicles],
      tasks: [...tasks],
      records: [...records],
      fuelLogs: [...fuelLogs],
      quickReminders: [...quickReminders],
    };
    lastSnapshotRef.current = snapshot;
  }, [vehicles, tasks, records, fuelLogs, quickReminders]);

  const addQuickReminder = useCallback(
    async (reminder: Reminder) => {
      takeSnapshot();
      await saveQuickReminders([reminder, ...quickReminders]);
    },
    [quickReminders, saveQuickReminders, takeSnapshot]
  );

  const deleteQuickReminder = useCallback(
    async (id: string) => {
      takeSnapshot();
      await saveQuickReminders(quickReminders.filter((r) => r.id !== id));
    },
    [quickReminders, saveQuickReminders, takeSnapshot]
  );

  const updateQuickReminder = useCallback(
    async (id: string, updates: Partial<Reminder>) => {
      takeSnapshot();
      const updatedReminders = quickReminders.map((r) =>
        r.id === id ? { ...r, ...updates } : r
      );
      await saveQuickReminders(updatedReminders);
    },
    [quickReminders, saveQuickReminders, takeSnapshot]
  );

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
      saveQuickReminders(snapshot.quickReminders),
    ]);

    lastSnapshotRef.current = null;
  }, [saveVehicles, saveTasks, saveRecords, saveFuelLogs, saveQuickReminders]);

  const addVehicle = useCallback(
    async (vehicle: Omit<Vehicle, "id" | "createdAt" | "updatedAt">) => {
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
      await saveVehicles(vehicles.filter((v: Vehicle) => v.id !== id));
      await saveTasks(tasks.filter((t: MaintenanceTask) => t.vehicleId !== id));
      await saveRecords(
        records.filter((r: MaintenanceRecord) => r.vehicleId !== id)
      );
      await saveFuelLogs(fuelLogs.filter((f: FuelLog) => f.vehicleId !== id));
    },
    [
      vehicles,
      tasks,
      records,
      fuelLogs,
      saveVehicles,
      saveTasks,
      saveRecords,
      saveFuelLogs,
      takeSnapshot,
    ]
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

  const reorderVehicles = useCallback(
    async (orderedIds: string[]) => {
      takeSnapshot();

      // Create a map of id -> new index
      const orderMap = new Map(orderedIds.map((id, index) => [id, index]));

      // Update all vehicles
      const updatedVehicles = vehicles.map((v) => {
        if (orderMap.has(v.id)) {
          return {
            ...v,
            customOrder: orderMap.get(v.id),
            updatedAt: Date.now(),
          };
        }
        return v;
      });

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
      await saveVehicles(vehicles.filter((v: Vehicle) => !idSet.has(v.id)));
      await saveTasks(
        tasks.filter((t: MaintenanceTask) => !idSet.has(t.vehicleId))
      );
      await saveRecords(
        records.filter((r: MaintenanceRecord) => !idSet.has(r.vehicleId))
      );
      await saveFuelLogs(
        fuelLogs.filter((f: FuelLog) => !idSet.has(f.vehicleId))
      );
    },
    [
      vehicles,
      tasks,
      records,
      fuelLogs,
      saveVehicles,
      saveTasks,
      saveRecords,
      saveFuelLogs,
      takeSnapshot,
    ]
  );

  const addTask = useCallback(
    async (task: Omit<MaintenanceTask, "id" | "createdAt" | "updatedAt">) => {
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
    async (record: Omit<MaintenanceRecord, "id" | "createdAt">) => {
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

            if (task.intervalType === "mileage") {
              updates.nextDueMileage = record.mileage + task.intervalValue;
            } else {
              updates.nextDueDate =
                record.date + task.intervalValue * 24 * 60 * 60 * 1000;
            }

            await updateTask(record.taskId, updates);
          } else {
            // For non-recurring tasks, mark as completed
            await updateTask(record.taskId, { isCompleted: true });
          }
        }
      }

      // Update vehicle mileage if the new record has higher mileage
      const vehicle = vehicles.find((v) => v.id === record.vehicleId);
      if (vehicle && record.mileage > vehicle.currentMileage) {
        await updateVehicle(vehicle.id, { currentMileage: record.mileage });
      }

      return newRecord;
    },
    [
      records,
      tasks,
      vehicles,
      saveRecords,
      updateTask,
      updateVehicle,
      takeSnapshot,
    ]
  );

  const deleteRecord = useCallback(
    async (id: string) => {
      takeSnapshot();
      await saveRecords(records.filter((r) => r.id !== id));
    },
    [records, saveRecords, takeSnapshot]
  );

  const updateRecord = useCallback(
    async (id: string, updates: Partial<MaintenanceRecord>) => {
      takeSnapshot();
      const updatedRecords = records.map((r) =>
        r.id === id ? { ...r, ...updates } : r
      );
      await saveRecords(updatedRecords);
    },
    [records, saveRecords, takeSnapshot]
  );

  const addFuelLog = useCallback(
    async (log: Omit<FuelLog, "id" | "createdAt">) => {
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

  const updateFuelLog = useCallback(
    async (id: string, updates: Partial<FuelLog>) => {
      takeSnapshot();
      const updatedLogs = fuelLogs.map((log) =>
        log.id === id ? { ...log, ...updates } : log
      );
      await saveFuelLogs(updatedLogs);
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
        .filter((r: MaintenanceRecord) => r.vehicleId === vehicleId)
        .sort((a: MaintenanceRecord, b: MaintenanceRecord) => b.date - a.date),
    [records]
  );

  const getRecordById = useCallback(
    (id: string) => records.find((r) => r.id === id),
    [records]
  );

  const getFuelLogsByVehicle = useCallback(
    (vehicleId: string) =>
      fuelLogs
        .filter((log: FuelLog) => log.vehicleId === vehicleId)
        .sort((a: FuelLog, b: FuelLog) => b.date - a.date),
    [fuelLogs]
  );

  const getQuickRemindersByVehicle = useCallback(
    (vehicleId: string) =>
      quickReminders
        .filter((r: Reminder) => r.vehicleId === vehicleId)
        .sort((a: Reminder, b: Reminder) => a.dueAt - b.dueAt),
    [quickReminders]
  );

  const getUpcomingTasks = useCallback(
    (vehicleId?: string) => {
      const now = Date.now();
      const filteredTasks = vehicleId
        ? tasks.filter(
            (t: MaintenanceTask) => t.vehicleId === vehicleId && !t.isCompleted
          )
        : tasks.filter((t: MaintenanceTask) => !t.isCompleted);

      return filteredTasks
        .map((task: MaintenanceTask) => {
          const vehicle = vehicles.find(
            (v: Vehicle) => v.id === task.vehicleId
          );
          if (!vehicle) return null;

          let isDue = false;
          let daysUntilDue: number | undefined;
          let milesUntilDue: number | undefined;

          if (task.intervalType === "date" && task.nextDueDate) {
            const daysMs = task.nextDueDate - now;
            daysUntilDue = Math.ceil(daysMs / (24 * 60 * 60 * 1000));
            isDue = daysUntilDue <= 7;
          } else if (task.intervalType === "mileage" && task.nextDueMileage) {
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
        .filter((item: any): item is NonNullable<typeof item> => item !== null)
        .sort((a: any, b: any) => {
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
    updateRecord,
    deleteRecord,
    addFuelLog,
    updateFuelLog,
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
    reorderVehicles,
    quickReminders,
    addQuickReminder,
    deleteQuickReminder,
    updateQuickReminder,
    getQuickRemindersByVehicle,
  };
});
