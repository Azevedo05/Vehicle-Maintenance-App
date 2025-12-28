import { StyleSheet, Platform } from "react-native";
import { Colors } from "@/contexts/ThemeContext";

export const createVehicleListItemStyles = (colors: Colors) =>
  StyleSheet.create({
    vehicleCard: {
      borderRadius: 24,
      backgroundColor: colors.card,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 4,
      marginBottom: 16,
    },
    imageContainer: {
      position: "relative",
    },
    vehicleImagePlaceholder: {
      height: 200,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      width: "100%",
      backgroundColor: colors.primary + "10",
      justifyContent: "center",
      alignItems: "center",
    },
    badgeContainer: {
      position: "absolute",
      top: 16,
      right: 16,
      flexDirection: "row",
      gap: 10,
      zIndex: 1,
    },
    archivedBadgeAndroid: {
      padding: 8,
      borderRadius: 20,
      backgroundColor: "rgba(0,0,0,0.6)",
      justifyContent: "center",
      alignItems: "center",
    },
    archivedBadgeIos: {
      padding: 8,
      borderRadius: 20,
      overflow: "hidden",
      justifyContent: "center",
      alignItems: "center",
    },
    statusPillAndroid: {
      paddingVertical: 6,
      paddingHorizontal: 10,
      borderRadius: 16,
      backgroundColor: "rgba(0,0,0,0.7)",
      justifyContent: "center",
      alignItems: "center",
    },
    statusPillIos: {
      paddingVertical: 6,
      paddingHorizontal: 10,
      borderRadius: 16,
      overflow: "hidden",
      justifyContent: "center",
      alignItems: "center",
    },
    statusPillContent: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    statusSection: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    statusText: {
      color: "#FFFFFF",
      fontWeight: "700",
      fontSize: 13,
    },
    statusSeparator: {
      width: 1,
      height: 12,
      backgroundColor: "rgba(255,255,255,0.2)",
    },
    cardContent: {
      paddingTop: 20,
      paddingBottom: 16,
    },
    headerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    titleContainer: {
      flex: 1,
      flexDirection: "row",
      flexWrap: "wrap",
      alignItems: "baseline",
      marginRight: 8,
    },
    title: {
      fontSize: 22,
      fontWeight: "800",
      color: colors.text,
      lineHeight: 28,
      letterSpacing: -0.5,
      marginRight: 8,
    },
    year: {
      fontSize: 16,
      color: colors.textSecondary,
      fontWeight: "500",
    },
    categoryBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
    },
    categoryText: {
      fontSize: 12,
      fontWeight: "700",
    },
  });
