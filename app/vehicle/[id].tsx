import { router, Stack, useLocalSearchParams } from "expo-router";
import {
  AlertCircle,
  Archive,
  ArchiveRestore,
  Calendar,
  ChevronRight,
  Edit,
  Fuel,
  Gauge,
  Plus,
  Car,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";

import { useVehicles } from "@/contexts/VehicleContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { usePreferences } from "@/contexts/PreferencesContext";
import { useAppAlert } from "@/contexts/AlertContext";
import { getMaintenanceTypeLabel } from "@/types/vehicle";

export default function VehicleDetailScreen() {
  const { id } = useLocalSearchParams();
  const vehicleId = id as string;
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    getVehicleById,
    getRecordsByVehicle,
    getUpcomingTasks,
    getFuelLogsByVehicle,
    deleteVehicle,
    setVehicleArchived,
    restoreLastSnapshot,
  } = useVehicles();
  const { colors } = useTheme();
  const { t } = useLocalization();
  const { currencySymbol } = usePreferences();
  const { showAlert, showToast } = useAppAlert();

  const vehicle = getVehicleById(vehicleId);
  const records = getRecordsByVehicle(vehicleId);
  const fuelLogs = getFuelLogsByVehicle(vehicleId);
  const upcomingTasks = getUpcomingTasks(vehicleId);

  const styles = createStyles(colors);

  const handleDeleteVehicle = () => {
    if (!vehicle || isDeleting) {
      return;
    }

    showAlert({
      title: t("vehicles.delete"),
      message: t("vehicles.delete_text", { name: vehicle.name }),
      buttons: [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("common.delete"),
          style: "destructive",
          onPress: async () => {
            if (!vehicle) return;
            
            setIsDeleting(true);
            const vehicleName = vehicle.name; // Guardar o nome antes de eliminar
            
            try {
              await deleteVehicle(vehicleId);
              
              // Navegar imediatamente para evitar tela branca
              router.back();
              
              // Mostrar toast após navegar (toast é global)
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
              console.error('Error deleting vehicle:', error);
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

  // A partir deste ponto, ou temos um vehicle válido, ou estamos em fase de delete.
  // Para o TypeScript, garantimos que `vehicle` não é undefined quando não estamos a apagar.
  if (!vehicle) {
    // Estamos no meio de um delete; mostrar loading em vez de tela branca
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]} edges={["bottom"]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleArchiveToggle = () => {
    const isArchived = !!vehicle.archived;
    const vehicleName = vehicle.name;
    showAlert({
      title: isArchived
        ? t("vehicles.unarchive_confirm")
        : t("vehicles.archive_confirm"),
      message: isArchived ? t("vehicles.unarchive_text") : t("vehicles.archive_text"),
      buttons: [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: isArchived ? t("vehicles.unarchive") : t("vehicles.archive"),
          onPress: async () => {
            await setVehicleArchived(vehicleId, !isArchived);
            
            showToast({
              message: isArchived 
                ? t("vehicles.unarchive_success", { name: vehicleName })
                : t("vehicles.archive_success", { name: vehicleName }),
              actionLabel: t("common.undo"),
              onAction: async () => {
                await restoreLastSnapshot();
              },
            });
          },
        },
      ],
    });
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <View style={styles.headerActions}>
              <TouchableOpacity
                onPress={() => router.push(`/edit-vehicle?id=${vehicleId}`)}
                style={styles.headerButton}
              >
                <Edit size={20} color={colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleArchiveToggle}
                style={styles.headerButton}
              >
                {vehicle.archived ? (
                  <ArchiveRestore size={20} color={colors.text} />
                ) : (
                  <Archive size={20} color={colors.text} />
                )}
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
          <View style={styles.headerContainer}>
            {vehicle.photo ? (
              <>
                <Image
                  source={{ uri: vehicle.photo }}
                  style={styles.vehicleImage}
                  contentFit="cover"
                />
                <LinearGradient
                  colors={["transparent", colors.background]}
                  style={styles.imageGradient}
                />
              </>
            ) : (
              <View style={styles.noImagePlaceholder}>
                <Car size={64} color={colors.placeholder} />
              </View>
            )}

            <View style={styles.infoCard}>
              <View style={styles.nameContainer}>
                <View style={styles.nameRow}>
                  <Text style={styles.vehicleName}>{vehicle.name}</Text>
                  {vehicle.archived && (
                    <View style={styles.archivedBadge}>
                      <Text style={styles.archivedBadgeText}>
                        {t("vehicles.archived")}
                      </Text>
                    </View>
                  )}
                </View>
                <View style={styles.badgeRow}>
                  {vehicle.licensePlate && (
                    <View style={styles.licenseBadge}>
                      <Text style={styles.licenseBadgeText}>
                        {vehicle.licensePlate}
                      </Text>
                    </View>
                  )}
                  <View style={styles.yearBadge}>
                    <Text style={styles.yearBadgeText}>{vehicle.year}</Text>
                  </View>
                  {vehicle.category && (
                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryBadgeText}>
                        {t(`vehicles.category_${vehicle.category}`)}
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              <View style={styles.mileageCard}>
                <View style={styles.mileageIconContainer}>
                  <Gauge size={24} color={colors.primary} />
                </View>
                <View style={styles.mileageContent}>
                  <Text style={styles.mileageLabel}>
                    {t("vehicles.current_mileage")}
                  </Text>
                  <Text style={styles.mileageValue}>
                    {vehicle.currentMileage.toLocaleString()} {t("vehicles.km")}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {t("maintenance.upcoming")}
              </Text>
              <TouchableOpacity
                onPress={() => router.push(`/add-task?vehicleId=${vehicleId}`)}
                style={styles.addButton}
              >
                <Plus size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {upcomingTasks.length === 0 ? (
              <View style={styles.emptyCard}>
                <Calendar size={32} color={colors.placeholder} />
                <Text style={styles.emptyText}>
                  {t("maintenance.empty_title_all_done")}
                </Text>
              </View>
            ) : (
              upcomingTasks.map((item) => {
                return (
                  <View
                    key={item.task.id}
                    style={[styles.taskCard, item.isDue && styles.dueTaskCard]}
                  >
                    <View style={styles.taskInfo}>
                      <Text style={styles.taskTitle} numberOfLines={2}>
                        {getMaintenanceTypeLabel(item.task.type, t)}
                      </Text>
                      <Text
                        style={[
                          styles.taskDue,
                          item.isDue
                            ? styles.taskOverdue
                            : styles.taskScheduled,
                        ]}
                      >
                        {item.daysUntilDue !== undefined
                          ? item.daysUntilDue <= 0
                            ? t("maintenance.overdue")
                            : item.isDue
                            ? t("maintenance.due_in_days", {
                                days: item.daysUntilDue,
                              })
                            : t("maintenance.in_days", {
                                days: item.daysUntilDue,
                              })
                          : item.milesUntilDue !== undefined
                          ? item.milesUntilDue <= 0
                            ? t("maintenance.overdue")
                            : item.isDue
                            ? t("maintenance.due_in_km", {
                                km: item.milesUntilDue,
                              })
                            : t("maintenance.in_km", { km: item.milesUntilDue })
                          : t("maintenance.scheduled")}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() =>
                        router.push(
                          `/add-record?vehicleId=${vehicleId}&taskId=${item.task.id}`
                        )
                      }
                      style={styles.completeButton}
                    >
                      <Text style={styles.completeButtonText}>
                        {t("maintenance.complete")}
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              })
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t("maintenance.history")}</Text>

            {records.length === 0 ? (
              <View style={styles.emptyCard}>
                <Calendar size={32} color={colors.placeholder} />
                <Text style={styles.emptyText}>
                  {t("maintenance.empty_history")}
                </Text>
              </View>
            ) : (
              <FlatList
                data={records}
                renderItem={({ item: record }) => (
                  <TouchableOpacity
                    style={styles.recordCard}
                    onPress={() => router.push(`/record/${record.id}`)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.recordInfo}>
                      <Text style={styles.recordTitle} numberOfLines={1}>
                        {record.title}
                      </Text>
                      <Text style={styles.recordDate} numberOfLines={1}>
                        {formatDate(record.date)} •{" "}
                        {record.mileage.toLocaleString()} {t("vehicles.km")}
                      </Text>
                      {record.cost !== undefined && (
                        <Text style={styles.recordCost}>
                          {currencySymbol}{record.cost.toFixed(2)}
                        </Text>
                      )}
                      {record.notes && (
                        <Text style={styles.recordNotes} numberOfLines={2}>
                          {record.notes}
                        </Text>
                      )}
                    </View>
                    <ChevronRight size={20} color={colors.border} />
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                windowSize={10}
                removeClippedSubviews={true}
              />
            )}
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{t("fuel.section_title")}</Text>
              <TouchableOpacity
                onPress={() =>
                  router.push(`/add-fuel-log?vehicleId=${vehicleId}`)
                }
                style={styles.addButton}
              >
                <Plus size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {fuelLogs.length === 0 ? (
              <View style={styles.emptyCard}>
                <Fuel size={32} color={colors.placeholder} />
                <Text style={styles.emptyText}>{t("fuel.empty_state")}</Text>
              </View>
            ) : (
              fuelLogs.slice(0, 3).map((log) => (
                <View key={log.id} style={styles.fuelCard}>
                  <View style={styles.fuelRow}>
                    <Text style={styles.recordTitle}>
                      {formatDate(log.date)}
                    </Text>
                    <Text style={styles.fuelVolume}>
                      {log.volume.toFixed(1)} {t("fuel.volume_unit")}
                    </Text>
                  </View>
                  <Text style={styles.recordDate}>
                    {currencySymbol}
                    {log.totalCost.toFixed(2)} •{" "}
                    {t(`fuel.type_${log.fuelType}`)}
                  </Text>
                  {log.pricePerUnit !== undefined && (
                    <Text style={styles.fuelPricePerUnit}>
                      {currencySymbol}
                      {log.pricePerUnit.toFixed(3)}/{t("fuel.volume_unit")}
                    </Text>
                  )}
                  {log.station && (
                    <Text style={styles.recordNotes} numberOfLines={1}>
                      {log.station}
                    </Text>
                  )}
                </View>
              ))
            )}
          </View>

          <View style={styles.dangerZone}>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDeleteVehicle}
              activeOpacity={0.7}
            >
              <Text style={styles.deleteButtonText}>
                {t("vehicles.delete")}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
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
      fontWeight: "600" as const,
    },
    headerButton: {
      padding: 8,
    },
    headerActions: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: 32,
    },
    headerContainer: {
      position: "relative",
    },
    vehicleImage: {
      width: "100%",
      height: 250,
      backgroundColor: colors.border,
    },
    imageGradient: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      height: 100,
    },
    noImagePlaceholder: {
      width: "100%",
      height: 250,
      backgroundColor: colors.primary + "10",
      justifyContent: "center",
      alignItems: "center",
      borderBottomWidth: 3,
      borderBottomColor: colors.primary + "30",
    },
    infoCard: {
      backgroundColor: colors.background,
      paddingHorizontal: 20,
      paddingTop: 12,
      paddingBottom: 24,
    },
    nameContainer: {
      flexDirection: "column",
      alignItems: "flex-start",
      marginBottom: 12,
      gap: 4,
    },
    nameRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      flex: 1,
    },
    vehicleName: {
      fontSize: 32,
      fontWeight: "800" as const,
      color: colors.text,
      flex: 1,
    },
    badgeRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginTop: 4,
    },
    archivedBadge: {
      backgroundColor: colors.warning + "25",
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 10,
    },
    archivedBadgeText: {
      color: colors.warning,
      fontWeight: "700" as const,
      fontSize: 12,
    },
    licenseBadge: {
      backgroundColor: colors.primary + "20",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.primary + "40",
    },
    licenseBadgeText: {
      fontSize: 14,
      fontWeight: "700" as const,
      color: colors.primary,
      letterSpacing: 1,
    },
    categoryBadge: {
      backgroundColor: colors.surface,
      borderRadius: 8,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderWidth: 1,
      borderColor: colors.border,
    },
    categoryBadgeText: {
      fontSize: 12,
      color: colors.textSecondary,
      fontWeight: "600" as const,
    },
    yearBadge: {
      backgroundColor: colors.surface,
      borderRadius: 8,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderWidth: 1,
      borderColor: colors.border,
    },
    yearBadgeText: {
      fontSize: 12,
      color: colors.textSecondary,
      fontWeight: "600" as const,
    },
    detailsRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      marginBottom: 20,
    },
    detailChip: {
      backgroundColor: colors.surface,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.border,
    },
    detailChipText: {
      fontSize: 14,
      fontWeight: "600" as const,
      color: colors.text,
    },
    mileageCard: {
      backgroundColor: colors.primary + "10",
      borderRadius: 16,
      padding: 16,
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.primary + "30",
    },
    mileageIconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.primary + "20",
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    mileageContent: {
      flex: 1,
    },
    mileageLabel: {
      fontSize: 12,
      color: colors.textSecondary,
      marginBottom: 4,
      textTransform: "uppercase",
      fontWeight: "600" as const,
    },
    mileageValue: {
      fontSize: 24,
      fontWeight: "700" as const,
      color: colors.primary,
    },
    section: {
      marginTop: 10,
      paddingHorizontal: 20,
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 22,
      fontWeight: "800" as const,
      color: colors.text,
      marginBottom: 8,
      letterSpacing: 0.5,
    },
    addButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.primary,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    emptyCard: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 40,
      alignItems: "center",
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 3,
      borderWidth: 1,
      borderColor: colors.border,
    },
    emptyText: {
      fontSize: 15,
      color: colors.textSecondary,
      marginTop: 12,
      fontWeight: "500" as const,
    },
    taskCard: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      marginBottom: 12,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
    },
    dueTaskCard: {
      borderWidth: 1,
      borderColor: colors.error,
    },
    taskInfo: {
      flex: 1,
      minWidth: 0,
    },
    taskTitle: {
      fontSize: 16,
      fontWeight: "700" as const,
      color: colors.text,
      marginBottom: 6,
      flexShrink: 1,
    },
    taskDue: {
      fontSize: 13,
      fontWeight: "600" as const,
    },
    taskOverdue: {
      color: colors.error,
    },
    taskScheduled: {
      color: colors.primary,
    },
    completeButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 12,
      marginLeft: 12,
      minWidth: 85,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 3,
    },
    completeButtonText: {
      color: "#FFFFFF",
      fontSize: 13,
      fontWeight: "700" as const,
      textAlign: "center",
    },
    recordCard: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      marginBottom: 12,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
      borderWidth: 1,
      borderColor: colors.border,
    },
    recordInfo: {
      flex: 1,
      minWidth: 0,
    },
    recordTitle: {
      fontSize: 16,
      fontWeight: "700" as const,
      color: colors.text,
      marginBottom: 4,
      flexShrink: 1,
    },
    recordDate: {
      fontSize: 13,
      color: colors.textSecondary,
      marginBottom: 4,
      flexShrink: 1,
      fontWeight: "500" as const,
    },
    recordCost: {
      fontSize: 15,
      fontWeight: "700" as const,
      color: colors.success,
      marginBottom: 4,
    },
    recordNotes: {
      fontSize: 13,
      color: colors.textSecondary,
      fontStyle: "italic",
      lineHeight: 18,
    },
    fuelCard: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    fuelRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 6,
    },
    fuelVolume: {
      fontSize: 14,
      fontWeight: "600" as const,
      color: colors.primary,
    },
    fuelPricePerUnit: {
      fontSize: 12,
      fontWeight: "500" as const,
      color: colors.textSecondary,
      marginTop: 2,
    },
    dangerZone: {
      marginTop: 40,
      paddingHorizontal: 20,
      marginBottom: 20,
    },
    deleteButton: {
      backgroundColor: colors.error,
      borderRadius: 16,
      padding: 18,
      alignItems: "center",
      shadowColor: colors.error,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    deleteButtonText: {
      color: "#FFFFFF",
      fontSize: 17,
      fontWeight: "700" as const,
      letterSpacing: 0.5,
    },
  });
