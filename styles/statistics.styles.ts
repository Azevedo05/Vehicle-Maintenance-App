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
      paddingBottom: 24,
    },
    header: {
      paddingTop: 8,
      marginBottom: 16,
    },
    screenTitle: {
      fontSize: 28,
      fontWeight: "700" as const,
      color: colors.text,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: "700" as const,
      color: colors.text,
      marginBottom: 12,
    },
    cardGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 20,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    cardHalf: {
      width: "48%",
      minWidth: 150,
    },
    cardLabel: {
      fontSize: 13,
      color: colors.textSecondary,
      marginBottom: 8,
      fontWeight: "500" as const,
    },
    cardValue: {
      fontSize: 24,
      fontWeight: "700" as const,
      color: colors.text,
    },
    cardSubtext: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 4,
    },
    chart: {
      flexDirection: "row",
      alignItems: "flex-end",
      justifyContent: "space-between",
      height: 180,
    },
    chartColumn: {
      flex: 1,
      alignItems: "center",
      justifyContent: "flex-end",
    },
    chartBarContainer: {
      height: 150,
      justifyContent: "flex-end",
      alignItems: "center",
      width: "80%",
    },
    chartBar: {
      width: "100%",
      borderTopLeftRadius: 4,
      borderTopRightRadius: 4,
      minHeight: 4,
    },
    chartLabel: {
      fontSize: 10,
      color: colors.textSecondary,
      marginTop: 8,
      textAlign: "center",
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
      flex: 1,
      marginRight: 12,
    },
    categoryRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    categoryDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
    },
    listItemRight: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    listItemTitle: {
      fontSize: 16,
      fontWeight: "600" as const,
      color: colors.text,
      marginBottom: 4,
    },
    listItemSubtitle: {
      fontSize: 13,
      color: colors.textSecondary,
    },
    listItemValue: {
      fontSize: 17,
      fontWeight: "700" as const,
      color: colors.primary,
    },
    typeItem: {
      paddingVertical: 12,
    },
    typeHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 6,
    },
    typeTitleRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    typeCountHeader: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    typeBreakdown: {
      fontSize: 13,
      color: colors.textSecondary,
      lineHeight: 18,
    },
    insightsCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 20,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
      gap: 16,
    },
    insightItem: {
      paddingVertical: 8,
    },
    insightContent: {
      flex: 1,
    },
    insightTitle: {
      fontSize: 13,
      color: colors.textSecondary,
      marginBottom: 4,
      fontWeight: "500" as const,
    },
    insightText: {
      fontSize: 16,
      fontWeight: "600" as const,
      color: colors.text,
    },
    emptyContainer: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 60,
      paddingHorizontal: 40,
    },
    emptyIcon: {
      fontSize: 64,
      marginBottom: 16,
    },
    emptyTitle: {
      fontSize: 20,
      fontWeight: "700" as const,
      color: colors.text,
      marginBottom: 8,
      textAlign: "center",
    },
    emptyText: {
      fontSize: 15,
      color: colors.textSecondary,
      textAlign: "center",
      lineHeight: 22,
    },
    chipRow: {
      gap: 8,
      paddingVertical: 4,
      paddingRight: 16,
    },
    chip: {
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.card,
      marginRight: 8,
    },
    chipActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    chipText: {
      color: colors.text,
      fontWeight: "500" as const,
    },
    chipTextActive: {
      color: "#FFFFFF",
    },
    rangeRow: {
      flexDirection: "row",
      gap: 12,
      marginVertical: 12,
    },
    rangeChip: {
      flex: 1,
      borderRadius: 12,
      paddingVertical: 10,
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.card,
    },
    rangeChipActive: {
      borderColor: colors.primary,
      backgroundColor: colors.primary + "10",
    },
    rangeChipText: {
      color: colors.text,
      fontWeight: "600" as const,
    },
    rangeChipTextActive: {
      color: colors.primary,
    },
    fuelSummaryRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 12,
      marginBottom: 12,
    },
    summaryItem: {
      flex: 1,
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    summaryItemFull: {
      flex: 1,
      maxWidth: "100%",
    },
    summaryValue: {
      fontSize: 18,
      fontWeight: "700" as const,
      color: colors.text,
    },
    cardSpacing: {
      marginTop: 12,
    },
    fuelStatsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
    },
    fuelStatCard: {
      width: "48%",
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 16,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
      minHeight: 100,
      justifyContent: "center",
    },
  });
