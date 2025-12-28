import { StyleSheet } from "react-native";

export const createSettingsStyles = (colors: any) =>
  StyleSheet.create({
    section: {
      marginBottom: 32,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 12,
      marginLeft: 4,
    },
    optionGroup: {
      backgroundColor: colors.card,
      borderRadius: 16,
      overflow: "hidden",
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    optionButton: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      gap: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    optionButtonActive: {
      backgroundColor: colors.primary + "15",
    },
    optionButtonLast: {
      borderBottomWidth: 0,
    },
    optionText: {
      fontSize: 16,
      color: colors.text,
    },
    optionTextActive: {
      fontWeight: "600",
      color: colors.primary,
    },
    notificationContent: {
      flex: 1,
      marginRight: 12,
    },
    optionDescription: {
      fontSize: 13,
      color: colors.textSecondary,
      marginTop: 4,
    },
  });
