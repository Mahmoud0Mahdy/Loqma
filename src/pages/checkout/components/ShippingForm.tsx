import { useState, useCallback, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Label } from "../../../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../../../components/ui/radio-group";
import { MapPin, ShieldCheck } from "lucide-react";

import { validateField } from "../validation/shippingValidation";
import { FormField } from "../components/form/PaymentForm";
import { Input } from "../../../components/ui/input";

// 1. Defined strict TypeScript interfaces to replace `any`
interface ShippingFormData {
  fullName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  deliveryMethod?: "standard" | "express";
  [key: string]: any;
}

interface ShippingFormProps {
  formData: ShippingFormData;
  handleInputChange: (field: string, value: string) => void;
  nextStep: () => void;
  subtotal: number;
}

export function ShippingForm({
  formData,
  handleInputChange,
  nextStep,
  subtotal,
}: ShippingFormProps) {
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // 2. Memoized required fields to avoid recreating the array on every render
  const requiredFields = useMemo(
    () => ["fullName", "email", "address", "city", "state", "zipCode"],
    []
  );

  // 3. Consolidated formatting into a clean switch statement and added useCallback
  const handleChange = useCallback(
    (field: string, rawValue: string) => {
      let value = rawValue;

      switch (field) {
        case "fullName":
        case "city":
        case "state":
          value = value.replace(/[^A-Za-z\s]/g, "").slice(0, 50);
          break;
        case "phone":
          value = value.replace(/[^\d+()\-\s]/g, "").slice(0, 20);
          break;
        case "zipCode":
          value = value.replace(/\D/g, "").slice(0, 10);
          break;
        case "address":
          value = value.slice(0, 100);
          break;
      }

      handleInputChange(field, value);

      if (touched[field]) {
        const valid = validateField(field, value);
        setErrors((prev) => ({
          ...prev,
          [field]: !valid,
        }));
      }
    },
    [handleInputChange, touched]
  );

  const handleBlur = useCallback(
    (field: string) => {
      setTouched((prev) => ({ ...prev, [field]: true }));
      const valid = validateField(field, formData[field] || "");
      setErrors((prev) => ({ ...prev, [field]: !valid }));
    },
    [formData]
  );

  const fieldError = useCallback(
    (f: string) => touched[f] && errors[f],
    [touched, errors]
  );

  const fieldValid = useCallback(
    (f: string) => touched[f] && !errors[f] && !!formData[f],
    [touched, errors, formData]
  );

  const inputStyle = useCallback(
    (f: string) => {
      if (fieldError(f)) {
        return "border-red-500 focus-visible:ring-red-500";
      }
      return "focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500";
    },
    [fieldError]
  );

  // 4. Memoized to prevent calculating this on every single render
  const disableContinue = useMemo(() => {
    return requiredFields.some((field) => !formData[field] || errors[field]);
  }, [requiredFields, formData, errors]);

  const handleContinue = useCallback(() => {
    // Added fallbacks to prevent "undefined" showing up in the full string
    const fullAddress = `${formData.address || ""}, ${formData.city || ""}, ${
      formData.state || ""
    }`;

    handleInputChange("fullAddress", fullAddress);
    nextStep();
  }, [formData, handleInputChange, nextStep]);

  return (
    <Card className="shadow-md border border-gray-200">
      <CardHeader className="pb-4 border-b border-gray-100 mb-4">
        <CardTitle className="flex items-center text-xl font-bold text-gray-800">
          <MapPin size={22} className="mr-2 text-green-600" />
          Shipping Information
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* SECTION: PERSONAL INFO */}
        <div className="space-y-5">
          <div>
            <Label className="text-sm font-semibold text-gray-700 mb-1.5 block">
              Full Name
            </Label>
            <Input
              value={formData?.fullName || ""}
              disabled
              className="h-12 border-gray-200 rounded-lg bg-gray-50 text-gray-600 font-medium"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <Label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                Email
              </Label>
              <Input
                value={formData?.email || ""}
                disabled
                className="h-12 bg-gray-50 border border-gray-200 text-gray-600 font-medium"
              />
            </div>

            <FormField
              label="Phone"
              name="phone"
              value={formData.phone || ""}
              placeholder="+20 100 123 4567"
              error="Invalid phone number"
              handleChange={handleChange}
              handleBlur={handleBlur}
              inputStyle={inputStyle}
              fieldError={fieldError}
              fieldValid={fieldValid}
            />
          </div>
        </div>

        {/* SECTION: ADDRESS */}
        <div className="space-y-5 pt-4 border-t border-gray-100">
          <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
            Address Details
          </h3>

          <FormField
            label="Address"
            name="address"
            value={formData.address || ""}
            placeholder="123 Main Street, Apartment 4B"
            error="Enter valid address"
            handleChange={handleChange}
            handleBlur={handleBlur}
            inputStyle={inputStyle}
            fieldError={fieldError}
            fieldValid={fieldValid}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <FormField
              label="City"
              name="city"
              value={formData.city || ""}
              error="Invalid city"
              handleChange={handleChange}
              handleBlur={handleBlur}
              inputStyle={inputStyle}
              fieldError={fieldError}
              fieldValid={fieldValid}
            />

            <FormField
              label="State"
              name="state"
              value={formData.state || ""}
              error="Invalid state"
              handleChange={handleChange}
              handleBlur={handleBlur}
              inputStyle={inputStyle}
              fieldError={fieldError}
              fieldValid={fieldValid}
            />

            <FormField
              label="ZIP Code"
              name="zipCode"
              value={formData.zipCode || ""}
              error="Invalid ZIP code"
              handleChange={handleChange}
              handleBlur={handleBlur}
              inputStyle={inputStyle}
              fieldError={fieldError}
              fieldValid={fieldValid}
            />
          </div>
        </div>

        {/* SECTION: DELIVERY METHOD */}
        <div className="space-y-4 pt-4 border-t border-gray-100">
          <Label className="text-sm font-bold text-gray-800 uppercase tracking-wider block mb-3">
            Delivery Method
          </Label>

          <RadioGroup
            value={formData.deliveryMethod || "standard"}
            onValueChange={(v) => handleInputChange("deliveryMethod", v)}
            className="grid gap-4"
          >
            {/* 🔥 BUG FIX: Changed wrapper from div to label and matched htmlFor. Entire block is now clickable. */}
            <label
              htmlFor="standard"
              className={`flex items-center space-x-3 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                (formData.deliveryMethod || "standard") === "standard"
                  ? "border-green-600 bg-green-50/40"
                  : "border-gray-100 hover:border-gray-200"
              }`}
            >
              <RadioGroupItem
                value="standard"
                id="standard"
                className="text-green-600"
              />
              <div className="flex flex-col w-full flex-1">
                <span className="font-semibold text-gray-900">
                  Standard Delivery
                </span>
                <span className="text-sm text-gray-500 mt-0.5">
                  3-5 business days —{" "}
                  {subtotal > 50 ? (
                    <span className="text-green-600 font-bold uppercase text-xs ml-1">
                      Free
                    </span>
                  ) : (
                    "$5.99"
                  )}
                </span>
              </div>
            </label>

            {/* Express Option */}
            <label
              htmlFor="express"
              className={`flex items-center space-x-3 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                formData.deliveryMethod === "express"
                  ? "border-green-600 bg-green-50/40"
                  : "border-gray-100 hover:border-gray-200"
              }`}
            >
              <RadioGroupItem
                value="express"
                id="express"
                className="text-green-600"
              />
              <div className="flex flex-col w-full flex-1">
                <span className="font-semibold text-gray-900">
                  Express Delivery
                </span>
                <span className="text-sm text-gray-500 mt-0.5">
                  1-2 business days —{" "}
                  <span className="font-medium text-gray-700">$12.99</span>
                </span>
              </div>
            </label>
          </RadioGroup>
        </div>

        {/* SECTION: BUTTON */}
        <div className="pt-6">
          <Button
            type="button"
            disabled={disableContinue}
            onClick={handleContinue}
            className="w-full h-14 bg-green-600 hover:bg-green-700 text-white text-[16px] font-bold rounded-xl shadow-md transition-transform active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Continue to Payment
          </Button>

          <div className="flex items-center justify-center space-x-1.5 mt-4 text-gray-400">
            <ShieldCheck size={16} />
            <span className="text-xs font-medium tracking-wide">
              Secure SSL Encrypted Connection
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}