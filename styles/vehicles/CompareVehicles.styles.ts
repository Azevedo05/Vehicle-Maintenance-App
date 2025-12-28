import { StyleSheet } from "react-native";
import { Colors } from "@/contexts/ThemeContext";

export const createCompareVehiclesStyles = (colors: Colors) =>
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
    selectionInfo: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    selectionText: {
      fontSize: 15,
      color: colors.textSecondary,
    },
    clearButton: {
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    clearButtonDisabled: {
      opacity: 0.4,
    },
    clearButtonText: {
      fontSize: 14,
      fontWeight: "600" as const,
      color: colors.text,
    },
    clearButtonTextDisabled: {
      color: colors.textSecondary,
    },
    listCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 8,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 8,
    },
    emptyList: {
      alignItems: "center",
      paddingVertical: 32,
      gap: 12,
    },
    emptyListText: {
      color: colors.textSecondary,
      textAlign: "center",
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
    itemInfo: {
      flex: 1,
      minWidth: 0,
      gap: 4,
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
    itemCategory: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    comparisonSection: {
      gap: 12,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: "700" as const,
      color: colors.text,
    },
    comparisonEmpty: {
      padding: 20,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.card,
    },
    comparisonEmptyText: {
      textAlign: "center",
      color: colors.textSecondary,
      lineHeight: 20,
    },
    comparisonCards: {
      gap: 10,
    },
    comparisonCard: {
      width: 220,
      paddingVertical: 12,
      paddingHorizontal: 8,
      borderRadius: 16,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 10,
    },
    cardName: {
      fontSize: 17,
      fontWeight: "700" as const,
      color: colors.text,
      marginBottom: 6,
    },
    metricRow: {
      marginTop: 4,
      width: "100%",
      paddingHorizontal: 2,
    },
    metricLabel: {
      fontSize: 11,
      color: colors.textSecondary,
      textAlign: "left",
    },
    metricValue: {
      fontSize: 15,
      fontWeight: "700" as const,
      color: colors.text,
      textAlign: "right",
      marginTop: 0,
    },
  });
