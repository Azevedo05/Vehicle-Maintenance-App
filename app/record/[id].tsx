import { router, Stack, useLocalSearchParams } from "expo-router";
import {
  AlertCircle,
  Calendar,
  DollarSign,
  FileText,
  Gauge,
  MapPin,
  Trash2,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useVehicles } from "@/contexts/VehicleContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { usePreferences } from "@/contexts/PreferencesContext";
import { getMaintenanceTypeLabel } from "@/types/maintenance";
import { useAppAlert } from "@/contexts/AlertContext";
import { ThemedBackground } from "@/components/ThemedBackground";
import { createRecordDetailStyles } from "@/styles/record/RecordDetail.styles";

export default function RecordDetailScreen() {
  const { id } = useLocalSearchParams();
  const recordId = id as string;
  const [isDeleting, setIsDeleting] = useState(false);

  const { getRecordById, getVehicleById, deleteRecord, restoreLastSnapshot } =
    useVehicles();
  const { colors } = useTheme();
  const { t } = useLocalization();
  const { formatDistance } = usePreferences();
  const { showAlert, showToast } = useAppAlert();

  const record = getRecordById(recordId);
  const vehicle = record ? getVehicleById(record.vehicleId) : null;

  const styles = createRecordDetailStyles(colors);

  const handleDeleteRecord = () => {
    if (!record || !vehicle || isDeleting) {
      return;
    }

    showAlert({
      title: t("maintenance.delete_record"),
      message: t("maintenance.delete_record_text"),
      buttons: [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("common.delete"),
          style: "destructive",
          onPress: async () => {
            if (!record) return;

            setIsDeleting(true);

            try {
              await deleteRecord(recordId);

              // Mostrar toast antes de navegar
              showToast({
                message: t("maintenance.delete_record_success"),
                actionLabel: t("common.undo"),
                onAction: async () => {
                  await restoreLastSnapshot();
                },
              });

              // Pequeno delay para garantir que o toast aparece antes de navegar
              setTimeout(() => {
                router.back();
              }, 100);
            } catch (error) {
              console.error("Error deleting record:", error);
              setIsDeleting(false);
            }
          },
        },
      ],
    });
  };

  if ((!record || !vehicle) && !isDeleting) {
    return (
      <View style={styles.errorContainer}>
        <AlertCircle size={48} color={colors.error} />
        <Text style={styles.errorText}>{t("maintenance.not_found")}</Text>
        <TouchableOpacity
          style={styles.errorButton}
          onPress={() => router.back()}
        >
          <Text style={styles.errorButtonText}>{t("common.go_back")}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // A partir daqui garantimos ao TypeScript que `record` e `vehicle` existem
  if (!record || !vehicle) {
    // Estamos no meio de um delete; não renderizamos o resto.
    return null;
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <ThemedBackground>
      <Stack.Screen
        options={{
          title: t("maintenance.details"),
          headerRight: () => (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginRight: Platform.OS === "ios" ? -16 : 0,
              }}
            >
              <TouchableOpacity
                onPress={handleDeleteRecord}
                style={styles.headerButton}
                hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
              >
                <Trash2 size={24} color={colors.error} />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      <SafeAreaView
        style={[styles.container, { backgroundColor: "transparent" }]}
        edges={["bottom"]}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.headerCard}>
            <Text style={styles.title}>{record.title}</Text>
            <Text style={styles.type}>
              {getMaintenanceTypeLabel(record.type, t)}
            </Text>
            <Text style={styles.vehicle}>
              {vehicle.make} {vehicle.model}
            </Text>
          </View>

          <View style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <View style={styles.iconContainer}>
                <Calendar size={20} color={colors.primary} />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>{t("maintenance.date")}</Text>
                <Text style={styles.detailValue}>
                  {formatDate(record.date)}
                </Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.iconContainer}>
                <Gauge size={20} color={colors.primary} />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>
                  {t("maintenance.mileage")}
                </Text>
                <Text style={styles.detailValue}>
                  {formatDistance(record.mileage)}
                </Text>
              </View>
            </View>

            {record.cost !== undefined && (
              <View style={styles.detailRow}>
                <View style={styles.iconContainer}>
                  <DollarSign size={20} color={colors.success} />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>
                    {t("maintenance.cost")}
                  </Text>
                  <Text style={styles.detailValue}>
                    €{record.cost.toFixed(2)}
                  </Text>
                </View>
              </View>
            )}

            {record.location && (
              <View style={styles.detailRow}>
                <View style={styles.iconContainer}>
                  <MapPin size={20} color={colors.primary} />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>
                    {t("maintenance.location")}
                  </Text>
                  <Text style={styles.detailValue}>{record.location}</Text>
                </View>
              </View>
            )}

            {record.notes && (
              <View style={styles.detailRow}>
                <View style={styles.iconContainer}>
                  <FileText size={20} color={colors.primary} />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>
                    {t("maintenance.notes")}
                  </Text>
                  <Text style={styles.detailValue}>{record.notes}</Text>
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </ThemedBackground>
  );
}
