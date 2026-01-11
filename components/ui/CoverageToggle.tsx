import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import { ChevronDown, ChevronUp } from "lucide-react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { useTheme, Colors } from "@/contexts/ThemeContext";
import { Input } from "./Input";

interface CoverageToggleProps {
  label: string;
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  children?: React.ReactNode;
  icon?: React.ReactNode;
}

export function CoverageToggle({
  label,
  enabled,
  onToggle,
  children,
  icon,
}: CoverageToggleProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const contentHeight = useSharedValue(0);
  const [measured, setMeasured] = React.useState(false);
  const [contentHeightValue, setContentHeightValue] = React.useState(0);

  React.useEffect(() => {
    contentHeight.value = withTiming(
      enabled && measured ? contentHeightValue : 0,
      {
        duration: 200,
      }
    );
  }, [enabled, measured, contentHeightValue]);

  const animatedStyle = useAnimatedStyle(() => ({
    height: contentHeight.value,
    overflow: "hidden",
  }));

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.header, enabled && styles.headerActive]}
        onPress={() => onToggle(!enabled)}
        activeOpacity={0.7}
      >
        <View style={styles.headerLeft}>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <Text style={[styles.label, enabled && styles.labelActive]}>
            {label}
          </Text>
        </View>
        <View style={styles.headerRight}>
          <View style={[styles.toggle, enabled && styles.toggleActive]}>
            <View
              style={[styles.toggleDot, enabled && styles.toggleDotActive]}
            />
          </View>
        </View>
      </TouchableOpacity>

      {children && (
        <Animated.View style={animatedStyle}>
          <View
            style={styles.content}
            onLayout={(e) => {
              if (!measured) {
                setContentHeightValue(e.nativeEvent.layout.height);
                setMeasured(true);
              }
            }}
          >
            {children}
          </View>
        </Animated.View>
      )}

      {/* Hidden view for measuring */}
      {children && !measured && (
        <View style={styles.measureContainer}>
          <View
            style={styles.content}
            onLayout={(e) => {
              setContentHeightValue(e.nativeEvent.layout.height);
              setMeasured(true);
            }}
          >
            {children}
          </View>
        </View>
      )}
    </View>
  );
}

const createStyles = (colors: Colors) =>
  StyleSheet.create({
    container: {
      borderRadius: 12,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: "hidden",
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 16,
    },
    headerActive: {
      backgroundColor: colors.primary + "10",
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      flex: 1,
    },
    headerRight: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    iconContainer: {
      width: 32,
      height: 32,
      borderRadius: 8,
      backgroundColor: colors.primary + "15",
      justifyContent: "center",
      alignItems: "center",
    },
    label: {
      fontSize: 15,
      fontWeight: "600",
      color: colors.text,
      flex: 1,
    },
    labelActive: {
      color: colors.primary,
    },
    toggle: {
      width: 44,
      height: 24,
      borderRadius: 12,
      backgroundColor: colors.border,
      padding: 2,
      justifyContent: "center",
    },
    toggleActive: {
      backgroundColor: colors.primary,
    },
    toggleDot: {
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: "#FFFFFF",
    },
    toggleDotActive: {
      alignSelf: "flex-end",
    },
    content: {
      padding: 16,
      gap: 12,
    },
    measureContainer: {
      position: "absolute",
      opacity: 0,
      pointerEvents: "none",
    },
  });
