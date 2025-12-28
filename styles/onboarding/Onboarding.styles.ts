import { StyleSheet } from "react-native";
import { Colors } from "@/contexts/ThemeContext";

export const createOnboardingStyles = (colors: Colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    topContainer: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 50,
      paddingHorizontal: 24,
      paddingTop: 16,
    },
    footerContainer: {
      position: "absolute",
      bottom: 30,
      left: 20,
      right: 20,
      alignItems: "center",
    },
    glassFooter: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
      height: 80,
      borderRadius: 40,
      paddingHorizontal: 16,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: "hidden",
    },
    footerBtn: {
      width: 56,
      height: 56,
      borderRadius: 28,
      justifyContent: "center",
      alignItems: "center",
    },
    primaryBtn: {
      backgroundColor: colors.primary,
    },
    paginationContainer: {
      flexDirection: "row",
      gap: 6,
    },
    dot: {
      height: 6,
      borderRadius: 3,
      backgroundColor: colors.text,
    },
  });
