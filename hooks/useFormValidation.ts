import { useState, useCallback } from "react";
import { useLocalization } from "@/contexts/LocalizationContext";

type ValidationRule = (value: string) => string | null;

interface ValidationRules {
  [key: string]: ValidationRule[];
}

interface ValidationErrors {
  [key: string]: string | null;
}

export const useFormValidation = (initialValues: Record<string, any>) => {
  const { t } = useLocalization();
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validate = useCallback(
    (name: string, value: string, rules: ValidationRule[]) => {
      let error: string | null = null;

      for (const rule of rules) {
        const result = rule(value);
        if (result) {
          error = result;
          break;
        }
      }

      setErrors((prev) => ({ ...prev, [name]: error }));
      return !error;
    },
    []
  );

  const handleBlur = useCallback((name: string) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
  }, []);

  const resetValidation = useCallback(() => {
    setErrors({});
    setTouched({});
  }, []);

  // Common validation rules
  const rules = {
    required: (value: string) =>
      !value || value.trim() === "" ? t("validation.required") : null,

    number: (value: string) =>
      isNaN(Number(value)) ? t("validation.number_required") : null,

    positive: (value: string) =>
      Number(value) <= 0 ? t("validation.positive_required") : null,

    year: (value: string) => {
      const year = Number(value);
      const currentYear = new Date().getFullYear();
      if (isNaN(year) || year < 1900 || year > currentYear + 1) {
        return t("validation.invalid_year");
      }
      return null;
    },

    mileage: (value: string) => {
      const mileage = Number(value);
      if (isNaN(mileage) || mileage < 0 || mileage > 9999999) {
        return t("validation.invalid_mileage");
      }
      return null;
    },
  };

  return {
    errors,
    touched,
    validate,
    handleBlur,
    resetValidation,
    rules,
    hasErrors: Object.values(errors).some((error) => error !== null),
  };
};
