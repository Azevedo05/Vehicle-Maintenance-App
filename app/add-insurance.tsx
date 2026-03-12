import { router, Stack, useLocalSearchParams } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Check,
  Trash2,
  Calendar,
  CarFront,
  Gavel,
  Shield,
  Flame,
  CloudRain,
  Heart,
  Lock,
  RectangleHorizontal,
} from "lucide-react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

import { useVehicles } from "@/contexts/VehicleContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { useAppAlert } from "@/contexts/AlertContext";
import { useNotifications } from "@/contexts/NotificationContext";
import {
  VehicleInsurance,
  PaymentFrequency,
  CoverageType,
  InsuranceCoverages,
  CoverageOption,
  RoadsideAssistance,
} from "@/types";
import { ThemedBackground } from "@/components/ThemedBackground";
import { Input } from "@/components/ui/Input";
import { Chip } from "@/components/ui/Chip";
import { CoverageToggle } from "@/components/ui/CoverageToggle";
import { Accordion } from "@/components/ui/Accordion";
import { createFuelFormStyles } from "@/styles/fuel/FuelForm.styles";
import Toast from "react-native-toast-message";

// Common insurers in Portugal
const INSURERS = [
  "Fidelidade",
  "Allianz",
  "Tranquilidade",
  "Zurich",
  "Ageas",
  "Liberty Seguros",
  "Generali",
  "Mapfre",
  "Lusitania",
  "Caravela",
  "Una Seguros",
  "Victoria",
  "OK! Teleseguros",
  "Logo",
  "Seguro Directo",
  "N Seguros",
  "Génesis",
];

export default function AddInsuranceScreen() {
  const { vehicleId, insuranceId } = useLocalSearchParams();
  const { getVehicleById, updateVehicle } = useVehicles();
  const { colors } = useTheme();
  const { t } = useLocalization();
  const { showAlert } = useAppAlert();
  const { cancelNotification } = useNotifications();

  const vehicle = getVehicleById(vehicleId as string);
  const existingInsurance = vehicle?.insurance;
  const isEditing = !!insuranceId || !!existingInsurance;

  // Basic form state
  const [provider, setProvider] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredInsurers, setFilteredInsurers] = useState<string[]>([]);

  const [policyNumber, setPolicyNumber] = useState("");
  const [policyError, setPolicyError] = useState("");

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
  );
  const [annualCost, setAnnualCost] = useState("");
  const [paymentFrequency, setPaymentFrequency] = useState<
    PaymentFrequency | undefined
  >(undefined);
  const [coverage, setCoverage] = useState<CoverageType | undefined>(undefined);
  const [isPaid, setIsPaid] = useState<boolean | undefined>(undefined);
  const [notes, setNotes] = useState("");

  // NEW: Additional fields
  const [deductible, setDeductible] = useState("");
  const [bonusPercentage, setBonusPercentage] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");

  // NEW: Coverage toggles
  const [coverages, setCoverages] = useState<InsuranceCoverages>({});

  const [costError, setCostError] = useState("");
  const [deductibleError, setDeductibleError] = useState("");
  const [bonusError, setBonusError] = useState("");
  const [contactError, setContactError] = useState("");
  const [notesError, setNotesError] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Date picker state
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const styles = createFuelFormStyles(colors);

  // Helper to update a coverage
  const updateCoverage = <K extends keyof InsuranceCoverages>(
    key: K,
    value: Partial<InsuranceCoverages[K]>
  ) => {
    setCoverages((prev) => ({
      ...prev,
      [key]: { ...prev[key], ...value },
    }));
  };

  // Provider suggestions logic
  const handleProviderChange = (text: string) => {
    setProvider(text);
    if (text.length > 0) {
      const filtered = INSURERS.filter((insurer) =>
        insurer.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredInsurers(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  const selectProvider = (name: string) => {
    setProvider(name);
    setShowSuggestions(false);
  };

  // Policy validation logic
  const validatePolicy = (text: string) => {
    setPolicyNumber(text);
    if (text.length > 0 && text.length < 4) {
      setPolicyError(t("insurance.policy_too_short"));
    } else if (text.length > 0 && !/^[a-zA-Z0-9\-\/\.]+$/.test(text)) {
      setPolicyError(t("insurance.policy_invalid_chars"));
    } else {
      setPolicyError("");
    }
  };

  const validateCost = (val: string) => {
    setAnnualCost(val);
    const parsed = parseFloat(val);
    if (val && (isNaN(parsed) || parsed <= 0 || parsed > 10000)) {
      setCostError(t("insurance.invalid_cost_limit"));
    } else {
      setCostError("");
    }
  };

  const validateDeductible = (val: string) => {
    setDeductible(val);
    const parsed = parseFloat(val);
    if (val && (isNaN(parsed) || parsed < 0 || parsed > 10000)) {
      setDeductibleError(t("insurance.invalid_deductible_limit"));
    } else {
      setDeductibleError("");
    }
  };

  const validateBonus = (val: string) => {
    setBonusPercentage(val);
    const parsed = parseFloat(val);
    if (val && (isNaN(parsed) || parsed < 0 || parsed > 100)) {
      setBonusError(t("insurance.invalid_bonus_limit"));
    } else {
      setBonusError("");
    }
  };

  const validateContact = (val: string) => {
    setEmergencyContact(val);
    if (val.trim().length > 20) {
      setContactError(t("insurance.invalid_contact_limit"));
    } else {
      setContactError("");
    }
  };

  const validateNotes = (val: string) => {
    setNotes(val);
    if (val.trim().length > 250) {
      setNotesError(t("insurance.invalid_notes_limit"));
    } else {
      setNotesError("");
    }
  };

  // Load existing insurance data
  useEffect(() => {
    if (existingInsurance) {
      setProvider(existingInsurance.provider);
      setPolicyNumber(existingInsurance.policyNumber);
      setStartDate(new Date(existingInsurance.startDate));
      setEndDate(new Date(existingInsurance.endDate));
      setAnnualCost(existingInsurance.annualCost.toString());
      setPaymentFrequency(existingInsurance.paymentFrequency);
      setCoverage(existingInsurance.coverage);
      setIsPaid(existingInsurance.isPaid);
      setNotes(existingInsurance.notes || "");
      setDeductible(existingInsurance.deductible?.toString() || "");
      setBonusPercentage(existingInsurance.bonusPercentage?.toString() || "");
      setEmergencyContact(existingInsurance.emergencyContact || "");
      setCoverages(existingInsurance.coverages || {});
    }
  }, [existingInsurance]);

  const handleSubmit = async () => {
    // Validate policy
    const isPolicyValid =
      policyNumber.length >= 4 && /^[a-zA-Z0-9\-\/\.]+$/.test(policyNumber);

    if (!isPolicyValid && policyNumber.length > 0) {
      const errorMsg =
        policyNumber.length < 4
          ? t("insurance.policy_too_short")
          : t("insurance.policy_invalid_chars");

      setPolicyError(errorMsg);

      showAlert({
        title: t("common.error"),
        message: errorMsg,
      });
      return;
    }

    if (startDate.getTime() >= endDate.getTime()) {
      showAlert({
        title: t("common.error"),
        message: t("insurance.invalid_dates"),
      });
      return;
    }

    if (
      !provider.trim() ||
      !policyNumber.trim() ||
      !annualCost.trim() ||
      !paymentFrequency ||
      !coverage ||
      (!isEditing && isPaid === undefined)
    ) {
      showAlert({
        title: t("vehicles.missing_info"),
        message: t("vehicles.fill_required"),
      });
      return;
    }

    if (policyError || costError || deductibleError || bonusError || contactError || notesError) {
      showAlert({
        title: t("common.error"),
        message: t("common.invalid_fields"),
      });
      return;
    }

    const cost = parseFloat(annualCost);
    if (isNaN(cost) || cost <= 0 || cost > 10000) {
      showAlert({
        title: t("common.error"),
        message: t("insurance.invalid_cost_limit"),
      });
      return;
    }

    const parsedDeductible = deductible ? parseFloat(deductible) : undefined;
    if (parsedDeductible !== undefined && (isNaN(parsedDeductible) || parsedDeductible < 0 || parsedDeductible > 10000)) {
      showAlert({
        title: t("common.error"),
        message: t("insurance.invalid_deductible_limit"),
      });
      return;
    }

    const parsedBonus = bonusPercentage ? parseFloat(bonusPercentage) : undefined;
    if (parsedBonus !== undefined && (isNaN(parsedBonus) || parsedBonus < 0 || parsedBonus > 100)) {
      showAlert({
        title: t("common.error"),
        message: t("insurance.invalid_bonus_limit"),
      });
      return;
    }

    const cleanContact = emergencyContact.trim();
    if (cleanContact.length > 20) {
      showAlert({
        title: t("common.error"),
        message: t("insurance.invalid_contact_limit"),
      });
      return;
    }

    const cleanNotes = notes.trim();
    if (cleanNotes.length > 250) {
      showAlert({
        title: t("common.error"),
        message: t("insurance.invalid_notes_limit"),
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const now = Date.now();
      const insurance: VehicleInsurance = {
        id:
          existingInsurance?.id ||
          `ins_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        vehicleId: vehicleId as string,
        provider: provider.trim(),
        policyNumber: policyNumber.trim(),
        startDate: startDate.getTime(),
        endDate: endDate.getTime(),
        annualCost: cost,
        paymentFrequency,
        isPaid,
        coverage,
        notes: cleanNotes || undefined,
        deductible: parsedDeductible,
        bonusPercentage: parsedBonus,
        emergencyContact: cleanContact || undefined,
        coverages: Object.keys(coverages).length > 0 ? coverages : undefined,
        createdAt: existingInsurance?.createdAt || now,
        updatedAt: now,
      };

      await updateVehicle(vehicleId as string, { insurance });

      Toast.show({
        type: "success",
        text1: t(existingInsurance ? "insurance.edit_success" : "insurance.add_success"),
        props: { toastId: Date.now() },
      });
      router.back();
    } catch (error) {
      console.error("Error saving insurance:", error);
      showAlert({
        title: t("common.error"),
        message: t("common.error"),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = () => {
    showAlert({
      title: t("insurance.delete_title"),
      message: t("insurance.delete_message"),
      buttons: [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("common.delete"),
          style: "destructive",
          onPress: async () => {
            try {
              if (existingInsurance?.id) {
                await cancelNotification(existingInsurance.id);
              }
              await updateVehicle(vehicleId as string, {
                insurance: undefined,
              });
              Toast.show({
                type: "success",
                text1: t("insurance.delete_success"),
                props: { toastId: Date.now() },
              });
              router.back();
            } catch (error) {
              console.error("Error deleting insurance:", error);
            }
          },
        },
      ],
    });
  };

  const formatDate = (date: Date) => date.toLocaleDateString();

  const handleStartDateChange = (event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === "android") setShowStartPicker(false);
    if (date) setStartDate(date);
  };

  const handleEndDateChange = (event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === "android") setShowEndPicker(false);
    if (date) setEndDate(date);
  };

  return (
    <ThemedBackground>
      <SafeAreaView
        style={[styles.container, { backgroundColor: "transparent" }]}
        edges={["bottom"]}
      >
        <Stack.Screen
          options={{
            title: isEditing ? t("insurance.edit") : t("insurance.add"),
            headerRight: () => (
              <View
                style={{
                  flexDirection: "row",
                  gap: 16,
                  alignItems: "center",
                  marginRight: Platform.OS === "ios" ? -16 : 0,
                }}
              >
                {isSubmitting ? (
                  <ActivityIndicator color={colors.primary} />
                ) : (
                  <>
                    <TouchableOpacity
                      onPress={handleSubmit}
                      disabled={isSubmitting}
                      hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                    >
                      <Check size={24} color={colors.primary} />
                    </TouchableOpacity>
                    {isEditing && (
                      <TouchableOpacity
                        onPress={handleDelete}
                        disabled={isSubmitting}
                        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                      >
                        <Trash2 size={24} color={colors.error} />
                      </TouchableOpacity>
                    )}
                  </>
                )}
              </View>
            ),
          }}
        />

        <KeyboardAvoidingView
          behavior="padding"
          style={styles.keyboardView}
          keyboardVerticalOffset={100}
        >
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.form}>
              {/* ===== BASIC INFO ===== */}
              <Accordion
                title={t("insurance.section_basic_info")}
                icon={<Shield size={20} color={colors.primary} />}
                initiallyExpanded={true}
              >
                <View style={{ gap: 16 }}>
                  <View>
                    <Input
                      label={t("insurance.provider")}
                      value={provider}
                      onChangeText={handleProviderChange}
                      onFocus={() =>
                        provider.length > 0 && setShowSuggestions(true)
                      }
                      placeholder="Ex: Fidelidade, Allianz..."
                      required
                    />
                    {showSuggestions && filteredInsurers.length > 0 && (
                      <View style={styles.suggestionsContainer}>
                        {filteredInsurers.map((insurer) => (
                          <TouchableOpacity
                            key={insurer}
                            style={styles.suggestionItem}
                            onPress={() => selectProvider(insurer)}
                          >
                            <Text style={styles.suggestionText}>{insurer}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>

                  <Input
                    label={t("insurance.policy_number")}
                    value={policyNumber}
                    onChangeText={validatePolicy}
                    placeholder="Ex: AP-123456789"
                    required
                    error={policyError}
                  />

                  {/* Coverage Type */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>
                      {t("insurance.coverage")}{" "}
                      <Text style={{ color: colors.error }}>*</Text>
                    </Text>
                    <View
                      style={[
                        styles.typeRow,
                        { flexWrap: "wrap", justifyContent: "flex-start", gap: 8 },
                      ]}
                    >
                      {(
                        ["basic", "medium", "comprehensive"] as CoverageType[]
                      ).map((type) => (
                        <Chip
                          key={type}
                          label={t(`insurance.coverage_${type}`)}
                          active={coverage === type}
                          onPress={() =>
                            setCoverage(coverage === type ? undefined : type)
                          }
                          style={styles.typeChip}
                        />
                      ))}
                    </View>
                  </View>


                </View>
              </Accordion>

              {/* ===== DATES & PAYMENTS ===== */}
              <Accordion
                title={t("insurance.section_dates")}
                icon={<Calendar size={20} color={colors.primary} />}
                initiallyExpanded={false}
              >
                <View style={{ gap: 16 }}>
                  {/* Dates Row */}
                  <View style={styles.row}>
                    <View style={[styles.rowItem, { gap: 8 }]}>
                      <Text style={styles.label}>
                        {t("insurance.start_date")}{" "}
                        <Text style={{ color: colors.error }}>*</Text>
                      </Text>
                      <TouchableOpacity
                        style={styles.input}
                        onPress={() => setShowStartPicker(true)}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <Calendar size={18} color={colors.textSecondary} />
                          <Text style={{ color: colors.text, fontSize: 16 }}>
                            {formatDate(startDate)}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>

                    <View style={[styles.rowItem, { gap: 8 }]}>
                      <Text style={styles.label}>
                        {t("insurance.end_date")}{" "}
                        <Text style={{ color: colors.error }}>*</Text>
                      </Text>
                      <TouchableOpacity
                        style={styles.input}
                        onPress={() => setShowEndPicker(true)}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <Calendar size={18} color={colors.textSecondary} />
                          <Text style={{ color: colors.text, fontSize: 16 }}>
                            {formatDate(endDate)}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <Input
                    label={`${t("insurance.annual_cost")} (€)`}
                    value={annualCost}
                    onChangeText={validateCost}
                    placeholder="Ex: 350.00"
                    keyboardType="decimal-pad"
                    required
                    maxLength={8}
                    error={costError}
                  />

                  {/* ===== DEDUCTIBLE & BONUS ===== */}
                  <View style={styles.row}>
                    <View style={styles.rowItem}>
                      <Input
                        label={`${t("insurance.deductible")} (€)`}
                        value={deductible}
                        onChangeText={validateDeductible}
                        placeholder={t("insurance.deductible_placeholder")}
                        keyboardType="decimal-pad"
                        maxLength={8}
                        error={deductibleError}
                      />
                    </View>
                    <View style={styles.rowItem}>
                      <Input
                        label={`${t("insurance.bonus_percentage")} (%)`}
                        value={bonusPercentage}
                        onChangeText={validateBonus}
                        placeholder={t("insurance.bonus_percentage_placeholder")}
                        keyboardType="decimal-pad"
                        maxLength={6}
                        error={bonusError}
                      />
                    </View>
                  </View>

                  {/* Payment Frequency */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>
                      {t("insurance.payment_frequency")}{" "}
                      <Text style={{ color: colors.error }}>*</Text>
                    </Text>
                    <View
                      style={[
                        styles.typeRow,
                        { flexWrap: "wrap", justifyContent: "flex-start", gap: 8 },
                      ]}
                    >
                      {(
                        [
                          "monthly",
                          "quarterly",
                          "semiannual",
                          "annual",
                        ] as PaymentFrequency[]
                      ).map((freq) => (
                        <Chip
                          key={freq}
                          label={t(`insurance.frequency_${freq}`)}
                          active={paymentFrequency === freq}
                          onPress={() => setPaymentFrequency(freq)}
                          style={styles.typeChip}
                        />
                      ))}
                    </View>
                  </View>

                  {/* Payment Status - only when creating, editing uses the Mark as Paid button */}
                  {!isEditing && (
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>
                      {t("insurance.payment_status")}{" "}
                      <Text style={{ color: colors.error }}>*</Text>
                    </Text>
                    <View style={styles.typeRow}>
                      <Chip
                        label={t("insurance.paid")}
                        active={isPaid}
                        onPress={() => setIsPaid(true)}
                        style={styles.typeChip}
                      />
                      <Chip
                        label={t("insurance.unpaid")}
                        active={isPaid === false}
                        onPress={() => setIsPaid(false)}
                        style={styles.typeChip}
                      />
                    </View>
                  </View>
                  )}
                </View>
              </Accordion>

              {/* ===== ADDITIONAL COVERAGES ===== */}
              <Accordion
                title={t("insurance.additional_coverages")}
                icon={<Shield size={20} color={colors.primary} />}
                initiallyExpanded={false}
              >
                <View style={{ gap: 16 }}>
                  {/* Glass Breakage */}
                  <CoverageToggle
                    label={t("insurance.coverage_glass")}
                    enabled={coverages.glassBreakage?.enabled || false}
                    onToggle={(enabled) =>
                      updateCoverage("glassBreakage", { enabled })
                    }
                    icon={
                      <RectangleHorizontal size={18} color={colors.primary} />
                    }
                  >
                    <Input
                      label={`${t("insurance.max_value")} (€)`}
                      value={coverages.glassBreakage?.maxValue?.toString() || ""}
                      onChangeText={(v) =>
                        updateCoverage("glassBreakage", {
                          maxValue: v ? parseFloat(v) : undefined,
                        })
                      }
                      placeholder={t("insurance.max_value_placeholder")}
                      keyboardType="decimal-pad"
                    />
                  </CoverageToggle>

                  {/* Roadside Assistance */}
                  <CoverageToggle
                    label={t("insurance.coverage_roadside")}
                    enabled={coverages.roadsideAssistance?.enabled || false}
                    onToggle={(enabled) =>
                      updateCoverage("roadsideAssistance", { enabled })
                    }
                    icon={<CarFront size={18} color={colors.primary} />}
                  >
                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>
                        {t("insurance.includes_replacement")}
                      </Text>
                      <View style={styles.typeRow}>
                        <Chip
                          label={t("common.yes")}
                          active={
                            coverages.roadsideAssistance?.includesReplacement ||
                            false
                          }
                          onPress={() =>
                            updateCoverage("roadsideAssistance", {
                              includesReplacement: true,
                            })
                          }
                          style={styles.typeChip}
                        />
                        <Chip
                          label={t("common.no")}
                          active={
                            !coverages.roadsideAssistance?.includesReplacement
                          }
                          onPress={() =>
                            updateCoverage("roadsideAssistance", {
                              includesReplacement: false,
                            })
                          }
                          style={styles.typeChip}
                        />
                      </View>
                    </View>
                    {coverages.roadsideAssistance?.includesReplacement && (
                      <Input
                        label={t("insurance.replacement_days")}
                        value={
                          coverages.roadsideAssistance?.replacementDays?.toString() ||
                          ""
                        }
                        onChangeText={(v) =>
                          updateCoverage("roadsideAssistance", {
                            replacementDays: v ? parseInt(v, 10) : undefined,
                          })
                        }
                        placeholder={t("insurance.replacement_days_placeholder")}
                        keyboardType="number-pad"
                      />
                    )}
                  </CoverageToggle>

                  {/* Legal Protection */}
                  <CoverageToggle
                    label={t("insurance.coverage_legal")}
                    enabled={coverages.legalProtection?.enabled || false}
                    onToggle={(enabled) =>
                      updateCoverage("legalProtection", { enabled })
                    }
                    icon={<Gavel size={18} color={colors.primary} />}
                  >
                    <Input
                      label={`${t("insurance.max_value")} (€)`}
                      value={
                        coverages.legalProtection?.maxValue?.toString() || ""
                      }
                      onChangeText={(v) =>
                        updateCoverage("legalProtection", {
                          maxValue: v ? parseFloat(v) : undefined,
                        })
                      }
                      placeholder={t("insurance.max_value_placeholder")}
                      keyboardType="decimal-pad"
                    />
                  </CoverageToggle>

                  {/* Own Damage */}
                  <CoverageToggle
                    label={t("insurance.coverage_own_damage")}
                    enabled={coverages.ownDamage?.enabled || false}
                    onToggle={(enabled) =>
                      updateCoverage("ownDamage", { enabled })
                    }
                    icon={<Shield size={18} color={colors.primary} />}
                  >
                    <Input
                      label={`${t("insurance.coverage_deductible")} (€)`}
                      value={coverages.ownDamage?.deductible?.toString() || ""}
                      onChangeText={(v) =>
                        updateCoverage("ownDamage", {
                          deductible: v ? parseFloat(v) : undefined,
                        })
                      }
                      placeholder={t("insurance.deductible_placeholder")}
                      keyboardType="decimal-pad"
                    />
                  </CoverageToggle>

                  {/* Theft */}
                  <CoverageToggle
                    label={t("insurance.coverage_theft")}
                    enabled={coverages.theft?.enabled || false}
                    onToggle={(enabled) => updateCoverage("theft", { enabled })}
                    icon={<Lock size={18} color={colors.primary} />}
                  >
                    <Input
                      label={`${t("insurance.max_value")} (€)`}
                      value={coverages.theft?.maxValue?.toString() || ""}
                      onChangeText={(v) =>
                        updateCoverage("theft", {
                          maxValue: v ? parseFloat(v) : undefined,
                        })
                      }
                      placeholder={t("insurance.max_value_placeholder")}
                      keyboardType="decimal-pad"
                    />
                  </CoverageToggle>

                  {/* Fire */}
                  <CoverageToggle
                    label={t("insurance.coverage_fire")}
                    enabled={coverages.fire?.enabled || false}
                    onToggle={(enabled) => updateCoverage("fire", { enabled })}
                    icon={<Flame size={18} color={colors.primary} />}
                  >
                    <Input
                      label={`${t("insurance.max_value")} (€)`}
                      value={coverages.fire?.maxValue?.toString() || ""}
                      onChangeText={(v) =>
                        updateCoverage("fire", {
                          maxValue: v ? parseFloat(v) : undefined,
                        })
                      }
                      placeholder={t("insurance.max_value_placeholder")}
                      keyboardType="decimal-pad"
                    />
                  </CoverageToggle>

                  {/* Natural Disasters */}
                  <CoverageToggle
                    label={t("insurance.coverage_natural")}
                    enabled={coverages.naturalDisasters?.enabled || false}
                    onToggle={(enabled) =>
                      updateCoverage("naturalDisasters", { enabled })
                    }
                    icon={<CloudRain size={18} color={colors.primary} />}
                  >
                    <Input
                      label={`${t("insurance.max_value")} (€)`}
                      value={
                        coverages.naturalDisasters?.maxValue?.toString() || ""
                      }
                      onChangeText={(v) =>
                        updateCoverage("naturalDisasters", {
                          maxValue: v ? parseFloat(v) : undefined,
                        })
                      }
                      placeholder={t("insurance.max_value_placeholder")}
                      keyboardType="decimal-pad"
                    />
                  </CoverageToggle>

                  {/* Personal Accident */}
                  <CoverageToggle
                    label={t("insurance.coverage_personal")}
                    enabled={coverages.personalAccident?.enabled || false}
                    onToggle={(enabled) =>
                      updateCoverage("personalAccident", { enabled })
                    }
                    icon={<Heart size={18} color={colors.primary} />}
                  >
                    <Input
                      label={`${t("insurance.max_value")} (€)`}
                      value={
                        coverages.personalAccident?.maxValue?.toString() || ""
                      }
                      onChangeText={(v) =>
                        updateCoverage("personalAccident", {
                          maxValue: v ? parseFloat(v) : undefined,
                        })
                      }
                      placeholder={t("insurance.max_value_placeholder")}
                      keyboardType="decimal-pad"
                    />
                  </CoverageToggle>
                </View>
              </Accordion>

              {/* Emergency Contact & Notes */}
              <View style={{ gap: 16 }}>
                  <Input
                    label={t("insurance.emergency_contact")}
                    value={emergencyContact}
                    onChangeText={validateContact}
                    placeholder="Ex: +351 210 000 000"
                    keyboardType="phone-pad"
                    maxLength={20}
                    error={contactError}
                  />
                  <Input
                    label={t("insurance.notes")}
                    value={notes}
                    onChangeText={validateNotes}
                    placeholder={t("insurance.notes_placeholder")}
                    multiline
                    numberOfLines={4}
                    style={{ minHeight: 100, textAlignVertical: "top" }}
                    maxLength={250}
                    error={notesError}
                  />
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        {/* Date Pickers */}
        {showStartPicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={handleStartDateChange}
          />
        )}
        {showEndPicker && (
          <DateTimePicker
            value={endDate}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={handleEndDateChange}
          />
        )}
      </SafeAreaView>
    </ThemedBackground>
  );
}
