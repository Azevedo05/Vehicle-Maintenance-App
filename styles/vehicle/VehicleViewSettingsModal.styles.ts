import { StyleSheet } from "react-native";
import { Colors } from "@/contexts/ThemeContext";

export const createVehicleViewSettingsModalStyles = (colors: Colors) =>
  StyleSheet.create({
    blurContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    overlay: {
      width: "100%",
      height: "100%",
      justifyContent: "center",
      alignItems: "center",
      padding: 16,
      backgroundColor: "rgba(0, 0, 0, 0.4)",
    },
    modalCard: {
      width: "100%",
      maxWidth: 340,
      borderRadius: 24,
      padding: 24,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 24,
      elevation: 10,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },
    title: {
      fontSize: 20,
      fontWeight: "700",
      fontFamily: "Inter_700Bold",
    },
    closeButton: {
      padding: 4,
    },
    description: {
      fontSize: 14,
      marginBottom: 24,
      fontFamily: "Inter_400Regular",
    },
    optionsList: {
      gap: 8,
    },
    optionRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 12,
    },
    optionLabel: {
      fontSize: 16,
      fontWeight: "500",
      fontFamily: "Inter_500Medium",
    },
  });
