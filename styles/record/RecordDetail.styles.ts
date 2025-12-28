import { StyleSheet } from "react-native";
import { Colors } from "@/contexts/ThemeContext";

export const createRecordDetailStyles = (colors: Colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    errorContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
      backgroundColor: colors.background,
    },
    errorText: {
      fontSize: 18,
      fontWeight: "600" as const,
      color: colors.text,
      marginTop: 16,
      marginBottom: 24,
    },
    errorButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 12,
    },
    errorButtonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "600" as const,
    },
    headerButton: {
      padding: 8,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      padding: 16,
    },
    headerCard: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    title: {
      fontSize: 24,
      fontWeight: "700" as const,
      color: colors.text,
      marginBottom: 8,
    },
    type: {
      fontSize: 16,
      color: colors.primary,
      fontWeight: "600" as const,
      marginBottom: 4,
    },
    vehicle: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    detailsCard: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 16,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    detailRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primary + "15",
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    detailContent: {
      flex: 1,
    },
    detailLabel: {
      fontSize: 12,
      color: colors.textSecondary,
      marginBottom: 4,
      textTransform: "uppercase",
      fontWeight: "600" as const,
    },
    detailValue: {
      fontSize: 16,
      color: colors.text,
      fontWeight: "500" as const,
    },
  });
