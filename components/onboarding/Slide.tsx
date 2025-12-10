import React, { useMemo } from "react";
import { View, Text, StyleSheet, Dimensions, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/contexts/ThemeContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import {
  Check,
  Car,
  Bell,
  Fuel,
  TrendingUp,
  CalendarClock,
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  SharedValue,
} from "react-native-reanimated";
import { SlideData } from "./types";

const { width, height } = Dimensions.get("window");

interface SlideProps {
  item: SlideData;
  index: number;
  scrollX: SharedValue<number>;
}

export const Slide = React.memo(({ item, index, scrollX }: SlideProps) => {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const styles = useMemo(() => createStyles(colors), [colors]);

  // Parallax & Opacity Animations
  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * width,
      index * width,
      (index + 1) * width,
    ];

    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0, 1, 0],
      Extrapolation.CLAMP
    );

    const scale = interpolate(
      scrollX.value,
      inputRange,
      [0.8, 1, 0.8],
      Extrapolation.CLAMP
    );

    return {
      opacity,
      transform: [{ scale }],
    };
  });

  return (
    <View style={styles.slideContainer}>
      {/* Background Gradient */}
      <LinearGradient
        colors={item.gradient as any}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Decoration Circles */}
      <View
        style={[
          styles.decorationCircle,
          { top: -100, right: -50, backgroundColor: "rgba(255,255,255,0.03)" },
        ]}
      />
      <View
        style={[
          styles.decorationCircle,
          {
            bottom: -100,
            left: -50,
            backgroundColor: "rgba(255,255,255,0.03)",
          },
        ]}
      />

      <SafeAreaView style={styles.safeArea}>
        <Animated.View style={[styles.contentContainer, animatedStyle]}>
          {/* --- 1. WELCOME SLIDE --- */}
          {item.type === "welcome" && (
            <View style={styles.heroSection}>
              {item.preTitle && (
                <Text style={styles.heroPreTitle}>{item.preTitle}</Text>
              )}
              <Image
                source={require("../../assets/images/splash-title.png")}
                style={styles.logoImage}
                resizeMode="contain"
              />
              <Text style={styles.heroSubtitle}>{item.subtitle}</Text>
            </View>
          )}

          {/* --- 2. FEATURES SLIDE --- */}
          {item.type === "features" && (
            <View style={styles.featuresContainer}>
              <Text style={styles.sectionTitle}>
                {t("onboarding.features_title")}
              </Text>

              <View style={styles.featureList}>
                {/* Feature 1: Vehicles */}
                <View style={styles.featureItem}>
                  <View style={styles.featureIconBox}>
                    <Car size={24} color={colors.primary} />
                  </View>
                  <View style={styles.featureTextBox}>
                    <Text style={styles.featureText}>
                      {t("onboarding.feature_vehicles")}
                    </Text>
                  </View>
                </View>

                {/* Feature 2: Maintenance */}
                <View style={styles.featureItem}>
                  <View style={styles.featureIconBox}>
                    <Bell size={24} color={colors.primary} />
                  </View>
                  <View style={styles.featureTextBox}>
                    <Text style={styles.featureText}>
                      {t("onboarding.feature_maintenance")}
                    </Text>
                  </View>
                </View>

                {/* Feature 3: Fuel */}
                <View style={styles.featureItem}>
                  <View style={styles.featureIconBox}>
                    <Fuel size={24} color={colors.primary} />
                  </View>
                  <View style={styles.featureTextBox}>
                    <Text style={styles.featureText}>
                      {t("onboarding.feature_fuel")}
                    </Text>
                  </View>
                </View>

                {/* Feature 4: Statistics */}
                <View style={styles.featureItem}>
                  <View style={styles.featureIconBox}>
                    <TrendingUp size={24} color={colors.primary} />
                  </View>
                  <View style={styles.featureTextBox}>
                    <Text style={styles.featureText}>
                      {t("onboarding.feature_statistics")}
                    </Text>
                  </View>
                </View>

                {/* Feature 5: Custom Reminders */}
                <View style={styles.featureItem}>
                  <View style={styles.featureIconBox}>
                    <CalendarClock size={24} color={colors.primary} />
                  </View>
                  <View style={styles.featureTextBox}>
                    <Text style={styles.featureText}>
                      {t("onboarding.feature_reminders")}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* --- 3. READY SLIDE --- */}
          {item.type === "ready" && (
            <View style={styles.centerContent}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: colors.success + "20" },
                ]}
              >
                <Check size={80} color={colors.success} />
                <View style={[styles.glow, { shadowColor: colors.success }]} />
              </View>
              <Text style={styles.slideTitle}>{item.title}</Text>
              <Text style={styles.slideBody}>{item.subtitle}</Text>
            </View>
          )}
        </Animated.View>
      </SafeAreaView>
    </View>
  );
});

const createStyles = (colors: any) =>
  StyleSheet.create({
    slideContainer: {
      width,
      height,
      overflow: "hidden",
    },
    decorationCircle: {
      position: "absolute",
      width: 300,
      height: 300,
      borderRadius: 150,
      opacity: 0.3,
      filter: "blur(50px)",
    },
    safeArea: {
      flex: 1,
      justifyContent: "center",
    },
    contentContainer: {
      flex: 1,
      alignItems: "center",
      paddingHorizontal: 24,
      justifyContent: "center",
      paddingBottom: 100,
    },
    // Welcome
    heroSection: {
      alignItems: "center",
      marginBottom: 32,
    },
    heroPreTitle: {
      fontSize: 32,
      fontWeight: "600",
      color: "#94a3b8",
      marginBottom: 24,
      textAlign: "center",
    },
    logoImage: {
      width: 280,
      height: 280,
      marginBottom: 40,
    },
    heroSubtitle: {
      fontSize: 20,
      color: "#cbd5e1",
      textAlign: "center",
      lineHeight: 30,
      fontWeight: "400",
      maxWidth: "90%",
    },
    // Features Slide
    featuresContainer: {
      width: "100%",
      paddingHorizontal: 16,
      alignItems: "center",
    },
    sectionTitle: {
      fontSize: 28,
      fontWeight: "bold",
      color: "#fff",
      marginBottom: 24,
      textAlign: "center",
    },
    featureList: {
      width: "100%",
      gap: 16,
    },
    featureItem: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "rgba(255,255,255,0.05)",
      padding: 16,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.1)",
    },
    featureIconBox: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: "rgba(255,255,255,0.1)",
      justifyContent: "center",
      alignItems: "center",
      marginRight: 16,
    },
    featureTextBox: {
      flex: 1,
    },
    featureText: {
      fontSize: 16,
      color: "#e2e8f0",
      fontWeight: "500",
      lineHeight: 24,
    },
    // Ready Slide
    centerContent: {
      alignItems: "center",
      width: "100%",
    },
    iconContainer: {
      width: 140,
      height: 140,
      borderRadius: 70,
      backgroundColor: "rgba(255,255,255,0.05)",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 40,
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.1)",
    },
    glow: {
      position: "absolute",
      width: 100,
      height: 100,
      borderRadius: 50,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.8,
      shadowRadius: 40,
      elevation: 10,
    },
    slideTitle: {
      fontSize: 32,
      fontWeight: "bold",
      color: "#fff",
      marginBottom: 16,
      textAlign: "center",
    },
    slideBody: {
      fontSize: 18,
      color: "#cbd5e1",
      textAlign: "center",
      lineHeight: 28,
      maxWidth: "85%",
    },
  });
