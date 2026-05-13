import { useState, useCallback, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Label } from "../../../components/ui/label";
import { Checkbox } from "../../../components/ui/checkbox";
import { CreditCard } from "lucide-react";
import { toast } from "sonner";

import { validatePaymentField } from "../validation/paymentValidation";
import { FormField } from "../components/form/PaymentForm"; // Make sure this component accepts standard classNames now
import { useCheckout } from "../../../contexts/CheckoutContext";
import { confirmPayment } from "../../../api/paymentApi";

import "./components_css/PaymentForm.css"; // <-- Import the new CSS file

// 1. Defined TypeScript interfaces to replace `any`
interface PaymentFormData {
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  cardName?: string;
  saveInfo?: boolean;
  [key: string]: any;
}

interface PaymentFormProps {
  formData: PaymentFormData;
  handleInputChange: (field: string, value: string | boolean) => void;
  nextStep: () => void;
  setStep: (step: number) => void;
}

export function PaymentForm({
  formData,
  handleInputChange,
  nextStep,
  setStep,
}: PaymentFormProps) {
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);

  const { checkoutData, setCheckoutField } = useCheckout();

  // 2. Memoized required fields
  const requiredFields = useMemo(
    () => ["cardNumber", "expiryDate", "cvv", "cardName"],
    []
  );

  // 3. Wrapped functions in useCallback
  const handleChange = useCallback(
    (field: string, rawValue: string) => {
      let value = rawValue;

      switch (field) {
        case "cardNumber":
          value = value.replace(/\D/g, "").slice(0, 16);
          value = value.replace(/(.{4})/g, "$1 ").trim();
          break;
        case "cvv":
          value = value.replace(/\D/g, "").slice(0, 4);
          break;
        case "expiryDate":
          value = value.replace(/[^\d]/g, "").slice(0, 4);
          if (value.length >= 3) {
            value = value.slice(0, 2) + "/" + value.slice(2);
          }
          break;
        case "cardName":
          value = value.replace(/[^A-Za-z\s]/g, "").slice(0, 50);
          break;
      }

      handleInputChange(field, value);

      // 🔥 live validation
      if (touched[field]) {
        const valid = validatePaymentField(field, value);
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
      const valid = validatePaymentField(field, formData[field] as string || "");
      setErrors((prev) => ({ ...prev, [field]: !valid }));
    },
    [formData]
  );

  const fieldError = useCallback(
    (field: string) => touched[field] && errors[field],
    [touched, errors]
  );

  const fieldValid = useCallback(
    (field: string) => touched[field] && !errors[field] && !!formData[field],
    [touched, errors, formData]
  );

  // 4. Returns standard CSS classes instead of Tailwind utilities
  const inputStyle = useCallback(
    (field: string) => {
      if (fieldError(field)) {
        return "form-input error";
      }
      return "form-input valid";
    },
    [fieldError]
  );

  const disableContinue = useMemo(() => {
    return requiredFields.some((field) => !formData[field] || errors[field]);
  }, [requiredFields, formData, errors]);

  const handleContinue = async () => {
    try {
      setLoading(true);

      // 🔥 save payment method
      setCheckoutField("paymentMethodId", 1);

      const [month, year] = (formData.expiryDate as string).split("/");

      const payload = {
        paymentMethodId: 1,
        savePayment: formData.saveInfo,
        cardNumber: (formData.cardNumber as string).replace(/\s/g, ""),
        expiryMonth: Number(month),
        expiryYear: Number(`20${year}`),
        cvv: formData.cvv,
      };

      console.log("CONFIRM PAYMENT:", payload);

      // 🔥 confirm payment
      await confirmPayment(checkoutData.orderId, payload);

      toast.success("Payment confirmed successfully");
      nextStep();
    } catch (err) {
      console.error(err);
      toast.error("Failed to confirm payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="payment-card">
      <CardHeader className="payment-card-header">
        <CardTitle className="payment-card-title">
          <CreditCard className="icon-accent" size={20} />
          Payment Information
        </CardTitle>
      </CardHeader>

      <CardContent className="payment-card-content">
        {/* CARD NUMBER */}
        <FormField
          label="Card Number"
          name="cardNumber"
          value={formData.cardNumber || ""}
          placeholder="1234 5678 9012 3456"
          error="Invalid card number"
          handleChange={handleChange}
          handleBlur={handleBlur}
          inputStyle={inputStyle}
          fieldError={fieldError}
          fieldValid={fieldValid}
        />

        {/* EXPIRY + CVV */}
        <div className="grid-layout cols-2">
          <FormField
            label="Expiry Date"
            name="expiryDate"
            value={formData.expiryDate || ""}
            placeholder="MM/YY"
            error="Card expired or invalid date"
            handleChange={handleChange}
            handleBlur={handleBlur}
            inputStyle={inputStyle}
            fieldError={fieldError}
            fieldValid={fieldValid}
          />

          <FormField
            label="CVV"
            name="cvv"
            value={formData.cvv || ""}
            placeholder="123"
            error="Invalid CVV"
            handleChange={handleChange}
            handleBlur={handleBlur}
            inputStyle={inputStyle}
            fieldError={fieldError}
            fieldValid={fieldValid}
          />
        </div>

        {/* CARD NAME */}
        <FormField
          label="Name on Card"
          name="cardName"
          value={formData.cardName || ""}
          placeholder="John Doe"
          error="Enter valid card name"
          handleChange={handleChange}
          handleBlur={handleBlur}
          inputStyle={inputStyle}
          fieldError={fieldError}
          fieldValid={fieldValid}
        />

        {/* SAVE CARD */}
        <div className="checkbox-group">
          <Checkbox
            id="saveInfo"
            checked={formData.saveInfo}
            onCheckedChange={(checked) =>
              handleInputChange("saveInfo", checked as boolean)
            }
          />
          <Label htmlFor="saveInfo" className="checkbox-label">
            Save payment information for future orders
          </Label>
        </div>

        {/* ACTIONS */}
        <div className="action-buttons">
          <Button
            variant="outline"
            onClick={() => setStep(3)}
            className="btn outline-btn"
          >
            Back
          </Button>

          <Button
            disabled={disableContinue || loading}
            onClick={handleContinue}
            className="btn submit-btn"
          >
            {loading ? "Processing..." : "Review Order"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}