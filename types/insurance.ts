import { Timestamp } from "./common";

/** Insurance policy status */
export type InsuranceStatus = "active" | "pending" | "expired";

/** Payment frequency options */
export type PaymentFrequency =
  | "monthly"
  | "quarterly"
  | "semiannual"
  | "annual";

/** Coverage level options */
export type CoverageType = "basic" | "medium" | "comprehensive";

/** Additional coverage with optional value limit */
export interface CoverageOption {
  enabled: boolean;
  /** Maximum coverage value in € */
  maxValue?: number;
  /** Deductible (Franquia) in € */
  deductible?: number;
  /** Additional notes */
  notes?: string;
}

/** Coverage options for roadside assistance */
export interface RoadsideAssistance extends CoverageOption {
  /** Includes replacement vehicle */
  includesReplacement?: boolean;
  /** Number of replacement days */
  replacementDays?: number;
}

/** All additional coverages */
export interface InsuranceCoverages {
  /** Glass breakage - Vidros */
  glassBreakage?: CoverageOption;
  /** Roadside assistance - Assistência em Viagem */
  roadsideAssistance?: RoadsideAssistance;
  /** Legal protection - Proteção Jurídica */
  legalProtection?: CoverageOption;
  /** Own damage - Danos Próprios */
  ownDamage?: CoverageOption;
  /** Theft - Roubo/Furto */
  theft?: CoverageOption;
  /** Fire - Incêndio */
  fire?: CoverageOption;
  /** Natural disasters - Catástrofes Naturais */
  naturalDisasters?: CoverageOption;
  /** Personal accident - Acidentes Pessoais */
  personalAccident?: CoverageOption;
}

/** Vehicle insurance policy */
export interface VehicleInsurance {
  id: string;
  vehicleId: string;
  /** Insurance company name */
  provider: string;
  /** Policy number */
  policyNumber: string;
  /** Policy start date */
  startDate: Timestamp;
  /** Policy end date */
  endDate: Timestamp;
  /** Total annual cost in € */
  annualCost: number;
  /** How often payments are made */
  paymentFrequency?: PaymentFrequency;
  /** Is the current period paid? */
  isPaid?: boolean;
  /** Next payment due date */
  nextPaymentDate?: Timestamp;
  /** Coverage level */
  coverage?: CoverageType;
  /** Additional notes */
  notes?: string;

  // NEW FIELDS
  /** Deductible (Franquia) in € */
  deductible?: number;
  /** No-claims bonus percentage (Escalão) */
  bonusPercentage?: number;
  /** 24h emergency contact phone */
  emergencyContact?: string;
  /** Additional coverages */
  coverages?: InsuranceCoverages;
  /** ID of the event in the native calendar */
  calendarEventId?: string;

  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Calculate insurance status based on dates
 */
export function getInsuranceStatus(
  insurance: VehicleInsurance
): InsuranceStatus {
  const now = Date.now();

  if (now > insurance.endDate) {
    return "expired";
  }

  if (now < insurance.startDate) {
    return "pending";
  }

  return "active";
}

/**
 * Get days until insurance expires (negative if already expired)
 */
export function getDaysUntilExpiry(insurance: VehicleInsurance): number {
  const now = Date.now();
  const diffMs = insurance.endDate - now;
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Get list of enabled coverages
 */
export function getEnabledCoverages(insurance: VehicleInsurance): string[] {
  const enabled: string[] = [];
  const coverages = insurance.coverages;

  if (!coverages) return enabled;

  if (coverages.glassBreakage?.enabled) enabled.push("glassBreakage");
  if (coverages.roadsideAssistance?.enabled) enabled.push("roadsideAssistance");
  if (coverages.legalProtection?.enabled) enabled.push("legalProtection");
  if (coverages.ownDamage?.enabled) enabled.push("ownDamage");
  if (coverages.theft?.enabled) enabled.push("theft");
  if (coverages.fire?.enabled) enabled.push("fire");
  if (coverages.naturalDisasters?.enabled) enabled.push("naturalDisasters");
  if (coverages.personalAccident?.enabled) enabled.push("personalAccident");

  return enabled;
}
