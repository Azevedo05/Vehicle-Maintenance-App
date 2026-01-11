import { StyleSheet } from "react-native";
import { Colors } from "@/contexts/ThemeContext";

export const createAddInsuranceModalStyles = (colors: Colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerButton: {
      width: 44,
      height: 44,
      justifyContent: "center",
      alignItems: "center",
    },
    headerTitle: {
      fontSize: 17,
      fontWeight: "700",
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
    form: {
      gap: 16,
    },
    section: {
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
      fontSize: 16,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
    },
    textArea: {
      minHeight: 100,
      textAlignVertical: "top",
    },
    datesRow: {
      flexDirection: "row",
      gap: 12,
    },
    dateField: {
      flex: 1,
    },
    dateButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      padding: 16,
      borderRadius: 12,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    dateButtonText: {
      fontSize: 16,
      color: colors.text,
      fontWeight: "500",
    },
    chipsRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    notesInput: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      padding: 16,
      fontSize: 16,
      color: colors.text,
      minHeight: 100,
      textAlignVertical: "top",
    },
    // Date Picker Modal
    datePickerOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    datePickerContent: {
      backgroundColor: colors.card,
      borderRadius: 20,
      padding: 20,
      width: "90%",
      maxWidth: 350,
    },
    datePickerDone: {
      alignSelf: "center",
      marginTop: 12,
      paddingHorizontal: 24,
      paddingVertical: 10,
      borderRadius: 12,
      backgroundColor: colors.primary,
    },
    datePickerDoneText: {
      fontSize: 15,
      fontWeight: "700",
      color: "#FFFFFF",
    },
  });
