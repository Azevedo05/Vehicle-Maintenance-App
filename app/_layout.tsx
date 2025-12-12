import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import * as SystemUI from "expo-system-ui";
import React, { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from "@expo-google-fonts/inter";
import { AnimatedSplashScreen } from "@/components/AnimatedSplashScreen";
import Toast from "react-native-toast-message";
import { toastConfig } from "@/components/ui/ToastConfig";

import {
  LocalizationProvider,
  useLocalization,
} from "@/contexts/LocalizationContext";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import { VehicleProvider } from "@/contexts/VehicleContext";
import { AlertProvider } from "@/contexts/AlertContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import {
  PreferencesProvider,
  usePreferences,
} from "@/contexts/PreferencesContext";
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
      <Stack.Screen
        name="onboarding"
        options={{ headerShown: false, animation: "fade" }}
      />
    </Stack>
  );
}

const RootLayoutContent = () => {
  const [isSplashAnimationFinished, setSplashAnimationFinished] =
    useState(false);
  const { isOnboardingCompleted, isLoading } = usePreferences();
  const router = useRouter();
  const segments = useSegments();
  const { colors } = useTheme();

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  useEffect(() => {
    if (isLoading || !isSplashAnimationFinished || !fontsLoaded) return;

    const inOnboardingGroup = segments[0] === "onboarding";

    if (!isOnboardingCompleted && !inOnboardingGroup) {
      // Redirect to onboarding if not completed
      router.replace("/onboarding");
    } else if (isOnboardingCompleted && inOnboardingGroup) {
      // Redirect to tabs if onboarding is already completed
      router.replace("/");
    }
  }, [
    isOnboardingCompleted,
    isLoading,
    isSplashAnimationFinished,
    fontsLoaded,
    segments,
  ]);

  if (isLoading || !isSplashAnimationFinished || !fontsLoaded) {
    return (
      <AnimatedSplashScreen onFinish={() => setSplashAnimationFinished(true)} />
    );
  }

  return <RootLayoutNav />;
};

const ThemedPaperProvider = ({ children }: { children: React.ReactNode }) => {
  const { paperTheme } = useTheme();
  return <PaperProvider theme={paperTheme}>{children}</PaperProvider>;
};

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <LocalizationProvider>
        <ThemeProvider>
          <ThemedPaperProvider>
            <PreferencesProvider>
              <NotificationProvider>
                <VehicleProvider>
                  <AlertProvider>
                    <GestureHandlerRootView style={{ flex: 1 }}>
                      <RootLayoutContent />
                      <Toast config={toastConfig} />
                    </GestureHandlerRootView>
                  </AlertProvider>
                </VehicleProvider>
              </NotificationProvider>
            </PreferencesProvider>
          </ThemedPaperProvider>
        </ThemeProvider>
      </LocalizationProvider>
    </QueryClientProvider>
  );
}
