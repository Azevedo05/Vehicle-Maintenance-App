import React from "react";
import {
  View,
  Text,
  TextInput,
  TextInputProps,
  StyleSheet,
  ViewStyle,
} from "react-native";
import { useTheme } from "@/contexts/ThemeContext";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  required?: boolean;
  containerStyle?: ViewStyle;
}

export const Input = ({
  label,
  error,
  required,
  containerStyle,
  style,
  ...props
}: InputProps) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={styles.label}>
          {label} {required && <Text style={styles.required}>*</Text>}
        </Text>
      )}
      <TextInput
        style={[
          styles.input,
          isFocused && {
            borderColor: colors.primary,
            backgroundColor: colors.primary + "05", // Very subtle tint
          },
          error ? { borderColor: colors.error } : null,
          style,
        ]}
        placeholderTextColor={colors.placeholder}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      gap: 8,
    },
    label: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
    },
    required: {
      color: colors.error,
    },
    input: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      fontSize: 16,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
    },
    errorText: {
      color: colors.error,
      fontSize: 12,
      marginTop: 4,
    },
  });
