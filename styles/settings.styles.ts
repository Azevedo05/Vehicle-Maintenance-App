import { StyleSheet } from "react-native";
import { Colors } from "@/contexts/ThemeContext";

export const createSettingsStyles = (colors: Colors) =>
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
  });
