export type VehicleCategory = 'personal' | 'work' | 'family' | 'other';

export interface Vehicle {
    id: string;
    name: string;
    make: string;
    model: string;
    year: number;
    licensePlate?: string;
    currentMileage: number;
    photo?: string;
    color?: string;
    vin?: string;
    category?: VehicleCategory;
    archived?: boolean;
    createdAt: number;
    updatedAt: number;
  }
  
  export interface MaintenanceTask {
    id: string;
    vehicleId: string;
    type: MaintenanceType;
    title: string;
    description?: string;
    intervalType: 'mileage' | 'date';
    intervalValue: number;
    lastCompletedDate?: number;
    lastCompletedMileage?: number;
    nextDueDate?: number;
    nextDueMileage?: number;
    isRecurring: boolean;
    isCompleted: boolean;
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
  
export type FuelType =
  | 'gasoline_95'
  | 'gasoline_98'
  | 'diesel'
  | 'diesel_additive'
  | 'gpl'
  | 'electric';

export interface FuelLog {
  id: string;
  vehicleId: string;
  date: number;
  fuelType: FuelType;
  volume: number;
  totalCost: number;
  pricePerUnit?: number;
  station?: string;
  notes?: string;
  createdAt: number;
}

  export type MaintenanceType =
    | 'oil_change'
    | 'tire_rotation'
    | 'tire_replacement'
    | 'brake_inspection'
    | 'brake_pads'
    | 'air_filter'
    | 'cabin_filter'
    | 'battery'
    | 'spark_plugs'
    | 'coolant'
    | 'transmission_fluid'
    | 'wheel_alignment'
    | 'inspection'
    | 'registration'
    | 'insurance'
    | 'other';
  
  export interface MaintenanceTypeInfo {
    label: string;
    icon: string;
    color: string;
    defaultInterval: number;
    intervalType: 'mileage' | 'date';
  }
  
export const MAINTENANCE_TYPES: Record<MaintenanceType, MaintenanceTypeInfo> = {
  oil_change: {
    label: 'Oil Change',
    icon: 'droplet',
    color: '#FF9500',
    defaultInterval: 10000, // 10,000 km (industry standard: 5,000-15,000 km)
    intervalType: 'mileage',
  },
  tire_rotation: {
    label: 'Tire Rotation',
    icon: 'disc',
    color: '#5856D6',
    defaultInterval: 10000, // 10,000 km (industry standard)
    intervalType: 'mileage',
  },
  tire_replacement: {
    label: 'Tire Replacement',
    icon: 'circle',
    color: '#AF52DE',
    defaultInterval: 50000, // 50,000 km (typical tire lifespan)
    intervalType: 'mileage',
  },
  brake_inspection: {
    label: 'Brake Inspection',
    icon: 'octagon',
    color: '#FF3B30',
    defaultInterval: 20000, // 20,000 km (industry standard)
    intervalType: 'mileage',
  },
  brake_pads: {
    label: 'Brake Pads',
    icon: 'shield',
    color: '#FF2D55',
    defaultInterval: 50000, // 50,000 km (typical brake pad lifespan)
    intervalType: 'mileage',
  },
  air_filter: {
    label: 'Air Filter',
    icon: 'wind',
    color: '#34C759',
    defaultInterval: 15000, // 15,000 km (industry standard: 10,000-20,000 km)
    intervalType: 'mileage',
  },
  cabin_filter: {
    label: 'Cabin Filter',
    icon: 'air-vent',
    color: '#32D74B',
    defaultInterval: 15000, // 15,000 km or 12 months (industry standard)
    intervalType: 'mileage',
  },
  battery: {
    label: 'Battery',
    icon: 'battery',
    color: '#FFCC00',
    defaultInterval: 1095, // 3 years / 36 months (typical battery lifespan)
    intervalType: 'date',
  },
  spark_plugs: {
    label: 'Spark Plugs',
    icon: 'zap',
    color: '#FF9500',
    defaultInterval: 40000, // 40,000 km (industry standard: 30,000-50,000 km)
    intervalType: 'mileage',
  },
  coolant: {
    label: 'Coolant',
    icon: 'thermometer',
    color: '#5AC8FA',
    defaultInterval: 40000, // 40,000 km or 2 years (industry standard)
    intervalType: 'mileage',
  },
  transmission_fluid: {
    label: 'Transmission Fluid',
    icon: 'gauge',
    color: '#FF6482',
    defaultInterval: 60000, // 60,000 km (industry standard: 60,000-100,000 km)
    intervalType: 'mileage',
  },
  wheel_alignment: {
    label: 'Wheel Alignment',
    icon: 'align-center',
    color: '#64D2FF',
    defaultInterval: 20000, // 20,000 km or when needed (industry standard)
    intervalType: 'mileage',
  },
  inspection: {
    label: 'Inspection',
    icon: 'clipboard-check',
    color: '#007AFF',
    defaultInterval: 365, // 12 months / annually (legal requirement in many countries)
    intervalType: 'date',
  },
  registration: {
    label: 'Registration',
    icon: 'file-text',
    color: '#30B0C7',
    defaultInterval: 365, // 12 months / annually (legal requirement)
    intervalType: 'date',
  },
  insurance: {
    label: 'Insurance',
    icon: 'shield-check',
    color: '#0A84FF',
    defaultInterval: 365, // 12 months / annually (legal requirement)
    intervalType: 'date',
  },
  other: {
    label: 'Other',
    icon: 'wrench',
    color: '#8E8E93',
    defaultInterval: 10000, // 10,000 km (general maintenance interval)
    intervalType: 'mileage',
  },
};

// Helper function to get translated maintenance type label
export function getMaintenanceTypeLabel(type: MaintenanceType, t: (key: string) => string): string {
  return t(`maintenance.types.${type}`);
}

import { Home, Briefcase, Users, Car } from 'lucide-react-native';

export const VEHICLE_CATEGORY_INFO: Record<VehicleCategory, { Icon: typeof Home; label: string; color: string }> = {
  personal: { Icon: Home, label: 'Personal', color: '#3B82F6' },
  work: { Icon: Briefcase, label: 'Work', color: '#8B5CF6' },
  family: { Icon: Users, label: 'Family', color: '#10B981' },
  other: { Icon: Car, label: 'Other', color: '#6B7280' },
};

export function getVehicleCategoryLabel(category: VehicleCategory | undefined, t: any): string {
  if (!category) return t('vehicles.category_none');
  return t(`vehicles.category_${category}`);
}
  