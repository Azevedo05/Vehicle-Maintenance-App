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

    // Card Header (Gradient) — used on the main card AND the modal header
    cardHeaderGradient: {
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    cardHeaderGradientInner: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    providerName: {
      fontSize: 22,
      fontWeight: "800",
      color: "#FFFFFF",
      letterSpacing: 0.5,
    },

    // Progress Bar
    progressContainer: {
      height: 6,
      backgroundColor: "rgba(255,255,255,0.3)",
      borderRadius: 3,
      overflow: "hidden",
      marginBottom: 4,
    },
    progressBar: {
      height: "100%",
      backgroundColor: "#FFFFFF",
      borderRadius: 3,
    },
    progressLabels: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    progressLabelText: {
      fontSize: 12,
      color: "rgba(255,255,255,0.9)",
      fontWeight: "500",
    },

    // Status badges
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
    statusTextActive: { color: "#FFFFFF" },
    statusTextPending: { color: "#FFFFFF" },
    statusTextExpired: { color: "#FFFFFF" },

    // ─── Modal Styles ─────────────────────────────────
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.text,
    },

    // Modal gradient header (inside the bottom sheet)
    modalGradientHeader: {
      borderRadius: 16,
      overflow: "hidden",
      marginBottom: 20,
    },

    // Section cards (grouped rows inside the modal)
    modalSectionCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 4,
      marginBottom: 16,
    },
    modalSectionTitle: {
      fontSize: 13,
      fontWeight: "700",
      color: colors.textSecondary,
      textTransform: "uppercase",
      letterSpacing: 1,
      marginBottom: 10,
    },

    // Detail row with icon (inside section card)
    modalDetailRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 12,
      paddingHorizontal: 14,
      gap: 14,
    },
    modalDetailIcon: {
      width: 34,
      height: 34,
      borderRadius: 10,
      backgroundColor: colors.primary + "12",
      justifyContent: "center",
      alignItems: "center",
    },
    modalDetailContent: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 12,
    },
    modalDetailLabel: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    modalDetailValue: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.text,
      textAlign: "right",
    },
    modalDetailSubValue: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 2,
      textAlign: "right",
    },
    modalDetailValueColumn: {
      alignItems: "flex-end",
    },
    modalDetailSeparator: {
      height: 1,
      backgroundColor: colors.border + "60",
      marginLeft: 62,
    },

    // Coverage type badge (chip)
    coverageBadge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 8,
      backgroundColor: colors.primary + "15",
      borderWidth: 1,
      borderColor: colors.primary + "30",
    },
    coverageBadgeText: {
      fontSize: 12,
      fontWeight: "700",
      color: colors.primary,
    },

    // Expiry Warning
    expiryWarning: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      paddingVertical: 10,
      paddingHorizontal: 14,
      borderRadius: 12,
      marginBottom: 16,
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

    // Emergency Contact Card
    emergencyCard: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.card,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 16,
      marginBottom: 16,
      gap: 14,
    },
    emergencyCardIcon: {
      width: 42,
      height: 42,
      borderRadius: 12,
      backgroundColor: "#10B981" + "15",
      justifyContent: "center",
      alignItems: "center",
    },
    emergencyCardContent: {
      flex: 1,
    },
    emergencyCardLabel: {
      fontSize: 12,
      color: colors.textSecondary,
      marginBottom: 2,
    },
    emergencyCardNumber: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.text,
    },
    emergencyCallButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: "#10B981",
    },
    emergencyCallText: {
      color: "#FFFFFF",
      fontSize: 13,
      fontWeight: "600",
    },

    // Coverages List
    coveragesContainer: {
      marginTop: 8,
      backgroundColor: colors.card,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
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

    // Notes card
    notesCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 16,
      marginBottom: 16,
    },
    notesText: {
      fontSize: 14,
      color: colors.text,
      lineHeight: 20,
    },

    // Pay button (green CTA)
    payButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#10B981",
      paddingVertical: 14,
      borderRadius: 16,
      gap: 10,
      marginBottom: 16,
    },
    payButtonText: {
      color: "#FFFFFF",
      fontSize: 15,
      fontWeight: "700",
    },

    // Edit button (outlined / secondary)
    editOutlinedButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 14,
      borderRadius: 16,
      borderWidth: 1.5,
      borderColor: colors.primary,
      gap: 10,
      marginTop: 20,
    },
    editOutlinedButtonText: {
      color: colors.primary,
      fontSize: 15,
      fontWeight: "700",
    },

    // Card Body (legacy — kept for backward compat)
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

    // Legacy detail row (kept for backward compat)
    detailRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 12,
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

    // Legacy buttons (kept for card-level usage)
    emergencyContactButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.primary,
      paddingVertical: 14,
      borderRadius: 12,
      gap: 10,
      marginTop: 8,
      marginBottom: 4,
    },
    emergencyContactText: {
      color: "#FFFFFF",
      fontSize: 15,
      fontWeight: "700",
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
    headerAction: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: "rgba(255,255,255,0.12)",
      justifyContent: "center",
      alignItems: "center",
    },
  });
