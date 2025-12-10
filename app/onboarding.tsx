import React, { useState, useRef, useMemo } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/contexts/ThemeContext";
import { usePreferences } from "@/contexts/PreferencesContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { ArrowRight, Check } from "lucide-react-native";
import { useRouter } from "expo-router";
import { BlurView } from "expo-blur";
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import { Slide } from "@/components/onboarding/Slide";
import { TopProgressBar } from "@/components/onboarding/TopProgressBar";
import { SlideData } from "@/components/onboarding/types";

const { width, height } = Dimensions.get("window");

export default function OnboardingScreen() {
  const { colors } = useTheme();
  const { completeOnboarding } = usePreferences();
  const router = useRouter();
  const { t } = useLocalization();

  const styles = useMemo(() => createStyles(colors), [colors]);

  const scrollX = useSharedValue(0);
  const flatListRef = useRef<Animated.FlatList<SlideData>>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // --- Slides Configuration ---
  const slides: SlideData[] = useMemo(
    () => [
      {
        id: "welcome",
        type: "welcome",
        preTitle: t("onboarding.welcome_pretitle"),
        subtitle: t("onboarding.welcome_subtitle"),
        gradient: [colors.background, colors.card, colors.background] as const,
      },
      {
        id: "features",
        type: "features",
        gradient: [colors.background, colors.card, colors.background] as const,
      },
      {
        id: "ready",
        type: "ready",
        title: t("onboarding.ready_title"),
        subtitle: t("onboarding.ready_subtitle"),
        gradient: [colors.background, colors.card, colors.background] as const,
      },
    ],
    [t, colors]
  );

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollX.value = event.contentOffset.x;
  });

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
      setCurrentIndex(currentIndex + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex - 1,
        animated: true,
      });
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleComplete = async () => {
    await completeOnboarding();
    router.replace("/");
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0 && viewableItems[0].index !== null) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  // --- Render Item ---
  const renderItem = ({ item, index }: { item: SlideData; index: number }) => {
    return <Slide item={item} index={index} scrollX={scrollX} />;
  };

  // --- Pagination Dots ---
  const Pagination = () => {
    return (
      <View style={styles.paginationContainer}>
        {slides.map((_, index) => {
          const animatedDotStyle = useAnimatedStyle(() => {
            const inputRange = [
              (index - 1) * width,
              index * width,
              (index + 1) * width,
            ];
            const widthAnim = interpolate(
              scrollX.value,
              inputRange,
              [8, 24, 8],
              Extrapolation.CLAMP
            );
            const opacityAnim = interpolate(
              scrollX.value,
              inputRange,
              [0.5, 1, 0.5],
              Extrapolation.CLAMP
            );
            return {
              width: widthAnim,
              opacity: opacityAnim,
              backgroundColor:
                index === currentIndex ? colors.primary : "#ffffff80",
            };
          });
          return (
            <Animated.View key={index} style={[styles.dot, animatedDotStyle]} />
          );
        })}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* --- Top Progress Bar --- */}
      <SafeAreaView style={styles.topContainer} pointerEvents="none">
        <TopProgressBar scrollX={scrollX} slidesLength={slides.length} />
      </SafeAreaView>

      {/* --- Main Content --- */}
      <Animated.FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
        bounces={false}
      />

      {/* --- Floating Footer --- */}
      <View style={styles.footerContainer}>
        <BlurView intensity={40} tint="dark" style={styles.glassFooter}>
          <TouchableOpacity
            onPress={handleBack}
            style={[styles.footerBtn, { opacity: currentIndex > 0 ? 1 : 0 }]}
            disabled={currentIndex === 0}
          >
            <ArrowRight
              size={24}
              color="#fff"
              style={{ transform: [{ rotate: "180deg" }] }}
            />
          </TouchableOpacity>

          <Pagination />

          <TouchableOpacity
            onPress={handleNext}
            style={[styles.footerBtn, styles.primaryBtn]}
          >
            {currentIndex === slides.length - 1 ? (
              <Check size={24} color="#000" />
            ) : (
              <ArrowRight size={24} color="#000" />
            )}
          </TouchableOpacity>
        </BlurView>
      </View>
    </View>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#000",
    },
    topContainer: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 50,
      paddingHorizontal: 24,
      paddingTop: 16,
    },
    footerContainer: {
      position: "absolute",
      bottom: 30,
      left: 20,
      right: 20,
      alignItems: "center",
    },
    glassFooter: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
      height: 80,
      borderRadius: 40,
      paddingHorizontal: 16,
      backgroundColor: "rgba(0,0,0,0.6)",
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.1)",
      overflow: "hidden",
    },
    footerBtn: {
      width: 56,
      height: 56,
      borderRadius: 28,
      justifyContent: "center",
      alignItems: "center",
    },
    primaryBtn: {
      backgroundColor: "#fff",
    },
    paginationContainer: {
      flexDirection: "row",
      gap: 6,
    },
    dot: {
      height: 6,
      borderRadius: 3,
      backgroundColor: "#fff",
    },
  });
