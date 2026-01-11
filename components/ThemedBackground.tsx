import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@/contexts/ThemeContext";

const { width, height: screenHeight } = Dimensions.get("screen");

interface ThemedBackgroundProps {
  children?: React.ReactNode;
  style?: any;
}

export const ThemedBackground = ({
  children,
  style,
}: ThemedBackgroundProps) => {
  const { colors } = useTheme();

  // Gradient mimicking the 'Welcome' slide: [background, card, background]
  // This creates a subtle vertical gradient (Black -> Dark Gray -> Black)
  const gradientColors = [
    colors.background,
    colors.card,
    colors.background,
  ] as const;

  return (
    <LinearGradient
      colors={gradientColors}
      style={[
        styles.container,
        { height: screenHeight, backgroundColor: colors.background },
        style,
      ]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {/* Content */}
      <View style={{ flex: 1, zIndex: 1 }}>{children}</View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "hidden",
  },
});
