import React from "react";
import { TouchableOpacity, StyleSheet, ViewStyle } from "react-native";
import { ArrowDownUp, Check } from "lucide-react-native";

import { useTheme } from "@/contexts/ThemeContext";

interface ReorderModeButtonProps {
  isReorderMode: boolean;
  onToggle: () => void;
  disabled?: boolean;
  style?: ViewStyle;
}

/**
 * Button to toggle reorder mode on/off
 * Shows ArrowDownUp icon when inactive
 * Shows Check icon when active
 */
export const ReorderModeButton = ({
  isReorderMode,
  onToggle,
  disabled = false,
  style,
}: ReorderModeButtonProps) => {
  const { colors } = useTheme();

  const styles = createStyles(colors, isReorderMode);

  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.buttonDisabled, style]}
      onPress={onToggle}
      activeOpacity={0.7}
      disabled={disabled}
    >
      {isReorderMode ? (
        <Check size={20} color="#fff" />
      ) : (
        <ArrowDownUp size={20} color={colors.text} />
      )}
    </TouchableOpacity>
  );
};

const createStyles = (colors: any, isActive: boolean) =>
  StyleSheet.create({
    button: {
      width: 40,
      height: 40,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 20, // Circular
      backgroundColor: isActive ? colors.primary : "transparent",
    },
    buttonDisabled: {
      opacity: 0.5,
    },
  });
