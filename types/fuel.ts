import { Timestamp } from "./common";

/** Available fuel types */
export type FuelType = "gasoline" | "diesel" | "gpl" | "electric";

/** Fuel log entry */
export interface FuelLog {
  id: string;
  vehicleId: string;
  date: Timestamp;
  fuelType: FuelType;
  /** Volume in liters */
  volume: number;
  /** Total cost in € */
  totalCost: number;
  /** Price per liter */
  pricePerUnit?: number;
  /** Fuel station name */
  station?: string;
  notes?: string;
  createdAt: Timestamp;
}
