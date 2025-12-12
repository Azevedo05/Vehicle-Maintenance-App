import { router, Stack, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Check, Trash2 } from "lucide-react-native";

import { useVehicles } from "@/contexts/VehicleContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { usePreferences } from "@/contexts/PreferencesContext";
import { useAppAlert } from "@/contexts/AlertContext";
import { FuelType } from "@/types/vehicle";
import DatePickerInput from "@/components/DatePickerInput";
import LoadingOverlay from "@/components/LoadingOverlay";

import { Input } from "@/components/ui/Input";
import { Chip } from "@/components/ui/Chip";
// import { SuccessAnimation } from "@/components/ui/SuccessAnimation"; // Removed
import { ThemedBackground } from "@/components/ThemedBackground";
import Toast from "react-native-toast-message";

export default function AddFuelLogScreen() {
  const { vehicleId, fuelLogId } = useLocalSearchParams();
  const {
    addFuelLog,
    updateFuelLog,
    deleteFuelLog,
    getVehicleById,
    restoreLastSnapshot,
    fuelLogs,
  } = useVehicles();
  const { colors } = useTheme();
  const { t } = useLocalization();
  const { currencySymbol } = usePreferences();
  const { showToast, showAlert } = useAppAlert();

  const vehicle = getVehicleById(vehicleId as string);
  const isEditing = !!fuelLogId;

  const [date, setDate] = useState(new Date());
  const [fuelType, setFuelType] = useState<FuelType>(
    vehicle?.fuelType || "gasoline"
  );
  const [volume, setVolume] = useState("");
  const [totalCost, setTotalCost] = useState("");
  const [station, setStation] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const [showSuccess, setShowSuccess] = useState(false);

  // Load existing log data if editing
  React.useEffect(() => {
    if (fuelLogId) {
      const log = fuelLogs.find((l) => l.id === fuelLogId);
      if (log) {
        setDate(new Date(log.date));
        setFuelType(log.fuelType);
        setVolume(log.volume.toString());
        setTotalCost(log.totalCost.toString());
        setStation(log.station || "");
        setNotes(log.notes || "");
      }
    }
  }, [fuelLogId, fuelLogs]);

  // Get unique stations from history
  const recentStations = React.useMemo(() => {
    const stations = new Set<string>();
    fuelLogs.forEach((log) => {
      if (log.station) stations.add(log.station);
    });
    return Array.from(stations).sort();
  }, [fuelLogs]);

  const filteredStations = React.useMemo(() => {
    if (!station.trim()) return [];
    return recentStations.filter(
      (s) =>
        s.toLowerCase().includes(station.toLowerCase()) &&
        s.toLowerCase() !== station.toLowerCase()
    );
  }, [station, recentStations]);

  const handleSubmit = async () => {
    if (!date || !volume.trim() || !totalCost.trim()) {
      showAlert({
        title: t("vehicles.missing_info"),
        message: t("vehicles.fill_required"),
      });
      return;
    }

    const volumeValue = parseFloat(volume);
    const totalCostValue = parseFloat(totalCost);

    if (isNaN(volumeValue) || volumeValue <= 0) {
      showAlert({
        title: t("fuel.invalid_volume_title"),
        message: t("fuel.invalid_volume_text"),
      });
      return;
    }

    if (volumeValue > 200) {
      showAlert({
        title: t("fuel.invalid_volume_title"),
        message: t("validation.max_fuel_volume"),
      });
      return;
    }

    if (isNaN(totalCostValue) || totalCostValue <= 0) {
      showAlert({
        title: t("fuel.invalid_cost_title"),
        message: t("fuel.invalid_cost_text"),
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const logData = {
        vehicleId: vehicleId as string,
        date: date.getTime(),
        fuelType,
        volume: volumeValue,
        totalCost: totalCostValue,
        pricePerUnit: volumeValue > 0 ? totalCostValue / volumeValue : 0,
        station: station.trim(),
        notes: notes.trim(),
      };

      if (isEditing) {
        await updateFuelLog(fuelLogId as string, logData);
      } else {
        await addFuelLog(logData);
      }

      Toast.show({
        type: "success",
        text1: t("common.success"),
      });
      router.back();
    } catch (error) {
      console.error("Error saving fuel log:", error);
      showAlert({
        title: t("common.error"),
        message: t("fuel.save_error"),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = () => {
    showAlert({
      title: t("fuel.delete_log"),
      message: t("fuel.delete_confirm"),
      buttons: [
        {
          text: t("common.cancel"),
          style: "cancel",
        },
        {
          text: t("common.delete"),
          style: "destructive",
          onPress: async () => {
            try {
              await deleteFuelLog(fuelLogId as string);
              showToast({
                message: t("fuel.delete_success"),
                actionLabel: t("common.undo"),
                onAction: async () => {
                  await restoreLastSnapshot();
                },
              });
              router.back();
            } catch (error) {
              console.error("Error deleting fuel log:", error);
              showAlert({
                title: t("common.error"),
                message: t("common.error"),
              });
            }
          },
        },
      ],
    });
  };

  const styles = createStyles(colors);

  return (
    <ThemedBackground>
      <SafeAreaView
        style={[styles.container, { backgroundColor: "transparent" }]}
        edges={["bottom"]}
      >
        <Stack.Screen
          options={{
            title: isEditing
              ? vehicle?.fuelType === "electric"
                ? t("fuel.edit_log_electric")
                : t("fuel.edit_log")
              : vehicle?.fuelType === "electric"
              ? t("fuel.add_log_electric")
              : t("fuel.add_log"),
            headerRight: () => (
              <View
                style={{
                  flexDirection: "row",
                  gap: 16,
                  alignItems: "center",
                  marginRight: Platform.OS === "ios" ? -16 : 0,
                }}
              >
                {isSubmitting ? (
                  <ActivityIndicator color={colors.primary} />
                ) : (
                  <>
                    <TouchableOpacity
                      onPress={handleSubmit}
                      disabled={isSubmitting}
                      hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                    >
                      <Check size={24} color={colors.primary} />
                    </TouchableOpacity>
                    {isEditing && (
                      <TouchableOpacity
                        onPress={handleDelete}
                        disabled={isSubmitting}
                        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                      >
                        <Trash2 size={24} color={colors.error} />
                      </TouchableOpacity>
                    )}
                  </>
                )}
              </View>
            ),
          }}
        />

        <KeyboardAvoidingView
          behavior="padding"
          style={styles.keyboardView}
          keyboardVerticalOffset={100}
        >
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.form}>
              <DatePickerInput
                label={t("fuel.date_label")}
                value={date}
                onChange={setDate}
                mode="date"
                maximumDate={new Date()}
                required
              />

              {/* Fuel type chips - only show if vehicle doesn't have a type set */}
              {!vehicle?.fuelType && (
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>{t("fuel.type_label")}</Text>
                  <View style={styles.typeRow}>
                    {(
                      ["gasoline", "diesel", "gpl", "electric"] as FuelType[]
                    ).map((type) => (
                      <Chip
                        key={type}
                        label={t(`fuel.type_${type}`)}
                        active={fuelType === type}
                        onPress={() => setFuelType(type)}
                        style={styles.typeChip}
                      />
                    ))}
                  </View>
                </View>
              )}

              <View style={styles.row}>
                <View style={styles.rowItem}>
                  <Input
                    label={t("fuel.volume_label", {
                      unit:
                        fuelType === "electric"
                          ? t("fuel.volume_unit_electric")
                          : t("fuel.volume_unit"),
                    })}
                    value={volume}
                    onChangeText={setVolume}
                    placeholder={t("fuel.volume_placeholder")}
                    keyboardType="decimal-pad"
                    required
                  />
                </View>
                <View style={styles.rowItem}>
                  <Input
                    label={t("fuel.total_cost_label", {
                      currency: currencySymbol,
                    })}
                    value={totalCost}
                    onChangeText={setTotalCost}
                    placeholder="70.00"
                    keyboardType="decimal-pad"
                    required
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>{t("fuel.station_label")}</Text>
                <TextInput
                  style={styles.input}
                  value={station}
                  onChangeText={(text) => {
                    setStation(text);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => {
                    // Delay hiding to allow press on suggestion
                    setTimeout(() => setShowSuggestions(false), 200);
                  }}
                  placeholder={t("fuel.station_placeholder")}
                  placeholderTextColor={colors.placeholder}
                />
                {showSuggestions && filteredStations.length > 0 && (
                  <View style={styles.suggestionsContainer}>
                    {filteredStations.map((item) => (
                      <TouchableOpacity
                        key={item}
                        style={styles.suggestionItem}
                        onPress={() => {
                          setStation(item);
                          setShowSuggestions(false);
                        }}
                      >
                        <Text style={styles.suggestionText}>{item}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              <Input
                label={t("fuel.notes_label")}
                value={notes}
                onChangeText={setNotes}
                placeholder={t("fuel.notes_placeholder")}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                style={styles.textArea}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        <LoadingOverlay
          visible={isSubmitting}
          text={isEditing ? t("common.saving") : t("fuel.saving")}
        />
      </SafeAreaView>
    </ThemedBackground>
  );
}

const createStyles = (colors: ReturnType<typeof useTheme>["colors"]) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    keyboardView: {
      flex: 1,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      padding: 16,
    },
    form: {
      gap: 16,
    },
    inputGroup: {
      gap: 8,
    },
    label: {
      fontSize: 16,
      fontWeight: "600" as const,
      color: colors.text,
    },
    dangerZone: {
      marginTop: 24,
      marginBottom: 8,
    },
    deleteButton: {
      backgroundColor: colors.error + "15",
      borderRadius: 12,
      padding: 16,
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.error + "30",
    },
    deleteButtonText: {
      color: colors.error,
      fontSize: 16,
      fontWeight: "600" as const,
    },

    input: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      fontSize: 16,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
    },
    textArea: {
      minHeight: 100,
    },
    typeRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    typeChip: {
      // Custom style override if needed, or rely on Chip default
    },
    row: {
      flexDirection: "row",
      gap: 12,
    },
    rowItem: {
      flex: 1,
    },
    suggestionsContainer: {
      marginTop: 4,
      backgroundColor: colors.surface,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: "hidden",
    },
    suggestionItem: {
      padding: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    suggestionText: {
      fontSize: 14,
      color: colors.text,
    },
  });
