import { StyleSheet } from "react-native";
import { Colors } from "@/contexts/ThemeContext";

export const createInsuranceSectionStyles = (colors: Colors) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 20,
      marginTop: 24,
      marginBottom: 8,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    title: {
      fontSize: 22,
      fontWeight: "800",
      color: colors.text,
      letterSpacing: 0.5,
    },
    editButton: {
      width: 36,
      height: 36,
      borderRadius: 12,
      backgroundColor: colors.primary + "15",
      justifyContent: "center",
      alignItems: "center",
    },
    headerAddButton: {
      backgroundColor: colors.primary,
      width: 32,
      height: 32,
      borderRadius: 16,
      justifyContent: "center",
      alignItems: "center",
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: "hidden",
    },
    // ... (header status stuff remains)

    // Coverages List (New)
    coveragesContainer: {
      marginTop: 8,
      backgroundColor: colors.background,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border + "40",
      overflow: "hidden",
    },
    coverageItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border + "40",
    },
    coverageIcon: {
      width: 32,
      height: 32,
      borderRadius: 8,
      backgroundColor: colors.primary + "10",
      justifyContent: "center",
      alignItems: "center",
    },
    coverageDetails: {
      flex: 1,
    },
    coverageName: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.text,
    },
    coverageMeta: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 2,
    },
    // Card Header (Provider)
    cardHeader: {
      backgroundColor: colors.primary + "10",
      padding: 20,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    providerName: {
      fontSize: 20,
      fontWeight: "800",
      color: colors.text,
      letterSpacing: 0.5,
    },
    statusBadge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: "transparent",
    },
    statusBadgeActive: {
      backgroundColor: "#10B981" + "15",
      borderColor: "#10B981" + "30",
    },
    statusBadgePending: {
      backgroundColor: "#F59E0B" + "15",
      borderColor: "#F59E0B" + "30",
    },
    statusBadgeExpired: {
      backgroundColor: "#EF4444" + "15",
      borderColor: "#EF4444" + "30",
    },
    statusText: {
      fontSize: 11,
      fontWeight: "700",
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    statusTextActive: { color: "#10B981" },
    statusTextPending: { color: "#F59E0B" },
    statusTextExpired: { color: "#EF4444" },

    // Card Body
    cardBody: {
      padding: 20,
      gap: 20,
    },
    sectionTitle: {
      fontSize: 13,
      fontWeight: "700",
      color: colors.textSecondary,
      textTransform: "uppercase",
      letterSpacing: 1,
      marginBottom: 12,
    },

    // Detail Row Layout
    detailRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border + "40",
    },
    detailLabel: {
      fontSize: 14,
      color: colors.textSecondary,
      flex: 1,
    },
    detailValueContainer: {
      flex: 1,
      alignItems: "flex-end",
    },
    detailValue: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.text,
      textAlign: "right",
    },
    detailSubValue: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 2,
    },

    // Expiry Warning
    expiryWarning: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginTop: 12,
      paddingVertical: 10,
      paddingHorizontal: 14,
      borderRadius: 12,
    },
    expiryWarningGreen: {
      backgroundColor: "#10B981" + "15",
    },
    expiryWarningYellow: {
      backgroundColor: "#F59E0B" + "15",
    },
    expiryWarningRed: {
      backgroundColor: "#EF4444" + "15",
    },
    expiryWarningText: {
      fontSize: 13,
      fontWeight: "600",
    },
    expiryTextGreen: { color: "#10B981" },
    expiryTextYellow: { color: "#F59E0B" },
    expiryTextRed: { color: "#EF4444" },

    // Footer / Edit
    cardFooter: {
      padding: 16,
      backgroundColor: colors.background,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      alignItems: "center",
    },
    editButtonFull: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      opacity: 0.6,
    },
    editButtonText: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.textSecondary,
    },

    // Empty State
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
    emptyDescription: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: "center",
    },
  });
