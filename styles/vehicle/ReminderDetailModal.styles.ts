import { StyleSheet, Dimensions } from "react-native";
import { Colors } from "../../contexts/ThemeContext";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const createReminderDetailStyles = (colors: Colors, isDark: boolean) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 24,
    },
    backdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0,0,0,0.6)",
    },
    modalContainer: {
      width: "100%",
      borderRadius: 24,
      overflow: "hidden",
      padding: 20,
      elevation: 10,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 10,
      backgroundColor: isDark ? "#1C1C1E" : "#FFFFFF",
      maxHeight: "80%",
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
    },
    titleContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    titleIcon: {
      marginRight: 8,
    },
    title: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
    },
    closeButton: {
      padding: 4,
    },
    content: {
      gap: 16,
    },
    menuGroup: {
      backgroundColor: isDark ? "#2C2C2E" : colors.surface,
      borderRadius: 16,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: colors.border,
    },
    menuRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    menuRowLast: {
      borderBottomWidth: 0,
    },
    menuLabelRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    menuLabel: {
      fontSize: 15,
      color: colors.text,
      fontWeight: "500",
    },
    menuValue: {
      fontSize: 15,
      color: colors.textSecondary,
      fontWeight: "600",
    },
    timestampContainer: {
      gap: 4,
      flex: 1,
      marginTop: 4,
    },
    timestampText: {
      fontSize: 12,
      color: colors.textSecondary,
      fontWeight: "500",
      textAlign: "right",
    },
    sectionLabel: {
      fontSize: 13,
      fontWeight: "600",
      color: colors.textSecondary,
      marginBottom: 8,
      marginTop: 16,
      marginLeft: 4,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    descriptionInputContainer: {
      backgroundColor: isDark ? "#2C2C2E" : colors.surface,
      borderRadius: 16,
      padding: 12,
      minHeight: 120,
      borderWidth: 1,
      borderColor: colors.border,
    },
    descriptionInput: {
      fontSize: 16,
      color: colors.text,
      lineHeight: 24,
      textAlign: "left",
      textAlignVertical: "top",
      padding: 0,
      minHeight: 100,
    },
    actionButton: {
      marginTop: 24,
      paddingVertical: 14,
      borderRadius: 16,
      alignItems: "center",
      backgroundColor: colors.primary,
    },
    actionButtonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "700",
    },
    absoluteFill: {
      ...StyleSheet.absoluteFillObject,
    },
  });
