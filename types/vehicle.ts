import { Home, Briefcase, Users, Car } from "lucide-react-native";
import { ImagePosition, Timestamp } from "./common";
import { VehicleInsurance } from "./insurance";
import { FuelType } from "./fuel";

// Re-export FuelType for backwards compatibility
export { FuelType } from "./fuel";

// ============================================================================
// Basic Types
// ============================================================================

/** Vehicle usage category */
export type VehicleCategory = "personal" | "work" | "family" | "other";

/** Transmission type */
export type TransmissionType = "manual" | "automatic";

/** Tire pressure unit */
export type PressureUnit = "bar" | "psi";

/** Drive type */
export type DriveType = "FWD" | "RWD" | "AWD" | "4WD";

/** Vehicle list sort options */
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

// ============================================================================
// Main Vehicle Interface
// ============================================================================

export interface Vehicle {
  id: string;

  // Basic Info
  make: string;
  model: string;
  year: number;
  licensePlate?: string;
  currentMileage: number;
  color?: string;
  category?: VehicleCategory;

  // Photos
  photo?: string;
  photoPosition?: ImagePosition;
  photos?: string[];
  photoPositions?: Record<string, ImagePosition>;
  detailsPhotoPosition?: ImagePosition;
  detailsPhotoPositions?: Record<string, ImagePosition>;

  // Technical Specs
  fuelType?: FuelType;
  engine?: number; // cc (50-13000)
  transmission?: TransmissionType;
  horsepower?: number; // cv
  torque?: number; // Nm
  driveType?: DriveType;
  batteryCapacity?: number; // kWh (electric vehicles)

  // Tires
  tireSizeFront?: string;
  tireSizeRear?: string;
  tirePressureFront?: string;
  tirePressureRear?: string;
  tirePressureUnit?: PressureUnit;

  // Identification
  vin?: string;

  // Dates & Status
  purchaseDate?: Timestamp;
  archived?: boolean;
  customOrder?: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;

  // Insurance
  insurance?: VehicleInsurance;
}

// ============================================================================
// Category Constants
// ============================================================================

export const VEHICLE_CATEGORY_INFO: Record<
  VehicleCategory,
  { Icon: typeof Home; label: string; color: string }
> = {
  personal: { Icon: Home, label: "Personal", color: "#3B82F6" },
  work: { Icon: Briefcase, label: "Work", color: "#8B5CF6" },
  family: { Icon: Users, label: "Family", color: "#10B981" },
  other: { Icon: Car, label: "Other", color: "#6B7280" },
};

// ============================================================================
// Helper Functions
// ============================================================================

export function getVehicleCategoryLabel(
  category: VehicleCategory | undefined,
  t: any
): string {
  if (!category) return t("vehicles.category_none");
  return t(`vehicles.category_${category}`);
}
