import { StyleSheet } from "react-native";
import { Colors } from "@/contexts/ThemeContext";

export const createVehicleHeaderStyles = (colors: Colors) =>
  StyleSheet.create({
    infoCard: {
      paddingHorizontal: 20,
      paddingBottom: 0,
      gap: 4,
    },
    headerTopRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      paddingHorizontal: 4,
    },
    nameContainer: {
      flex: 1,
      gap: 2,
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
      fontWeight: "700",
      letterSpacing: 0.5,
      opacity: 0.8,
    },
    archiveButton: {
      padding: 4,
    },
    specValue: {
      fontSize: 15,
      color: colors.text,
      fontWeight: "600",
    },
  });
