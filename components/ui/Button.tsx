import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  Pressable,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { useTheme } from "@/contexts/ThemeContext";
import { LucideIcon } from "lucide-react-native";

interface ButtonProps {
  label?: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "icon";
  size?: "sm" | "md" | "lg";
  icon?: LucideIcon;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const Button = ({
  label,
  onPress,
  variant = "primary",
  size = "md",
  icon: Icon,
  loading,
  disabled,
  style,
  textStyle,
  fullWidth,
}: ButtonProps) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.96);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const getVariantStyle = () => {
    switch (variant) {
      case "primary":
        return styles.primary;
      case "secondary":
        return styles.secondary;
      case "outline":
        return styles.outline;
      case "ghost":
        return styles.ghost;
      case "icon":
        return styles.iconBtn;
      default:
        return styles.primary;
    }
  };

  const getSizeStyle = () => {
    if (variant === "icon") {
      switch (size) {
        case "sm":
          return { width: 32, height: 32 };
        case "lg":
          return { width: 56, height: 56 };
        default:
          return { width: 40, height: 40 };
      }
    }

    switch (size) {
      case "sm":
        return { paddingVertical: 8, paddingHorizontal: 12 };
      case "lg":
        return { paddingVertical: 16, paddingHorizontal: 24 };
      default:
        return { paddingVertical: 12, paddingHorizontal: 16 };
    }
  };

  const getTextColor = () => {
    if (disabled) return colors.textSecondary;
    if (variant === "primary") return "#FFFFFF";
    if (variant === "outline") return colors.primary;
    if (variant === "ghost") return colors.primary;
    return colors.text;
  };

  return (
    <AnimatedPressable
      style={[
        styles.base,
        getVariantStyle(),
        getSizeStyle(),
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        style,
        animatedStyle,
      ]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <>
          {Icon && (
            <Icon
              size={size === "sm" ? 16 : size === "lg" ? 24 : 20}
              color={getTextColor()}
              style={label ? styles.iconRight : undefined}
            />
          )}
          {label && (
            <Text
              style={[
                styles.text,
                { color: getTextColor() },
                size === "sm" && { fontSize: 13 },
                size === "lg" && { fontSize: 18 },
                textStyle,
              ]}
            >
              {label}
            </Text>
          )}
        </>
      )}
    </AnimatedPressable>
  );
};

const createStyles = (colors: any) =>
  StyleSheet.create({
    base: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 12,
    },
    fullWidth: {
      width: "100%",
    },
    disabled: {
      opacity: 0.5,
    },
    primary: {
      backgroundColor: colors.primary,
    },
    secondary: {
      backgroundColor: colors.surface,
    },
    outline: {
      backgroundColor: "transparent",
      borderWidth: 1,
      borderColor: colors.primary,
    },
    ghost: {
      backgroundColor: "transparent",
    },
    iconBtn: {
      borderRadius: 999,
      backgroundColor: colors.surface,
      padding: 0,
    },
    text: {
      fontWeight: "600",
      fontSize: 16,
    },
    iconRight: {
      marginRight: 8,
    },
  });
