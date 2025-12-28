import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useLocalization } from "@/contexts/LocalizationContext";
import { useTheme } from "@/contexts/ThemeContext";

import { ThemeSettings } from "@/components/settings/ThemeSettings";
import { LanguageSettings } from "@/components/settings/LanguageSettings";
import { NotificationSettingsSection } from "@/components/settings/NotificationSettingsSection";
import { UnitSettings } from "@/components/settings/UnitSettings";
import { DataManagementSettings } from "@/components/settings/DataManagementSettings";
import { AboutSection } from "@/components/settings/AboutSection";
import { HapticSettings } from "@/components/settings/HapticSettings";
import { BuyMeCoffee } from "@/components/settings/BuyMeCoffee";
import { createSettingsStyles } from "@/styles/settings.styles";

import { ThemedBackground } from "@/components/ThemedBackground";

export default function SettingsScreen() {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const styles = createSettingsStyles(colors);

  return (
    <ThemedBackground>
      <SafeAreaView
        style={[styles.container, { backgroundColor: "transparent" }]}
        edges={["top"]}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.screenTitle}>{t("settings.title")}</Text>
          </View>

          <ThemeSettings />
          <LanguageSettings />
          <NotificationSettingsSection />
          <HapticSettings />
          {/* <UnitSettings /> */}
          <DataManagementSettings />
          <BuyMeCoffee />
          <AboutSection />
        </ScrollView>
      </SafeAreaView>
    </ThemedBackground>
  );
}
