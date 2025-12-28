import { StyleSheet } from "react-native";
import { Colors } from "@/contexts/ThemeContext";

export const createNotificationSettingsStyles = (colors: Colors) =>
  StyleSheet.create({
    permissionWarning: {
      fontSize: 13,
      color: colors.warning,
      marginTop: 8,
      marginLeft: 4,
    },
    advancedSettingsButton: {
      flexDirection: "row",
      alignItems: "center",
      padding: 12,
      marginTop: 12,
      backgroundColor: `${colors.primary}10`,
      borderRadius: 8,
      gap: 8,
    },
    advancedSettingsText: {
      flex: 1,
      fontSize: 14,
      fontWeight: "500",
      color: colors.primary,
    },
  });
