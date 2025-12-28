import { StyleSheet } from "react-native";
import { Colors } from "@/contexts/ThemeContext";

export const createBulkOperationsStyles = (colors: Colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      padding: 16,
      paddingBottom: 32,
      gap: 16,
    },
    header: {
      gap: 6,
    },
    title: {
      fontSize: 28,
      fontWeight: "700" as const,
      color: colors.text,
    },
    subtitle: {
      fontSize: 15,
      color: colors.textSecondary,
      lineHeight: 20,
    },
    statsRow: {
      flexDirection: "row",
      gap: 12,
    },
    statCard: {
      flex: 1,
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 6,
    },
    statLabel: {
      fontSize: 13,
      color: colors.textSecondary,
    },
    statValue: {
      fontSize: 20,
      fontWeight: "700" as const,
      color: colors.text,
    },
    selectionBar: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 4,
    },
    selectionText: {
      color: colors.textSecondary,
    },
    selectionActions: {
      flexDirection: "row",
      gap: 16,
    },
    selectionActionText: {
      color: colors.primary,
      fontWeight: "600" as const,
    },
    listCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 8,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 8,
    },
    listItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      padding: 12,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    listItemSelected: {
      borderColor: colors.primary,
      backgroundColor: colors.primary + "10",
    },
    listItemArchived: {
      opacity: 0.6,
    },
    checkbox: {
      width: 24,
      height: 24,
      borderRadius: 8,
      borderWidth: 2,
      borderColor: colors.border,
      justifyContent: "center",
      alignItems: "center",
    },
    checkboxActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    itemContent: {
      flex: 1,
      gap: 4,
      minWidth: 0,
    },
    itemHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    itemTitle: {
      fontSize: 16,
      fontWeight: "600" as const,
      color: colors.text,
      flex: 1,
    },
    archivedTag: {
      fontSize: 12,
      color: colors.warning,
      fontWeight: "600" as const,
    },
    itemSubtitle: {
      fontSize: 13,
      color: colors.textSecondary,
    },
    actionsSection: {
      gap: 12,
    },
    actionButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      paddingVertical: 14,
      borderRadius: 12,
      backgroundColor: colors.primary,
    },
    actionButtonSecondary: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      paddingVertical: 14,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.primary,
      backgroundColor: "transparent",
    },
    deleteButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      paddingVertical: 14,
      borderRadius: 12,
      backgroundColor: colors.error,
    },
    actionButtonText: {
      color: "#FFFFFF",
      fontWeight: "700" as const,
    },
    actionButtonSecondaryText: {
      color: colors.primary,
      fontWeight: "700" as const,
    },
    deleteButtonText: {
      color: "#FFFFFF",
      fontWeight: "700" as const,
    },
    actionButtonDisabled: {
      opacity: 0.5,
    },
  });
