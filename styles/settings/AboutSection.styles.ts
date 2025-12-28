import { StyleSheet } from "react-native";
import { Colors } from "@/contexts/ThemeContext";

export const createAboutSectionStyles = (colors: Colors) =>
  StyleSheet.create({
    aboutSection: {
      flexDirection: "column",
      alignItems: "flex-start",
      gap: 16,
    },
    aboutContent: {
      flex: 1,
      width: "100%",
    },
    aboutTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 8,
    },
    aboutDescription: {
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 20,
      fontStyle: "italic",
      marginBottom: 8,
    },
    separator: {
      height: 1,
      backgroundColor: colors.border,
      marginVertical: 16,
      width: "100%",
    },
    aboutSubDescription: {
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 20,
      marginBottom: 24,
    },
    aboutSectionTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 12,
    },
    featuresList: {
      gap: 12,
      marginBottom: 24,
    },
    featureItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    featureIconContainer: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.primary + "15",
      alignItems: "center",
      justifyContent: "center",
    },
    featureText: {
      fontSize: 14,
      color: colors.text,
      fontWeight: "500",
    },
    versionContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      marginTop: 8,
    },
    versionLabel: {
      fontSize: 13,
      color: colors.textSecondary,
      marginRight: 4,
    },
    versionText: {
      fontSize: 13,
      fontWeight: "600",
      color: colors.textSecondary,
    },
  });
