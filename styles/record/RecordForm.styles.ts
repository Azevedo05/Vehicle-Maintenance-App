import { StyleSheet } from "react-native";
import { Colors } from "../../contexts/ThemeContext";

export const createRecordFormStyles = (colors: Colors) =>
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
    },
    keyboardView: {
      flex: 1,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      padding: 16,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: "700" as const,
      color: colors.text,
      marginBottom: 16,
    },
    typeGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      marginBottom: 24,
      justifyContent: "space-between",
    },
    typeCard: {
      width: "31%",
      minWidth: 90,
      padding: 12,
      justifyContent: "center",
      alignItems: "center",
      minHeight: 60,
      backgroundColor: colors.surface,
    },
    typeCardSelected: {
      backgroundColor: colors.primary + "15",
      borderColor: colors.primary,
      borderWidth: 2,
    },
    typeLabel: {
      fontSize: 12,
      fontWeight: "600" as const,
      color: colors.textSecondary,
      textAlign: "center",
      flexShrink: 1,
    },
    typeLabelSelected: {
      color: colors.primary,
    },
    form: {
      gap: 16,
    },
    textArea: {
      minHeight: 100,
    },
    footer: {
      padding: 16,
      backgroundColor: colors.background,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
  });
