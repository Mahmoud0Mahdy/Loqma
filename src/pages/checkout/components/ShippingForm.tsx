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
import "./components_css/PaymentForm.css"; // <-- Import the new CSS file

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

  const requiredFields = useMemo(
    () => ["fullName", "email", "address", "city", "state", "zipCode"],
    []
  );

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

  // Updated to return standard CSS classes
  const inputStyle = useCallback(
    (f: string) => {
      if (fieldError(f)) {
        return "form-input error";
      }
      return "form-input valid";
    },
    [fieldError]
  );

  const disableContinue = useMemo(() => {
    return requiredFields.some((field) => !formData[field] || errors[field]);
  }, [requiredFields, formData, errors]);

  const handleContinue = useCallback(() => {
    const fullAddress = `${formData.address || ""}, ${formData.city || ""}, ${
      formData.state || ""
    }`;

    handleInputChange("fullAddress", fullAddress);
    nextStep();
  }, [formData, handleInputChange, nextStep]);

  return (
    <Card className="shipping-card">
      <CardHeader className="shipping-card-header">
        <CardTitle className="shipping-card-title">
          <MapPin size={22} className="icon-accent" />
          Shipping Information
        </CardTitle>
      </CardHeader>

      <CardContent className="shipping-card-content">
        {/* SECTION: PERSONAL INFO */}
        <div className="form-section">
          <div className="input-wrapper">
            <Label className="field-label">Full Name</Label>
            <Input
              value={formData?.fullName || ""}
              disabled
              className="form-input disabled"
            />
          </div>

          <div className="grid-layout cols-2">
            <div className="input-wrapper">
              <Label className="field-label">Email</Label>
              <Input
                value={formData?.email || ""}
                disabled
                className="form-input disabled"
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
        <div className="form-section border-top">
          <h3 className="section-title">Address Details</h3>

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

          <div className="grid-layout cols-3">
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
        <div className="form-section border-top">
          <Label className="section-title mb-custom">Delivery Method</Label>

          <RadioGroup
            value={formData.deliveryMethod || "standard"}
            onValueChange={(v) => handleInputChange("deliveryMethod", v)}
            className="radio-group"
          >
            <label
              htmlFor="standard"
              className={`delivery-option ${
                (formData.deliveryMethod || "standard") === "standard"
                  ? "active"
                  : ""
              }`}
            >
              <RadioGroupItem
                value="standard"
                id="standard"
                className="radio-item"
              />
              <div className="delivery-details">
                <span className="delivery-title">Standard Delivery</span>
                <span className="delivery-subtitle">
                  3-5 business days —{" "}
                  {subtotal > 50 ? (
                    <span className="free-badge">Free</span>
                  ) : (
                    "$5.99"
                  )}
                </span>
              </div>
            </label>

            <label
              htmlFor="express"
              className={`delivery-option ${
                formData.deliveryMethod === "express" ? "active" : ""
              }`}
            >
              <RadioGroupItem
                value="express"
                id="express"
                className="radio-item"
              />
              <div className="delivery-details">
                <span className="delivery-title">Express Delivery</span>
                <span className="delivery-subtitle">
                  1-2 business days — <span className="price-badge">$12.99</span>
                </span>
              </div>
            </label>
          </RadioGroup>
        </div>

        {/* SECTION: BUTTON */}
        <div className="action-section">
          <Button
            type="button"
            disabled={disableContinue}
            onClick={handleContinue}
            className="submit-btn"
          >
            Continue to Payment
          </Button>

          <div className="secure-badge">
            <ShieldCheck size={16} />
            <span>Secure SSL Encrypted Connection</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}