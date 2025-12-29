import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  StyleSheet,
} from "react-native";
import { Mail, MessageSquare, Heart, ChevronRight } from "lucide-react-native";

import { useTheme } from "@/contexts/ThemeContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { createSettingsStyles } from "@/styles/settings/SettingsSections.styles";

const CONTACT_EMAIL = "goncalo.azevedo.work@gmail.com";

export const ContactSection = () => {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const styles = createSettingsStyles(colors);

  const handleEmail = (subjectKey: string) => {
    const subject = t(`contact.${subjectKey}`);
    const url = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      subject
    )}`;
    Linking.openURL(url).catch((err) =>
      console.error("Error opening email client:", err)
    );
  };

  const ContactItem = ({
    icon: Icon,
    label,
    descKey,
    subjectKey,
    isLast = false,
  }: {
    icon: any;
    label: string;
    descKey: string;
    subjectKey: string;
    isLast?: boolean;
  }) => (
    <TouchableOpacity
      style={[styles.optionButton, isLast && styles.optionButtonLast]}
      onPress={() => handleEmail(subjectKey)}
      activeOpacity={0.7}
    >
      <Icon size={20} color={colors.primary} />
      <View style={{ flex: 1, marginRight: 12 }}>
        <Text style={styles.optionText}>{label}</Text>
        <Text
          style={{ fontSize: 13, color: colors.textSecondary, marginTop: 4 }}
        >
          {t(`contact.${descKey}`)}
        </Text>
      </View>
      <ChevronRight size={20} color={colors.textSecondary} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{t("contact.title")}</Text>
      <View style={styles.optionGroup}>
        <ContactItem
          icon={Mail}
          label={t("contact.report_bug")}
          descKey="report_bug_desc"
          subjectKey="subject_bug"
        />
        <ContactItem
          icon={MessageSquare}
          label={t("contact.suggest_feature")}
          descKey="suggest_feature_desc"
          subjectKey="subject_feature"
        />
        <ContactItem
          icon={Heart}
          label={t("contact.send_feedback")}
          descKey="send_feedback_desc"
          subjectKey="subject_feedback"
          isLast
        />
      </View>
    </View>
  );
};
