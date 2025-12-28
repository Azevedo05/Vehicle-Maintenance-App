import { StyleSheet } from "react-native";
import { Colors } from "@/contexts/ThemeContext";

export const createVehicleHeaderStyles = (colors: Colors) =>
  StyleSheet.create({
    infoCard: {
      paddingHorizontal: 24,
      paddingBottom: 24,
      gap: 20,
    },
    headerTopRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    nameContainer: {
      flex: 1,
      gap: 4,
    },
    vehicleName: {
      fontSize: 32,
      fontWeight: "800",
      color: colors.text,
      letterSpacing: -0.5,
      lineHeight: 40,
    },
    licenseText: {
      fontSize: 16,
      color: colors.textSecondary,
      fontWeight: "600",
      letterSpacing: 1,
    },
    archiveButton: {
      padding: 4,
    },
    specsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginTop: 8,
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      gap: 0,
    },
    specItem: {
      width: "33.33%",
      paddingVertical: 12,
      paddingHorizontal: 4,
    },
    specLabel: {
      fontSize: 11,
      color: colors.textSecondary,
      fontWeight: "500",
      textTransform: "uppercase",
      letterSpacing: 0.5,
      marginBottom: 4,
    },
    specValue: {
      fontSize: 15,
      color: colors.text,
      fontWeight: "600",
    },
    mileageContainer: {
      marginTop: 8,
      paddingTop: 20,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      gap: 8,
    },
    mileageHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    iconCircle: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.primary + "15",
      justifyContent: "center",
      alignItems: "center",
    },
    mileageLabel: {
      fontSize: 13,
      color: colors.textSecondary,
      fontWeight: "600",
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    mileageValue: {
      fontSize: 36,
      fontWeight: "300",
      color: colors.text,
      letterSpacing: -1,
    },
    mileageUnit: {
      fontSize: 18,
      fontWeight: "500",
      color: colors.textSecondary,
      marginLeft: 4,
    },
  });
