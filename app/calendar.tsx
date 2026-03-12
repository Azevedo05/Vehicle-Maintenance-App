import React, { useMemo } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";

import { useLocalization } from "@/contexts/LocalizationContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useVehicles } from "@/contexts/VehicleContext";
import { MaintenanceCalendar } from "@/components/maintenance/MaintenanceCalendar";
import { createStyles } from "@/styles/maintenance.styles";
import { ThemedBackground } from "@/components/ThemedBackground";

export default function CalendarScreen() {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const { getUpcomingTasks } = useVehicles();
  const styles = createStyles(colors);

  const upcomingTasks = getUpcomingTasks();

  const sortedTasks = useMemo(() => {
    return [...upcomingTasks].sort((a, b) => {
      const aDue = a.daysUntilDue ?? a.milesUntilDue ?? Infinity;
      const bDue = b.daysUntilDue ?? b.milesUntilDue ?? Infinity;
      return aDue - bDue;
    });
  }, [upcomingTasks]);

  return (
    <ThemedBackground>
      <SafeAreaView
        style={[styles.container, { backgroundColor: "transparent" }]}
        edges={["top"]}
      >
        <View style={{ paddingHorizontal: 16 }}>
          <View style={styles.header}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TouchableOpacity
                onPress={() => router.back()}
                style={{
                  padding: 8,
                  marginLeft: -8,
                  marginRight: 12,
                }}
              >
                <ArrowLeft size={24} color={colors.text} />
              </TouchableOpacity>
              <Text style={styles.screenTitle}>{t("tabs.calendar")}</Text>
            </View>
          </View>
        </View>

        <View style={{ flex: 1, marginTop: 8 }}>
          <MaintenanceCalendar
            tasks={sortedTasks}
            onTaskPress={(vehicleId) => router.push(`/vehicle/${vehicleId}`)}
          />
        </View>
      </SafeAreaView>
    </ThemedBackground>
  );
}
