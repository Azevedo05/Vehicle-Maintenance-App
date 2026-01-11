import * as ImagePicker from "expo-image-picker";
import { router, Stack } from "expo-router";
import {
  Camera,
  X,
  Check,
  Images,
  Plus,
  Trash2,
  Star,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Modal,
  Platform,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
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
import { useFormValidation } from "@/hooks/useFormValidation";

import { Input } from "@/components/ui/Input";
import { Chip } from "@/components/ui/Chip";
import { VehicleImage } from "@/components/ui/VehicleImage";
import { ImagePositionModal } from "@/components/ui/ImagePositionModal";
import { ThemedBackground } from "@/components/ThemedBackground";
import Toast from "react-native-toast-message";
import { createFormStyles } from "@/styles/vehicle/VehicleForm.styles";
import { useVehicleImageHandling } from "@/hooks/useVehicleImageHandling";
import { VehicleExtrasForm } from "@/components/vehicle/VehicleExtrasForm";

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
  const {
    photo,
    setPhoto,
    selectedPhoto,
    setSelectedPhoto,
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
  } = useVehicleImageHandling();

  const [fuelType, setFuelType] = useState<FuelType | undefined>(undefined);
  const [engine, setEngine] = useState("");
  const [transmission, setTransmission] = useState<
    TransmissionType | undefined
  >(undefined);
  const [purchaseDate, setPurchaseDate] = useState<Date | undefined>(undefined);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [engineError, setEngineError] = useState<string | null>(null);
  const [category, setCategory] = useState<VehicleCategory | undefined>(
    undefined
  );
  const [tireSizeFront, setTireSizeFront] = useState("");
  const [tireSizeRear, setTireSizeRear] = useState("");
  const [tirePressureFront, setTirePressureFront] = useState("");
  const [tirePressureRear, setTirePressureRear] = useState("");
  const [tirePressureUnit, setTirePressureUnit] =
    useState<import("@/types/vehicle").PressureUnit>("bar");
  const [vin, setVin] = useState("");
  const [batteryCapacity, setBatteryCapacity] = useState("");
  const [batteryCapacityError, setBatteryCapacityError] = useState<
    string | null
  >(null);
  const [horsepower, setHorsepower] = useState("");
  const [horsepowerError, setHorsepowerError] = useState<string | null>(null);
  const [torque, setTorque] = useState("");
  const [torqueError, setTorqueError] = useState<string | null>(null);
  const [driveType, setDriveType] = useState<
    import("@/types/vehicle").DriveType | undefined
  >(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showExtras, setShowExtras] = useState(false);
  const { width: windowWidth } = useWindowDimensions();

  // Proporção dinâmica para corresponder aos cartões da lista principal
  const isTablet = windowWidth >= 600;
  const imageHeight = isTablet ? 320 : 200;
  // Para tablets, o frame no modal usa (screenWidth - 48) para padding de 24 em cada lado
  // A altura é 320. Para phone, width total - 48 padding e altura 200
  const listAspectRatio = (windowWidth - 48) / imageHeight;
  const detailsAspectRatio = windowWidth / 400; // 400 é a altura do banner nos detalhes

  const { validate, errors, touched, handleBlur, rules } = useFormValidation({
    make,
    model,
    year,
    licensePlate,
    currentMileage,
  });

  const formAspectRatio = 16 / 9;
  const styles = createFormStyles(colors, formAspectRatio);

  const handleImageSelection = () => {
    setShowPhotoOptions(true);
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

    if (engineError || horsepowerError || torqueError || batteryCapacityError) {
      showAlert({
        title: t("common.error"),
        message: t("vehicles.fill_required"),
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const engineNum = engine
        ? parseInt(engine.replace(/\D/g, ""), 10)
        : undefined;
      await addVehicle({
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
        horsepower:
          horsepower &&
          parseInt(horsepower, 10) >= 5 &&
          parseInt(horsepower, 10) <= 2000
            ? parseInt(horsepower, 10)
            : undefined,
        torque:
          torque && parseInt(torque, 10) >= 5 && parseInt(torque, 10) <= 3000
            ? parseInt(torque, 10)
            : undefined,
        tireSizeFront: tireSizeFront.trim() || undefined,
        tireSizeRear: tireSizeRear.trim() || undefined,
        tirePressureFront: tirePressureFront.trim() || undefined,
        tirePressureRear: tirePressureRear.trim() || undefined,
        tirePressureUnit,
        vin: vin.trim() || undefined,
        batteryCapacity:
          batteryCapacity &&
          parseFloat(batteryCapacity) >= 1 &&
          parseFloat(batteryCapacity) <= 250
            ? parseFloat(batteryCapacity)
            : undefined,
        driveType,
      });

      Toast.show({
        type: "success",
        text1: t("common.success"),
        text2: t("vehicles.add_success", {
          name: `${make.trim()} ${model.trim()}`,
        }),
        props: { toastId: Date.now() },
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
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.keyboardView}
          keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
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
                {selectedPhoto ? (
                  <Animated.View
                    entering={FadeIn}
                    exiting={FadeOut}
                    style={styles.photoWrapper}
                  >
                    <VehicleImage
                      uri={selectedPhoto}
                      position={photoPositions[selectedPhoto]}
                      aspectRatio={formAspectRatio}
                      borderTopRadius={16}
                      borderBottomRadius={16}
                    />
                    {selectedPhoto === photo ? (
                      <View style={styles.mainLabel}>
                        <Star size={14} color="#FFF" fill="#FFF" />
                        <Text style={styles.mainLabelText}>
                          {t("vehicles.main_photo")}
                        </Text>
                      </View>
                    ) : (
                      <TouchableOpacity
                        style={styles.setCoverButton}
                        onPress={() => {
                          setPhoto(selectedPhoto);
                          Haptics.impactAsync(
                            Haptics.ImpactFeedbackStyle.Medium
                          );
                        }}
                        activeOpacity={0.8}
                      >
                        <Star size={14} color="#FFF" />
                        <Text style={styles.setCoverButtonText}>
                          {t("vehicles.set_as_main")}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </Animated.View>
                ) : (
                  <Animated.View
                    entering={FadeIn}
                    exiting={FadeOut}
                    style={styles.photoPlaceholder}
                  >
                    <Camera size={48} color={colors.textSecondary} />
                    <Text style={styles.photoPlaceholderText}>
                      {t("vehicles.add_photo")}
                    </Text>
                  </Animated.View>
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
                        onPress={() => {
                          if (selectedPhoto !== uri) {
                            setSelectedPhoto(uri);
                          }
                        }}
                        activeOpacity={0.7}
                        style={[
                          styles.galleryItem,
                          selectedPhoto === uri && styles.galleryItemSelected,
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
                <TextInput
                  style={styles.input}
                  value={licensePlate}
                  onChangeText={(text) => setLicensePlate(text.toUpperCase())}
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
                        onPress={() => {
                          setFuelType(type);
                          // Auto-set transmission for electric vehicles
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

              <VehicleExtrasForm
                fuelType={fuelType}
                engine={engine}
                setEngine={setEngine}
                engineError={engineError}
                setEngineError={setEngineError}
                transmission={transmission}
                setTransmission={setTransmission}
                purchaseDate={purchaseDate}
                setShowDatePicker={setShowDatePicker}
                horsepower={horsepower}
                setHorsepower={setHorsepower}
                horsepowerError={horsepowerError}
                setHorsepowerError={setHorsepowerError}
                torque={torque}
                setTorque={setTorque}
                torqueError={torqueError}
                setTorqueError={setTorqueError}
                vin={vin}
                setVin={setVin}
                batteryCapacity={batteryCapacity}
                setBatteryCapacity={setBatteryCapacity}
                batteryCapacityError={batteryCapacityError}
                setBatteryCapacityError={setBatteryCapacityError}
                driveType={driveType}
                setDriveType={(val) => setDriveType(val)}
                tireSizeFront={tireSizeFront}
                setTireSizeFront={setTireSizeFront}
                tirePressureFront={tirePressureFront}
                setTirePressureFront={setTirePressureFront}
                tireSizeRear={tireSizeRear}
                setTireSizeRear={setTireSizeRear}
                tirePressureRear={tirePressureRear}
                setTirePressureRear={setTirePressureRear}
                tirePressureUnit={tirePressureUnit}
                setTirePressureUnit={setTirePressureUnit}
                showExtras={showExtras}
                setShowExtras={setShowExtras}
              />
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
            listAspectRatio={listAspectRatio}
            detailsAspectRatio={detailsAspectRatio}
          />
        )}
      </SafeAreaView>
    </ThemedBackground>
  );
}
