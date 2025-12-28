import { StyleSheet, Platform, Dimensions } from "react-native";
import { Colors } from "@/contexts/ThemeContext";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export const createStyles = (
  colors: Colors,
  insets: any,
  isMinimalist: boolean = false,
  isDark: boolean = true
) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    errorContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
      backgroundColor: colors.background,
    },
    errorText: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
      marginTop: 16,
      marginBottom: 24,
    },
    errorButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 12,
    },
    errorButtonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "600",
    },
    heroSection: {
      position: "relative",
    },
    vehicleImage: {
      width: SCREEN_WIDTH,
      height: isMinimalist ? SCREEN_HEIGHT * 0.6 : 400,
      backgroundColor: colors.border,
    },
    noImagePlaceholder: {
      width: "100%",
      height: isMinimalist ? SCREEN_HEIGHT * 0.6 : 400,
      backgroundColor: colors.primary + "15",
      justifyContent: "center",
      alignItems: "center",
    },
    paginationContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: 8,
      marginTop: 8,
      marginBottom: 16,
    },
    paginationDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },
    paginationDotActive: {
      width: 24,
      height: 8,
      borderRadius: 4,
    },
    floatingBackButtonContainer: {
      position: "absolute",
      top: Platform.OS === "ios" ? 50 : 30,
      left: 20,
      zIndex: 10,
    },
    floatingActions: {
      position: "absolute",
      top: Platform.OS === "ios" ? 50 : 30,
      right: 20,
      alignItems: "flex-end",
      zIndex: 10,
    },
    menuContainer: {
      position: "absolute",
      top: 56,
      right: 0,
      borderRadius: 12,
      overflow: "hidden",
      minWidth: 180,
      zIndex: 20,
    },
    menuBackdrop: {
      position: "absolute",
      top: -100,
      right: -20,
      width: SCREEN_WIDTH,
      height: SCREEN_HEIGHT,
      zIndex: 15,
    },
    menuBlur: {
      paddingVertical: 4,
      backgroundColor: isDark
        ? "rgba(0, 0, 0, 0.9)"
        : "rgba(255, 255, 255, 0.95)",
    },
    menuItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 12,
      paddingHorizontal: 16,
      gap: 12,
    },
    menuItemText: {
      fontSize: 14,
      fontFamily: "Inter_600SemiBold",
      color: isDark ? "#FFFFFF" : colors.text,
    },
    menuDivider: {
      height: 1,
      backgroundColor: isDark
        ? "rgba(255, 255, 255, 0.1)"
        : "rgba(0, 0, 0, 0.05)",
      marginHorizontal: 16,
    },
    floatingButtonBlur: {
      width: 44,
      height: 44,
      borderRadius: 22,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: isDark
        ? "rgba(0, 0, 0, 0.8)"
        : "rgba(255, 255, 255, 0.8)",
      overflow: "hidden",
    },
    safeArea: {
      flex: 1,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: 0,
    },
    curvedCard: {
      backgroundColor: colors.background,
      borderTopLeftRadius: 35,
      borderTopRightRadius: 35,
      marginTop: -80,
      paddingTop: 32,
      paddingHorizontal: 0,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: -10 },
      shadowOpacity: 0.1,
      shadowRadius: 24,
      elevation: 10,
      minHeight:
        SCREEN_HEIGHT -
        (isMinimalist ? SCREEN_HEIGHT * 0.6 : 400) +
        80 -
        insets.bottom,
      paddingBottom: 32,
    },
  });
