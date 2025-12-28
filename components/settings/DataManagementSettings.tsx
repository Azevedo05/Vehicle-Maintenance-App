import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import {
  Download,
  Upload,
  Trash2,
  Database,
  ChevronRight,
} from "lucide-react-native";
import * as DocumentPicker from "expo-document-picker";
import * as Haptics from "expo-haptics";
import { useTheme } from "@/contexts/ThemeContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { useVehicles } from "@/contexts/VehicleContext";
import { useAppAlert } from "@/contexts/AlertContext";
import { usePreferences } from "@/contexts/PreferencesContext";
import {
  exportData,
  importData,
  clearAllData,
  exportCategoryData,
  loadSampleData,
} from "@/utils/dataManagement";
import { VEHICLE_CATEGORY_INFO, VehicleCategory } from "@/types/vehicle";
import LoadingOverlay from "@/components/LoadingOverlay";
import { createSettingsStyles } from "@/styles/settings/SettingsSections.styles";
import { createDataManagementStyles } from "@/styles/settings/DataManagementSettings.styles";

export const DataManagementSettings = () => {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const {
    vehicles,
    tasks,
    records,
    fuelLogs,
    reloadData: reloadVehicleData,
    restoreLastSnapshot,
  } = useVehicles();
  const { showAlert } = useAppAlert();
  const { hapticsEnabled } = usePreferences();

  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [isCategoryExporting, setIsCategoryExporting] = useState(false);

  const styles = createSettingsStyles(colors);
  const localStyles = createDataManagementStyles(colors);

  const handleExportCategory = async (category: VehicleCategory) => {
    if (hapticsEnabled) {
      Haptics.selectionAsync();
    }
    const vehiclesInCategory = vehicles.filter(
      (vehicle) => (vehicle.category ?? "other") === category
    );

    if (vehiclesInCategory.length === 0) {
      showAlert({
        title: t("settings.export_category"),
        message: t("settings.export_category_empty"),
      });
      return;
    }

    setIsCategoryExporting(true);
    const success = await exportCategoryData(
      category,
      vehicles,
      tasks,
      records,
      fuelLogs
    );
    setIsCategoryExporting(false);
    setIsCategoryModalVisible(false);

    showAlert({
      title: success ? t("common.success") : t("common.error"),
      message: success
        ? t("settings.export_category_success")
        : t("settings.export_category_error"),
    });
  };

  const handleExportData = async () => {
    if (hapticsEnabled) {
      Haptics.selectionAsync();
    }
    setIsExporting(true);
    const success = await exportData();
    setIsExporting(false);

    if (success) {
      showAlert({
        title: t("settings.export_success"),
        message: t("settings.export_success_text"),
      });
    } else {
      showAlert({
        title: t("settings.export_error"),
        message: t("settings.export_error_text"),
      });
    }
  };

  const handleImportData = async () => {
    if (hapticsEnabled) {
      Haptics.selectionAsync();
    }
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/json", "text/plain", "*/*"],
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return;
      }

      setIsImporting(true);
      const file = result.assets[0];

      // Read file content
      const response = await fetch(file.uri);
      const jsonString = await response.text();

      const success = await importData(jsonString);

      if (success) {
        // Reload all data immediately
        await reloadVehicleData();
        setIsImporting(false);

        showAlert({
          title: t("settings.import_success"),
          message: t("settings.import_success_text"),
        });
      } else {
        setIsImporting(false);
        showAlert({
          title: t("settings.import_error"),
          message: t("settings.import_error_text"),
        });
      }
    } catch {
      setIsImporting(false);
      showAlert({
        title: t("settings.import_error"),
        message: t("settings.import_error_text"),
      });
    }
  };

  const handleLoadSampleData = () => {
    if (hapticsEnabled) {
      Haptics.selectionAsync();
    }
    showAlert({
      title: t("settings.load_sample_confirm"),
      message: t("settings.load_sample_text"),
      buttons: [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("settings.load_sample"),
          style: "default",
          onPress: async () => {
            setIsImporting(true);
            try {
              const success = await loadSampleData();
              if (success) {
                // Force refresh of data
                await restoreLastSnapshot();
                showAlert({
                  title: t("common.success"),
                  message: t("settings.load_sample_success"),
                });
              } else {
                showAlert({
                  title: t("common.error"),
                  message: t("settings.load_sample_error"),
                });
              }
            } catch (error) {
              console.error("Error loading sample data:", error);
              showAlert({
                title: t("common.error"),
                message: t("settings.load_sample_error"),
              });
            } finally {
              setIsImporting(false);
            }
          },
        },
      ],
    });
  };

  const handleClearData = () => {
    if (hapticsEnabled) {
      Haptics.selectionAsync(); // Selection for the button
    }
    showAlert({
      title: t("settings.clear_data_confirm"),
      message: t("settings.clear_data_confirm_text"),
      buttons: [
        {
          text: t("common.cancel"),
          style: "cancel",
        },
        {
          text: t("common.delete"),
          style: "destructive",
          onPress: async () => {
            if (hapticsEnabled) {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); // Impact for the actual delete
            }
            setIsClearing(true);
            const success = await clearAllData();

            if (success) {
              // Reload all data immediately
              await reloadVehicleData();
              setIsClearing(false);

              showAlert({
                title: t("settings.clear_success"),
                message: t("settings.clear_success_text"),
              });
            } else {
              setIsClearing(false);
              showAlert({
                title: t("settings.clear_error"),
                message: t("settings.clear_error_text"),
              });
            }
          },
        },
      ],
    });
  };

  return (
    <>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t("settings.data_management")}</Text>
        <View style={styles.optionGroup}>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={handleExportData}
            activeOpacity={0.7}
          >
            <Download size={20} color={colors.text} />
            <View style={styles.notificationContent}>
              <Text style={styles.optionText}>{t("settings.export_data")}</Text>
              <Text style={styles.optionDescription}>
                {t("settings.export_data_description")}
              </Text>
            </View>
            <ChevronRight size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => {
              if (hapticsEnabled) Haptics.selectionAsync();
              setIsCategoryModalVisible(true);
            }}
            activeOpacity={0.7}
          >
            <Database size={20} color={colors.text} />
            <View style={styles.notificationContent}>
              <Text style={styles.optionText}>
                {t("settings.export_category")}
              </Text>
              <Text style={styles.optionDescription}>
                {t("settings.export_category_description")}
              </Text>
            </View>
            <ChevronRight size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionButton}
            onPress={handleImportData}
            activeOpacity={0.7}
          >
            <Upload size={20} color={colors.text} />
            <View style={styles.notificationContent}>
              <Text style={styles.optionText}>{t("settings.import_data")}</Text>
              <Text style={styles.optionDescription}>
                {t("settings.import_data_description")}
              </Text>
            </View>
            <ChevronRight size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionButton}
            onPress={handleLoadSampleData}
            activeOpacity={0.7}
          >
            <Database size={20} color={colors.primary} />
            <View style={styles.notificationContent}>
              <Text style={[styles.optionText, { color: colors.primary }]}>
                {t("settings.load_sample")}
              </Text>
              <Text style={styles.optionDescription}>
                {t("settings.load_sample_description")}
              </Text>
            </View>
            <ChevronRight size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.optionButton, styles.optionButtonLast]}
            onPress={handleClearData}
            activeOpacity={0.7}
          >
            <Trash2 size={20} color={colors.error} />
            <View style={styles.notificationContent}>
              <Text style={[styles.optionText, { color: colors.error }]}>
                {t("settings.clear_data")}
              </Text>
              <Text style={styles.optionDescription}>
                {t("settings.clear_data_description")}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <LoadingOverlay
        visible={isExporting || isImporting || isClearing}
        text={
          isExporting ? t("settings.export_data") : t("settings.import_data")
        }
      />

      <Modal
        visible={isCategoryModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsCategoryModalVisible(false)}
      >
        <View style={localStyles.modalOverlay}>
          <View style={localStyles.modalCard}>
            <Text style={localStyles.modalTitle}>
              {t("settings.export_category")}
            </Text>
            <Text style={localStyles.modalDescription}>
              {t("settings.export_category_description")}
            </Text>
            {(Object.keys(VEHICLE_CATEGORY_INFO) as VehicleCategory[]).map(
              (category) => (
                <TouchableOpacity
                  key={category}
                  style={localStyles.modalCategoryButton}
                  onPress={() => handleExportCategory(category)}
                  disabled={isCategoryExporting}
                >
                  <Text style={localStyles.modalCategoryText}>
                    {t(`vehicles.category_${category}`)}
                  </Text>
                  <ChevronRight size={18} color={colors.textSecondary} />
                </TouchableOpacity>
              )
            )}
            <TouchableOpacity
              style={localStyles.modalCloseButton}
              onPress={() => setIsCategoryModalVisible(false)}
              activeOpacity={0.8}
            >
              <Text style={localStyles.modalCloseButtonText}>
                {t("common.cancel")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};
