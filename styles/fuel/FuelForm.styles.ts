import { StyleSheet } from "react-native";
import { Colors } from "@/contexts/ThemeContext";

export const createFuelFormStyles = (colors: Colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
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
    form: {
      gap: 16,
    },
    inputGroup: {
      gap: 8,
    },
    label: {
      fontSize: 16,
      fontWeight: "600" as const,
      color: colors.text,
    },
    dangerZone: {
      marginTop: 24,
      marginBottom: 8,
    },
    deleteButton: {
      backgroundColor: colors.error + "15",
      borderRadius: 12,
      padding: 16,
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.error + "30",
    },
    deleteButtonText: {
      color: colors.error,
      fontSize: 16,
      fontWeight: "600" as const,
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
    textArea: {
      minHeight: 100,
    },
    typeRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    typeChip: {
      // Custom style override if needed
    },
    row: {
      flexDirection: "row",
      gap: 12,
    },
    rowItem: {
      flex: 1,
    },
    suggestionsContainer: {
      marginTop: 4,
      backgroundColor: colors.surface,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: "hidden",
    },
    suggestionItem: {
      padding: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    suggestionText: {
      fontSize: 14,
      color: colors.text,
    },
  });
