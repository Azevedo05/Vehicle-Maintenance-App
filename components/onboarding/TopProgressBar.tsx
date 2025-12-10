import React, { useMemo } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  SharedValue,
} from "react-native-reanimated";
import { useTheme } from "@/contexts/ThemeContext";

const { width } = Dimensions.get("window");

interface TopProgressBarProps {
  scrollX: SharedValue<number>;
  slidesLength: number;
}

export const TopProgressBar = React.memo(
  ({ scrollX, slidesLength }: TopProgressBarProps) => {
    const { colors } = useTheme();
    const styles = useMemo(() => createStyles(colors), [colors]);

    const animatedProgressStyle = useAnimatedStyle(() => {
      const maxScroll = (slidesLength - 1) * width;
      const progress = interpolate(
        scrollX.value,
        [0, maxScroll],
        [33, 100],
        Extrapolation.CLAMP
      );

      return {
        width: `${progress}%`,
      };
    });

    return (
      <View style={styles.progressBarContainer}>
        <Animated.View
          style={[styles.progressBarFill, animatedProgressStyle]}
        />
      </View>
    );
  }
);

const createStyles = (colors: any) =>
  StyleSheet.create({
    progressBarContainer: {
      height: 4,
      backgroundColor: "rgba(255,255,255,0.1)",
      borderRadius: 2,
      width: "100%",
      overflow: "hidden",
    },
    progressBarFill: {
      height: "100%",
      backgroundColor: colors.primary,
      borderRadius: 2,
    },
  });
