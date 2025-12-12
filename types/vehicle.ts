export type VehicleCategory = "personal" | "work" | "family" | "other";

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  licensePlate?: string;
  currentMileage: number;
  photo?: string;
  photoPosition?: {
    x: number;
    y: number;
    scale: number;
  };
  photos?: string[];
  color?: string;
  vin?: string;
  fuelType?: FuelType;
  category?: VehicleCategory;
  archived?: boolean;
  customOrder?: number;
  createdAt: number;
  updatedAt: number;
}

export type FuelType = "gasoline" | "diesel" | "gpl" | "electric";

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

import { Home, Briefcase, Users, Car } from "lucide-react-native";

export const VEHICLE_CATEGORY_INFO: Record<
  VehicleCategory,
  { Icon: typeof Home; label: string; color: string }
> = {
  personal: { Icon: Home, label: "Personal", color: "#3B82F6" },
  work: { Icon: Briefcase, label: "Work", color: "#8B5CF6" },
  family: { Icon: Users, label: "Family", color: "#10B981" },
  other: { Icon: Car, label: "Other", color: "#6B7280" },
};

export function getVehicleCategoryLabel(
  category: VehicleCategory | undefined,
  t: any
): string {
  if (!category) return t("vehicles.category_none");
  return t(`vehicles.category_${category}`);
}

export type VehicleSortOption =
  | "newest"
  | "oldest"
  | "name_az"
  | "name_za"
  | "year_new"
  | "year_old"
  | "mileage_high"
  | "mileage_low"
  | "last_maintenance"
  | "custom";
