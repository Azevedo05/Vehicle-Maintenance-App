import React from "react";
import {
  Pressable,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { LucideIcon } from "lucide-react-native";

interface ChipProps {
  label: string;
  active?: boolean;
  onPress: () => void;
  icon?: LucideIcon;
  iconColor?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Chip = ({
  label,
  active,
  onPress,
  icon: Icon,
  iconColor,
  style,
  textStyle,
}: ChipProps) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.chip,
        style,
        active && styles.chipActive,
        pressed && { opacity: 0.7 },
      ]}
      onPress={onPress}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      {Icon && (
        <Icon
          size={16}
          color={active ? "#FFFFFF" : iconColor || colors.textSecondary}
          style={styles.icon}
        />
      )}
      <Text
        style={[
          styles.text,
          active && styles.textActive,
          active && { color: "#FFFFFF" },
          textStyle,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
};

const createStyles = (colors: any) =>
  StyleSheet.create({
    chip: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 12,
      backgroundColor: colors.surface,
    },
    chipActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    icon: {
      marginRight: 8,
    },
    text: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.text,
    },
    textActive: {
      color: "#FFFFFF",
    },
  });
