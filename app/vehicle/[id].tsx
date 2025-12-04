import { router, Stack, useLocalSearchParams } from "expo-router";
import { AlertCircle, Edit, Trash2 } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useVehicles } from "@/contexts/VehicleContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { useAppAlert } from "@/contexts/AlertContext";

import { VehicleHeader } from "@/components/vehicle-details/VehicleHeader";
import { MaintenanceOverview } from "@/components/vehicle-details/MaintenanceOverview";
import { MaintenanceHistory } from "@/components/vehicle-details/MaintenanceHistory";
import { FuelLogSection } from "@/components/vehicle-details/FuelLogSection";

export default function VehicleDetailScreen() {
  const { id } = useLocalSearchParams();
  const vehicleId = id as string;
  const [isDeleting, setIsDeleting] = useState(false);

  const { getVehicleById, deleteVehicle, restoreLastSnapshot } = useVehicles();
  const { colors } = useTheme();
  const { t } = useLocalization();
  const { showAlert, showToast } = useAppAlert();

  const vehicle = getVehicleById(vehicleId);
  const styles = createStyles(colors);

  const handleDelete = () => {
    if (!vehicle || isDeleting) {
      return;
    }

    showAlert({
      title: t("vehicles.delete"),
      message: t("vehicles.delete_text", {
        name: `${vehicle.make} ${vehicle.model}`,
      }),
      buttons: [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("common.delete"),
          style: "destructive",
          onPress: async () => {
            if (!vehicle) return;

            setIsDeleting(true);
            const vehicleName = `${vehicle.make} ${vehicle.model}`;

            try {
              await deleteVehicle(vehicleId);
              router.back();

              setTimeout(() => {
                showToast({
                  message: t("vehicles.delete_success", { name: vehicleName }),
                  actionLabel: t("common.undo"),
                  onAction: async () => {
                    await restoreLastSnapshot();
                  },
                });
              }, 150);
            } catch (error) {
              console.error("Error deleting vehicle:", error);
              setIsDeleting(false);
            }
          },
        },
      ],
    });
  };

  if (!vehicle && !isDeleting) {
    return (
      <View style={styles.errorContainer}>
        <AlertCircle size={48} color={colors.error} />
        <Text style={styles.errorText}>{t("vehicles.not_found")}</Text>
        <TouchableOpacity
          style={styles.errorButton}
          onPress={() => router.back()}
        >
          <Text style={styles.errorButtonText}>{t("common.go_back")}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!vehicle) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
        edges={["bottom"]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <View style={{ flexDirection: "row", gap: 8 }}>
              <TouchableOpacity
                onPress={() => router.push(`/edit-vehicle?id=${vehicle.id}`)}
                style={styles.headerButton}
              >
                <Edit size={20} color={colors.primary} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleDelete}
                style={styles.headerButton}
              >
                <Trash2 size={20} color={colors.error} />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <VehicleHeader vehicle={vehicle} />
          <MaintenanceOverview vehicleId={vehicleId} />
          <MaintenanceHistory vehicleId={vehicleId} />
          <FuelLogSection vehicleId={vehicleId} />
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const createStyles = (colors: any) =>
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
      fontWeight: "600",
      color: colors.text,
      marginTop: 16,
      marginBottom: 24,
    },
    errorButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 12,
    },
    errorButtonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "600",
    },
    headerButton: {
      padding: 8,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: 32,
    },
  });
