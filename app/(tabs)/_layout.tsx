import { Tabs } from "expo-router";
import { Bell, CarFront, Settings, TrendingUp } from "lucide-react-native";
import React from "react";

import { AnimatedTabIcon } from "@/components/ui/AnimatedTabIcon";
import { useLocalization } from "@/contexts/LocalizationContext";
import { useTheme } from "@/contexts/ThemeContext";

export default function TabLayout() {
  const { colors } = useTheme();
  const { t } = useLocalization();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopLeftRadius: 24, // Smoother curve
          borderTopRightRadius: 24,
          height: 84, // Standard iOS height (49 + 34 safe area) for optimal reachability
          borderTopWidth: 0,
          elevation: 8, // Softer shadow
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: -4,
          },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          paddingTop: 12,
          paddingBottom: 28, // Accommodate Home Indicator physically
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
        },
        tabBarLabelStyle: {
          fontSize: 12, // Readable standard size
          fontWeight: "600",
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("vehicles.title"),
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon focused={focused}>
              <CarFront color={color} size={24} />
            </AnimatedTabIcon>
          ),
          tabBarLabel: t("tabs.vehicles"),
        }}
      />
      <Tabs.Screen
        name="maintenance"
        options={{
          title: t("maintenance.title"),
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon focused={focused}>
              <Bell color={color} size={24} />
            </AnimatedTabIcon>
          ),
          tabBarLabel: t("tabs.reminders"),
        }}
      />
      <Tabs.Screen
        name="statistics"
        options={{
          title: t("statistics.title"),
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon focused={focused}>
              <TrendingUp color={color} size={24} />
            </AnimatedTabIcon>
          ),
          tabBarLabel: t("tabs.statistics"),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t("settings.title"),
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon focused={focused}>
              <Settings color={color} size={24} />
            </AnimatedTabIcon>
          ),
          tabBarLabel: t("tabs.settings"),
        }}
      />
    </Tabs>
  );
}
