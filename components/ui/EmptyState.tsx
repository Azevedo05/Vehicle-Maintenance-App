import React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  style?: ViewStyle;
}

export const EmptyState = ({
  icon,
  title,
  description,
  style,
}: EmptyStateProps) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, style]}>
      <View style={styles.iconContainer}>{icon}</View>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.description, { color: colors.textSecondary }]}>
        {description}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingVertical: 40,
    minHeight: 300,
  },
  iconContainer: {
    marginBottom: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
    textAlign: "center",
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 24,
    maxWidth: 300,
  },
});
