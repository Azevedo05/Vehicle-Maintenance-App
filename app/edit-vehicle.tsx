import * as ImagePicker from "expo-image-picker";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { Camera, X, Check, Plus, Trash2 } from "lucide-react-native";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

import { useLocalization } from "@/contexts/LocalizationContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useVehicles } from "@/contexts/VehicleContext";
import { useAppAlert } from "@/contexts/AlertContext";
import { VehicleCategory, VEHICLE_CATEGORY_INFO } from "@/types/vehicle";
import Link from "expo-router"; // Unused but keeping context if needed, actually just add the import

import { ThemedBackground } from "@/components/ThemedBackground";
import { DraggableImage } from "@/components/ui/DraggableImage";
import { VehicleImage } from "@/components/ui/VehicleImage";

export default function EditVehicleScreen() {
  const { id } = useLocalSearchParams();
  const { getVehicleById, updateVehicle, restoreLastSnapshot } = useVehicles();
  const { colors } = useTheme();
  const { t } = useLocalization();
  const { showToast, showAlert } = useAppAlert();

  const vehicle = getVehicleById(id as string);

  const [make, setMake] = useState(vehicle?.make || "");
  const [model, setModel] = useState(vehicle?.model || "");
  const [year, setYear] = useState(vehicle?.year.toString() || "");
  const [licensePlate, setLicensePlate] = useState(vehicle?.licensePlate || "");
  const [currentMileage, setCurrentMileage] = useState(
    vehicle?.currentMileage.toString() || ""
  );
  const [photo, setPhoto] = useState<string | undefined>(vehicle?.photo);
  const [photos, setPhotos] = useState<string[]>(
    vehicle?.photos || (vehicle?.photo ? [vehicle.photo] : [])
  );
  const [category, setCategory] = useState<VehicleCategory | undefined>(
    vehicle?.category
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoPositions, setPhotoPositions] = useState<
    Record<string, { xRatio: number; yRatio: number; scale: number }>
  >(vehicle?.photoPositions || {});

  const styles = createStyles(colors);

  if (!vehicle) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{t("vehicles.not_found")}</Text>
      </View>
    );
  }

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
      allowsEditing: false,
      quality: 0.8,
    });

    if (!result.canceled) {
      const newUri = result.assets[0].uri;
      setPhotos((prev) => [...prev, newUri]);
      if (!photo) {
        setPhoto(newUri);
      }
    }
  };

  const handleSubmit = async () => {
    if (
      !make.trim() ||
      !model.trim() ||
      !year.trim() ||
      !currentMileage.trim() ||
      !category
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
      await updateVehicle(vehicle.id, {
        make: make.trim(),
        model: model.trim(),
        year: yearNum,
        licensePlate: licensePlate.trim() || undefined,
        currentMileage: mileageNum,
        photo,
        photoPosition: photo ? photoPositions[photo] : undefined, // Keep legacy field for backward compatibility if needed, or migration
        photoPositions,
        photos, // Ensure this uses 'photos' state, not 'vehicle.photos'
        category,
      });

      router.back();

      setTimeout(() => {
        showToast({
          message: t("vehicles.update_success", {
            name: `${make.trim()} ${model.trim()}`,
          }),
          actionLabel: t("common.undo"),
          onAction: async () => {
            await restoreLastSnapshot();
          },
        });
      }, 150);
    } catch (error) {
      console.error("Error updating vehicle:", error);
      showAlert({
        title: t("common.error"),
        message: t("vehicles.update_error"),
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
        <Stack.Screen
          options={{
            title: t("vehicles.edit_vehicle"),
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
              <View style={styles.mainPhotoContainer}>
                {photo ? (
                  <Animated.View
                    entering={FadeIn}
                    exiting={FadeOut}
                    style={styles.photoWrapper}
                  >
                    <VehicleImage
                      uri={photo}
                      position={photoPositions[photo]}
                      onPositionChange={(pos) => {
                        setPhotoPositions((prev) => ({
                          ...prev,
                          [photo]: pos,
                        }));
                      }}
                      aspectRatio={16 / 9}
                      editable={true}
                      borderTopRadius={16}
                      borderBottomRadius={16}
                      dragLabel={t("common.drag_adjust")}
                    />

                    {/* Top overlay buttons */}
                    <View
                      style={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        flexDirection: "row",
                        gap: 8,
                      }}
                    >
                      <TouchableOpacity
                        style={{
                          backgroundColor: "rgba(0,0,0,0.6)",
                          padding: 8,
                          borderRadius: 20,
                        }}
                        onPress={pickImage}
                      >
                        <Camera size={20} color="#FFF" />
                      </TouchableOpacity>
                    </View>

                    <View style={styles.mainLabel}>
                      <Text style={styles.mainLabelText}>
                        {t("vehicles.main_photo")}
                      </Text>
                    </View>
                  </Animated.View>
                ) : (
                  <TouchableOpacity onPress={pickImage} activeOpacity={0.7}>
                    <Animated.View
                      entering={FadeIn}
                      exiting={FadeOut}
                      style={styles.photoPlaceholder}
                    >
                      <Camera size={32} color={colors.textSecondary} />
                      <Text style={styles.photoPlaceholderText}>
                        {t("vehicles.add_photo")}
                      </Text>
                    </Animated.View>
                  </TouchableOpacity>
                )}
              </View>

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
                        onPress={() => {
                          if (photo !== uri) {
                            setPhoto(uri);
                          }
                        }}
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
                    onPress={pickImage}
                  >
                    <Plus size={24} color={colors.primary} />
                  </TouchableOpacity>
                </ScrollView>
              )}
            </View>

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  {t("vehicles.make")} <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  value={make}
                  onChangeText={setMake}
                  placeholder={t("vehicles.make_placeholder")}
                  placeholderTextColor={colors.placeholder}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  {t("vehicles.model")} <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  value={model}
                  onChangeText={setModel}
                  placeholder={t("vehicles.model_placeholder")}
                  placeholderTextColor={colors.placeholder}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  {t("vehicles.year")} <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  value={year}
                  onChangeText={setYear}
                  placeholder={t("vehicles.year_placeholder")}
                  placeholderTextColor={colors.placeholder}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>{t("vehicles.license_plate")}</Text>
                <TextInput
                  style={styles.input}
                  value={licensePlate}
                  onChangeText={(text) => setLicensePlate(text.toUpperCase())}
                  placeholder={t("vehicles.license_placeholder")}
                  placeholderTextColor={colors.placeholder}
                  autoCapitalize="characters"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  {t("vehicles.current_mileage")} ({t("vehicles.km")}){" "}
                  <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  value={currentMileage}
                  onChangeText={setCurrentMileage}
                  placeholder={t("vehicles.mileage_placeholder")}
                  placeholderTextColor={colors.placeholder}
                  keyboardType="numeric"
                />
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
                    const IconComponent = info.Icon;
                    return (
                      <TouchableOpacity
                        key={cat}
                        style={[
                          styles.categoryButton,
                          category === cat && styles.categoryButtonActive,
                          {
                            borderColor:
                              category === cat ? info.color : colors.border,
                          },
                        ]}
                        onPress={() =>
                          setCategory(category === cat ? undefined : cat)
                        }
                      >
                        <IconComponent
                          size={20}
                          color={
                            category === cat ? info.color : colors.textSecondary
                          }
                        />
                        <Text
                          style={[
                            styles.categoryLabel,
                            category === cat && { color: info.color },
                          ]}
                        >
                          {t(`vehicles.category_${cat}`)}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
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
    categoryButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 10,
      paddingHorizontal: 14,
      borderRadius: 8,
      borderWidth: 2,
      gap: 6,
      minWidth: "48%",
      flex: 1,
    },
    categoryButtonActive: {
      backgroundColor: colors.card,
    },
    categoryLabel: {
      fontSize: 14,
      fontWeight: "500",
      color: colors.text,
    },
  });
