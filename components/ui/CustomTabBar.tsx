import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
} from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useTheme } from "@/contexts/ThemeContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  useAnimatedStyle,
  withTiming,
  useDerivedValue,
  interpolateColor,
} from "react-native-reanimated";

const TabBarItem = ({
  isFocused,
  options,
  onPress,
  onLongPress,
  colors,
}: {
  isFocused: boolean;
  options: any;
  onPress: () => void;
  onLongPress: () => void;
  colors: any;
}) => {
  // Animation for the pill background opacity/color
  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: withTiming(isFocused ? colors.primary : "transparent", {
        duration: 200,
      }),
      flexGrow: withTiming(isFocused ? 2 : 1, { duration: 200 }),
      // paddingHorizontal: withTiming(isFocused ? 20 : 0, { duration: 200 }), // Optional: Add padding for pill shape
    };
  });

  // Animation for the text visibility
  const animatedTextStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isFocused ? 1 : 0, { duration: 200 }),
      display: isFocused ? "flex" : "none", // Ideally animate width/transform, but display works for simple toggle
      transform: [{ scale: withTiming(isFocused ? 1 : 0, { duration: 200 }) }],
    };
  });

  const iconColor = isFocused ? "#FFFFFF" : colors.textSecondary;

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityState={isFocused ? { selected: true } : {}}
      accessibilityLabel={options.tabBarAccessibilityLabel}
      testID={options.tabBarTestID}
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.tabItemButton}
    >
      <Animated.View style={[styles.tabItemContainer, animatedContainerStyle]}>
        {/* Render Icon */}
        <View style={styles.iconContainer}>
          {options.tabBarIcon &&
            options.tabBarIcon({
              focused: isFocused,
              color: iconColor,
              size: 24,
            })}
        </View>

        {/* Render Label only if focused */}
        {isFocused && (
          <Animated.Text
            numberOfLines={1}
            style={[
              styles.label,
              { color: "#FFFFFF" },
              animatedTextStyle, // Apply animation
            ]}
          >
            {options.tabBarLabel}
          </Animated.Text>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

export function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.tabBarContainer,
        {
          backgroundColor: colors.card,
          paddingBottom: insets.bottom + 8, // Add some bottom padding
          height: 80 + insets.bottom, // Total height
        },
      ]}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            // Use LayoutAnimation for smooth width transitions of the flex items
            LayoutAnimation.configureNext(
              LayoutAnimation.Presets.easeInEaseOut
            );
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TabBarItem
            key={route.key}
            isFocused={isFocused}
            options={options}
            onPress={onPress}
            onLongPress={onLongPress}
            colors={colors}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 12,
    paddingHorizontal: 16,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    borderTopWidth: 0,
  },
  tabItemButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  tabItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10, // Pill height control
    paddingHorizontal: 16,
    borderRadius: 30, // Fully rounded pill
    overflow: "hidden",
  },
  iconContainer: {
    // Ensure icon stays centered or aligned
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8, // Space between icon and text
  },
});
