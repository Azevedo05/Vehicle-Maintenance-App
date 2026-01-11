import { StyleSheet, Dimensions } from "react-native";
import { Colors } from "../../contexts/ThemeContext";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const createTaskInfoStyles = (colors: Colors, isDark: boolean) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 24,
    },
    backdrop: {
      ...StyleSheet.absoluteFillObject,
    },
    absoluteFill: {
      ...StyleSheet.absoluteFillObject,
    },
    modalContainer: {
      width: "100%",
      borderRadius: 24,
      overflow: "hidden",
      padding: 20,
      elevation: 10,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 10,
      backgroundColor: isDark ? "#1C1C1E" : "#FFFFFF",
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
    },
    titleContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    titleIcon: {
      marginRight: 8,
    },
    title: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
    },
    closeButton: {
      padding: 4,
    },
    content: {
      gap: 16,
    },
    typeBadge: {
      alignSelf: "flex-start",
      backgroundColor: "rgba(0,122,255,0.1)",
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 8,
      marginBottom: 8,
    },
    typeText: {
      fontSize: 12,
      fontWeight: "600",
      textTransform: "uppercase",
      color: colors.primary,
    },
    infoRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    iconBox: {
      width: 36,
      height: 36,
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
    },
    infoTextContainer: {
      flex: 1,
    },
    infoLabel: {
      fontSize: 12,
      marginBottom: 2,
      color: colors.textSecondary,
    },
    infoValue: {
      fontSize: 15,
      fontWeight: "500",
      color: colors.text,
    },
    recurrenceValue: {
      fontSize: 15,
      fontWeight: "500",
      color: colors.text,
      marginTop: 4,
    },
    alertBox: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      padding: 12,
      borderRadius: 12,
      marginTop: 8,
      backgroundColor: colors.error + "10",
    },
    alertText: {
      fontSize: 14,
      fontWeight: "600",
      flex: 1,
      color: colors.error,
    },
    doneButton: {
      marginTop: 24,
      paddingVertical: 14,
      borderRadius: 16,
      alignItems: "center",
      backgroundColor: colors.primary,
    },
    doneButtonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "700",
    },
  });
