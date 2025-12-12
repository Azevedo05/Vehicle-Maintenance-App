import * as ImagePicker from "expo-image-picker";
import { router, Stack } from "expo-router";
import { Camera, X, Check, Images, Plus, Trash2 } from "lucide-react-native";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Modal,
  Platform,
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
import { DraggableImage } from "@/components/ui/DraggableImage";
import { ThemedBackground } from "@/components/ThemedBackground";
import Toast from "react-native-toast-message";

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
  const [photos, setPhotos] = useState<string[]>([]);
  const [fuelType, setFuelType] = useState<FuelType | undefined>(undefined);
  const [category, setCategory] = useState<VehicleCategory | undefined>(
    undefined
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);
  const [photoPosition, setPhotoPosition] = useState<
    { x: number; y: number; scale: number } | undefined
  >(undefined);

  const { validate, errors, touched, handleBlur, rules } = useFormValidation({
    make,
    model,
    year,
    licensePlate,
    currentMileage,
  });
  const styles = createStyles(colors);

  const handleImageSelection = () => {
    setShowPhotoOptions(true);
  };

  const pickImage = async (source: "camera" | "library") => {
    setShowPhotoOptions(false);
    let permissionResult;

    if (source === "camera") {
      permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    } else {
      permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
    }

    if (permissionResult.status !== "granted") {
      showAlert({
        title: t("vehicles.permission_needed"),
        message: t("vehicles.permission_text"),
      });
      return;
    }

    let result;
    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: ["images"],
      allowsEditing: false,
      quality: 0.8,
    };

    if (source === "camera") {
      result = await ImagePicker.launchCameraAsync(options);
    } else {
      result = await ImagePicker.launchImageLibraryAsync(options);
    }

    if (!result.canceled) {
      const newUri = result.assets[0].uri;
      setPhotos((prev) => [...prev, newUri]);
      if (!photo) {
        setPhoto(newUri);
      }
      setPhotoPosition(undefined); // Reset position for new photo
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
        photoPosition,
        photos,
        category,
        fuelType,
      });

      Toast.show({
        type: "success",
        text1: t("common.success"), // Or "Vehicle added" if available
        text2: t("vehicles.add_success"), // Check if this key exists, otherwise generic
      });
      router.back();
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
    <ThemedBackground>
      <SafeAreaView
        style={[styles.container, { backgroundColor: "transparent" }]}
        edges={["bottom"]}
      >
        {/* ... (Stack.Screen and SuccessAnimation) ... */}
        <Stack.Screen
          options={{
            title: t("vehicles.add_vehicle"),
            headerRight: () => (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginRight: Platform.OS === "ios" ? -16 : 0,
                }}
              >
                {isSubmitting ? (
                  <ActivityIndicator color={colors.primary} />
                ) : (
                  <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={isSubmitting}
                    hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                  >
                    <Check size={24} color={colors.primary} />
                  </TouchableOpacity>
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
            <View style={styles.photoSection}>
              <TouchableOpacity
                style={styles.mainPhotoContainer}
                onPress={handleImageSelection}
                activeOpacity={0.7}
              >
                {photo ? (
                  <View style={styles.photoWrapper}>
                    <DraggableImage
                      uri={photo}
                      initialPosition={photoPosition}
                      onPositionChange={setPhotoPosition}
                      aspectRatio={16 / 9}
                      editable={true}
                    />
                    <View style={styles.mainLabel}>
                      <Text style={styles.mainLabelText}>
                        {t("vehicles.main_photo")}
                      </Text>
                    </View>
                  </View>
                ) : (
                  <View style={styles.photoPlaceholder}>
                    <Camera size={48} color={colors.textSecondary} />
                    <Text style={styles.photoPlaceholderText}>
                      {t("vehicles.add_photo")}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>

              {/* Gallery Strip */}
              {photos.length > 0 && (
                <ScrollView
                  horizontal
                  style={styles.galleryScroll}
                  contentContainerStyle={styles.galleryContent}
                  showsHorizontalScrollIndicator={false}
                >
                  {photos.map((uri, index) => (
                    <View key={index} style={styles.galleryItemContainer}>
                      <TouchableOpacity
                        onPress={() => setPhoto(uri)}
                        activeOpacity={0.7}
                        style={[
                          styles.galleryItem,
                          photo === uri && styles.galleryItemSelected,
                        ]}
                      >
                        <Image
                          source={{ uri }}
                          style={styles.galleryImage}
                          contentFit="cover"
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.removeThumbButton}
                        onPress={() => {
                          const newPhotos = photos.filter((p) => p !== uri);
                          setPhotos(newPhotos);
                          if (photo === uri) {
                            setPhoto(
                              newPhotos.length > 0 ? newPhotos[0] : undefined
                            );
                          }
                        }}
                      >
                        <X size={12} color="#FFFFFF" />
                      </TouchableOpacity>
                    </View>
                  ))}
                  <TouchableOpacity
                    style={styles.addMoreButton}
                    onPress={handleImageSelection}
                  >
                    <Plus size={24} color={colors.primary} />
                  </TouchableOpacity>
                </ScrollView>
              )}
            </View>

            <View style={styles.form}>
              {/* ... form inputs ... */}
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
                  {t("vehicles.category")}{" "}
                  <Text style={styles.required}>*</Text>
                </Text>
                <View style={styles.categoryGrid}>
                  {(
                    Object.keys(VEHICLE_CATEGORY_INFO) as VehicleCategory[]
                  ).map((cat) => {
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
                  })}
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
        <Modal
          transparent
          visible={showPhotoOptions}
          animationType="fade"
          onRequestClose={() => setShowPhotoOptions(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowPhotoOptions(false)}
          >
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                {t("vehicles.choose_photo_source")}
              </Text>

              <View style={styles.modalOptions}>
                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={() => pickImage("camera")}
                  activeOpacity={0.7}
                >
                  <View style={styles.modalIconContainer}>
                    <Camera size={28} color={colors.primary} />
                  </View>
                  <Text style={styles.modalOptionText}>
                    {t("vehicles.camera")}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={() => pickImage("library")}
                  activeOpacity={0.7}
                >
                  <View style={styles.modalIconContainer}>
                    <Images size={28} color={colors.primary} />
                  </View>
                  <Text style={styles.modalOptionText}>
                    {t("vehicles.gallery")}
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowPhotoOptions(false)}
              >
                <Text style={styles.modalCancelText}>{t("common.cancel")}</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      </SafeAreaView>
    </ThemedBackground>
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
      width: "100%",
      marginBottom: 24,
      gap: 16,
    },
    mainPhotoContainer: {
      width: "100%",
      aspectRatio: 16 / 9,
      borderRadius: 16,
      overflow: "hidden",
    },
    photoWrapper: {
      width: "100%",
      height: "100%",
      position: "relative" as const,
    },
    photo: {
      width: "100%",
      height: "100%",
      backgroundColor: colors.border,
    },
    mainLabel: {
      position: "absolute",
      bottom: 12,
      left: 12,
      backgroundColor: "rgba(0,0,0,0.6)",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
    },
    mainLabelText: {
      color: "#FFFFFF",
      fontSize: 12,
      fontWeight: "600" as const,
    },
    photoPlaceholder: {
      width: "100%",
      height: "100%",
      borderRadius: 16,
      backgroundColor: colors.surface,
      borderWidth: 2,
      borderColor: colors.border,
      borderStyle: "dashed" as const,
      justifyContent: "center" as const,
      alignItems: "center" as const,
      gap: 12,
    },
    photoPlaceholderText: {
      fontSize: 16,
      color: colors.textSecondary,
      fontWeight: "600" as const,
    },
    galleryScroll: {
      maxHeight: 110, // Increased to accommodate padding
    },
    galleryContent: {
      gap: 16, // Increased gap
      paddingHorizontal: 12, // Increased padding
      paddingVertical: 12, // Added vertical padding for the buttons
    },
    galleryItemContainer: {
      position: "relative" as const,
    },
    galleryItem: {
      width: 80,
      height: 80,
      borderRadius: 12,
      overflow: "hidden",
      borderWidth: 2,
      borderColor: colors.border,
    },
    galleryItemSelected: {
      borderColor: colors.primary,
      borderWidth: 3,
    },
    galleryImage: {
      width: "100%",
      height: "100%",
    },
    removeThumbButton: {
      position: "absolute" as const,
      top: -6,
      right: -6,
      backgroundColor: colors.error,
      width: 20,
      height: 20,
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1.5,
      borderColor: colors.background,
    },
    addMoreButton: {
      width: 80,
      height: 80,
      borderRadius: 12,
      backgroundColor: colors.surface,
      borderWidth: 2,
      borderColor: colors.border,
      borderStyle: "dashed" as const,
      justifyContent: "center",
      alignItems: "center",
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
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    modalContent: {
      backgroundColor: colors.card,
      borderRadius: 24,
      padding: 24,
      width: "100%",
      maxWidth: 340,
      gap: 24,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 16,
      elevation: 10,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
      textAlign: "center",
      marginBottom: 8,
    },
    modalOptions: {
      flexDirection: "row",
      justifyContent: "space-around",
      gap: 16,
    },
    modalOption: {
      alignItems: "center",
      gap: 12,
      padding: 16,
      borderRadius: 16,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      minWidth: 110,
    },
    modalIconContainer: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: colors.primary + "15",
      justifyContent: "center",
      alignItems: "center",
    },
    modalOptionText: {
      fontSize: 15,
      fontWeight: "600",
      color: colors.text,
    },
    modalCancelButton: {
      paddingVertical: 12,
      alignItems: "center",
    },
    modalCancelText: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.error,
    },
  });
