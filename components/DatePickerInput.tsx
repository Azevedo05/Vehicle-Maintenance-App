import React, { useState } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useTheme } from "@/contexts/ThemeContext";

interface DatePickerInputProps {
  label: string;
  value: Date;
  onChange: (date: Date) => void;
  mode?: "date" | "time" | "datetime";
  maximumDate?: Date;
  minimumDate?: Date;
  required?: boolean;
}

export default function DatePickerInput({
  label,
  value,
  onChange,
  mode = "date",
  maximumDate,
  minimumDate,
  required = false,
}: DatePickerInputProps) {
  const { colors } = useTheme();
  const [show, setShow] = useState(false);

  const handleChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    // On Android, the picker closes automatically
    if (Platform.OS === "android") {
      setShow(false);
    }

    if (event.type === "set" && selectedDate) {
      onChange(selectedDate);
    }
  };

  const formatDate = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatTime = (date: Date): string => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const formatDateTime = (date: Date): string => {
    return `${formatDate(date)} ${formatTime(date)}`;
  };

  const getFormattedValue = (): string => {
    switch (mode) {
      case "time":
        return formatTime(value);
      case "datetime":
        return formatDateTime(value);
      default:
        return formatDate(value);
    }
  };

  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label} {required && <Text style={styles.required}>*</Text>}
      </Text>

      <TouchableOpacity
        style={styles.input}
        onPress={() => setShow(true)}
        activeOpacity={0.7}
      >
        <Text style={styles.inputText}>{getFormattedValue()}</Text>
      </TouchableOpacity>

      {show && (
        <DateTimePicker
          value={value}
          mode={mode}
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleChange}
          maximumDate={maximumDate}
          minimumDate={minimumDate}
          // iOS specific: show cancel button
          {...(Platform.OS === "ios" && {
            onTouchCancel: () => setShow(false),
          })}
        />
      )}

      {/* iOS: Show done button */}
      {show && Platform.OS === "ios" && (
        <View style={styles.iosButtonContainer}>
          <TouchableOpacity
            style={[styles.iosButton, { backgroundColor: colors.primary }]}
            onPress={() => setShow(false)}
          >
            <Text style={styles.iosButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof useTheme>["colors"]) =>
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
      borderWidth: 1,
      borderColor: colors.border,
    },
    inputText: {
      fontSize: 16,
      color: colors.text,
      fontWeight: "500",
    },
    iosButtonContainer: {
      marginTop: 8,
      alignItems: "flex-end",
    },
    iosButton: {
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8,
    },
    iosButtonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "600",
    },
  });
