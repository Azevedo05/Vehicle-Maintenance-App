import { router, Stack, useLocalSearchParams } from "expo-router";
import { AlertCircle } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
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
import { useAppAlert } from "@/contexts/AlertContext";
import { Image } from "expo-image";
import { Car, ChevronLeft, Edit, Trash2 } from "lucide-react-native";
import { BlurView } from "expo-blur";

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
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Content */}
      <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Image - Goes behind the curved card */}
          <View style={styles.heroSection}>
            {vehicle.photo ? (
              <Image
                source={{ uri: vehicle.photo }}
                style={styles.vehicleImage}
                contentFit="cover"
              />
            ) : (
              <View style={styles.noImagePlaceholder}>
                <Car size={80} color={colors.placeholder} />
              </View>
            )}

            {/* Floating Back Button */}
            <View style={styles.floatingBackButtonContainer}>
              <TouchableOpacity
                onPress={() => router.back()}
                activeOpacity={0.8}
              >
                <BlurView
                  intensity={30}
                  tint="dark"
                  style={styles.floatingButtonBlur}
                >
                  <ChevronLeft size={24} color="#FFFFFF" />
                </BlurView>
              </TouchableOpacity>
            </View>

            {/* Floating Action Buttons */}
            <View style={styles.floatingActions}>
              <TouchableOpacity
                onPress={() => router.push(`/edit-vehicle?id=${vehicle.id}`)}
                activeOpacity={0.8}
              >
                <BlurView
                  intensity={30}
                  tint="dark"
                  style={styles.floatingButtonBlur}
                >
                  <Edit size={20} color="#FFFFFF" />
                </BlurView>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDelete} activeOpacity={0.8}>
                <BlurView
                  intensity={30}
                  tint="dark"
                  style={styles.floatingButtonBlur}
                >
                  <Trash2 size={20} color="#FFFFFF" />
                </BlurView>
              </TouchableOpacity>
            </View>
          </View>

          {/* Curved Content Card - Overlays the image */}
          <View style={styles.curvedCard}>
            {/* Vehicle Info inside curved card */}
            <VehicleHeader vehicle={vehicle} />

            {/* Maintenance sections */}
            <MaintenanceOverview vehicleId={vehicleId} />
            <MaintenanceHistory vehicleId={vehicleId} />
            <FuelLogSection vehicleId={vehicleId} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
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
    heroSection: {
      position: "relative",
    },
    vehicleImage: {
      width: "100%",
      height: 400,
      backgroundColor: colors.border,
    },
    noImagePlaceholder: {
      width: "100%",
      height: 400,
      backgroundColor: colors.primary + "15",
      justifyContent: "center",
      alignItems: "center",
    },
    floatingBackButtonContainer: {
      position: "absolute",
      top: Platform.OS === "ios" ? 50 : 30,
      left: 20,
      zIndex: 10,
    },
    floatingActions: {
      position: "absolute",
      top: Platform.OS === "ios" ? 50 : 30,
      right: 20,
      flexDirection: "row",
      gap: 12,
      zIndex: 10,
    },
    floatingButtonBlur: {
      width: 44,
      height: 44,
      borderRadius: 22,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.3)",
      overflow: "hidden",
    },
    safeArea: {
      flex: 1,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: 32,
    },
    curvedCard: {
      backgroundColor: colors.background,
      borderTopLeftRadius: 35,
      borderTopRightRadius: 35,
      marginTop: -80,
      paddingTop: 32,
      paddingHorizontal: 0,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: -10 },
      shadowOpacity: 0.15,
      shadowRadius: 20,
      elevation: 15,
    },
  });
