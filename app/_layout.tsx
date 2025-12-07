import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";

import { AnimatedSplashScreen } from "@/components/AnimatedSplashScreen";

import {
  LocalizationProvider,
  useLocalization,
} from "@/contexts/LocalizationContext";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import { VehicleProvider } from "@/contexts/VehicleContext";
import { AlertProvider } from "@/contexts/AlertContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { PreferencesProvider } from "@/contexts/PreferencesContext";
import { useMaintenanceNotifications } from "@/hooks/useMaintenanceNotifications";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  const { colors } = useTheme();
  const { t } = useLocalization();

  // Sync notifications with maintenance tasks
  useMaintenanceNotifications();

  return (
    <Stack screenOptions={{ headerBackTitle: t("common.back") }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="add-vehicle"
        options={{
          presentation: "modal",
          title: t("vehicles.add"),
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
        }}
      />
      <Stack.Screen
        name="edit-vehicle"
        options={{
          presentation: "modal",
          title: t("vehicles.edit"),
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
        }}
      />
      <Stack.Screen
        name="vehicle/[id]"
        options={{
          title: t("vehicles.details"),
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
        }}
      />
      <Stack.Screen
        name="vehicles/compare"
        options={{
          title: t("vehicles.compare_vehicles"),
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
        }}
      />
      <Stack.Screen
        name="vehicles/bulk"
        options={{
          title: t("vehicles.bulk_operations"),
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
        }}
      />
      <Stack.Screen
        name="add-task"
        options={{
          presentation: "modal",
          title: t("maintenance.add_task"),
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
        }}
      />
      <Stack.Screen
        name="add-record"
        options={{
          presentation: "modal",
          title: t("maintenance.log_maintenance"),
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
        }}
      />
      <Stack.Screen
        name="add-fuel-log"
        options={{
          presentation: "modal",
          title: t("fuel.add_log_title"),
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
        }}
      />
      <Stack.Screen
        name="record/[id]"
        options={{
          title: t("maintenance.details"),
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  const [isSplashAnimationFinished, setSplashAnimationFinished] =
    useState(false);

  useEffect(() => {
    // Native splash screen hiding is now handled by AnimatedSplashScreen
    // to ensure no flash of content occurs before the video is ready.
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <LocalizationProvider>
        <ThemeProvider>
          <PaperProvider>
            <PreferencesProvider>
              <NotificationProvider>
                <VehicleProvider>
                  <AlertProvider>
                    <GestureHandlerRootView style={{ flex: 1 }}>
                      {!isSplashAnimationFinished && (
                        <AnimatedSplashScreen
                          onFinish={() => setSplashAnimationFinished(true)}
                        />
                      )}
                      <RootLayoutNav />
                    </GestureHandlerRootView>
                  </AlertProvider>
                </VehicleProvider>
              </NotificationProvider>
            </PreferencesProvider>
          </PaperProvider>
        </ThemeProvider>
      </LocalizationProvider>
    </QueryClientProvider>
  );
}
