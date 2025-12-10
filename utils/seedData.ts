import { Vehicle } from "@/types/vehicle";
import {
  MaintenanceTask,
  MaintenanceRecord,
  MaintenanceType,
} from "@/types/maintenance";
import { FuelLog } from "@/types/vehicle";

export const SEED_VEHICLES: Vehicle[] = [
  {
    id: "seed_tesla_model_3",
    make: "Tesla",
    model: "Model 3",
    year: 2024,
    licensePlate: "AA-00-EV",
    photo: "tesla_model_3_blue_1765127312244.png", // Will be resolved to local path
    category: "personal",
    fuelType: "electric",
    currentMileage: 15000,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: "seed_ford_transit",
    make: "Ford",
    model: "Transit Custom",
    year: 2022,
    licensePlate: "BE-89-CD",
    photo: "ford_transit_white_v2_1765128177999.png",
    category: "work",
    fuelType: "diesel",
    currentMileage: 45000,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: "seed_volvo_xc90",
    make: "Volvo",
    model: "XC90",
    year: 2023,
    licensePlate: "AD-55-GH",
    photo: "volvo_xc90_green_1765127340928.png",
    category: "personal",
    fuelType: "diesel",
    currentMileage: 25000,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

export const SEED_TASKS: MaintenanceTask[] = [
  // Ford Transit - Oil Change (Overdue)
  {
    id: "seed_task_ford_oil",
    vehicleId: "seed_ford_transit",
    title: "Oil Change",
    type: "oil_change",
    intervalType: "mileage",
    intervalValue: 15000,
    nextDueMileage: 44000, // Current is 45000, so it's 1000 km overdue
    isRecurring: true,
    isCompleted: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  // Volvo XC90 - Inspection (Due 21/05/2026)
  {
    id: "seed_task_volvo_inspection",
    vehicleId: "seed_volvo_xc90",
    title: "Inspection",
    type: "inspection",
    intervalType: "date",
    intervalValue: 365,
    nextDueDate: new Date("2026-05-21").getTime(),
    isRecurring: true,
    isCompleted: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  // Tesla Model 3 - Inspection (Due 29/08/2027)
  {
    id: "seed_task_tesla_inspection",
    vehicleId: "seed_tesla_model_3",
    title: "Inspection",
    type: "inspection",
    intervalType: "date",
    intervalValue: 730, // 2 years
    nextDueDate: new Date("2027-08-29").getTime(),
    isRecurring: true,
    isCompleted: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  // Tesla Model 3 - Tire Rotation (Due at 20,000 km)
  {
    id: "seed_task_tesla_tires",
    vehicleId: "seed_tesla_model_3",
    title: "Tire Rotation",
    type: "tire_rotation",
    intervalType: "mileage",
    intervalValue: 10000,
    nextDueMileage: 20000, // Current is 15000, so 5000 left
    isRecurring: true,
    isCompleted: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

// Helper to get past dates
const daysAgo = (days: number) => Date.now() - days * 24 * 60 * 60 * 1000;

export const SEED_RECORDS: MaintenanceRecord[] = [
  // Ford Transit History
  {
    id: "seed_rec_ford_oil_1",
    vehicleId: "seed_ford_transit",
    taskId: "seed_task_ford_oil", // Linked to the recurring task
    type: "oil_change",
    date: daysAgo(180), // 6 months ago
    mileage: 30000,
    cost: 120.5,
    title: "Oil Change",
    notes: "Regular maintenance. Replaced filter.",
    location: "Ford Pro Service",
    createdAt: daysAgo(180),
  },
  {
    id: "seed_rec_ford_brakes",
    vehicleId: "seed_ford_transit",
    type: "brake_pads",
    date: daysAgo(60), // 2 months ago
    mileage: 42000,
    cost: 350.0,
    notes: "Front brake pads replaced. Rotors resurfaced.",
    location: "QuickFix Auto",
    createdAt: daysAgo(60),
    title: "Brake Pads Replacement",
  },
  // Tesla Model 3 History
  {
    id: "seed_rec_tesla_tires",
    vehicleId: "seed_tesla_model_3",
    type: "tire_replacement",
    date: daysAgo(365), // 1 year ago (purchase?)
    mileage: 50,
    cost: 800,
    notes: "Initial set of Michelin Pilot Sport 4S",
    createdAt: daysAgo(365),
    title: "New Tires",
  },
  {
    id: "seed_rec_tesla_wipers",
    vehicleId: "seed_tesla_model_3",
    type: "wipers",
    date: daysAgo(20),
    mileage: 14500,
    cost: 45.99,
    notes: "Replaced wiper blades",
    createdAt: daysAgo(20),
    title: "Wiper Blades",
  },
  // Volvo XC90 History
  {
    id: "seed_rec_volvo_service",
    vehicleId: "seed_volvo_xc90",
    type: "inspection",
    date: daysAgo(100),
    mileage: 20000,
    cost: 450.0,
    notes: "Annual scheduled service. All green.",
    location: "Volvo Dealership",
    createdAt: daysAgo(100),
    title: "Annual Service",
  },
];

export const SEED_FUEL: FuelLog[] = [
  // Ford Transit (Diesel Workhorse) - Constant use
  {
    id: "seed_fuel_ford_1",
    vehicleId: "seed_ford_transit",
    date: daysAgo(45),
    fuelType: "diesel",
    volume: 55.0,
    totalCost: 93.5, // ~1.70/L
    pricePerUnit: 1.7,
    station: "Galp",
    createdAt: daysAgo(45),
  },
  {
    id: "seed_fuel_ford_2",
    vehicleId: "seed_ford_transit",
    date: daysAgo(30),
    fuelType: "diesel",
    volume: 62.1,
    totalCost: 108.67, // ~1.75/L
    pricePerUnit: 1.75,
    station: "Repsol",
    createdAt: daysAgo(30),
  },
  {
    id: "seed_fuel_ford_3",
    vehicleId: "seed_ford_transit",
    date: daysAgo(10),
    fuelType: "diesel",
    volume: 58.4,
    totalCost: 99.28, // ~1.70/L
    pricePerUnit: 1.7,
    station: "BP",
    createdAt: daysAgo(10),
  },

  // Tesla Model 3 (Electric) - Cheap charging
  {
    id: "seed_fuel_tesla_1",
    vehicleId: "seed_tesla_model_3",
    date: daysAgo(25),
    fuelType: "electric",
    volume: 45.0, // kWh
    totalCost: 11.25, // ~0.25/kWh (Home)
    pricePerUnit: 0.25,
    station: "Home Charger",
    createdAt: daysAgo(25),
  },
  {
    id: "seed_fuel_tesla_2",
    vehicleId: "seed_tesla_model_3",
    date: daysAgo(12),
    fuelType: "electric",
    volume: 38.5,
    totalCost: 19.25, // ~0.50/kWh (Supercharger)
    pricePerUnit: 0.5,
    station: "Tesla Supercharger",
    createdAt: daysAgo(12),
  },
  {
    id: "seed_fuel_tesla_3",
    vehicleId: "seed_tesla_model_3",
    date: daysAgo(3),
    fuelType: "electric",
    volume: 52.0,
    totalCost: 13.0, // ~0.25/kWh
    pricePerUnit: 0.25,
    station: "Home Charger",
    createdAt: daysAgo(3),
  },

  // Volvo XC90 (Family) - Occasional
  {
    id: "seed_fuel_volvo_1",
    vehicleId: "seed_volvo_xc90",
    date: daysAgo(60),
    fuelType: "diesel",
    volume: 48.0,
    totalCost: 81.6, // ~1.70/L
    pricePerUnit: 1.7,
    station: "Prio",
    createdAt: daysAgo(60),
  },
  {
    id: "seed_fuel_volvo_2",
    vehicleId: "seed_volvo_xc90",
    date: daysAgo(15),
    fuelType: "diesel",
    volume: 65.0,
    totalCost: 113.75, // ~1.75/L
    pricePerUnit: 1.75,
    station: "Galp",
    createdAt: daysAgo(15),
  },
];
