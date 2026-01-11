import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import {
  Shield,
  Plus,
  Edit2,
  FileText,
  Calendar,
  Euro,
  Clock,
  AlertTriangle,
  XCircle,
  RectangleHorizontal,
  CarFront,
  Gavel,
  Lock,
  Flame,
  CloudRain,
  Heart,
  ChevronRight,
} from "lucide-react-native";
import { router } from "expo-router";

import { useTheme } from "@/contexts/ThemeContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import {
  Vehicle,
  getInsuranceStatus,
  getDaysUntilExpiry,
  getEnabledCoverages,
  InsuranceCoverages,
} from "@/types";
import { createInsuranceSectionStyles } from "@/styles/vehicle/InsuranceSection.styles";

interface InsuranceSectionProps {
  vehicle: Vehicle;
}

const COVERAGE_ICONS: Record<string, any> = {
  glassBreakage: RectangleHorizontal,
  roadsideAssistance: CarFront,
  legalProtection: Gavel,
  ownDamage: Shield,
  theft: Lock,
  fire: Flame,
  naturalDisasters: CloudRain,
  personalAccident: Heart,
};

export function InsuranceSection({ vehicle }: InsuranceSectionProps) {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const styles = createInsuranceSectionStyles(colors);

  const insurance = vehicle.insurance;

  const handleNavigate = () => {
    router.push(`/add-insurance?vehicleId=${vehicle.id}`);
  };

  if (!insurance) {
    // Empty State
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{t("insurance.title")}</Text>
          <TouchableOpacity
            style={styles.headerAddButton}
            onPress={handleNavigate}
            activeOpacity={0.8}
          >
            <Plus size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.emptyCard}>
          <Shield size={32} color={colors.placeholder} />
          <Text style={styles.emptyDescription}>
            {t("insurance.empty_description")}
          </Text>
        </View>
      </View>
    );
  }

  // Calculate status and expiry
  const status = getInsuranceStatus(insurance);
  const daysUntilExpiry = getDaysUntilExpiry(insurance);
  const enabledCoverages = getEnabledCoverages(insurance);

  const getStatusStyles = () => {
    switch (status) {
      case "active":
        return {
          badge: styles.statusBadgeActive,
          text: styles.statusTextActive,
        };
      case "pending":
        return {
          badge: styles.statusBadgePending,
          text: styles.statusTextPending,
        };
      case "expired":
        return {
          badge: styles.statusBadgeExpired,
          text: styles.statusTextExpired,
        };
    }
  };

  const getExpiryWarning = () => {
    if (status === "expired") {
      return {
        style: styles.expiryWarningRed,
        textStyle: styles.expiryTextRed,
        text: t("insurance.expired_ago", { days: Math.abs(daysUntilExpiry) }),
        icon: XCircle,
      };
    }
    if (daysUntilExpiry <= 14) {
      return {
        style: styles.expiryWarningRed,
        textStyle: styles.expiryTextRed,
        text: t("insurance.expires_in", { days: daysUntilExpiry }),
        icon: AlertTriangle,
      };
    }
    if (daysUntilExpiry <= 30) {
      return {
        style: styles.expiryWarningYellow,
        textStyle: styles.expiryTextYellow,
        text: t("insurance.expires_in", { days: daysUntilExpiry }),
        icon: Clock,
      };
    }
    return null;
  };

  const renderCoverageDetails = (key: string) => {
    const details = insurance.coverages?.[key as keyof InsuranceCoverages];
    if (!details) return null;

    let subText = "";
    if (details.maxValue)
      subText = `${t("insurance.max_value")}: ${details.maxValue}€`;
    if (details.deductible)
      subText += `${subText ? " • " : ""}${t("insurance.deductible")}: ${
        details.deductible
      }€`;

    // Specific for Roadside
    if (key === "roadsideAssistance" && "includesReplacement" in details) {
      const ra = details as any;
      if (ra.includesReplacement) {
        subText = `${t("insurance.replacement_vehicle")}${
          ra.replacementDays
            ? ` (${ra.replacementDays} ${t("common.days")})`
            : ""
        }`;
      }
    }

    return (
      <View key={key} style={styles.coverageItem}>
        <View style={styles.coverageIcon}>
          {React.createElement(COVERAGE_ICONS[key] || Shield, {
            size: 16,
            color: colors.primary,
          })}
        </View>
        <View style={styles.coverageDetails}>
          <Text style={styles.coverageName}>
            {t(`insurance.coverage_${key}`)}
          </Text>
          {subText ? <Text style={styles.coverageMeta}>{subText}</Text> : null}
        </View>
      </View>
    );
  };

  const statusStyles = getStatusStyles();
  const expiryWarning = getExpiryWarning();

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t("insurance.title")}</Text>
      </View>

      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.9}
        onPress={handleNavigate}
      >
        {/* Header: Provider & Status */}
        <View style={styles.cardHeader}>
          <Text style={styles.providerName}>{insurance.provider}</Text>
          <View style={[styles.statusBadge, statusStyles.badge]}>
            <Text style={[styles.statusText, statusStyles.text]}>
              {t(`insurance.status_${status}`)}
            </Text>
          </View>
        </View>

        {/* Body */}
        <View style={styles.cardBody}>
          <View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>
                {t("insurance.policy_number")}
              </Text>
              <Text style={styles.detailValue}>{insurance.policyNumber}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>{t("insurance.expires")}</Text>
              <View style={styles.detailValueContainer}>
                <Text style={styles.detailValue}>
                  {formatDate(insurance.endDate)}
                </Text>
                <Text style={styles.detailSubValue}>
                  {t(`insurance.frequency_${insurance.paymentFrequency}`)}
                </Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>
                {t("insurance.annual_cost")}
              </Text>
              <View style={styles.detailValueContainer}>
                <Text style={styles.detailValue}>{insurance.annualCost}€</Text>
                <Text
                  style={[
                    styles.detailSubValue,
                    { color: insurance.isPaid ? "#10B981" : "#EF4444" },
                  ]}
                >
                  {insurance.isPaid
                    ? t("insurance.paid")
                    : t("insurance.unpaid")}
                </Text>
              </View>
            </View>

            {insurance.emergencyContact ? (
              <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
                <Text style={styles.detailLabel}>
                  {t("insurance.emergency_contact")}
                </Text>
                <Text style={styles.detailValue}>
                  {insurance.emergencyContact}
                </Text>
              </View>
            ) : null}
          </View>

          {/* Expiry Warning */}
          {expiryWarning && (
            <View style={[styles.expiryWarning, expiryWarning.style]}>
              <expiryWarning.icon
                size={16}
                color={expiryWarning.textStyle.color}
              />
              <Text style={[styles.expiryWarningText, expiryWarning.textStyle]}>
                {expiryWarning.text}
              </Text>
            </View>
          )}

          {/* Additional Coverages */}
          {enabledCoverages.length > 0 && (
            <View>
              <Text style={styles.sectionTitle}>
                {t("insurance.additional_coverages")}
              </Text>
              <View style={styles.coveragesContainer}>
                {enabledCoverages.map((key) => renderCoverageDetails(key))}
              </View>
            </View>
          )}
        </View>

        {/* Footer */}
        <View style={styles.cardFooter}>
          <View style={styles.editButtonFull}>
            <Text style={styles.editButtonText}>{t("common.tap_to_edit")}</Text>
            <ChevronRight size={14} color={colors.textSecondary} />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}
