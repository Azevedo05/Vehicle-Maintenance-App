import * as ImagePicker from "expo-image-picker";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { Camera, X, Check, Images, Plus, Trash2 } from "lucide-react-native";
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
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

import { useLocalization } from "@/contexts/LocalizationContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useVehicles } from "@/contexts/VehicleContext";
import { useAppAlert } from "@/contexts/AlertContext";
import {
  VehicleCategory,
  VEHICLE_CATEGORY_INFO,
  FuelType,
  TransmissionType,
} from "@/types/vehicle";
import { Chip } from "@/components/ui/Chip";
import { createFormStyles } from "@/styles/vehicle/VehicleForm.styles";
import { useVehicleImageHandling } from "@/hooks/useVehicleImageHandling";
import { ThemedBackground } from "@/components/ThemedBackground";
import { VehicleImage } from "@/components/ui/VehicleImage";
import { ImagePositionModal } from "@/components/ui/ImagePositionModal";

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
  const {
    photo,
    setPhoto,
    photos,
    setPhotos,
    photoPositions,
    detailsPhotoPositions,
    pendingImage,
    showPositionModal,
    setShowPositionModal,
    showPhotoOptions,
    setShowPhotoOptions,
    pickImage,
    handlePositionConfirm,
    handlePositionCancel,
    removePhoto,
  } = useVehicleImageHandling({
    initialPhoto: vehicle?.photo,
    initialPhotos: vehicle?.photos || (vehicle?.photo ? [vehicle.photo] : []),
    initialPhotoPositions: vehicle?.photoPositions || {},
    initialDetailsPositions: vehicle?.detailsPhotoPositions || {},
  });

  const [currentMileage, setCurrentMileage] = useState(
    vehicle?.currentMileage.toString() || ""
  );
  const [category, setCategory] = useState<VehicleCategory | undefined>(
    vehicle?.category
  );
  const [fuelType, setFuelType] = useState<FuelType | undefined>(
    vehicle?.fuelType
  );
  const [engine, setEngine] = useState(vehicle?.engine?.toString() || "");
  const [transmission, setTransmission] = useState<
    TransmissionType | undefined
  >(vehicle?.transmission);
  const [purchaseDate, setPurchaseDate] = useState<Date | undefined>(
    vehicle?.purchaseDate ? new Date(vehicle.purchaseDate) : undefined
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [engineError, setEngineError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEngineChange = (value: string) => {
    setEngine(value);
    if (value.trim() === "") {
      setEngineError(null);
      return;
    }
    const numValue = parseInt(value.replace(/\D/g, ""), 10);
    if (isNaN(numValue) || numValue < 50 || numValue > 13000) {
      setEngineError(t("vehicles.invalid_engine_text"));
    } else {
      setEngineError(null);
    }
  };

  const styles = createFormStyles(colors);

  if (!vehicle) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{t("vehicles.not_found")}</Text>
      </View>
    );
  }

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
      const engineNum = engine
        ? parseInt(engine.replace(/\D/g, ""), 10)
        : undefined;
      await updateVehicle(vehicle.id, {
        make: make.trim(),
        model: model.trim(),
        year: yearNum,
        licensePlate: licensePlate.trim() || undefined,
        currentMileage: mileageNum,
        photo,
        photoPosition: photo ? photoPositions[photo] : undefined,
        photoPositions,
        detailsPhotoPosition: photo ? detailsPhotoPositions[photo] : undefined,
        detailsPhotoPositions,
        photos,
        category,
        fuelType,
        engine:
          engineNum && engineNum >= 50 && engineNum <= 13000
            ? engineNum
            : undefined,
        transmission: fuelType === "electric" ? "automatic" : transmission,
        purchaseDate: purchaseDate?.getTime(),
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
                      aspectRatio={16 / 9}
                      borderTopRadius={16}
                      borderBottomRadius={16}
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
                        onPress={() => setShowPhotoOptions(true)}
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
                  <TouchableOpacity
                    onPress={() => setShowPhotoOptions(true)}
                    activeOpacity={0.7}
                  >
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
                        onPress={() => removePhoto(uri)}
                      >
                        <X size={12} color="#FFFFFF" />
                      </TouchableOpacity>
                    </View>
                  ))}
                  <TouchableOpacity
                    style={styles.addMoreButton}
                    onPress={() => setShowPhotoOptions(true)}
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

              {/* Fuel Type */}
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
                        onPress={() => {
                          setFuelType(type);
                          if (type === "electric") {
                            setTransmission("automatic");
                          }
                        }}
                        style={styles.categoryChip}
                      />
                    )
                  )}
                </View>
              </View>

              {/* Engine - hidden for electric */}
              {fuelType !== "electric" && (
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>{t("vehicles.engine")}</Text>
                  <TextInput
                    style={[styles.input, engineError && styles.inputError]}
                    placeholder={t("vehicles.engine_placeholder")}
                    value={engine}
                    onChangeText={handleEngineChange}
                    placeholderTextColor={colors.placeholder}
                    keyboardType="numeric"
                  />
                  {engineError && (
                    <Text
                      style={{
                        fontSize: 12,
                        color: colors.error,
                        marginTop: 4,
                      }}
                    >
                      {engineError}
                    </Text>
                  )}
                </View>
              )}

              {/* Transmission */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>{t("vehicles.transmission")}</Text>
                <View style={styles.categoryGrid}>
                  {(["manual", "automatic"] as const).map((type) => (
                    <Chip
                      key={type}
                      label={t(`vehicles.transmission_${type}`)}
                      active={
                        transmission === type ||
                        (fuelType === "electric" && type === "automatic")
                      }
                      onPress={() => {
                        if (fuelType === "electric" && type === "manual")
                          return;
                        setTransmission(type);
                      }}
                      style={
                        fuelType === "electric" && type === "manual"
                          ? { ...styles.categoryChip, opacity: 0.4 }
                          : styles.categoryChip
                      }
                    />
                  ))}
                </View>
              </View>

              {/* Purchase Date */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>{t("vehicles.purchase_date")}</Text>
                <TouchableOpacity
                  style={styles.input}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text
                    style={
                      purchaseDate
                        ? { color: colors.text }
                        : { color: colors.placeholder }
                    }
                  >
                    {purchaseDate
                      ? purchaseDate.toLocaleDateString()
                      : t("maintenance.date_placeholder")}
                  </Text>
                </TouchableOpacity>
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
                        onPress={() => setCategory(cat)}
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

        {/* Date Picker */}
        {showDatePicker &&
          (Platform.OS === "ios" ? (
            <Modal
              transparent
              visible={showDatePicker}
              animationType="fade"
              onRequestClose={() => setShowDatePicker(false)}
            >
              <TouchableOpacity
                style={styles.modalOverlay}
                activeOpacity={1}
                onPress={() => setShowDatePicker(false)}
              >
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>
                    {t("vehicles.purchase_date")}
                  </Text>
                  <DateTimePicker
                    value={purchaseDate || new Date()}
                    mode="date"
                    display="spinner"
                    onChange={(event: DateTimePickerEvent, date?: Date) => {
                      if (date) setPurchaseDate(date);
                    }}
                    maximumDate={new Date()}
                    themeVariant="dark"
                  />
                  <TouchableOpacity
                    style={styles.modalCancelButton}
                    onPress={() => setShowDatePicker(false)}
                  >
                    <Text
                      style={[
                        styles.modalCancelText,
                        { color: colors.primary },
                      ]}
                    >
                      {t("common.done")}
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </Modal>
          ) : (
            <DateTimePicker
              value={purchaseDate || new Date()}
              mode="date"
              display="default"
              onChange={(event: DateTimePickerEvent, date?: Date) => {
                setShowDatePicker(false);
                if (event.type === "set" && date) {
                  setPurchaseDate(date);
                }
              }}
              maximumDate={new Date()}
            />
          ))}

        {/* Image Position Modal */}
        {pendingImage && (
          <ImagePositionModal
            visible={showPositionModal}
            imageUri={pendingImage}
            onConfirm={handlePositionConfirm}
            onCancel={handlePositionCancel}
          />
        )}

        {/* Photo Options Modal */}
        <Modal
          visible={showPhotoOptions}
          transparent
          animationType="fade"
          onRequestClose={() => setShowPhotoOptions(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowPhotoOptions(false)}
          >
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{t("vehicles.add_photo")}</Text>
              <View style={styles.modalOptions}>
                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={() => pickImage("camera")}
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
