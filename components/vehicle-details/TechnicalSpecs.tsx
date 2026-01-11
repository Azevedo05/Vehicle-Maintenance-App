import React from "react";
import { Text, View, useWindowDimensions } from "react-native";
import { useLocalization } from "@/contexts/LocalizationContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Vehicle, VEHICLE_CATEGORY_INFO } from "@/types/vehicle";
import { createTechnicalSpecsStyles } from "@/styles/vehicle/TechnicalSpecs.styles";
import {
  Calendar,
  Fuel,
  Zap,
  Palette,
  CircleDot as LucideCircleDot,
  Gauge as LucideGauge,
} from "lucide-react-native";
import {
  IconManualGearbox,
  IconEngine,
  IconCarTurbine,
  IconCar4wd,
  IconId,
  IconBattery,
  IconWheel,
  IconRoad,
} from "@tabler/icons-react-native";

interface TechnicalSpecsProps {
  vehicle: Vehicle;
}

export function TechnicalSpecs({ vehicle }: TechnicalSpecsProps) {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const { width } = useWindowDimensions();
  const isTablet = width > 500; // Threshold for 2-column optimization
  const styles = createTechnicalSpecsStyles(colors);

  const hasTechnicalData =
    vehicle.horsepower ||
    vehicle.torque ||
    vehicle.engine ||
    vehicle.transmission ||
    vehicle.driveType ||
    vehicle.tireSizeFront ||
    vehicle.tireSizeRear;

  if (!hasTechnicalData) return null;

  const SpecItem = ({
    icon: Icon,
    label,
    value,
    unit,
    fullWidth = false,
  }: {
    icon: any;
    label: string;
    value?: string | number;
    unit?: string;
    fullWidth?: boolean;
  }) => {
    if (value === undefined || value === null || value === "") return null;
    return (
      <View
        style={[
          styles.specItem,
          fullWidth && !isTablet && { width: "100%", flex: undefined },
        ]}
      >
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: colors.primary + "10" },
          ]}
        >
          <Icon size={20} color={colors.primary} strokeWidth={1.5} />
        </View>
        <View style={styles.specTextContainer}>
          <Text style={styles.specLabel} numberOfLines={1} adjustsFontSizeToFit>
            {label}
          </Text>
          <Text
            style={[
              styles.specValue,
              typeof value === "string" && value.length > 20
                ? { fontSize: 12 }
                : null,
            ]}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {value}
            {unit ? ` ${unit}` : ""}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("vehicles.technical_specs")}</Text>

      <View style={styles.grid}>
        {/* Row: Status - Mileage */}
        <View style={styles.row}>
          <SpecItem
            icon={IconRoad}
            label={t("vehicles.current_mileage")}
            value={vehicle.currentMileage.toLocaleString()}
            unit={t("vehicles.km")}
            fullWidth={true}
          />
        </View>

        {/* Dynamic Groups */}
        <View style={styles.row}>
          <SpecItem
            icon={Calendar}
            label={t("vehicles.year")}
            value={vehicle.year}
          />
          <SpecItem
            icon={vehicle.fuelType === "electric" ? Zap : Fuel}
            label={t("fuel.fuel")}
            value={
              vehicle.fuelType ? t(`fuel.type_${vehicle.fuelType}`) : undefined
            }
          />
        </View>

        <View style={styles.row}>
          <SpecItem
            icon={IconManualGearbox}
            label={t("vehicles.transmission")}
            value={
              vehicle.transmission
                ? t(`vehicles.transmission_${vehicle.transmission}`)
                : undefined
            }
          />
          <SpecItem
            icon={IconEngine}
            label={t("vehicles.engine")}
            value={vehicle.engine}
            unit="cc"
          />
        </View>

        {/* Pair Power/Torque */}
        <View style={styles.row}>
          <SpecItem
            icon={LucideGauge}
            label={t("vehicles.horsepower")}
            value={vehicle.horsepower}
            unit="cv"
          />
          <SpecItem
            icon={IconCarTurbine}
            label={t("vehicles.torque")}
            value={vehicle.torque}
            unit="Nm"
          />
        </View>

        {/* Pairing Drive Type and Category */}
        <View style={styles.row}>
          <SpecItem
            icon={IconCar4wd}
            label={t("vehicles.drive_type")}
            value={
              vehicle.driveType
                ? t(`vehicles.drive_type_${vehicle.driveType}`)
                : undefined
            }
          />
          <SpecItem
            icon={
              vehicle.category
                ? VEHICLE_CATEGORY_INFO[vehicle.category].Icon
                : LucideCircleDot
            }
            label={t("vehicles.category")}
            value={
              vehicle.category
                ? t(`vehicles.category_${vehicle.category}`)
                : undefined
            }
          />
        </View>

        {/* Tablet Optimized: Pairing Color, VIN, and Purchase Date */}
        <View
          style={[
            styles.row,
            !isTablet && { flexDirection: "column", gap: 16 },
          ]}
        >
          <SpecItem
            icon={Palette}
            label={t("vehicles.color")}
            value={vehicle.color}
          />
          {isTablet && vehicle.purchaseDate ? (
            <SpecItem
              icon={Calendar}
              label={t("vehicles.purchase_date")}
              value={new Date(vehicle.purchaseDate).toLocaleDateString()}
            />
          ) : vehicle.batteryCapacity ? (
            <SpecItem
              icon={IconBattery}
              label={t("vehicles.battery_capacity")}
              value={vehicle.batteryCapacity}
              unit="kWh"
            />
          ) : null}
        </View>

        <View
          style={[
            styles.row,
            !isTablet && { flexDirection: "column", gap: 16 },
          ]}
        >
          {vehicle.vin && (
            <SpecItem
              icon={IconId}
              label={t("vehicles.vin")}
              value={vehicle.vin}
              fullWidth={!isTablet}
            />
          )}
          {!isTablet && vehicle.purchaseDate && (
            <SpecItem
              icon={Calendar}
              label={t("vehicles.purchase_date")}
              value={new Date(vehicle.purchaseDate).toLocaleDateString()}
            />
          )}
          {/* Battery if not shown above */}
          {isTablet && vehicle.batteryCapacity && vehicle.purchaseDate && (
            <SpecItem
              icon={IconBattery}
              label={t("vehicles.battery_capacity")}
              value={vehicle.batteryCapacity}
              unit="kWh"
            />
          )}
        </View>

        {/* Tires Section Grouped */}
        {(vehicle.tireSizeFront ||
          vehicle.tireSizeRear ||
          vehicle.tirePressureFront ||
          vehicle.tirePressureRear) && (
          <View style={{ marginTop: 8 }}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{t("vehicles.tires")}</Text>
            </View>

            {/* Tire Sizes Row */}
            {(vehicle.tireSizeFront || vehicle.tireSizeRear) && (
              <View
                style={[
                  styles.tireSection,
                  {
                    marginBottom: 12,
                    paddingBottom: 12,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border + "40",
                  },
                ]}
              >
                <View style={styles.tireHeader}>
                  <View
                    style={[
                      styles.iconContainer,
                      { backgroundColor: colors.primary + "10" },
                    ]}
                  >
                    <IconWheel
                      size={20}
                      color={colors.primary}
                      strokeWidth={1.5}
                    />
                  </View>
                  <Text style={styles.tireTitle}>
                    {t("vehicles.tire_size")}
                  </Text>
                </View>
                <View style={styles.row}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.specLabel}>{t("common.front")}</Text>
                    <Text style={styles.tireValue}>
                      {vehicle.tireSizeFront || "---"}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.specLabel}>{t("common.rear")}</Text>
                    <Text style={styles.tireValue}>
                      {vehicle.tireSizeRear || "---"}
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {/* Tire Pressures Row */}
            {(vehicle.tirePressureFront || vehicle.tirePressureRear) && (
              <View style={styles.tireSection}>
                <View
                  style={[
                    styles.tireHeader,
                    { justifyContent: "space-between" },
                  ]}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <View
                      style={[
                        styles.iconContainer,
                        { backgroundColor: colors.primary + "10" },
                      ]}
                    >
                      <IconWheel
                        size={20}
                        color={colors.primary}
                        strokeWidth={1.5}
                      />
                    </View>
                    <Text style={styles.tireTitle}>
                      {t("vehicles.tire_pressure")}
                    </Text>
                  </View>
                  {vehicle.tirePressureUnit && (
                    <View
                      style={[
                        styles.pressureBadge,
                        { backgroundColor: colors.primary + "15" },
                      ]}
                    >
                      <Text
                        style={[styles.pressureText, { fontWeight: "700" }]}
                      >
                        {vehicle.tirePressureUnit.toUpperCase()}
                      </Text>
                    </View>
                  )}
                </View>
                <View style={styles.row}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.specLabel}>{t("common.front")}</Text>
                    <Text style={styles.tireValue}>
                      {vehicle.tirePressureFront || "---"}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.specLabel}>{t("common.rear")}</Text>
                    <Text style={styles.tireValue}>
                      {vehicle.tirePressureRear || "---"}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  );
}
