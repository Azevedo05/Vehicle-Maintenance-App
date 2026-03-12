import React, { useState } from "react";
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
  PhoneCall,
  Hash,
  CreditCard,
  CalendarClock,
  Layers,
  StickyNote,
  CheckCircle,
  CalendarPlus,
} from "lucide-react-native";
import { router } from "expo-router";
import * as Linking from "expo-linking";
import { LinearGradient } from "expo-linear-gradient";

import { useTheme } from "@/contexts/ThemeContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { useVehicles } from "@/contexts/VehicleContext";
import { useAppAlert } from "@/contexts/AlertContext";
import {
  Vehicle,
  getInsuranceStatus,
  getDaysUntilExpiry,
  getEnabledCoverages,
  InsuranceCoverages,
} from "@/types";
import { createInsuranceSectionStyles } from "@/styles/vehicle/InsuranceSection.styles";
import { BottomSheet } from "@/components/BottomSheet";
import { useCalendarExport } from "@/hooks/useCalendarExport";

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

const COVERAGE_TRANSLATION_KEYS: Record<string, string> = {
  glassBreakage: "glass",
  roadsideAssistance: "roadside",
  legalProtection: "legal",
  ownDamage: "own_damage",
  theft: "theft",
  fire: "fire",
  naturalDisasters: "natural",
  personalAccident: "personal",
};

export function InsuranceSection({ vehicle }: InsuranceSectionProps) {
  const { colors } = useTheme();
  const { t, language } = useLocalization();
  const { updateVehicle } = useVehicles();
  const { showAlert } = useAppAlert();
  const styles = createInsuranceSectionStyles(colors);

  const insurance = vehicle.insurance;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { exportToCalendar, removeFromCalendar, isExporting } = useCalendarExport();

  const handleNavigate = () => {
    setIsModalVisible(false);
    router.push(`/add-insurance?vehicleId=${vehicle.id}`);
  };

  // Calculate next payment date based on frequency
  const getNextPaymentDate = (fromDate: number, frequency?: string): number | undefined => {
    const date = new Date(fromDate);
    switch (frequency) {
      case "monthly":
        date.setMonth(date.getMonth() + 1);
        break;
      case "quarterly":
        date.setMonth(date.getMonth() + 3);
        break;
      case "semiannual":
        date.setMonth(date.getMonth() + 6);
        break;
      case "annual":
        date.setFullYear(date.getFullYear() + 1);
        break;
      default:
        return undefined; // If frequency is not recognized, we can't calculate next payment
    }
    return date.getTime();
  };

  const handleExportToCalendar = async () => {
    if (!insurance) return;

    if (insurance.calendarEventId) {
      const removed = await removeFromCalendar(insurance.calendarEventId);
      if (removed) {
        const updatedInsurance = { ...insurance };
        delete updatedInsurance.calendarEventId;
        updateVehicle(vehicle.id, { insurance: updatedInsurance });
      }
      return;
    }

    const typeLabel = t("insurance.title");
    const exportNotes = t("insurance.calendar_notes", {
      vehicle: `${vehicle.make} ${vehicle.model}`,
      policy: insurance.policyNumber || t("insurance.not_defined"),
      date: new Date(insurance.endDate).toLocaleDateString(language),
      contact: insurance.emergencyContact 
        ? `\n${t("insurance.emergency_contact")}: ${insurance.emergencyContact}`
        : "",
    });

    const eventId = await exportToCalendar(
      t("insurance.calendar_title", {
        provider: insurance.provider,
        vehicle: `${vehicle.make} ${vehicle.model}`,
      }),
      new Date(insurance.endDate),
      exportNotes
    );

    if (eventId) {
      updateVehicle(vehicle.id, {
        insurance: { ...insurance, calendarEventId: eventId },
      });
    }
  };

  // Check if the payment has cycled past its due date (auto-reset logic)
  const isPaymentOverdue = (): boolean => {
    if (!insurance) return false;
    if (insurance.isPaid && insurance.nextPaymentDate) {
      return Date.now() >= insurance.nextPaymentDate;
    }
    return false;
  };

  // Effective paid status (considers auto-reset)
  const effectiveIsPaid = insurance?.isPaid && !isPaymentOverdue();

  const handleMarkAsPaid = () => {
    if (!insurance) return;
    showAlert({
      title: t("insurance.confirm_payment_title"),
      message: t("insurance.confirm_payment_message"),
      buttons: [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("common.confirm"),
          onPress: async () => {
            const nextPayment = getNextPaymentDate(
              Date.now(),
              insurance.paymentFrequency
            );
            await updateVehicle(vehicle.id, {
              insurance: {
                ...insurance,
                isPaid: true,
                nextPaymentDate: nextPayment,
                updatedAt: Date.now(),
              },
            });
          },
        },
      ],
    });
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
    if (details.maxValue) {
      subText = `${t("insurance.max_value")}: ${formatNumber(details.maxValue)}€`;
    } else if (key !== "roadsideAssistance") {
      subText = `${t("insurance.max_value")}: ${t("insurance.not_defined")}`;
    }
    if (details.deductible)
      subText += `${subText ? " • " : ""}${t("insurance.deductible")}: ${formatNumber(details.deductible)
        }€`;

    // Specific for Roadside
    if (key === "roadsideAssistance") {
      const ra = details as any;
      const hasReplacement = ra.includesReplacement === true;
      if (hasReplacement) {
        subText = `${t("insurance.replacement_vehicle")}: ${t("common.yes")}${ra.replacementDays
          ? ` (${formatNumber(ra.replacementDays)} ${t("common.days")})`
          : ""
          }`;
      } else {
        subText = `${t("insurance.replacement_vehicle")}: ${t("common.no")}`;
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
            {t(`insurance.coverage_${COVERAGE_TRANSLATION_KEYS[key] || key}`)}
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

  // Format numbers with thousand separators (e.g., 10000 → 10 000)
  // Manual implementation because Hermes doesn't support locale in toLocaleString
  const formatNumber = (num: number): string => {
    const parts = num.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return parts.join(',');
  };

  // Render a detail row with icon for the modal
  const renderDetailRow = (
    icon: any,
    label: string,
    value: string,
    subValue?: string,
    subValueColor?: string,
    customValueComponent?: React.ReactNode,
    isLast?: boolean
  ) => (
    <View key={label}>
      <View style={styles.modalDetailRow}>
        <View style={styles.modalDetailIcon}>
          {React.createElement(icon, { size: 16, color: colors.primary })}
        </View>
        <View style={styles.modalDetailContent}>
          <Text style={styles.modalDetailLabel} numberOfLines={1}>{label}</Text>
          {customValueComponent ? (
            customValueComponent
          ) : (
            <View style={styles.modalDetailValueColumn}>
              <Text style={styles.modalDetailValue} numberOfLines={1}>{value}</Text>
              {subValue ? (
                <Text
                  style={[
                    styles.modalDetailSubValue,
                    subValueColor ? { color: subValueColor } : undefined,
                  ]}
                >
                  {subValue}
                </Text>
              ) : null}
            </View>
          )}
        </View>
      </View>
      {!isLast && <View style={styles.modalDetailSeparator} />}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t("insurance.title")}</Text>
      </View>

      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.9}
        onPress={() => setIsModalVisible(true)}
      >
        {/* Header: Provider, Status & Progress */}
        <LinearGradient
          colors={[colors.primary, colors.primary + "AA"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.cardHeaderGradient}
        >
          <View style={styles.cardHeaderGradientInner}>
            <View style={{ flexDirection: "row", alignItems: "center", flex: 1, paddingRight: 10 }}>
              <Text style={styles.providerName} numberOfLines={1}>{insurance.provider}</Text>
              <ChevronRight size={20} color="rgba(255,255,255,0.7)" style={{ marginLeft: 6 }} />
            </View>
            <View style={[styles.statusBadge, statusStyles.badge]}>
              <Text style={[styles.statusText, statusStyles.text]}>
                {t(`insurance.status_${status}`)}
              </Text>
            </View>
          </View>

          {/* Progress Bar */}
          {insurance.startDate && insurance.endDate && (
            <View>
              <View style={styles.progressContainer}>
                <View
                  style={[
                    styles.progressBar,
                    {
                      width: `${Math.max(0, Math.min(100, ((Date.now() - insurance.startDate) / (insurance.endDate - insurance.startDate)) * 100))}%`,
                      backgroundColor: status === "expired" ? "#EF4444" : "#FFFFFF"
                    }
                  ]}
                />
              </View>
              <View style={styles.progressLabels}>
                <Text style={styles.progressLabelText}>{formatDate(insurance.startDate)}</Text>
                <Text style={styles.progressLabelText}>{formatDate(insurance.endDate)}</Text>
              </View>
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>

      {/* Details Modal */}
      <BottomSheet
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      >
        {/* Modal Header */}
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>{t("insurance.title")}</Text>
          {insurance.endDate && (
            <TouchableOpacity
              onPress={handleExportToCalendar}
              disabled={isExporting}
              style={[
                styles.headerAction,
                { backgroundColor: colors.primary + "12" } // Circular subtle bg for light/dark
              ]}
            >
              <CalendarPlus 
                size={20} 
                color={insurance?.calendarEventId ? colors.error : colors.primary} 
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Gradient Header Card (inside modal) */}
        <View style={styles.modalGradientHeader}>
          <LinearGradient
            colors={[colors.primary, colors.primary + "AA"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ padding: 20, borderRadius: 16 }}
          >
            <View style={styles.cardHeaderGradientInner}>
              <Text style={[styles.providerName, { fontSize: 20 }]} numberOfLines={1}>
                {insurance.provider}
              </Text>
              <View style={[styles.statusBadge, statusStyles.badge]}>
                <Text style={[styles.statusText, statusStyles.text]}>
                  {t(`insurance.status_${status}`)}
                </Text>
              </View>
            </View>

            {insurance.startDate && insurance.endDate && (
              <View>
                <View style={styles.progressContainer}>
                  <View
                    style={[
                      styles.progressBar,
                      {
                        width: `${Math.max(0, Math.min(100, ((Date.now() - insurance.startDate) / (insurance.endDate - insurance.startDate)) * 100))}%`,
                        backgroundColor: status === "expired" ? "#EF4444" : "#FFFFFF"
                      }
                    ]}
                  />
                </View>
                <View style={styles.progressLabels}>
                  <Text style={styles.progressLabelText}>{formatDate(insurance.startDate)}</Text>
                  <Text style={styles.progressLabelText}>{formatDate(insurance.endDate)}</Text>
                </View>
              </View>
            )}
          </LinearGradient>
        </View>

        {/* Expiry Warning (right after header for prominence) */}
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

        {/* Policy Details Section */}
        <Text style={styles.modalSectionTitle}>
          {t("insurance.policy_details")}
        </Text>
        <View style={styles.modalSectionCard}>
          {renderDetailRow(
            Hash,
            t("insurance.policy_number"),
            insurance.policyNumber,
            undefined,
            undefined,
            undefined,
            !insurance.coverage  // isLast only if no coverage row follows
          )}
          {insurance.coverage &&
            renderDetailRow(
              Layers,
              t("insurance.coverage"),
              "",
              undefined,
              undefined,
              <View style={styles.coverageBadge}>
                <Text style={styles.coverageBadgeText}>
                  {t(`insurance.coverage_${insurance.coverage}`)}
                </Text>
              </View>,
              true
            )}
        </View>

        {/* Payment Details Section */}
        <Text style={styles.modalSectionTitle}>
          {t("insurance.payment_details")}
        </Text>
        <View style={styles.modalSectionCard}>
          {renderDetailRow(
            Euro,
            t("insurance.annual_cost"),
            `${formatNumber(insurance.annualCost)}€`,
            insurance.isPaid !== undefined
              ? (effectiveIsPaid ? t("insurance.paid") : t("insurance.unpaid"))
              : undefined,
            insurance.isPaid !== undefined
              ? (effectiveIsPaid ? "#10B981" : "#EF4444")
              : undefined,
            undefined,
            false
          )}
          {insurance.paymentFrequency &&
            renderDetailRow(
              CalendarClock,
              t("insurance.payment_frequency"),
              t(`insurance.frequency_${insurance.paymentFrequency}`),
              undefined,
              undefined,
              undefined,
              !insurance.deductible && !insurance.bonusPercentage
            )}
          {insurance.deductible !== undefined && insurance.deductible > 0 &&
            renderDetailRow(
              CreditCard,
              t("insurance.deductible"),
              `${formatNumber(insurance.deductible)}€`,
              undefined,
              undefined,
              undefined,
              !insurance.bonusPercentage
            )}
          {insurance.bonusPercentage !== undefined && insurance.bonusPercentage > 0 &&
            renderDetailRow(
              Shield,
              t("insurance.bonus_percentage"),
              `${formatNumber(insurance.bonusPercentage)}%`,
              undefined,
              undefined,
              undefined,
              true
            )}
        </View>

        {/* Mark as Paid Button */}
        {!effectiveIsPaid && insurance.isPaid !== undefined && (
          <TouchableOpacity
            style={styles.payButton}
            activeOpacity={0.8}
            onPress={handleMarkAsPaid}
          >
            <CheckCircle size={18} color="#FFFFFF" />
            <Text style={styles.payButtonText}>
              {t("insurance.mark_as_paid")}
            </Text>
          </TouchableOpacity>
        )}

        {/* Emergency Contact */}
        {insurance.emergencyContact ? (
          <TouchableOpacity
            style={styles.emergencyCard}
            activeOpacity={0.8}
            onPress={() => Linking.openURL(`tel:${insurance.emergencyContact}`)}
          >
            <View style={styles.emergencyCardIcon}>
              <PhoneCall size={20} color="#10B981" />
            </View>
            <View style={styles.emergencyCardContent}>
              <Text style={styles.emergencyCardLabel}>
                {t("insurance.emergency_contact")}
              </Text>
              <Text style={styles.emergencyCardNumber}>
                {insurance.emergencyContact}
              </Text>
            </View>
            <View style={styles.emergencyCallButton}>
              <Text style={styles.emergencyCallText}>
                {t("common.call")}
              </Text>
            </View>
          </TouchableOpacity>
        ) : null}

        {/* Additional Coverages */}
        {enabledCoverages.length > 0 && (
          <View>
            <Text style={styles.modalSectionTitle}>
              {t("insurance.additional_coverages")}
            </Text>
            <View style={styles.coveragesContainer}>
              {enabledCoverages.map((key) => renderCoverageDetails(key))}
            </View>
          </View>
        )}

        {/* Notes */}
        {insurance.notes ? (
          <View style={{ marginTop: 16 }}>
            <Text style={styles.modalSectionTitle}>
              {t("insurance.notes")}
            </Text>
            <View style={styles.notesCard}>
              <Text style={styles.notesText}>{insurance.notes}</Text>
            </View>
          </View>
        ) : null}



        {/* Edit Button (secondary/outlined) */}
        <TouchableOpacity
            style={[styles.editOutlinedButton, { marginTop: 0 }]}
          activeOpacity={0.8}
          onPress={handleNavigate}
        >
          <Edit2 size={18} color={colors.primary} />
          <Text style={styles.editOutlinedButtonText}>{t("common.edit")}</Text>
        </TouchableOpacity>
      </BottomSheet>
    </View>
  );
}
