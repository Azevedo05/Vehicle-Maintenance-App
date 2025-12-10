import { StyleSheet } from "react-native";

export const createStyles = (colors: any) =>
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
      paddingBottom: 100,
    },
    header: {
      paddingTop: 8,
      marginBottom: 16,
    },
    screenTitle: {
      fontSize: 28,
      fontWeight: "700",
      color: colors.text,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 12,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    cardGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
    },
    cardHalf: {
      width: "48%",
    },
    cardLabel: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 4,
    },
    cardValue: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.text,
    },
    cardSubtext: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 4,
    },
    cardSpacing: {
      marginBottom: 12,
    },
    listItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 12,
    },
    listItemBorder: {
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    listItemLeft: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    listItemTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 2,
    },
    listItemSubtitle: {
      fontSize: 13,
      color: colors.textSecondary,
    },
    listItemRight: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    listItemValue: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
    },
    typeItem: {
      flexDirection: "column",
      alignItems: "stretch",
      paddingVertical: 10,
    },
    typeHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 2,
    },
    typeTitleRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    typeCountHeader: {
      fontSize: 14,
      color: colors.textSecondary,
      fontWeight: "500",
      marginBottom: 2, // Match title alignment
    },
    typeBreakdown: {
      fontSize: 13,
      color: colors.textSecondary,
      marginTop: 2,
    },
    categoryRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    },
    categoryDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
      marginRight: 8,
    },
    chipRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      marginBottom: 16,
    },
    chip: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 999,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
    },
    rangeRow: {
      flexDirection: "row",
      backgroundColor: colors.card,
      borderRadius: 8,
      padding: 4,
      marginBottom: 16,
    },
    rangeChip: {
      flex: 1,
      paddingVertical: 6,
      alignItems: "center",
      borderRadius: 6,
    },
    rangeChipActive: {
      backgroundColor: colors.background,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    rangeChipText: {
      fontSize: 13,
      color: colors.textSecondary,
      fontWeight: "500",
    },
    rangeChipTextActive: {
      color: colors.text,
      fontWeight: "600",
    },
    fuelStatsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      gap: 6,
      marginBottom: 8,
    },
    fuelStatCard: {
      width: "49%",
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 12,
      borderWidth: 1,
      borderColor: colors.border,
      minHeight: 85,
      justifyContent: "space-between",
    },

    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 24,
      marginTop: 40,
      minHeight: 300,
    },
    emptyTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
      marginTop: 16,
      marginBottom: 8,
      textAlign: "center",
    },
    emptyText: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: "center",
      lineHeight: 20,
    },
  });
