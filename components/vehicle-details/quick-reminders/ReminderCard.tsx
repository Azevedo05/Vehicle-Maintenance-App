import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Clock, Repeat, Check } from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { Reminder } from "./types";
import { getStatusColor, getStatusText } from "./utils";

interface ReminderCardProps {
  reminder: Reminder;
  onPress: (reminder: Reminder) => void;
  onComplete: (reminder: Reminder) => void;
}

export const ReminderCard = ({
  reminder,
  onPress,
  onComplete,
}: ReminderCardProps) => {
  const { colors } = useTheme();
  const { t } = useLocalization();

  const statusColor = getStatusColor(reminder.dueAt, reminder.type, colors);
  const statusText = getStatusText(reminder, t);
  const isOverdue =
    reminder.type !== "recurring" && reminder.dueAt - Date.now() <= 0;

  return (
    <TouchableOpacity
      style={[
        styles.stickyNote,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          width: reminder.type === "recurring" ? 200 : 160,
        },
      ]}
      activeOpacity={0.7}
      onPress={() => onPress(reminder)}
    >
      <View style={styles.noteHeader}>
        <View
          style={[
            styles.timeTag,
            {
              backgroundColor: isOverdue
                ? statusColor + "15"
                : statusColor + "10",
              borderColor: isOverdue ? statusColor : "transparent",
            },
          ]}
        >
          {reminder.type === "recurring" ? (
            <Repeat size={12} color={statusColor} />
          ) : (
            <Clock size={12} color={statusColor} />
          )}
          <Text style={[styles.timeText, { color: statusColor }]}>
            {statusText}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => onComplete(reminder)}
          style={[
            styles.checkButton,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <Check size={14} color={colors.success} />
        </TouchableOpacity>
      </View>
      <View>
        <Text
          style={[styles.noteText, { color: colors.text }]}
          numberOfLines={1}
        >
          {reminder.text}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  stickyNote: {
    // width set dynamically
    height: 80, // Reduced height for single line
    borderRadius: 20,
    padding: 12,
    justifyContent: "flex-start",
    gap: 8,
    borderWidth: 1,
    // Softer, deeper shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 4,
  },
  noteHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 0,
  },
  timeTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  timeText: {
    fontSize: 11,
    fontWeight: "700",
  },
  checkButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  noteText: {
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
  },
  timestampText: {
    fontSize: 10,
    color: "#8E8E93",
    fontWeight: "500",
  },
});
