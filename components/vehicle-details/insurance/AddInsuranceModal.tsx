import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { X, Check, Calendar } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

import { useTheme } from "@/contexts/ThemeContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { VehicleInsurance, PaymentFrequency, CoverageType } from "@/types";
import { Chip } from "@/components/ui/Chip";
import { Input } from "@/components/ui/Input";
import { createAddInsuranceModalStyles } from "./AddInsuranceModal.styles";

interface AddInsuranceModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (insurance: VehicleInsurance) => void;
  vehicleId: string;
  initialData?: VehicleInsurance;
}

export function AddInsuranceModal({
  visible,
  onClose,
  onSave,
  vehicleId,
  initialData,
}: AddInsuranceModalProps) {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const insets = useSafeAreaInsets();
  const styles = createAddInsuranceModalStyles(colors);

  const isEditing = !!initialData;

  // Form state
  const [provider, setProvider] = useState("");
  const [policyNumber, setPolicyNumber] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
  );
  const [annualCost, setAnnualCost] = useState("");
  const [paymentFrequency, setPaymentFrequency] =
    useState<PaymentFrequency>("annual");
  const [coverage, setCoverage] = useState<CoverageType | undefined>(undefined);
  const [isPaid, setIsPaid] = useState(false);
  const [notes, setNotes] = useState("");

  // Date picker state
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  // Reset/initialize form when modal opens
  useEffect(() => {
    if (visible) {
      if (initialData) {
        setProvider(initialData.provider);
        setPolicyNumber(initialData.policyNumber);
        setStartDate(new Date(initialData.startDate));
        setEndDate(new Date(initialData.endDate));
        setAnnualCost(initialData.annualCost.toString());
        setPaymentFrequency(initialData.paymentFrequency || "annual");
        setCoverage(initialData.coverage);
        setIsPaid(initialData.isPaid ?? false);
        setNotes(initialData.notes || "");
      } else {
        setProvider("");
        setPolicyNumber("");
        setStartDate(new Date());
        setEndDate(new Date(Date.now() + 365 * 24 * 60 * 60 * 1000));
        setAnnualCost("");
        setPaymentFrequency("annual");
        setCoverage(undefined);
        setIsPaid(false);
        setNotes("");
      }
    }
  }, [visible, initialData]);

  const handleSave = () => {
    if (!provider.trim() || !policyNumber.trim() || !annualCost.trim()) {
      return;
    }

    const cost = parseFloat(annualCost);
    if (isNaN(cost) || cost <= 0) {
      return;
    }

    const now = Date.now();
    const insurance: VehicleInsurance = {
      id:
        initialData?.id ||
        `ins_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      vehicleId,
      provider: provider.trim(),
      policyNumber: policyNumber.trim(),
      startDate: startDate.getTime(),
      endDate: endDate.getTime(),
      annualCost: cost,
      paymentFrequency,
      isPaid,
      coverage,
      notes: notes.trim() || undefined,
      createdAt: initialData?.createdAt || now,
      updatedAt: now,
    };

    onSave(insurance);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString();
  };

  const handleStartDateChange = (event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === "android") {
      setShowStartPicker(false);
    }
    if (date) {
      setStartDate(date);
    }
  };

  const handleEndDateChange = (event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === "android") {
      setShowEndPicker(false);
    }
    if (date) {
      setEndDate(date);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.headerButton}>
            <X size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {isEditing ? t("insurance.edit") : t("insurance.add")}
          </Text>
          <TouchableOpacity onPress={handleSave} style={styles.headerButton}>
            <Check size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.form}>
            {/* Provider */}
            <Input
              label={t("insurance.provider")}
              value={provider}
              onChangeText={setProvider}
              placeholder="Ex: Fidelidade, Allianz..."
              required
            />

            {/* Policy Number */}
            <Input
              label={t("insurance.policy_number")}
              value={policyNumber}
              onChangeText={setPolicyNumber}
              placeholder="Ex: AP-123456789"
              required
            />

            {/* Dates Row */}
            <View style={styles.datesRow}>
              <View style={styles.dateField}>
                <Text style={styles.label}>
                  {t("insurance.start_date")}{" "}
                  <Text style={styles.required}>*</Text>
                </Text>
                <TouchableOpacity
                  style={styles.dateButton}
                  onPress={() => setShowStartPicker(true)}
                >
                  <Calendar size={18} color={colors.textSecondary} />
                  <Text style={styles.dateButtonText}>
                    {formatDate(startDate)}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.dateField}>
                <Text style={styles.label}>
                  {t("insurance.end_date")}{" "}
                  <Text style={styles.required}>*</Text>
                </Text>
                <TouchableOpacity
                  style={styles.dateButton}
                  onPress={() => setShowEndPicker(true)}
                >
                  <Calendar size={18} color={colors.textSecondary} />
                  <Text style={styles.dateButtonText}>
                    {formatDate(endDate)}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Annual Cost */}
            <Input
              label={`${t("insurance.annual_cost")} (€)`}
              value={annualCost}
              onChangeText={setAnnualCost}
              placeholder="Ex: 350.00"
              keyboardType="decimal-pad"
              required
            />

            {/* Payment Frequency */}
            <View style={styles.section}>
              <Text style={styles.label}>
                {t("insurance.payment_frequency")}
              </Text>
              <View style={styles.chipsRow}>
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
                  />
                ))}
              </View>
            </View>

            {/* Coverage Type */}
            <View style={styles.section}>
              <Text style={styles.label}>{t("insurance.coverage")}</Text>
              <View style={styles.chipsRow}>
                {(["basic", "medium", "comprehensive"] as CoverageType[]).map(
                  (cov) => (
                  <Chip
                    key={cov}
                    label={t(`insurance.coverage_${cov}`)}
                    active={coverage === cov}
                    onPress={() =>
                      setCoverage(coverage === cov ? undefined : cov)
                    }
                  />
                ))}
              </View>
            </View>

            {/* Payment Status */}
            <View style={styles.section}>
              <Text style={styles.label}>{t("insurance.payment_status")}</Text>
              <View style={styles.chipsRow}>
                <Chip
                  label={t("insurance.paid")}
                  active={isPaid}
                  onPress={() => setIsPaid(true)}
                />
                <Chip
                  label={t("insurance.unpaid")}
                  active={!isPaid}
                  onPress={() => setIsPaid(false)}
                />
              </View>
            </View>

            {/* Notes */}
            <View style={styles.section}>
              <Text style={styles.label}>{t("insurance.notes")}</Text>
              <TextInput
                style={styles.notesInput}
                value={notes}
                onChangeText={setNotes}
                placeholder={t("insurance.notes_placeholder")}
                placeholderTextColor={colors.placeholder}
                multiline
                numberOfLines={3}
              />
            </View>
          </View>
        </ScrollView>

        {/* Date Pickers */}
        {showStartPicker &&
          (Platform.OS === "ios" ? (
            <Modal transparent visible={showStartPicker} animationType="fade">
              <TouchableOpacity
                style={styles.datePickerOverlay}
                onPress={() => setShowStartPicker(false)}
              >
                <View style={styles.datePickerContent}>
                  <DateTimePicker
                    value={startDate}
                    mode="date"
                    display="spinner"
                    onChange={handleStartDateChange}
                    themeVariant="dark"
                  />
                  <TouchableOpacity
                    style={styles.datePickerDone}
                    onPress={() => setShowStartPicker(false)}
                  >
                    <Text style={styles.datePickerDoneText}>
                      {t("common.done")}
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </Modal>
          ) : (
            <DateTimePicker
              value={startDate}
              mode="date"
              display="default"
              onChange={handleStartDateChange}
            />
          ))}

        {showEndPicker &&
          (Platform.OS === "ios" ? (
            <Modal transparent visible={showEndPicker} animationType="fade">
              <TouchableOpacity
                style={styles.datePickerOverlay}
                onPress={() => setShowEndPicker(false)}
              >
                <View style={styles.datePickerContent}>
                  <DateTimePicker
                    value={endDate}
                    mode="date"
                    display="spinner"
                    onChange={handleEndDateChange}
                    themeVariant="dark"
                  />
                  <TouchableOpacity
                    style={styles.datePickerDone}
                    onPress={() => setShowEndPicker(false)}
                  >
                    <Text style={styles.datePickerDoneText}>
                      {t("common.done")}
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </Modal>
          ) : (
            <DateTimePicker
              value={endDate}
              mode="date"
              display="default"
              onChange={handleEndDateChange}
            />
          ))}
      </KeyboardAvoidingView>
    </Modal>
  );
}
