import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useTheme } from "@/contexts/ThemeContext";

interface TimePickerProps {
  value: Date;
  onChange: (date: Date) => void;
}

export const TimePicker = ({ value, onChange }: TimePickerProps) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [showAndroidPicker, setShowAndroidPicker] = useState(false);

  const onTimeChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowAndroidPicker(false);
    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  const formattedTime = value.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  if (Platform.OS === "android") {
    return (
      <View style={styles.androidContainer}>
        <TouchableOpacity
          style={styles.timeButton}
          onPress={() => setShowAndroidPicker(true)}
        >
          <Text style={styles.timeText}>{formattedTime}</Text>
        </TouchableOpacity>

        {showAndroidPicker && (
          <DateTimePicker
            testID="timePicker"
            value={value}
            mode="time"
            display="default" // Uses standard Android dialog (Clock/Spinner based on OS pref)
            is24Hour={true}
            onChange={onTimeChange}
          />
        )}
      </View>
    );
  }

  // iOS Implementation (Inline Spinner)
  return (
    <View style={styles.timePickerContainer}>
      <DateTimePicker
        value={value}
        mode="time"
        display="spinner"
        is24Hour={true}
        onChange={onTimeChange}
        textColor={colors.text}
        themeVariant={colors.background === "#000000" ? "dark" : "light"}
        style={styles.datePicker}
      />
    </View>
  );
};

const createStyles = (colors: any) =>
  StyleSheet.create({
    timePickerContainer: {
      alignItems: "center",
      marginBottom: 12,
      backgroundColor: colors.card,
    },
    datePicker: {
      height: 120,
      width: "100%",
    },
    // Android specific styles
    androidContainer: {
      alignItems: "center",
      marginBottom: 20,
      marginTop: 10,
    },
    timeButton: {
      backgroundColor: colors.card,
      paddingVertical: 16,
      paddingHorizontal: 32,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.primary,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
    timeText: {
      fontSize: 32,
      fontWeight: "700",
      color: colors.text,
      letterSpacing: 1,
    },
  });
