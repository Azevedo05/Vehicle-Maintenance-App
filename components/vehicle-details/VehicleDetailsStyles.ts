import { StyleSheet } from "react-native";

export const createVehicleDetailsStyles = (colors: any) =>
  StyleSheet.create({
    section: {
      marginTop: 10,
      paddingHorizontal: 20,
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 22,
      fontWeight: "800",
      color: colors.text,
      marginBottom: 8,
      letterSpacing: 0.5,
    },
    addButton: {
      backgroundColor: colors.primary,
      width: 32,
      height: 32,
      borderRadius: 16,
      justifyContent: "center",
      alignItems: "center",
    },
    emptyCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 32,
      alignItems: "center",
      justifyContent: "center",
      gap: 12,
      borderWidth: 1,
      borderColor: colors.border,
      borderStyle: "dashed",
    },
    emptyText: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: "center",
    },
    // Task/Maintenance Styles
    taskCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    dueTaskCard: {
      borderColor: colors.warning,
      backgroundColor: colors.warning + "05",
    },
    taskInfo: {
      flex: 1,
      marginRight: 12,
    },
    taskTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 4,
    },
    taskDue: {
      fontSize: 14,
      fontWeight: "500",
    },
    taskOverdue: {
      color: colors.error,
      fontWeight: "700",
    },
    taskScheduled: {
      color: colors.textSecondary,
    },
    completeButton: {
      backgroundColor: colors.primary + "15",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.primary + "30",
    },
    completeButtonText: {
      color: colors.primary,
      fontSize: 12,
      fontWeight: "600",
    },
    // Record/History Styles
    recordCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderWidth: 1,
      borderColor: colors.border,
    },
    recordInfo: {
      flex: 1,
      marginRight: 12,
    },
    recordTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 4,
    },
    recordDate: {
      fontSize: 13,
      color: colors.textSecondary,
      marginBottom: 2,
    },
    recordCost: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.primary,
      marginTop: 2,
    },
    recordNotes: {
      fontSize: 13,
      color: colors.textSecondary,
      fontStyle: "italic",
      marginTop: 4,
    },
    // Fuel Styles
    fuelCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderWidth: 1,
      borderColor: colors.border,
    },
    fuelRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 4,
    },
    fuelVolume: {
      fontSize: 14,
      fontWeight: "700",
      color: colors.text,
    },
    fuelPricePerUnit: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 2,
    },
  });
