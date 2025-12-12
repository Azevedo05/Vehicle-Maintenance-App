import { FuelLog, Vehicle, VehicleCategory, FuelType } from "@/types/vehicle";
import { MaintenanceRecord, MaintenanceType } from "@/types/maintenance";

export interface VehicleStats {
  vehicleId: string;
  vehicleName: string;
  totalSpent: number;
  maintenanceCount: number;
  averageCost: number;
  lastMaintenance?: number;
}

export interface TypeStats {
  type: MaintenanceType;
  count: number;
  totalSpent: number;
  averageCost: number;
  vehicleBreakdown: { vehicleId: string; vehicleName: string; count: number }[];
}

export interface CategoryStats {
  category: VehicleCategory;
  vehicleCount: number;
  maintenanceCount: number;
  totalSpent: number;
}

export interface FuelStats {
  totalFillUps: number;
  totalVolume: number; // Deprecated: use totalVolumeL or totalVolumeKWh
  totalVolumeL: number;
  totalVolumeKWh: number;
  totalCost: number;
  averageCostPerFill: number;
  averageVolume: number; // Deprecated
  averageVolumeL: number;
  averageVolumeKWh: number;
  lastFillDate?: number;
}

export interface FuelStatsByVehicle {
  vehicleId: string;
  vehicleName: string;
  fillUps: number;
  totalVolume: number; // Deprecated
  totalVolumeL: number;
  totalVolumeKWh: number;
  totalCost: number;
  fuelType: FuelType;
}

export interface MonthlyStats {
  month: string;
  year: number;
  totalSpent: number;
  count: number;
}

export interface OverallStats {
  totalSpent: number;
  totalMaintenance: number;
  thisYearSpent: number;
  thisYearCount: number;
  averageMonthlySpent: number;
  mostFrequentType: MaintenanceType | null;
  mostExpensiveType: MaintenanceType | null;
}

/**
 * Calculate overall statistics from maintenance records
 */
export function calculateOverallStats(
  records: MaintenanceRecord[]
): OverallStats {
  const currentYear = new Date().getFullYear();
  const now = Date.now();

  let totalSpent = 0;
  let thisYearSpent = 0;
  let thisYearCount = 0;

  const typeCounts: Record<string, number> = {};
  const typeSpending: Record<string, number> = {};

  // Get oldest and newest record dates for monthly average calculation
  let oldestDate = now;
  let newestDate = 0;

  records.forEach((record) => {
    const cost = record.cost || 0;
    totalSpent += cost;

    const recordYear = new Date(record.date).getFullYear();
    if (recordYear === currentYear) {
      thisYearSpent += cost;
      thisYearCount++;
    }

    // Track date range
    if (record.date < oldestDate) {
      oldestDate = record.date;
    }
    if (record.date > newestDate) {
      newestDate = record.date;
    }

    // Count by type
    typeCounts[record.type] = (typeCounts[record.type] || 0) + 1;
    typeSpending[record.type] = (typeSpending[record.type] || 0) + cost;
  });

  // Calculate average monthly spending
  let averageMonthlySpent = 0;
  if (records.length > 0 && oldestDate < newestDate) {
    const monthsDiff = Math.max(
      1,
      Math.floor((newestDate - oldestDate) / (1000 * 60 * 60 * 24 * 30.44))
    );
    averageMonthlySpent = totalSpent / monthsDiff;
  }

  // Find most frequent type
  let mostFrequentType: MaintenanceType | null = null;
  let maxCount = 0;
  Object.entries(typeCounts).forEach(([type, count]) => {
    if (count > maxCount) {
      maxCount = count;
      mostFrequentType = type as MaintenanceType;
    }
  });

  // Find most expensive type
  let mostExpensiveType: MaintenanceType | null = null;
  let maxSpending = 0;
  Object.entries(typeSpending).forEach(([type, spending]) => {
    if (spending > maxSpending) {
      maxSpending = spending;
      mostExpensiveType = type as MaintenanceType;
    }
  });

  return {
    totalSpent,
    totalMaintenance: records.length,
    thisYearSpent,
    thisYearCount,
    averageMonthlySpent,
    mostFrequentType,
    mostExpensiveType,
  };
}

/**
 * Calculate statistics per vehicle
 */
export function calculateVehicleStats(
  vehicles: Vehicle[],
  records: MaintenanceRecord[]
): VehicleStats[] {
  return vehicles.map((vehicle) => {
    const vehicleRecords = records.filter((r) => r.vehicleId === vehicle.id);
    const totalSpent = vehicleRecords.reduce(
      (sum, r) => sum + (r.cost || 0),
      0
    );
    const lastRecord = vehicleRecords.sort((a, b) => b.date - a.date)[0];

    return {
      vehicleId: vehicle.id,
      vehicleName: `${vehicle.make} ${vehicle.model}`,
      totalSpent,
      maintenanceCount: vehicleRecords.length,
      averageCost:
        vehicleRecords.length > 0 ? totalSpent / vehicleRecords.length : 0,
      lastMaintenance: lastRecord?.date,
    };
  });
}

/**
 * Calculate statistics per maintenance type
 */
export function calculateTypeStats(
  records: MaintenanceRecord[],
  vehicles: Vehicle[]
): TypeStats[] {
  const typeMap: Record<string, TypeStats> = {};

  records.forEach((record) => {
    if (!typeMap[record.type]) {
      typeMap[record.type] = {
        type: record.type as MaintenanceType,
        count: 0,
        totalSpent: 0,
        averageCost: 0,
        vehicleBreakdown: [],
      };
    }

    typeMap[record.type].count++;
    typeMap[record.type].totalSpent += record.cost || 0;

    // Track vehicle breakdown - check if vehicles array exists and has items
    if (vehicles && vehicles.length > 0) {
      const vehicleData = vehicles.find((v) => v.id === record.vehicleId);
      if (vehicleData) {
        const vehicleName = `${vehicleData.make} ${vehicleData.model}`;
        const existingVehicle = typeMap[record.type].vehicleBreakdown.find(
          (v) => v.vehicleId === record.vehicleId
        );

        if (existingVehicle) {
          existingVehicle.count++;
        } else {
          typeMap[record.type].vehicleBreakdown.push({
            vehicleId: record.vehicleId,
            vehicleName,
            count: 1,
          });
        }
      }
    }
  });

  // Calculate averages
  Object.values(typeMap).forEach((stat) => {
    stat.averageCost = stat.count > 0 ? stat.totalSpent / stat.count : 0;
    // Sort vehicle breakdown by count
    stat.vehicleBreakdown.sort((a, b) => b.count - a.count);
  });

  // Sort by count (most frequent first)
  return Object.values(typeMap).sort((a, b) => b.count - a.count);
}

export function calculateCategoryStats(
  vehicles: Vehicle[],
  records: MaintenanceRecord[]
): CategoryStats[] {
  const categories: Record<VehicleCategory, CategoryStats> = {
    personal: {
      category: "personal",
      vehicleCount: 0,
      maintenanceCount: 0,
      totalSpent: 0,
    },
    work: {
      category: "work",
      vehicleCount: 0,
      maintenanceCount: 0,
      totalSpent: 0,
    },
    family: {
      category: "family",
      vehicleCount: 0,
      maintenanceCount: 0,
      totalSpent: 0,
    },
    other: {
      category: "other",
      vehicleCount: 0,
      maintenanceCount: 0,
      totalSpent: 0,
    },
  };

  const vehicleCategoryMap = new Map<string, VehicleCategory>();

  vehicles.forEach((vehicle) => {
    const category = vehicle.category ?? "other";
    vehicleCategoryMap.set(vehicle.id, category);
    categories[category].vehicleCount += 1;
  });

  records.forEach((record) => {
    const category = vehicleCategoryMap.get(record.vehicleId) ?? "other";
    categories[category].maintenanceCount += 1;
    categories[category].totalSpent += record.cost || 0;
  });

  return Object.values(categories)
    .filter(
      (category) => category.vehicleCount > 0 || category.maintenanceCount > 0
    )
    .sort((a, b) => b.totalSpent - a.totalSpent);
}

export function calculateFuelStats(fuelLogs: FuelLog[]): FuelStats {
  if (fuelLogs.length === 0) {
    return {
      totalFillUps: 0,
      totalVolume: 0,
      totalVolumeL: 0,
      totalVolumeKWh: 0,
      totalCost: 0,
      averageCostPerFill: 0,
      averageVolume: 0,
      averageVolumeL: 0,
      averageVolumeKWh: 0,
      lastFillDate: undefined,
    };
  }

  const totalFillUps = fuelLogs.length;

  let totalVolumeL = 0;
  let totalVolumeKWh = 0;
  let countL = 0;
  let countKWh = 0;

  fuelLogs.forEach((log) => {
    if (log.fuelType === "electric") {
      totalVolumeKWh += log.volume || 0;
      countKWh++;
    } else {
      totalVolumeL += log.volume || 0;
      countL++;
    }
  });

  const totalVolume = totalVolumeL + totalVolumeKWh; // kept for legacy fallback

  const totalCost = fuelLogs.reduce(
    (sum, log) => sum + (log.totalCost || 0),
    0
  );
  const lastFillDate = fuelLogs.map((log) => log.date).sort((a, b) => b - a)[0];

  return {
    totalFillUps,
    totalVolume,
    totalVolumeL,
    totalVolumeKWh,
    totalCost,
    averageCostPerFill: totalFillUps > 0 ? totalCost / totalFillUps : 0,
    averageVolume: totalFillUps > 0 ? totalVolume / totalFillUps : 0,
    averageVolumeL: countL > 0 ? totalVolumeL / countL : 0,
    averageVolumeKWh: countKWh > 0 ? totalVolumeKWh / countKWh : 0,
    lastFillDate,
  };
}

export function calculateFuelStatsByVehicle(
  fuelLogs: FuelLog[],
  vehicles: Vehicle[]
): FuelStatsByVehicle[] {
  if (fuelLogs.length === 0) return [];

  const statsMap: Record<string, FuelStatsByVehicle> = {};

  fuelLogs.forEach((log) => {
    if (!statsMap[log.vehicleId]) {
      const vehicle = vehicles.find((v) => v.id === log.vehicleId);
      statsMap[log.vehicleId] = {
        vehicleId: log.vehicleId,
        vehicleName: vehicle
          ? `${vehicle.make} ${vehicle.model}`
          : log.vehicleId,
        fillUps: 0,
        totalVolume: 0,
        totalVolumeL: 0,
        totalVolumeKWh: 0,
        totalCost: 0,
        fuelType: vehicle?.fuelType || "gasoline",
      };
    }

    statsMap[log.vehicleId].fillUps += 1;

    const vol = log.volume || 0;
    statsMap[log.vehicleId].totalVolume += vol;

    if (log.fuelType === "electric") {
      statsMap[log.vehicleId].totalVolumeKWh += vol;
    } else {
      statsMap[log.vehicleId].totalVolumeL += vol;
    }

    statsMap[log.vehicleId].totalCost += log.totalCost || 0;
  });

  return Object.values(statsMap).sort((a, b) => b.totalCost - a.totalCost);
}

/**
 * Calculate monthly statistics for the last 12 months
 */
export function calculateMonthlyStats(
  records: MaintenanceRecord[]
): MonthlyStats[] {
  const now = new Date();
  const monthsMap: Record<string, MonthlyStats> = {};

  // Initialize last 12 months
  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
    monthsMap[key] = {
      month: date.toLocaleString("default", { month: "short" }),
      year: date.getFullYear(),
      totalSpent: 0,
      count: 0,
    };
  }

  // Aggregate records
  records.forEach((record) => {
    const date = new Date(record.date);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}`;

    if (monthsMap[key]) {
      monthsMap[key].totalSpent += record.cost || 0;
      monthsMap[key].count++;
    }
  });

  return Object.values(monthsMap);
}

/**
 * Get top N most expensive maintenance records
 */
export function getTopExpensiveRecords(
  records: MaintenanceRecord[],
  limit: number = 5
): MaintenanceRecord[] {
  return [...records]
    .filter((r) => r.cost && r.cost > 0)
    .sort((a, b) => (b.cost || 0) - (a.cost || 0))
    .slice(0, limit);
}

/**
 * Calculate year-over-year comparison
 */
export function calculateYearComparison(records: MaintenanceRecord[]): {
  currentYear: { spent: number; count: number };
  lastYear: { spent: number; count: number };
  percentageChange: number;
} {
  const currentYear = new Date().getFullYear();
  const lastYear = currentYear - 1;

  let currentYearSpent = 0;
  let currentYearCount = 0;
  let lastYearSpent = 0;
  let lastYearCount = 0;

  records.forEach((record) => {
    const year = new Date(record.date).getFullYear();
    const cost = record.cost || 0;

    if (year === currentYear) {
      currentYearSpent += cost;
      currentYearCount++;
    } else if (year === lastYear) {
      lastYearSpent += cost;
      lastYearCount++;
    }
  });

  const percentageChange =
    lastYearSpent > 0
      ? ((currentYearSpent - lastYearSpent) / lastYearSpent) * 100
      : 0;

  return {
    currentYear: { spent: currentYearSpent, count: currentYearCount },
    lastYear: { spent: lastYearSpent, count: lastYearCount },
    percentageChange,
  };
}

/**
 * Format currency value
 */
export function formatCurrency(value: number, symbol: string = "€"): string {
  return `${symbol}${value.toFixed(2)}`;
}

/**
 * Format large numbers with k/M suffix
 */
export function formatNumber(value: number): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}k`;
  }
  return value.toFixed(0);
}
