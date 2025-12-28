import { StyleSheet } from "react-native";
import { Colors } from "@/contexts/ThemeContext";

export const createDataManagementStyles = (colors: Colors) =>
  StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
      padding: 16,
    },
    modalCard: {
      width: "100%",
      maxWidth: 400,
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 24,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 5,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 8,
      textAlign: "center",
    },
    modalDescription: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: "center",
      marginBottom: 24,
    },
    modalCategoryButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 16,
      backgroundColor: colors.background,
      borderRadius: 12,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    modalCategoryText: {
      fontSize: 16,
      fontWeight: "500",
      color: colors.text,
      marginBottom: 0,
    },
    modalCloseButton: {
      marginTop: 16,
      padding: 16,
      alignItems: "center",
    },
    modalCloseButtonText: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.textSecondary,
    },
  });
