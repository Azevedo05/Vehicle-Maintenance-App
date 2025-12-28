import { Archive, Check, Download, Trash2, Undo2 } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useLocalization } from "@/contexts/LocalizationContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useVehicles } from "@/contexts/VehicleContext";
import { useAppAlert } from "@/contexts/AlertContext";
import { exportVehiclesByIds } from "@/utils/dataManagement";
import { ThemedBackground } from "@/components/ThemedBackground";
import { createBulkOperationsStyles } from "@/styles/vehicles/BulkOperations.styles";

export default function BulkOperationsScreen() {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const {
    vehicles,
    tasks,
    records,
    fuelLogs,
    setVehiclesArchived,
    deleteVehiclesBulk,
    restoreLastSnapshot,
  } = useVehicles();
  const { showToast, showAlert } = useAppAlert();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const styles = createBulkOperationsStyles(colors);

  const hasSelection = selectedIds.length > 0;

  const handleToggle = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const confirmAction = (
    action: "archive" | "unarchive" | "delete",
    onConfirm: () => void
  ) => {
    let title = "";
    let message = "";

    if (action === "archive") {
      title = t("vehicles.bulk_archive_confirm", { count: selectedIds.length });
    } else if (action === "unarchive") {
      title = t("vehicles.bulk_unarchive_confirm", {
        count: selectedIds.length,
      });
    } else {
      title = t("vehicles.bulk_delete_confirm", { count: selectedIds.length });
      message = t("vehicles.bulk_delete_text");
    }

    showAlert({
      title,
      message,
      buttons: [
        { text: t("common.cancel"), style: "cancel" },
        { text: t("common.confirm"), style: "destructive", onPress: onConfirm },
      ],
    });
  };

  const handleArchive = (archived: boolean) => {
    if (!hasSelection) return;
    confirmAction(archived ? "archive" : "unarchive", async () => {
      setIsProcessing(true);
      await setVehiclesArchived(selectedIds, archived);
      setSelectedIds([]);
      setIsProcessing(false);

      showToast({
        message: archived
          ? t("vehicles.bulk_archive_success")
          : t("vehicles.bulk_unarchive_success"),
        actionLabel: t("common.undo"),
        onAction: async () => {
          await restoreLastSnapshot();
        },
      });
    });
  };

  const handleDelete = () => {
    if (!hasSelection) return;
    confirmAction("delete", async () => {
      setIsProcessing(true);
      await deleteVehiclesBulk(selectedIds);
      setSelectedIds([]);
      setIsProcessing(false);

      showToast({
        message: t("vehicles.bulk_delete_success"),
        actionLabel: t("common.undo"),
        onAction: async () => {
          await restoreLastSnapshot();
        },
      });
    });
  };

  const handleExport = async () => {
    if (!hasSelection) return;
    setIsExporting(true);
    const success = await exportVehiclesByIds(
      selectedIds,
      vehicles,
      tasks,
      records,
      fuelLogs
    );
    setIsExporting(false);

    showAlert({
      title: success ? t("common.success") : t("common.error"),
      message: success
        ? t("vehicles.bulk_export_success")
        : t("vehicles.bulk_export_error"),
    });
  };

  const selectAll = () => {
    setSelectedIds(vehicles.map((vehicle) => vehicle.id));
  };

  const deselectAll = () => {
    setSelectedIds([]);
  };

  const stats = useMemo(() => {
    const archivedCount = vehicles.filter((vehicle) => vehicle.archived).length;
    return {
      total: vehicles.length,
      archived: archivedCount,
      active: vehicles.length - archivedCount,
    };
  }, [vehicles]);

  return (
    <ThemedBackground>
      <SafeAreaView
        style={[styles.container, { backgroundColor: "transparent" }]}
        edges={["bottom"]}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.subtitle}>
              {t("vehicles.bulk_description")}
            </Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>{t("vehicles.total")}</Text>
              <Text style={styles.statValue}>{stats.total}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>{t("vehicles.active")}</Text>
              <Text style={styles.statValue}>{stats.active}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>
                {t("vehicles.filter_archived")}
              </Text>
              <Text style={styles.statValue}>{stats.archived}</Text>
            </View>
          </View>

          <View style={styles.selectionBar}>
            <Text style={styles.selectionText}>
              {t("vehicles.selected_count", { count: selectedIds.length })}
            </Text>
            <View style={styles.selectionActions}>
              <TouchableOpacity onPress={selectAll} activeOpacity={0.8}>
                <Text style={styles.selectionActionText}>
                  {t("vehicles.select_all")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={deselectAll} activeOpacity={0.8}>
                <Text style={styles.selectionActionText}>
                  {t("vehicles.deselect_all")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.listCard}>
            {vehicles.map((vehicle) => (
              <TouchableOpacity
                key={vehicle.id}
                style={[
                  styles.listItem,
                  selectedIds.includes(vehicle.id) && styles.listItemSelected,
                  vehicle.archived && styles.listItemArchived,
                ]}
                onPress={() => handleToggle(vehicle.id)}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.checkbox,
                    selectedIds.includes(vehicle.id) && styles.checkboxActive,
                  ]}
                >
                  {selectedIds.includes(vehicle.id) && (
                    <Check size={16} color="#FFFFFF" />
                  )}
                </View>
                <View style={styles.itemContent}>
                  <View style={styles.itemHeader}>
                    <Text style={styles.itemTitle} numberOfLines={1}>
                      {vehicle.make} {vehicle.model}
                    </Text>
                    {vehicle.archived && (
                      <Text style={styles.archivedTag}>
                        {t("vehicles.archived")}
                      </Text>
                    )}
                  </View>
                  <Text style={styles.itemSubtitle} numberOfLines={1}>
                    {vehicle.make} {vehicle.model} •{" "}
                    {vehicle.currentMileage.toLocaleString()} km
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.actionsSection}>
            <TouchableOpacity
              style={[
                styles.actionButton,
                (!hasSelection || isProcessing) && styles.actionButtonDisabled,
              ]}
              onPress={() => handleArchive(true)}
              disabled={!hasSelection || isProcessing}
            >
              <Archive size={18} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>
                {t("vehicles.archive_selected")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionButtonSecondary,
                (!hasSelection || isProcessing) && styles.actionButtonDisabled,
              ]}
              onPress={() => handleArchive(false)}
              disabled={!hasSelection || isProcessing}
            >
              <Undo2 size={18} color={colors.primary} />
              <Text style={styles.actionButtonSecondaryText}>
                {t("vehicles.unarchive_selected")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionButtonSecondary,
                (!hasSelection || isExporting) && styles.actionButtonDisabled,
              ]}
              onPress={handleExport}
              disabled={!hasSelection || isExporting}
            >
              <Download size={18} color={colors.primary} />
              <Text style={styles.actionButtonSecondaryText}>
                {t("vehicles.export_selected")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.deleteButton,
                (!hasSelection || isProcessing) && styles.actionButtonDisabled,
              ]}
              onPress={handleDelete}
              disabled={!hasSelection || isProcessing}
            >
              <Trash2 size={18} color="#FFFFFF" />
              <Text style={styles.deleteButtonText}>
                {t("vehicles.delete_selected")}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ThemedBackground>
  );
}
