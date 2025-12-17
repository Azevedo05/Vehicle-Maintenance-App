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
    itemSeparator: {
      height: 12,
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginVertical: 8,
    },
    header: {
      paddingTop: 8,
      marginBottom: 16,
    },
    titleRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    screenTitle: {
      fontFamily: "Inter_800ExtraBold",
      fontSize: 28,
      fontWeight: "800",
      color: colors.text,
    },
    headerButtonsRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    iconHeaderButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 12, // Increased from 10
      paddingVertical: 10, // Increased from 6 to ensure larger hit area
      borderRadius: 999,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 6,
      minHeight: 40, // Enforce minimum visual height
    },
    iconHeaderButtonText: {
      fontFamily: "Inter_600SemiBold",
      fontSize: 13,
      color: colors.text,
      fontWeight: "600",
    },
    vehicleCard: {
      flexDirection: "column",
    },
    vehicleImage: {
      width: "100%",
      height: 160,
    },
    vehicleImagePlaceholder: {
      width: "100%",
      height: 160,
      backgroundColor: colors.background,
      justifyContent: "center",
      alignItems: "center",
    },
    vehicleInfo: {
      paddingLeft: 12,
      paddingVertical: 12,
      paddingRight: 12,
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    vehicleTextContainer: {
      flex: 1,
      gap: 4,
    },
    vehicleHeaderRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 4,
    },
    vehicleName: {
      fontFamily: "Inter_700Bold",
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 4,
    },
    detailsRow: {
      flexDirection: "row",
      alignItems: "center",
      flexWrap: "wrap",
    },
    dotSeparator: {
      fontSize: 14,
      color: colors.textSecondary,
      marginHorizontal: 6,
    },
    archivedBadge: {
      backgroundColor: colors.border,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
    },
    archivedBadgeText: {
      fontFamily: "Inter_600SemiBold",
      fontSize: 10,
      color: colors.textSecondary,
      fontWeight: "600",
    },
    vehicleDetails: {
      fontFamily: "Inter_500Medium",
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 2,
    },
    vehicleMileage: {
      fontFamily: "Inter_700Bold",
      fontSize: 16,
      color: colors.primary,
      fontWeight: "700",
      alignSelf: "flex-end",
    },
    categoryBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    categoryBadgeText: {
      fontFamily: "Inter_600SemiBold",
      fontSize: 14,
      fontWeight: "600",
    },
    alertBadge: {
      backgroundColor: colors.error,
      width: 24,
      height: 24,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
    },
    alertBadgeText: {
      color: "#FFFFFF",
      fontSize: 12,
      fontWeight: "700",
    },

    addButton: {
      position: "absolute",
      bottom: 100, // Matches paddingBottom of list for perfect alignment with footer

      right: 24,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: colors.primary,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowOpacity: 0.2, // Slightly more pronounced than cards but still soft
      shadowRadius: 12,
      elevation: 8,
    },
    filterBadge: {
      position: "absolute",
      top: 0,
      right: 0,
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.error,
    },
    modalHeaderRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
      paddingHorizontal: 16,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.text,
    },
    modalHeaderLink: {
      fontSize: 16,
      color: colors.primary,
      fontWeight: "600",
    },
    modalScrollView: {
      // flex: 1 removed to allow auto-height in BottomSheet
    },
    modalScrollContent: {
      paddingHorizontal: 16,
      paddingBottom: 24,
    },
    actionsList: {
      gap: 8,
    },
    actionItem: {
      flexDirection: "row",
      alignItems: "center",
      padding: 12,
      borderRadius: 12,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
    },
    actionIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.background,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    actionContent: {
      flex: 1,
    },
    actionTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 2,
    },
    actionDescription: {
      fontSize: 13,
      color: colors.textSecondary,
    },
    filterSection: {
      marginBottom: 24,
    },
    filterSectionTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 12,
    },
    categoryChips: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    categoryChip: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 999,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      flexGrow: 1,
      flexBasis: "40%",
    },
    categoryChipActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    categoryChipText: {
      fontSize: 13,
      color: colors.text,
      fontWeight: "500",
      flexShrink: 1,
    },
    categoryChipTextActive: {
      color: "#FFFFFF",
      fontWeight: "600",
    },
    sortOptionsList: {
      gap: 0,
      backgroundColor: colors.card,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: "hidden",
    },
    sortOptionItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 16,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      backgroundColor: colors.card,
    },
    sortOptionItemActive: {
      backgroundColor: colors.card, // Keep background same or slightly different
    },
    sortOptionText: {
      fontSize: 16,
      color: colors.text,
      fontWeight: "500",
    },
    sortOptionTextActive: {
      color: colors.primary,
      fontWeight: "600",
    },
    sortOptionIndicator: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: colors.primary,
    },
    sortDirectionBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
    },
    sortDirectionText: {
      fontSize: 12,
      color: colors.textSecondary,
      fontWeight: "500",
    },
    emptyState: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 24,
      marginTop: 40,
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
