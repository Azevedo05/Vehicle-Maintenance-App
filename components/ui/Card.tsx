import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  Pressable,
  StyleProp,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { useTheme } from "@/contexts/ThemeContext";

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: "default" | "outlined" | "elevated";
  padding?: number;
  onPress?: () => void;
  onLongPress?: () => void;
  delayLongPress?: number;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const Card = ({
  children,
  style,
  variant = "default",
  padding = 16,
  onPress,
  onLongPress,
  delayLongPress,
}: CardProps) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    if (onPress || onLongPress) {
      scale.value = withSpring(0.98);
    }
  };

  const handlePressOut = () => {
    if (onPress || onLongPress) {
      scale.value = withSpring(1);
    }
  };

  const getVariantStyle = () => {
    switch (variant) {
      case "outlined":
        return styles.outlined;
      case "elevated":
        return styles.elevated;
      default:
        return styles.default;
    }
  };

  const Container = onPress || onLongPress ? AnimatedPressable : View;

  return (
    <Container
      style={[
        styles.base,
        getVariantStyle(),
        { padding },
        style,
        (onPress || onLongPress) && animatedStyle,
      ]}
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={delayLongPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      {children}
    </Container>
  );
};

const createStyles = (colors: any) =>
  StyleSheet.create({
    base: {
      borderRadius: 16,
      backgroundColor: colors.surface,
    },
    default: {
      // No extra styles
    },
    outlined: {
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: "transparent",
    },
    elevated: {
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.08, // Much softer
      shadowRadius: 12, // More spread out
      elevation: 4, // Android
    },
  });
