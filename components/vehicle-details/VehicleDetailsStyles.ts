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
    },
    // ... (rest unchanged)

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
    // ...

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
      marginLeft: 8,
      flexShrink: 0,
    },
    fuelPricePerUnit: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 2,
    },
    // Common Record Styles (Used in multiple sections)
    recordInfo: {
      flex: 1,
      marginRight: 12,
    },
    recordTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      flexShrink: 1,
    },
    recordDate: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 2,
    },
    recordNotes: {
      fontSize: 12,
      color: colors.textSecondary,
      fontStyle: "italic",
      marginTop: 2,
    },
    recordCost: {
      fontSize: 14,
      fontWeight: "700",
      color: colors.text,
      marginTop: 4,
    },

    // Task Specific Styles
    taskInfo: {
      flex: 1,
      marginRight: 12,
    },
    taskTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 4,
    },
    taskDue: {
      fontSize: 14,
      fontWeight: "500",
      color: colors.textSecondary,
    },
    taskOverdue: {
      color: colors.error,
      fontWeight: "700",
    },
    taskWarning: {
      color: colors.warning,
      fontWeight: "700",
    },
    taskScheduled: {
      color: colors.textSecondary,
    },
    overdueTaskCard: {
      borderColor: colors.error,
      borderWidth: 1,
    },
    dueSoonTaskCard: {
      borderColor: colors.warning,
      borderWidth: 1,
    },
    inspectionOverdueCard: {
      borderColor: colors.error,
      borderWidth: 1,
      backgroundColor: colors.error + "10", // Slight reddish tint
    },
    completeButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
    },
    completeButtonText: {
      color: "#FFFFFF",
      fontSize: 13,
      fontWeight: "600",
    },
    timestampText: {
      fontSize: 10,
      color: "#8E8E93",
      fontWeight: "500",
    },
  });
