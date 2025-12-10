import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { ArrowUp } from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useLocalization } from "@/contexts/LocalizationContext";

interface VehicleListFooterProps {
  onScrollToTop: () => void;
  visible: boolean;
}

export const VehicleListFooter = ({
  onScrollToTop,
  visible,
}: VehicleListFooterProps) => {
  const { colors } = useTheme();
  const { t } = useLocalization();

  if (!visible) return <View style={{ height: 20 }} />;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: colors.card, shadowColor: colors.shadow },
        ]}
        onPress={onScrollToTop}
        activeOpacity={0.7}
      >
        <ArrowUp size={16} color={colors.primary} />
        <Text style={[styles.text, { color: colors.primary }]}>
          {t("common.back_to_top", "Back to Top")}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingBottom: 0,
    paddingHorizontal: 0, // Reset horizontal padding
    flexDirection: "row", // Enable row layout
    paddingRight: 96, // 16 (left) + 56 (fab) + 24 (right margin) = ~96 space reserved?
    // Actually FAB is right: 24. Width 56. So it ends at 24 from right, starts at 80 from right.
    // We want some gap. Say 16px gap. So paddingRight should be 80 + 16 = 96.
    // But wait, the list has paddingHorizontal: 16.
    // So the footer width is (Screen - 32).
    // The FAB is relative to Screen.
    // FAB Right edge is at Screen - 24.
    // FAB Left edge is at Screen - 80.
    // Footer Right edge is at Screen - 16.
    // We want Footer Button Right edge to be at Screen - 96 (80 + 16 gap).
    // So we need margin/padding right of (Screen - 16) - (Screen - 96) = 80.
    // So paddingRight: 80.
  },
  button: {
    flex: 1, // Extend horizontally
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center", // Center content
    gap: 8,
    height: 56, // Match FAB height
    borderRadius: 28, // Fully rounded (56/2)
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "transparent",
    // Add shadow to match FAB if desired, or keep flat/card style
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  text: {
    fontSize: 14,
    fontWeight: "600",
  },
});
