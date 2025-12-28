import React, { useState } from "react";
import ImageModal from "react-native-image-modal";
import { LinearGradient } from "expo-linear-gradient";
import { router, Stack, useLocalSearchParams, useRouter } from "expo-router";
import { AlertCircle } from "lucide-react-native";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  Pressable,
  Dimensions,
} from "react-native";
import {
  useSafeAreaInsets,
  SafeAreaView,
} from "react-native-safe-area-context";
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  Keyframe,
} from "react-native-reanimated";

import { useVehicles } from "@/contexts/VehicleContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { useAppAlert } from "@/contexts/AlertContext";
import { Image } from "expo-image";
import {
  Car,
  ChevronLeft,
  Edit,
  Trash2,
  MoreVertical,
  Eye,
  X,
} from "lucide-react-native";
import { BlurView } from "expo-blur";
import { ThemedBackground } from "@/components/ThemedBackground";

import { VehicleHeader } from "@/components/vehicle-details/VehicleHeader";
import { MaintenanceOverview } from "@/components/vehicle-details/MaintenanceOverview";
import { MaintenanceHistory } from "@/components/vehicle-details/MaintenanceHistory";
import { FuelLogSection } from "@/components/vehicle-details/FuelLogSection";

import { QuickReminders } from "@/components/vehicle-details/QuickReminders";

import { VehicleViewSettingsModal } from "@/components/vehicle-details/VehicleViewSettingsModal";
import { usePreferences } from "@/contexts/PreferencesContext";
import { VehicleImage } from "@/components/ui/VehicleImage";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

import { createStyles } from "@/styles/vehicle/VehicleDetail.styles";

const PaginationDot = React.memo(
  ({
    index,
    scrollX,
    activeColor,
    inactiveColor,
  }: {
    index: number;
    scrollX: SharedValue<number>;
    activeColor: string;
    inactiveColor: string;
  }) => {
    const animatedStyle = useAnimatedStyle(() => {
      // Calculate the input range based on the scroll position
      // Each page is SCREEN_WIDTH wide
      const inputRange = [
        (index - 1) * SCREEN_WIDTH,
        index * SCREEN_WIDTH,
        (index + 1) * SCREEN_WIDTH,
      ];

      // Interpolate width (scale effect) - subtle expansion
      const width = interpolate(
        scrollX.value,
        inputRange,
        [8, 24, 8], // Increased active width for better visibility
        Extrapolation.CLAMP
      );

      // Interpolate opacity/color
      const opacity = interpolate(
        scrollX.value,
        inputRange,
        [0.4, 1, 0.4], // Slightly reduced inactive opacity for contrast
        Extrapolation.CLAMP
      );

      // Interpolate background color
      const backgroundColor = interpolateColor(scrollX.value, inputRange, [
        inactiveColor,
        activeColor,
        inactiveColor,
      ]);

      return {
        width,
        backgroundColor,
        opacity,
      };
    });

    return (
      <Animated.View
        style={[
          {
            height: 8,
            borderRadius: 4,
            marginHorizontal: 3, // Reduced spacing (too far apart previously)
          },
          animatedStyle,
        ]}
      />
    );
  }
);

export default function VehicleDetailScreen() {
  const { id } = useLocalSearchParams();
  const vehicleId = id as string;
  const [isDeleting, setIsDeleting] = useState(false);

  const insets = useSafeAreaInsets();
  const scrollY = useSharedValue(0);
  const scrollX = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const scrollHandlerHorizontal = useAnimatedScrollHandler((event) => {
    scrollX.value = event.contentOffset.x;
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, 200], // Fade in between 0 and 200px scroll
      [0, 1],
      Extrapolation.CLAMP
    );

    return {
      opacity,
      backgroundColor: "#000000", // Solid black background
    };
  });

  const { getVehicleById, deleteVehicle, restoreLastSnapshot } = useVehicles();
  const { colors, isDark } = useTheme();
  const { preferences } = usePreferences();
  const { vehicleLayout } = preferences;
  const isMinimalist =
    !vehicleLayout.showQuickReminders &&
    !vehicleLayout.showMaintenanceOverview &&
    !vehicleLayout.showMaintenanceHistory &&
    !vehicleLayout.showFuelLogs;

  const { t } = useLocalization();
  const { showAlert, showToast } = useAppAlert();

  const [isViewSettingsVisible, setIsViewSettingsVisible] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const vehicle = getVehicleById(vehicleId);
  const styles = createStyles(colors, insets, isMinimalist, isDark);

  const displayPhotos =
    vehicle?.photos && vehicle.photos.length > 0
      ? vehicle.photos
      : vehicle?.photo
      ? [vehicle.photo]
      : [];

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
    <ThemedBackground>
      <View style={[styles.container, { backgroundColor: "transparent" }]}>
        <Stack.Screen options={{ headerShown: false }} />

        {/* Dynamic Status Bar Background */}
        <Animated.View
          style={[
            {
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: insets.top, // Only cover specific status bar area, or maybe a bit more if we want a "header" bar
              zIndex: 100,
            },
            headerAnimatedStyle,
          ]}
        />

        {/* Content */}
        <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
          <Animated.ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            onScroll={scrollHandler}
            scrollEventThrottle={16}
          >
            {/* Image - Goes behind the curved card */}
            <View style={styles.heroSection}>
              {displayPhotos.length > 0 ? (
                <View>
                  <Animated.ScrollView
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onScroll={scrollHandlerHorizontal}
                    scrollEventThrottle={16}
                  >
                    {displayPhotos.map((uri: string, index: number) => (
                      <View key={index} style={styles.vehicleImage}>
                        <VehicleImage
                          uri={uri}
                          position={
                            vehicle?.detailsPhotoPositions?.[uri] ||
                            vehicle?.photoPositions?.[uri]
                          }
                          height={isMinimalist ? SCREEN_HEIGHT * 0.6 : 400}
                        />
                      </View>
                    ))}
                  </Animated.ScrollView>
                </View>
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
                    intensity={60}
                    tint={isDark ? "dark" : "light"}
                    style={styles.floatingButtonBlur}
                  >
                    <ChevronLeft
                      size={24}
                      color={isDark ? "#FFFFFF" : colors.text}
                    />
                  </BlurView>
                </TouchableOpacity>
              </View>

              {/* Floating Action Buttons */}
              <View style={styles.floatingActions}>
                <TouchableOpacity
                  onPress={() => setIsMenuOpen(!isMenuOpen)}
                  activeOpacity={0.8}
                >
                  <BlurView
                    intensity={60}
                    tint={isDark ? "dark" : "light"}
                    style={styles.floatingButtonBlur}
                  >
                    <MoreVertical
                      size={20}
                      color={isDark ? "#FFFFFF" : colors.text}
                    />
                  </BlurView>
                </TouchableOpacity>

                {/* Dropdown Menu */}
                {isMenuOpen && (
                  <>
                    <Pressable
                      style={styles.menuBackdrop}
                      onPress={() => setIsMenuOpen(false)}
                    />
                    <Animated.View
                      style={styles.menuContainer}
                      entering={new Keyframe({
                        0: { opacity: 0, transform: [{ translateY: 20 }] },
                        100: { opacity: 1, transform: [{ translateY: 0 }] },
                      }).duration(200)}
                      exiting={new Keyframe({
                        0: { opacity: 1, transform: [{ translateY: 0 }] },
                        100: { opacity: 0, transform: [{ translateY: -20 }] },
                      }).duration(200)}
                    >
                      <BlurView
                        intensity={80}
                        tint={isDark ? "dark" : "light"}
                        style={styles.menuBlur}
                      >
                        <TouchableOpacity
                          style={styles.menuItem}
                          onPress={() => {
                            setIsMenuOpen(false);
                            setIsViewSettingsVisible(true);
                          }}
                        >
                          <Eye
                            size={18}
                            color={isDark ? "#FFFFFF" : colors.text}
                          />
                          <Text style={styles.menuItemText}>
                            {t(
                              "vehicle_details.customize_view",
                              "Customize View"
                            )}
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.menuItem}
                          onPress={() => {
                            setIsMenuOpen(false);
                            router.push(`/edit-vehicle?id=${vehicle.id}`);
                          }}
                        >
                          <Edit
                            size={18}
                            color={isDark ? "#FFFFFF" : colors.text}
                          />
                          <Text style={styles.menuItemText}>
                            {t("common.edit")}
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[styles.menuItem]}
                          onPress={() => {
                            setIsMenuOpen(false);
                            handleDelete();
                          }}
                        >
                          <Trash2 size={18} color="#FF453A" />
                          <Text
                            style={[styles.menuItemText, { color: "#FF453A" }]}
                          >
                            {t("common.delete")}
                          </Text>
                        </TouchableOpacity>
                      </BlurView>
                    </Animated.View>
                  </>
                )}
              </View>
            </View>

            {/* Curved Content Card - Overlays the image */}
            <LinearGradient
              colors={[colors.background, colors.card, colors.background]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.curvedCard}
            >
              {/* Dots Pagination */}
              {displayPhotos.length > 1 && (
                <View style={styles.paginationContainer}>
                  {displayPhotos.map((_: string, index: number) => (
                    <PaginationDot
                      key={index}
                      index={index}
                      scrollX={scrollX}
                      activeColor={colors.primary}
                      inactiveColor={colors.border}
                    />
                  ))}
                </View>
              )}

              {/* Vehicle Info inside curved card */}
              <VehicleHeader vehicle={vehicle} />

              {/* Quick Reminders "Nagging" Section */}
              {vehicleLayout.showQuickReminders && (
                <QuickReminders vehicleId={vehicleId} />
              )}

              {/* Maintenance sections */}
              {vehicleLayout.showMaintenanceOverview && (
                <MaintenanceOverview vehicleId={vehicleId} />
              )}
              {vehicleLayout.showMaintenanceHistory && (
                <MaintenanceHistory vehicleId={vehicleId} />
              )}
              {vehicleLayout.showFuelLogs && (
                <FuelLogSection vehicleId={vehicleId} />
              )}
            </LinearGradient>
          </Animated.ScrollView>
        </SafeAreaView>

        <VehicleViewSettingsModal
          visible={isViewSettingsVisible}
          onClose={() => setIsViewSettingsVisible(false)}
        />
      </View>
    </ThemedBackground>
  );
}
