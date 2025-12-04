import { Stack, router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState, useMemo } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Check, Trash2 } from "lucide-react-native";

import { useVehicles } from "@/contexts/VehicleContext";
import {
  MAINTENANCE_TYPES,
  MaintenanceType,
  getMaintenanceTypeLabel,
} from "@/types/maintenance";
import { useTheme } from "@/contexts/ThemeContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { useAppAlert } from "@/contexts/AlertContext";

import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { SuccessAnimation } from "@/components/ui/SuccessAnimation";

export default function AddRecordScreen() {
  const { vehicleId, taskId, recordId } = useLocalSearchParams();
  const {
    getVehicleById,
    tasks,
    addRecord,
    updateRecord,
    getRecordById,
    deleteRecord,
    restoreLastSnapshot,
  } = useVehicles();
  const { colors } = useTheme();
  const { t } = useLocalization();
  const { showToast, showAlert } = useAppAlert();

  const vehicle = vehicleId ? getVehicleById(vehicleId as string) : null;
  const task = taskId ? tasks.find((t) => t.id === taskId) : null;
  const existingRecord = recordId
    ? getRecordById(recordId as string)
    : undefined;

  const [selectedType, setSelectedType] = useState<MaintenanceType>(
    task?.type || "oil_change"
  );
  const [title, setTitle] = useState(
    task?.title || t("maintenance.types.oil_change")
  );
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [mileage, setMileage] = useState("");
  const [cost, setCost] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (existingRecord) {
      setSelectedType(existingRecord.type);
      setTitle(existingRecord.title);
      setDate(new Date(existingRecord.date).toISOString().split("T")[0]);
      setMileage(existingRecord.mileage.toString());
      setCost(existingRecord.cost?.toString() || "");
      setLocation(existingRecord.location || "");
      setNotes(existingRecord.notes || "");
    } else if (task) {
      setSelectedType(task.type);
      setTitle(task.title);
    }
  }, [task, existingRecord]);

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
    if (!existingRecord) {
      setTitle(getMaintenanceTypeLabel(type, t));
    }
  };

  const handleDelete = () => {
    if (!existingRecord) return;

    showAlert({
      title: t("common.delete"),
      message: t("maintenance.delete_confirm"),
      buttons: [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("common.delete"),
          style: "destructive",
          onPress: async () => {
            await deleteRecord(existingRecord.id);
            showToast({
              message: t("maintenance.delete_success"),
              actionLabel: t("common.undo"),
              onAction: async () => {
                await restoreLastSnapshot();
              },
            });
            router.back();
          },
        },
      ],
    });
  };

  const handleSubmit = async () => {
    if (!vehicleId || !title.trim() || !date || !mileage.trim()) {
      showAlert({
        title: t("vehicles.missing_info"),
        message: t("vehicles.fill_required"),
      });
      return;
    }

    const mileageNum = parseInt(mileage);
    if (isNaN(mileageNum) || mileageNum < 0) {
      showAlert({
        title: t("vehicles.invalid_mileage"),
        message: t("vehicles.valid_mileage_text"),
      });
      return;
    }

    if (mileageNum > 2000000) {
      showAlert({
        title: t("vehicles.invalid_mileage"),
        message: t("validation.max_mileage"),
      });
      return;
    }

    if (vehicle && mileageNum < vehicle.currentMileage) {
      showAlert({
        title: t("vehicles.invalid_mileage"),
        message: t("vehicles.mileage_lower_than_current"),
      });
      return;
    }

    const costNum = cost.trim() ? parseFloat(cost) : undefined;
    if (costNum !== undefined && (isNaN(costNum) || costNum < 0)) {
      showAlert({
        title: t("maintenance.invalid_cost"),
        message: t("maintenance.invalid_cost_text"),
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const recordTitle = title.trim();
      const recordData = {
        vehicleId: vehicleId as string,
        taskId: taskId as string | undefined,
        type: selectedType,
        title: recordTitle,
        date: new Date(date).getTime(),
        mileage: mileageNum,
        cost: costNum,
        location: location.trim() || undefined,
        notes: notes.trim() || undefined,
      };

      if (existingRecord) {
        await updateRecord(existingRecord.id, recordData);
      } else {
        await addRecord(recordData);
      }

      setShowSuccess(true);
    } catch (error) {
      console.error("Error saving record:", error);
      showAlert({
        title: t("common.error"),
        message: t("maintenance.log_error"),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const styles = createStyles(colors);

  if (!vehicle) {
    const errorStyles = createStyles(colors);
    return (
      <View style={errorStyles.errorContainer}>
        <Text style={errorStyles.errorText}>{t("vehicles.not_found")}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <Stack.Screen
        options={{
          headerRight: () => (
            <View
              style={{ flexDirection: "row", gap: 16, alignItems: "center" }}
            >
              <TouchableOpacity
                onPress={handleSubmit}
                disabled={isSubmitting}
                style={{ opacity: isSubmitting ? 0.5 : 1 }}
              >
                <Check size={20} color={colors.primary} />
              </TouchableOpacity>
              {existingRecord && (
                <TouchableOpacity
                  onPress={handleDelete}
                  disabled={isSubmitting}
                  style={{ opacity: isSubmitting ? 0.5 : 1 }}
                >
                  <Trash2 size={20} color={colors.error} />
                </TouchableOpacity>
              )}
            </View>
          ),
        }}
      />
      <SuccessAnimation
        visible={showSuccess}
        onAnimationFinish={() => {
          setShowSuccess(false);
          router.back();
        }}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
        keyboardVerticalOffset={100}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {!task && (
            <>
              <Text style={styles.sectionTitle}>
                {t("maintenance.select_type")}
              </Text>
              <View style={styles.typeGrid}>
                {sortedMaintenanceTypes.map((type) => {
                  const isSelected = selectedType === type;
                  return (
                    <Card
                      key={type}
                      variant={isSelected ? "elevated" : "outlined"}
                      style={[
                        styles.typeCard,
                        isSelected ? styles.typeCardSelected : undefined,
                      ]}
                      onPress={() => handleTypeSelect(type)}
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
                    </Card>
                  );
                })}
              </View>
            </>
          )}

          <View style={styles.form}>
            {selectedType === "other" && (
              <Input
                label={t("maintenance.title_field")}
                value={title}
                onChangeText={setTitle}
                placeholder={t("maintenance.task_name")}
                required
              />
            )}

            <Input
              label={t("maintenance.date")}
              value={date}
              onChangeText={setDate}
              placeholder={t("maintenance.date_placeholder")}
              required
            />

            <Input
              label={`${t("vehicles.current_mileage")} (${t("vehicles.km")})`}
              value={mileage}
              onChangeText={setMileage}
              placeholder={t("vehicles.mileage_placeholder")}
              keyboardType="numeric"
              required
            />

            <Input
              label={t("maintenance.cost")}
              value={cost}
              onChangeText={setCost}
              placeholder={t("maintenance.cost_placeholder")}
              keyboardType="decimal-pad"
            />

            <Input
              label={t("maintenance.location")}
              value={location}
              onChangeText={setLocation}
              placeholder={t("maintenance.location_placeholder")}
            />

            <Input
              label={t("maintenance.notes")}
              value={notes}
              onChangeText={setNotes}
              placeholder={t("maintenance.notes")}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              style={styles.textArea}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
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
      padding: 12,
      justifyContent: "center",
      alignItems: "center",
      minHeight: 60,
      backgroundColor: colors.surface,
    },
    typeCardSelected: {
      backgroundColor: colors.primary + "15",
      borderColor: colors.primary,
      borderWidth: 2,
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
    textArea: {
      minHeight: 100,
    },
    footer: {
      padding: 16,
      backgroundColor: colors.background,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
  });
