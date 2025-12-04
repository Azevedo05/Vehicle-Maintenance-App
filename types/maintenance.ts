export type MaintenanceType =
  | "oil_change"
  | "tire_rotation"
  | "tire_replacement"
  | "brake_inspection"
  | "brake_pads"
  | "air_filter"
  | "cabin_filter"
  | "battery"
  | "spark_plugs"
  | "coolant"
  | "transmission_fluid"
  | "wheel_alignment"
  | "inspection"
  | "registration"
  | "insurance"
  | "brake_fluid"
  | "timing_belt"
  | "wipers"
  | "ac_service"
  | "suspension"
  | "other";

export interface MaintenanceTypeInfo {
  label: string;
  icon: string;
  color: string;
  defaultInterval: number;
  intervalType: "mileage" | "date";
  defaultMileageInterval: number;
  defaultTimeInterval: number; // in days
}

export const MAINTENANCE_TYPES: Record<MaintenanceType, MaintenanceTypeInfo> = {
  oil_change: {
    label: "Oil Change",
    icon: "droplet",
    color: "#FF9500",
    defaultInterval: 10000,
    intervalType: "mileage",
    defaultMileageInterval: 10000,
    defaultTimeInterval: 365,
  },
  tire_rotation: {
    label: "Tire Rotation",
    icon: "disc",
    color: "#5856D6",
    defaultInterval: 10000,
    intervalType: "mileage",
    defaultMileageInterval: 10000,
    defaultTimeInterval: 180, // 6 months
  },
  tire_replacement: {
    label: "Tire Replacement",
    icon: "circle",
    color: "#AF52DE",
    defaultInterval: 50000,
    intervalType: "mileage",
    defaultMileageInterval: 50000,
    defaultTimeInterval: 1095, // 3 years
  },
  brake_inspection: {
    label: "Brake Inspection",
    icon: "octagon",
    color: "#FF3B30",
    defaultInterval: 20000,
    intervalType: "mileage",
    defaultMileageInterval: 20000,
    defaultTimeInterval: 365,
  },
  brake_pads: {
    label: "Brake Pads",
    icon: "shield",
    color: "#FF2D55",
    defaultInterval: 50000,
    intervalType: "mileage",
    defaultMileageInterval: 50000,
    defaultTimeInterval: 730, // 2 years
  },
  air_filter: {
    label: "Air Filter",
    icon: "wind",
    color: "#34C759",
    defaultInterval: 15000,
    intervalType: "mileage",
    defaultMileageInterval: 15000,
    defaultTimeInterval: 365,
  },
  cabin_filter: {
    label: "Cabin Filter",
    icon: "air-vent",
    color: "#32D74B",
    defaultInterval: 15000,
    intervalType: "mileage",
    defaultMileageInterval: 15000,
    defaultTimeInterval: 365,
  },
  battery: {
    label: "Battery",
    icon: "battery",
    color: "#FFCC00",
    defaultInterval: 1095,
    intervalType: "date",
    defaultMileageInterval: 50000,
    defaultTimeInterval: 1095, // 3 years
  },
  spark_plugs: {
    label: "Spark Plugs",
    icon: "zap",
    color: "#FF9500",
    defaultInterval: 40000,
    intervalType: "mileage",
    defaultMileageInterval: 40000,
    defaultTimeInterval: 730, // 2 years
  },
  coolant: {
    label: "Coolant",
    icon: "thermometer",
    color: "#5AC8FA",
    defaultInterval: 40000,
    intervalType: "mileage",
    defaultMileageInterval: 40000,
    defaultTimeInterval: 730, // 2 years
  },
  transmission_fluid: {
    label: "Transmission Fluid",
    icon: "gauge",
    color: "#FF6482",
    defaultInterval: 60000,
    intervalType: "mileage",
    defaultMileageInterval: 60000,
    defaultTimeInterval: 1095, // 3 years
  },
  wheel_alignment: {
    label: "Wheel Alignment",
    icon: "align-center",
    color: "#64D2FF",
    defaultInterval: 20000,
    intervalType: "mileage",
    defaultMileageInterval: 20000,
    defaultTimeInterval: 365,
  },
  inspection: {
    label: "Inspection",
    icon: "clipboard-check",
    color: "#007AFF",
    defaultInterval: 365,
    intervalType: "date",
    defaultMileageInterval: 15000, // Typical service interval
    defaultTimeInterval: 365,
  },
  registration: {
    label: "Registration",
    icon: "file-text",
    color: "#30B0C7",
    defaultInterval: 365,
    intervalType: "date",
    defaultMileageInterval: 0, // Not applicable usually
    defaultTimeInterval: 365,
  },
  insurance: {
    label: "Insurance",
    icon: "shield-check",
    color: "#0A84FF",
    defaultInterval: 365,
    intervalType: "date",
    defaultMileageInterval: 0, // Not applicable usually
    defaultTimeInterval: 365,
  },
  other: {
    label: "Other",
    icon: "wrench",
    color: "#8E8E93",
    defaultInterval: 10000,
    intervalType: "mileage",
    defaultMileageInterval: 10000,
    defaultTimeInterval: 180, // 6 months
  },
  brake_fluid: {
    label: "Brake Fluid",
    icon: "droplet",
    color: "#7D7AFF",
    defaultInterval: 730,
    intervalType: "date",
    defaultMileageInterval: 40000,
    defaultTimeInterval: 730, // 2 years
  },
  timing_belt: {
    label: "Timing Belt",
    icon: "circle-dashed",
    color: "#FF3B30",
    defaultInterval: 100000,
    intervalType: "mileage",
    defaultMileageInterval: 100000,
    defaultTimeInterval: 1825, // 5 years
  },
  wipers: {
    label: "Wipers",
    icon: "cloud-rain",
    color: "#5AC8FA",
    defaultInterval: 365,
    intervalType: "date",
    defaultMileageInterval: 0,
    defaultTimeInterval: 365, // 1 year
  },
  ac_service: {
    label: "AC Service",
    icon: "snowflake",
    color: "#007AFF",
    defaultInterval: 730,
    intervalType: "date",
    defaultMileageInterval: 0,
    defaultTimeInterval: 730, // 2 years
  },
  suspension: {
    label: "Suspension",
    icon: "move-vertical",
    color: "#FF9500",
    defaultInterval: 50000,
    intervalType: "mileage",
    defaultMileageInterval: 50000,
    defaultTimeInterval: 1460, // 4 years
  },
};

export interface MaintenanceTask {
  id: string;
  vehicleId: string;
  type: MaintenanceType;
  title: string;
  description?: string;
  intervalType: "mileage" | "date";
  intervalValue: number;
  lastCompletedDate?: number;
  lastCompletedMileage?: number;
  nextDueDate?: number;
  nextDueMileage?: number;
  isRecurring: boolean;
  isCompleted: boolean;
  customOrder?: number;
  createdAt: number;
  updatedAt: number;
}

export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  taskId?: string;
  type: MaintenanceType;
  title: string;
  description?: string;
  date: number;
  mileage: number;
  cost?: number;
  location?: string;
  notes?: string;
  photos?: string[];
  createdAt: number;
}

// Helper function to get translated maintenance type label
export function getMaintenanceTypeLabel(
  type: MaintenanceType,
  t: (key: string) => string
): string {
  return t(`maintenance.types.${type}`);
}
