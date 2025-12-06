import { router, Stack, useLocalSearchParams } from "expo-router";
import React, { useState, useLayoutEffect, useMemo } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { Check, Lightbulb, Calendar, Info } from "lucide-react-native";

import { useVehicles } from "@/contexts/VehicleContext";
import {
  MAINTENANCE_TYPES,
  MaintenanceType,
  getMaintenanceTypeLabel,
} from "@/types/maintenance";
import { useTheme } from "@/contexts/ThemeContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { useAppAlert } from "@/contexts/AlertContext";
import LoadingOverlay from "@/components/LoadingOverlay";

export default function AddTaskScreen() {
  const { vehicleId } = useLocalSearchParams();
  const { addTask, getVehicleById, restoreLastSnapshot } = useVehicles();
  const { colors } = useTheme();
  const { t } = useLocalization();
  const { showToast, showAlert } = useAppAlert();

  const vehicle = vehicleId ? getVehicleById(vehicleId as string) : null;

  const [selectedType, setSelectedType] =
    useState<MaintenanceType>("oil_change");
  const [title, setTitle] = useState(t("maintenance.types.oil_change"));
  const [intervalType, setIntervalType] = useState<"mileage" | "date">(
    "mileage"
  );
  const [intervalValue, setIntervalValue] = useState("5000");
  const [lastMileage, setLastMileage] = useState(
    vehicle?.currentMileage.toString() || "0"
  );
  const [isRecurring, setIsRecurring] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sortedMaintenanceTypes = useMemo(() => {
    const types = Object.keys(MAINTENANCE_TYPES) as MaintenanceType[];
    return types.sort((a, b) => {
      if (a === "other") return 1;
      if (b === "other") return -1;
      const labelA = getMaintenanceTypeLabel(a, t);
      const labelB = getMaintenanceTypeLabel(b, t);
      return labelA.localeCompare(labelB);
    });
  }, [t]);

  const handleTypeSelect = (type: MaintenanceType) => {
    setSelectedType(type);
    const typeInfo = MAINTENANCE_TYPES[type];
    setTitle(getMaintenanceTypeLabel(type, t));
    setIntervalType(typeInfo.intervalType);
    setIntervalValue(typeInfo.defaultInterval.toString());
  };

  const handleIntervalTypeChange = (type: "mileage" | "date") => {
    setIntervalType(type);
    // Use the recommended value for current maintenance type when switching
    const typeInfo = MAINTENANCE_TYPES[selectedType];
    if (type === "mileage") {
      setIntervalValue(typeInfo.defaultMileageInterval.toString());
    } else {
      setIntervalValue(typeInfo.defaultTimeInterval.toString());
    }
  };

  const handleUseRecommended = () => {
    const typeInfo = MAINTENANCE_TYPES[selectedType];
    if (intervalType === "mileage") {
      setIntervalValue(typeInfo.defaultMileageInterval.toString());
    } else {
      setIntervalValue(typeInfo.defaultTimeInterval.toString());
    }
  };

  const getRecommendedText = () => {
    const typeInfo = MAINTENANCE_TYPES[selectedType];
    if (intervalType === "mileage") {
      return t("maintenance.recommended_km_simple", {
        km: typeInfo.defaultMileageInterval.toLocaleString(),
      });
    } else {
      return t("maintenance.recommended_days_simple", {
        days: typeInfo.defaultTimeInterval,
      });
    }
  };

  const handleSubmit = async () => {
    if (!vehicleId || !title.trim() || !intervalValue.trim()) {
      showAlert({
        title: t("vehicles.missing_info"),
        message: t("vehicles.fill_required"),
      });
      return;
    }

    const interval = parseInt(intervalValue);
    if (isNaN(interval) || interval <= 0) {
      showAlert({
        title: t("maintenance.invalid_interval"),
        message: t("maintenance.invalid_interval_text", {
          type:
            intervalType === "mileage"
              ? t("maintenance.interval_mileage")
              : t("maintenance.interval_date"),
        }),
      });
      return;
    }

    const lastMileageNum = parseInt(lastMileage);
    if (
      intervalType === "mileage" &&
      (isNaN(lastMileageNum) || lastMileageNum < 0)
    ) {
      showAlert({
        title: t("vehicles.invalid_mileage"),
        message: t("vehicles.valid_mileage_text"),
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const now = Date.now();
      const taskTitle = title.trim();
      await addTask({
        vehicleId: vehicleId as string,
        type: selectedType,
        title: taskTitle,
        intervalType,
        intervalValue: interval,
        lastCompletedMileage:
          intervalType === "mileage" ? lastMileageNum : undefined,
        lastCompletedDate: intervalType === "date" ? now : undefined,
        nextDueMileage:
          intervalType === "mileage" ? lastMileageNum + interval : undefined,
        nextDueDate:
          intervalType === "date"
            ? now + interval * 24 * 60 * 60 * 1000
            : undefined,
        isRecurring: isRecurring,
        isCompleted: false,
      });

      router.back();

      setTimeout(() => {
        showToast({
          message: t("maintenance.add_task_success", { title: taskTitle }),
          actionLabel: t("common.undo"),
          onAction: async () => {
            await restoreLastSnapshot();
          },
        });
      }, 150);
    } catch (error) {
      console.error("Error adding task:", error);
      showAlert({
        title: t("common.error"),
        message: t("maintenance.add_error"),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!vehicle) {
    const errorStyles = createStyles(colors);
    return (
      <View style={errorStyles.errorContainer}>
        <Text style={errorStyles.errorText}>{t("vehicles.not_found")}</Text>
      </View>
    );
  }

  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: t("maintenance.add_task"),
          headerRight: () =>
            isSubmitting ? (
              <ActivityIndicator color={colors.primary} />
            ) : (
              <TouchableOpacity onPress={handleSubmit} disabled={isSubmitting}>
                <Check size={24} color={colors.primary} />
              </TouchableOpacity>
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
          <Text style={styles.sectionTitle}>
            {t("maintenance.select_type")}
          </Text>
          <View style={styles.typeGrid}>
            {sortedMaintenanceTypes.map((type) => {
              const isSelected = selectedType === type;
              return (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typeCard,
                    isSelected && styles.typeCardSelected,
                  ]}
                  onPress={() => handleTypeSelect(type)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.typeLabel,
                      isSelected && styles.typeLabelSelected,
                    ]}
                    numberOfLines={2}
                  >
                    {getMaintenanceTypeLabel(type, t)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t("maintenance.interval_type")}</Text>
              <View style={styles.segmentedControl}>
                <TouchableOpacity
                  style={[
                    styles.segment,
                    intervalType === "mileage" && styles.segmentSelected,
                  ]}
                  onPress={() => handleIntervalTypeChange("mileage")}
                >
                  <Text
                    style={[
                      styles.segmentText,
                      intervalType === "mileage" && styles.segmentTextSelected,
                    ]}
                  >
                    {t("maintenance.interval_mileage")}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.segment,
                    intervalType === "date" && styles.segmentSelected,
                  ]}
                  onPress={() => handleIntervalTypeChange("date")}
                >
                  <Text
                    style={[
                      styles.segmentText,
                      intervalType === "date" && styles.segmentTextSelected,
                    ]}
                  >
                    {t("maintenance.interval_date")}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.labelWithAction}>
                <Text style={styles.label}>
                  {t("maintenance.interval")} (
                  {intervalType === "mileage"
                    ? t("vehicles.km")
                    : t("maintenance.interval_date").toLowerCase()}
                  ) <Text style={styles.required}>*</Text>
                </Text>
              </View>
              <TouchableOpacity
                style={styles.recommendedHint}
                onPress={handleUseRecommended}
                activeOpacity={0.7}
              >
                <View style={styles.iconContainer}>
                  <Lightbulb size={20} color={colors.warning} />
                </View>
                <View style={styles.textContainer}>
                  <Text style={[styles.cardTitle, { color: colors.warning }]}>
                    {t("maintenance.use_recommended")}
                  </Text>
                  <Text style={styles.cardText}>{getRecommendedText()}</Text>
                </View>
              </TouchableOpacity>
              <TextInput
                style={styles.input}
                value={intervalValue}
                onChangeText={setIntervalValue}
                placeholder={
                  intervalType === "mileage"
                    ? t("maintenance.interval_mileage_placeholder")
                    : t("maintenance.interval_days_placeholder")
                }
                placeholderTextColor={colors.placeholder}
                keyboardType="numeric"
              />
            </View>

            {intervalType === "mileage" && (
              <View style={styles.inputGroup}>
                <View style={styles.labelWithAction}>
                  <Text style={styles.label}>
                    {t("maintenance.last_completed_mileage")} (
                    {t("vehicles.km")}) <Text style={styles.required}>*</Text>
                  </Text>
                  <TouchableOpacity
                    onPress={() =>
                      showAlert({
                        title: t("maintenance.last_mileage_help_title"),
                        message: t("maintenance.last_mileage_help_text"),
                      })
                    }
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Info size={20} color={colors.primary} />
                  </TouchableOpacity>
                </View>
                <TextInput
                  style={styles.input}
                  value={lastMileage}
                  onChangeText={setLastMileage}
                  placeholder={t("vehicles.mileage_placeholder")}
                  placeholderTextColor={colors.placeholder}
                  keyboardType="numeric"
                />
              </View>
            )}

            <View style={styles.inputGroup}>
              <View style={styles.switchRow}>
                <View style={styles.switchLabelContainer}>
                  <Text style={styles.label}>
                    {t("maintenance.recurring_task")}
                  </Text>
                  <Text style={styles.switchDescription}>
                    {t("maintenance.recurring_description")}
                  </Text>
                </View>
                <Switch
                  value={isRecurring}
                  onValueChange={setIsRecurring}
                  trackColor={{
                    false: colors.border,
                    true: colors.primary + "50",
                  }}
                  thumbColor={isRecurring ? colors.primary : colors.placeholder}
                />
              </View>
            </View>

            <View style={styles.infoCard}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: colors.primary + "15" },
                ]}
              >
                <Calendar size={20} color={colors.primary} />
              </View>
              <View style={styles.textContainer}>
                <Text style={[styles.cardTitle, { color: colors.primary }]}>
                  {t("maintenance.next_maintenance")}
                </Text>
                <Text style={styles.cardText}>
                  {intervalType === "mileage"
                    ? t("maintenance.at_mileage", {
                        mileage: (
                          parseInt(lastMileage) + parseInt(intervalValue || "0")
                        ).toLocaleString(),
                      })
                    : t("maintenance.in_days", { days: intervalValue })}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <LoadingOverlay visible={isSubmitting} text={t("vehicles.adding")} />
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof useTheme>["colors"]) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    errorContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
      backgroundColor: colors.background,
    },
    errorText: {
      fontSize: 18,
      fontWeight: "600" as const,
      color: colors.text,
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
    sectionTitle: {
      fontSize: 20,
      fontWeight: "700" as const,
      color: colors.text,
      marginBottom: 16,
    },
    typeGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      marginBottom: 24,
      justifyContent: "space-between",
    },
    typeCard: {
      width: "31%",
      minWidth: 90,
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 12,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 2,
      borderColor: "transparent",
      minHeight: 60,
    },
    typeCardSelected: {
      borderColor: colors.primary,
      backgroundColor: colors.primary + "15",
    },
    typeLabel: {
      fontSize: 12,
      fontWeight: "600" as const,
      color: colors.textSecondary,
      textAlign: "center",
      flexShrink: 1,
    },
    typeLabelSelected: {
      color: colors.primary,
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
      flexShrink: 1,
      flexWrap: "wrap",
    },
    labelWithAction: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 4,
    },
    recommendedButton: {
      backgroundColor: colors.primary + "15",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.primary + "30",
    },
    recommendedButtonText: {
      fontSize: 12,
      fontWeight: "600" as const,
      color: colors.primary,
    },
    recommendedHint: {
      backgroundColor: colors.warning + "10",
      borderRadius: 12,
      padding: 12,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.warning,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    recommendedHintText: {
      fontSize: 13,
      color: colors.text,
      fontWeight: "500" as const,
    },
    required: {
      color: colors.error,
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
    segmentedControl: {
      flexDirection: "row",
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 4,
      borderWidth: 1,
      borderColor: colors.border,
    },
    segment: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: "center",
    },
    segmentSelected: {
      backgroundColor: colors.primary,
    },
    segmentText: {
      fontSize: 16,
      fontWeight: "600" as const,
      color: colors.textSecondary,
    },
    segmentTextSelected: {
      color: "#FFFFFF",
    },
    infoCard: {
      backgroundColor: colors.primary + "10",
      borderRadius: 12,
      padding: 12,
      borderWidth: 1,
      borderColor: colors.primary,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.background,
      justifyContent: "center",
      alignItems: "center",
    },
    textContainer: {
      flex: 1,
    },
    cardTitle: {
      fontSize: 12,
      fontWeight: "700",
      marginBottom: 2,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    cardText: {
      fontSize: 14,
      color: colors.text,
      fontWeight: "500",
    },
    switchRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    switchLabelContainer: {
      flex: 1,
      marginRight: 12,
    },
    switchDescription: {
      fontSize: 13,
      color: colors.textSecondary,
      marginTop: 4,
    },
  });
