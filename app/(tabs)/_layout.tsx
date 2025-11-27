import { Tabs } from 'expo-router';
import { Bell, CarFront, Settings, TrendingUp } from 'lucide-react-native';
import React from 'react';

import { useLocalization } from '@/contexts/LocalizationContext';
import { useTheme } from '@/contexts/ThemeContext';

export default function TabLayout() {
  const { colors } = useTheme();
  const { t } = useLocalization();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        tabBarStyle: {
          backgroundColor: colors.tabBarBackground,
          borderTopWidth: 1,
          borderTopColor: colors.tabBarBorder,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('vehicles.title'),
          headerShown: false,
          tabBarIcon: ({ color }) => <CarFront color={color} size={24} />,
          tabBarLabel: t('tabs.vehicles'),
        }}
      />
      <Tabs.Screen
        name="maintenance"
        options={{
          title: t('maintenance.title'),
          headerShown: false,
          tabBarIcon: ({ color }) => <Bell color={color} size={24} />,
          tabBarLabel: t('tabs.reminders'),
        }}
      />
      <Tabs.Screen
        name="statistics"
        options={{
          title: t('statistics.title'),
          headerShown: false,
          tabBarIcon: ({ color }) => <TrendingUp color={color} size={24} />,
          tabBarLabel: t('tabs.statistics'),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('settings.title'),
          headerShown: false,
          tabBarIcon: ({ color }) => <Settings color={color} size={24} />,
          tabBarLabel: t('tabs.settings'),
        }}
      />
    </Tabs>
  );
}
