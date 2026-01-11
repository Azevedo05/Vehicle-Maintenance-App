import React from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { Plus, ChevronDown, ChevronUp, CirclePlus } from "lucide-react-native";
import { useLocalization } from "@/contexts/LocalizationContext";
import { useTheme } from "@/contexts/ThemeContext";
import { FuelType, TransmissionType, DriveType } from "@/types/vehicle";
import { Input } from "@/components/ui/Input";
import { Chip } from "@/components/ui/Chip";
import { createFormStyles } from "@/styles/vehicle/VehicleForm.styles";

interface VehicleExtrasFormProps {
  fuelType: FuelType | undefined;
  engine: string;
  setEngine: (value: string) => void;
  engineError: string | null;
  setEngineError: (value: string | null) => void;
  transmission: TransmissionType | undefined;
  setTransmission: (value: TransmissionType) => void;
  purchaseDate: Date | undefined;
  setShowDatePicker: (value: boolean) => void;
  horsepower: string;
  setHorsepower: (value: string) => void;
  horsepowerError: string | null;
  setHorsepowerError: (value: string | null) => void;
  torque: string;
  setTorque: (value: string) => void;
  torqueError: string | null;
  setTorqueError: (value: string | null) => void;
  vin: string;
  setVin: (value: string) => void;
  batteryCapacity: string;
  setBatteryCapacity: (value: string) => void;
  batteryCapacityError: string | null;
  setBatteryCapacityError: (value: string | null) => void;
  driveType: DriveType | undefined;
  setDriveType: (value: DriveType) => void;
  tireSizeFront: string;
  setTireSizeFront: (value: string) => void;
  tirePressureFront: string;
  setTirePressureFront: (value: string) => void;
  tireSizeRear: string;
  setTireSizeRear: (value: string) => void;
  tirePressureRear: string;
  setTirePressureRear: (value: string) => void;
  tirePressureUnit: import("@/types/vehicle").PressureUnit | undefined;
  setTirePressureUnit: (value: import("@/types/vehicle").PressureUnit) => void;
  showExtras: boolean;
  setShowExtras: (value: boolean) => void;
}

export const VehicleExtrasForm = ({
  fuelType,
  engine,
  setEngine,
  engineError,
  setEngineError,
  transmission,
  setTransmission,
  purchaseDate,
  setShowDatePicker,
  horsepower,
  setHorsepower,
  horsepowerError,
  setHorsepowerError,
  torque,
  setTorque,
  torqueError,
  setTorqueError,
  vin,
  setVin,
  batteryCapacity,
  setBatteryCapacity,
  batteryCapacityError,
  setBatteryCapacityError,
  driveType,
  setDriveType,
  tireSizeFront,
  setTireSizeFront,
  tirePressureFront,
  setTirePressureFront,
  tireSizeRear,
  setTireSizeRear,
  tirePressureRear,
  setTirePressureRear,
  tirePressureUnit,
  setTirePressureUnit,
  showExtras,
  setShowExtras,
}: VehicleExtrasFormProps) => {
  const { t } = useLocalization();
  const { colors } = useTheme();
  const styles = createFormStyles(colors);

  const handleEngineChangeInternal = (value: string) => {
    setEngine(value);
    if (value.trim() === "") {
      setEngineError(null);
      return;
    }
    const numValue = parseInt(value.replace(/\D/g, ""), 10);
    if (isNaN(numValue) || numValue < 50 || numValue > 13000) {
      setEngineError(t("vehicles.invalid_engine_text"));
    } else {
      setEngineError(null);
    }
  };

  const handleHorsepowerChangeInternal = (value: string) => {
    setHorsepower(value);
    if (value.trim() === "") {
      setHorsepowerError(null);
      return;
    }
    const numValue = parseInt(value.replace(/\D/g, ""), 10);
    if (isNaN(numValue) || numValue < 5 || numValue > 2000) {
      setHorsepowerError(t("vehicles.invalid_horsepower_text"));
    } else {
      setHorsepowerError(null);
    }
  };

  const handleTorqueChangeInternal = (value: string) => {
    setTorque(value);
    if (value.trim() === "") {
      setTorqueError(null);
      return;
    }
    const numValue = parseInt(value.replace(/\D/g, ""), 10);
    if (isNaN(numValue) || numValue < 5 || numValue > 3000) {
      setTorqueError(t("vehicles.invalid_torque_text"));
    } else {
      setTorqueError(null);
    }
  };

  const handleBatteryCapacityChangeInternal = (value: string) => {
    setBatteryCapacity(value);
    if (value.trim() === "") {
      setBatteryCapacityError(null);
      return;
    }
    const numValue = parseFloat(value.replace(/[^\d.]/g, ""));
    if (isNaN(numValue) || numValue < 1 || numValue > 250) {
      setBatteryCapacityError(t("vehicles.invalid_battery_text"));
    } else {
      setBatteryCapacityError(null);
    }
  };

  return (
    <View>
      <TouchableOpacity
        style={styles.extrasToggle}
        onPress={() => {
          setShowExtras(!showExtras);
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }}
        activeOpacity={0.7}
      >
        <View style={styles.extrasToggleContent}>
          <View style={styles.extrasToggleLeft}>
            <Plus size={20} color={colors.primary} />
            <Text style={styles.extrasToggleText}>{t("vehicles.extras")}</Text>
          </View>
          {showExtras ? (
            <ChevronUp size={20} color={colors.textSecondary} />
          ) : (
            <ChevronDown size={20} color={colors.textSecondary} />
          )}
        </View>
      </TouchableOpacity>

      {showExtras && (
        <Animated.View
          entering={FadeIn}
          exiting={FadeOut}
          style={{ gap: 16, marginTop: 16 }}
        >
          {/* Engine - hidden for electric */}
          {fuelType !== "electric" && (
            <Input
              label={`${t("vehicles.engine")} (cc)`}
              value={engine}
              onChangeText={handleEngineChangeInternal}
              placeholder={t("vehicles.engine_placeholder")}
              keyboardType="numeric"
              error={engineError || undefined}
            />
          )}

          {/* Transmission */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t("vehicles.transmission")}</Text>
            <View style={styles.categoryGrid}>
              {(["manual", "automatic"] as const).map((type) => (
                <Chip
                  key={type}
                  label={t(`vehicles.transmission_${type}`)}
                  active={
                    transmission === type ||
                    (fuelType === "electric" && type === "automatic")
                  }
                  onPress={() => {
                    if (fuelType === "electric" && type === "manual") return;
                    setTransmission(type);
                  }}
                  style={
                    fuelType === "electric" && type === "manual"
                      ? { ...styles.categoryChip, opacity: 0.4 }
                      : styles.categoryChip
                  }
                />
              ))}
            </View>
          </View>

          {/* Purchase Date */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t("vehicles.purchase_date")}</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowDatePicker(true)}
            >
              <Text
                style={
                  purchaseDate
                    ? { color: colors.text }
                    : { color: colors.placeholder }
                }
              >
                {purchaseDate
                  ? purchaseDate.toLocaleDateString()
                  : t("maintenance.date_placeholder")}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Input
                label={`${t("vehicles.horsepower")} (cv)`}
                value={horsepower}
                onChangeText={handleHorsepowerChangeInternal}
                placeholder={t("vehicles.horsepower_placeholder")}
                keyboardType="numeric"
                error={horsepowerError || undefined}
              />
            </View>
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Input
                label={`${t("vehicles.torque")} (Nm)`}
                value={torque}
                onChangeText={handleTorqueChangeInternal}
                placeholder={t("vehicles.torque_placeholder")}
                keyboardType="numeric"
                error={torqueError || undefined}
              />
            </View>
          </View>

          <Input
            label={t("vehicles.vin")}
            value={vin}
            onChangeText={setVin}
            placeholder={t("vehicles.vin_placeholder")}
            autoCapitalize="characters"
          />

          {fuelType === "electric" && (
            <Input
              label={`${t("vehicles.battery_capacity")} (kWh)`}
              value={batteryCapacity}
              onChangeText={handleBatteryCapacityChangeInternal}
              placeholder={t("vehicles.battery_capacity_placeholder")}
              keyboardType="numeric"
              error={batteryCapacityError || undefined}
            />
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t("vehicles.drive_type")}</Text>
            <View style={styles.categoryGrid}>
              {(["FWD", "RWD", "AWD", "4WD"] as const).map((type) => (
                <Chip
                  key={type}
                  label={t(`vehicles.drive_type_${type}`)}
                  active={driveType === type}
                  onPress={() => setDriveType(type)}
                  style={styles.categoryChip}
                />
              ))}
            </View>
          </View>

          {/* Tires Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t("vehicles.tires")}</Text>
          </View>

          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Input
                label={t("vehicles.tire_size_front")}
                value={tireSizeFront}
                onChangeText={setTireSizeFront}
                placeholder={t("vehicles.tire_size_front_placeholder")}
                autoCapitalize="characters"
              />
            </View>
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Input
                label={t("vehicles.tire_size_rear")}
                value={tireSizeRear}
                onChangeText={setTireSizeRear}
                placeholder={t("vehicles.tire_size_rear_placeholder")}
                autoCapitalize="characters"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 8,
                marginTop: 8,
              }}
            >
              <Text style={styles.label}>
                {t("vehicles.tire_pressure_unit")}
              </Text>
              <View style={styles.pressureSwitcher}>
                {(["bar", "psi"] as const).map((unit) => (
                  <TouchableOpacity
                    key={unit}
                    activeOpacity={0.7}
                    style={[
                      styles.pressureSwitcherOption,
                      tirePressureUnit === unit &&
                        styles.pressureSwitcherOptionActive,
                    ]}
                    onPress={() => setTirePressureUnit(unit)}
                  >
                    <Text
                      style={[
                        styles.pressureSwitcherText,
                        tirePressureUnit === unit &&
                          styles.pressureSwitcherTextActive,
                      ]}
                    >
                      {unit.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Input
                  label={t("vehicles.tire_pressure_front_short")}
                  value={tirePressureFront}
                  onChangeText={setTirePressureFront}
                  placeholder={tirePressureUnit === "bar" ? "2.4" : "35"}
                  keyboardType="numeric"
                />
              </View>
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Input
                  label={t("vehicles.tire_pressure_rear_short")}
                  value={tirePressureRear}
                  onChangeText={setTirePressureRear}
                  placeholder={tirePressureUnit === "bar" ? "2.2" : "32"}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>
        </Animated.View>
      )}
    </View>
  );
};
