import * as ImagePicker from "expo-image-picker";
import { router, Stack } from "expo-router";
import { Camera, X, Check } from "lucide-react-native";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";

import { useLocalization } from "@/contexts/LocalizationContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useVehicles } from "@/contexts/VehicleContext";
import { useAppAlert } from "@/contexts/AlertContext";
import {
  VehicleCategory,
  VEHICLE_CATEGORY_INFO,
  FuelType,
} from "@/types/vehicle";
import { useFormValidation } from "@/hooks/useFormValidation";
import MaskInput from "react-native-mask-input";

import { Input } from "@/components/ui/Input";
import { Chip } from "@/components/ui/Chip";
import { SuccessAnimation } from "@/components/ui/SuccessAnimation";

export default function AddVehicleScreen() {
  const { addVehicle, restoreLastSnapshot } = useVehicles();
  const { colors } = useTheme();
  const { t } = useLocalization();
  const { showToast, showAlert } = useAppAlert();
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [currentMileage, setCurrentMileage] = useState("");
  const [photo, setPhoto] = useState<string | undefined>(undefined);
  const [fuelType, setFuelType] = useState<FuelType | undefined>(undefined);
  const [category, setCategory] = useState<VehicleCategory | undefined>(
    "personal"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const { validate, errors, touched, handleBlur, rules } = useFormValidation({
    make,
    model,
    year,
    licensePlate,
    currentMileage,
  });
  const styles = createStyles(colors);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      showAlert({
        title: t("vehicles.permission_needed"),
        message: t("vehicles.permission_text"),
      });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (
      !make.trim() ||
      !model.trim() ||
      !year.trim() ||
      !currentMileage.trim() ||
      !category ||
      !fuelType
    ) {
      showAlert({
        title: t("vehicles.missing_info"),
        message: t("vehicles.fill_required"),
      });
      return;
    }

    const yearNum = parseInt(year);
    if (
      isNaN(yearNum) ||
      yearNum < 1900 ||
      yearNum > new Date().getFullYear() + 1
    ) {
      showAlert({
        title: t("vehicles.invalid_year"),
        message: t("vehicles.valid_year_text"),
      });
      return;
    }

    const mileageNum = parseInt(currentMileage);
    if (isNaN(mileageNum) || mileageNum < 0) {
      showAlert({
        title: t("vehicles.invalid_mileage"),
        message: t("vehicles.valid_mileage_text"),
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await addVehicle({
        make: make.trim(),
        model: model.trim(),
        year: yearNum,
        licensePlate: licensePlate.trim() || undefined,
        currentMileage: mileageNum,
        photo,
        category,
        fuelType,
      });

      setShowSuccess(true);
    } catch (error) {
      console.error("Error adding vehicle:", error);
      showAlert({
        title: t("common.error"),
        message: t("vehicles.save_error"),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <Stack.Screen
        options={{
          title: t("vehicles.add_vehicle"),
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
      <SuccessAnimation
        visible={showSuccess}
        onAnimationFinish={() => {
          setShowSuccess(false);
          router.back();
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
          <TouchableOpacity
            style={styles.photoSection}
            onPress={pickImage}
            activeOpacity={0.7}
          >
            {photo ? (
              <View style={styles.photoContainer}>
                <Image
                  source={{ uri: photo }}
                  style={styles.photo}
                  contentFit="cover"
                />
                <TouchableOpacity
                  style={styles.removePhotoButton}
                  onPress={(e) => {
                    e.stopPropagation();
                    setPhoto(undefined);
                  }}
                >
                  <X size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.photoPlaceholder}>
                <Camera size={32} color={colors.textSecondary} />
                <Text style={styles.photoPlaceholderText}>
                  {t("vehicles.add_photo")}
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.form}>
            <Input
              label={t("vehicles.make")}
              value={make}
              onChangeText={setMake}
              placeholder={t("vehicles.make_placeholder")}
              required
            />

            <Input
              label={t("vehicles.model")}
              value={model}
              onChangeText={setModel}
              placeholder={t("vehicles.model_placeholder")}
              required
            />

            <Input
              label={t("vehicles.year")}
              value={year}
              onChangeText={(text) => {
                setYear(text);
                validate("year", text, [rules.required, rules.year]);
              }}
              onBlur={() => {
                handleBlur("year");
                validate("year", year, [rules.required, rules.year]);
              }}
              placeholder={t("vehicles.year_placeholder")}
              keyboardType="numeric"
              required
              error={touched.year ? (errors.year as string) : undefined}
            />

            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t("vehicles.license_plate")}</Text>
              <MaskInput
                style={styles.input}
                value={licensePlate}
                onChangeText={(masked, unmasked) =>
                  setLicensePlate(masked.toUpperCase())
                }
                mask={[/\w/, /\w/, "-", /\w/, /\w/, "-", /\w/, /\w/]}
                placeholder={t("vehicles.license_placeholder")}
                placeholderTextColor={colors.placeholder}
                autoCapitalize="characters"
              />
            </View>

            <Input
              label={`${t("vehicles.current_mileage")} (${t("vehicles.km")})`}
              value={currentMileage}
              onChangeText={(text) => {
                setCurrentMileage(text);
                validate("mileage", text, [rules.required, rules.mileage]);
              }}
              onBlur={() => {
                handleBlur("mileage");
                validate("mileage", currentMileage, [
                  rules.required,
                  rules.mileage,
                ]);
              }}
              placeholder={t("vehicles.mileage_placeholder")}
              keyboardType="numeric"
              required
              error={touched.mileage ? (errors.mileage as string) : undefined}
            />

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                {t("fuel.type_label")} <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.categoryGrid}>
                {(["gasoline", "diesel", "gpl", "electric"] as const).map(
                  (type) => (
                    <Chip
                      key={type}
                      label={t(`fuel.type_${type}`)}
                      active={fuelType === type}
                      onPress={() => setFuelType(type)}
                      style={styles.categoryChip}
                    />
                  )
                )}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                {t("vehicles.category")} <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.categoryGrid}>
                {(Object.keys(VEHICLE_CATEGORY_INFO) as VehicleCategory[]).map(
                  (cat) => {
                    const info = VEHICLE_CATEGORY_INFO[cat];
                    return (
                      <Chip
                        key={cat}
                        label={t(`vehicles.category_${cat}`)}
                        active={category === cat}
                        onPress={() =>
                          setCategory(category === cat ? undefined : cat)
                        }
                        icon={info.Icon}
                        iconColor={info.color}
                        style={styles.categoryChip}
                      />
                    );
                  }
                )}
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) =>
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
    photoSection: {
      alignItems: "center",
      marginBottom: 24,
    },
    photoContainer: {
      position: "relative" as const,
    },
    photo: {
      width: 200,
      height: 150,
      borderRadius: 12,
      backgroundColor: colors.border,
    },
    removePhotoButton: {
      position: "absolute" as const,
      top: 8,
      right: 8,
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      justifyContent: "center" as const,
      alignItems: "center" as const,
    },
    photoPlaceholder: {
      width: 200,
      height: 150,
      borderRadius: 12,
      backgroundColor: colors.surface,
      borderWidth: 2,
      borderColor: colors.border,
      borderStyle: "dashed" as const,
      justifyContent: "center" as const,
      alignItems: "center" as const,
    },
    photoPlaceholderText: {
      marginTop: 8,
      fontSize: 14,
      color: colors.textSecondary,
      fontWeight: "500" as const,
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
    categoryGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
    },
    categoryChip: {
      width: "47%",
    },
  });
