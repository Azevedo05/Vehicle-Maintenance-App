import { StyleSheet } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";

export const createNotificationSettingsStyles = (
  colors: ReturnType<typeof useTheme>["colors"]
) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: 16,
      paddingBottom: 16,
      paddingTop: 4,
    },
    section: {
      marginBottom: 4,
      marginTop: 12,
    },
    firstSection: {
      marginTop: 0,
    },
    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 4,
      gap: 8,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
    },
    sectionDescription: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 8,
    },
    timeSelector: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    timeButton: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 8,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
    },
    timeButtonActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    timeButtonText: {
      fontSize: 14,
      fontWeight: "500",
      color: colors.text,
    },
    timeButtonTextActive: {
      color: "#FFFFFF",
    },
    timePickerButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 12,
    },
    timePickerText: {
      fontSize: 24,
      fontWeight: "700",
      color: colors.primary,
    },
    timePickerHint: {
      flex: 1,
      fontSize: 13,
      color: colors.textSecondary,
      textAlign: "right",
    },
    timeList: {
      maxHeight: 300,
      marginBottom: 16,
    },
    timeListItem: {
      padding: 16,
      borderRadius: 8,
      marginBottom: 4,
      backgroundColor: colors.background,
    },
    timeListItemActive: {
      backgroundColor: colors.primary,
    },
    timeListItemText: {
      fontSize: 18,
      fontWeight: "500",
      color: colors.text,
      textAlign: "center",
    },
    timeListItemTextActive: {
      color: "#FFFFFF",
      fontWeight: "700",
    },
    timePickerCancelButton: {
      backgroundColor: colors.background,
      borderRadius: 8,
      padding: 14,
      alignItems: "center",
      borderWidth: 2,
      borderColor: colors.border,
    },
    timePickerCancelButtonText: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
    },
    intervalTags: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    intervalTag: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.primary + "20",
      borderRadius: 20,
      paddingVertical: 8,
      paddingHorizontal: 12,
      gap: 6,
    },
    intervalTagText: {
      fontSize: 14,
      fontWeight: "500",
      color: colors.primary,
    },
    addIntervalButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.card,
      borderRadius: 20,
      paddingVertical: 8,
      paddingHorizontal: 12,
      gap: 4,
      borderWidth: 1,
      borderColor: colors.primary,
      borderStyle: "dashed",
    },
    addIntervalButtonText: {
      fontSize: 14,
      fontWeight: "500",
      color: colors.primary,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
      padding: 16,
    },
    modalContent: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 24,
      width: "100%",
      maxWidth: 400,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 8,
    },
    modalDescription: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 16,
    },
    modalInput: {
      backgroundColor: colors.background,
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 16,
    },
    modalButtons: {
      flexDirection: "row",
      gap: 12,
    },
    modalButton: {
      flex: 1,
      borderRadius: 8,
      padding: 14,
      alignItems: "center",
    },
    modalButtonCancel: {
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
    },
    modalButtonConfirm: {
      backgroundColor: colors.primary,
    },
    modalButtonTextCancel: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
    },
    modalButtonTextConfirm: {
      fontSize: 16,
      fontWeight: "600",
      color: "#FFFFFF",
    },
    input: {
      backgroundColor: colors.card,
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
    },
    helperText: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 4,
    },
    frequencyGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      marginBottom: 8,
    },
    frequencyCard: {
      width: "48%",
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: "center",
      gap: 8,
    },
    frequencyCardActive: {
      borderColor: colors.primary,
      backgroundColor: colors.primary + "10",
    },
    frequencyCardTitle: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.text,
    },
    frequencyCardTitleActive: {
      color: colors.primary,
    },
    frequencyCardDescription: {
      fontSize: 12,
      color: colors.textSecondary,
      textAlign: "center",
    },
    frequencyCardDescriptionActive: {
      color: colors.primary + "80",
    },
    saveButton: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      padding: 16,
      alignItems: "center",
      marginBottom: 24,
    },
    saveButtonText: {
      fontSize: 16,
      fontWeight: "600",
      color: "#FFFFFF",
    },
  });
