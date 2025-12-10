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

import { ThemedBackground } from "@/components/ThemedBackground";

// ...

export default function SettingsScreen() {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const styles = createStyles(colors);

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
          <UnitSettings />
          <DataManagementSettings />
          <AboutSection />
        </ScrollView>
      </SafeAreaView>
    </ThemedBackground>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: 16,
      paddingBottom: 100,
    },
    header: {
      paddingTop: 8,
      marginBottom: 16,
    },
    screenTitle: {
      fontSize: 28,
      fontWeight: "700",
      color: colors.text,
    },
  });
