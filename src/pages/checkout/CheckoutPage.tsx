import { useState, useEffect } from "react";
import {
  useNavigate,
  Navigate,
  useLocation,
  useSearchParams,
} from "react-router-dom";

import { Button } from "../../components/ui/button";

import { ArrowLeft } from "lucide-react";

import { toast } from "sonner";

import { useCart } from "../../contexts/CartContext";

import { useCheckout } from "../../contexts/CheckoutContext";

import { CheckoutSteps } from "./components/CheckoutSteps";

import { ShippingForm } from "./components/ShippingForm";

import { PaymentMethodStep } from "./components/PaymentMethodStep";

import { SavedCardsStep } from "./components/SavedCardsStep";

import { PaymentForm } from "./components/PaymentForm";

import { ReviewOrder } from "./components/ReviewOrder";

import { CheckoutSummary } from "./components/CheckoutSummary";

import { getUserProfile } from "../../api/userProfileApi";

import { placeOrder as placeOrderApi } from "../../api/orderApi";

export function CheckoutPage() {
  const navigate = useNavigate();

  const location = useLocation();
  const [searchParams] = useSearchParams();

  const resumeOrderId = searchParams.get("resumeOrder");

  const isResumePayment = !!resumeOrderId;

  const { cart, loading, fetchCart, fetchSummary } = useCart();

  const { checkoutData, setCheckoutField, setCheckoutData, resetCheckout } =
    useCheckout();

  const CHECKOUT_STEP_STORAGE_KEY = "checkoutStep";
  const CHECKOUT_FORM_STORAGE_KEY = "checkoutFormData";
  const CHECKOUT_PRODUCT_STORAGE_KEY = "checkoutQuickProduct";
  const CHECKOUT_QUANTITY_STORAGE_KEY = "checkoutQuickQuantity";
  const [step, setStep] = useState(() => {
    const savedStep = sessionStorage.getItem(CHECKOUT_STEP_STORAGE_KEY);

    return savedStep ? Number(savedStep) : 1;
  });

  const [loadingProfile, setLoadingProfile] = useState(true);

  const [placingOrder, setPlacingOrder] = useState(false);

  const savedQuickProduct = sessionStorage.getItem(
    CHECKOUT_PRODUCT_STORAGE_KEY,
  );

  const savedQuickQuantity = sessionStorage.getItem(
    CHECKOUT_QUANTITY_STORAGE_KEY,
  );
  useEffect(() => {
    if (location.state?.quickProduct) {
      sessionStorage.setItem(
        CHECKOUT_PRODUCT_STORAGE_KEY,
        JSON.stringify(location.state.quickProduct),
      );

      sessionStorage.setItem(
        CHECKOUT_QUANTITY_STORAGE_KEY,
        String(location.state.quickQuantity || 1),
      );
    }
  }, [location.state]);

  const quickProduct =
    location.state?.quickProduct ||
    (savedQuickProduct ? JSON.parse(savedQuickProduct) : null);

  const quickQuantity =
    location.state?.quickQuantity || Number(savedQuickQuantity || 1);

  // source
  const source = quickProduct ? "buynow" : "cart";

  // checkout draft
  useEffect(() => {
    setCheckoutData({
      source,
      productId: quickProduct?.id ? Number(quickProduct.id) : undefined,
      quantity: quickQuantity,
      requestId: crypto.randomUUID(),
    });
  }, [source, quickProduct, quickQuantity]);
  useEffect(() => {
    if (!resumeOrderId) return;

    setCheckoutField("orderId", Number(resumeOrderId));

    sessionStorage.setItem(CHECKOUT_STEP_STORAGE_KEY, "3");

    setStep(3);
  }, [resumeOrderId]);

  // cart items
  const cartItems = quickProduct
    ? [
        {
          product: quickProduct,
          quantity: quickQuantity,
        },
      ]
    : cart || [];

  // form state
  const [formData, setFormData] = useState(() => {
    const saved = sessionStorage.getItem(CHECKOUT_FORM_STORAGE_KEY);

    if (saved) {
      return JSON.parse(saved);
    }

    return {
      fullName: "",
      email: "",
      phone: "",

      address: "",
      city: "",
      state: "",
      zipCode: "",

      cardNumber: "",
      expiryDate: "",
      cvv: "",
      cardName: "",

      saveInfo: false,
      sameAddress: true,

      deliveryMethod: "standard",
    };
  });
  useEffect(() => {
    sessionStorage.setItem(CHECKOUT_STEP_STORAGE_KEY, step.toString());
  }, [step]);
  useEffect(() => {
    const { cardNumber, expiryDate, cvv, cardName, ...safeData } = formData;

    sessionStorage.setItem(CHECKOUT_FORM_STORAGE_KEY, JSON.stringify(safeData));
  }, [formData]);

  // prefill profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile();

        const updated = {
          fullName: data.fullName || "",
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || "",
          city: data.city || "",
          state: data.state || "",
          zipCode: data.zipCode || "",
        };

        setFormData(updated);
      } catch (err) {
        console.error("❌ PROFILE ERROR:", err);
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, []);

  // totals
  const subtotal = (cartItems || []).reduce((total, item: any) => {
    const price = Number(item.product?.price ?? item.price ?? 0);

    return total + price * item.quantity;
  }, 0);

  const tax = subtotal * 0.08;

  const shipping =
    formData.deliveryMethod === "express" ? 12.99 : subtotal > 50 ? 0 : 5.99;

  const total = subtotal + tax + shipping;

  // update form + context
  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    setCheckoutField(field, value);
  };

  // shipping validation
  const validateShippingStep = () => {
    return (
      formData.fullName &&
      formData.email &&
      formData.address &&
      formData.city &&
      formData.state &&
      formData.zipCode
    );
  };

  // payment validation
  const validatePaymentStep = () => {
    return (
      formData.cardNumber &&
      formData.expiryDate &&
      formData.cvv &&
      formData.cardName
    );
  };

  // STEP 1 -> STEP 2
  const nextShippingStep = () => {
    if (validateShippingStep()) {
      setStep(2);
    } else {
      toast.error("Please fill in all required fields");
    }
  };

  // PLACE ORDER
  // PLACE ORDER
  const placeOrder = async () => {
    try {
      setPlacingOrder(true);

      // =========================
      // ORDER ALREADY EXISTS
      // =========================
      if (checkoutData.orderId) {
        toast.success("Payment completed successfully!");

        resetCheckout();

        sessionStorage.removeItem(CHECKOUT_STEP_STORAGE_KEY);

        sessionStorage.removeItem(CHECKOUT_FORM_STORAGE_KEY);

        sessionStorage.removeItem(CHECKOUT_PRODUCT_STORAGE_KEY);

        sessionStorage.removeItem(CHECKOUT_QUANTITY_STORAGE_KEY);

        navigate("/orders");

        return;
      }

      // =========================
      // CREATE NEW ORDER
      // =========================
      const payload = {
        address: `${formData.address}, ${formData.city}, ${formData.state}, ${formData.zipCode}`,

        source: checkoutData.source || source,

        productId: checkoutData.productId || 0,

        quantity: checkoutData.quantity || 1,

        paymentMethodId: checkoutData.paymentMethodId || 2,

        requestId: checkoutData.requestId || "",
      };

      console.log("PLACE ORDER PAYLOAD:", payload);

      await placeOrderApi(payload);

      await fetchCart();

      await fetchSummary();

      toast.success("Order placed successfully!");

      resetCheckout();

      sessionStorage.removeItem(CHECKOUT_STEP_STORAGE_KEY);

      sessionStorage.removeItem(CHECKOUT_FORM_STORAGE_KEY);

      sessionStorage.removeItem(CHECKOUT_PRODUCT_STORAGE_KEY);

      sessionStorage.removeItem(CHECKOUT_QUANTITY_STORAGE_KEY);

      navigate("/");
    } catch (err) {
      console.error(err);

      toast.error("Failed to place order");
    } finally {
      setPlacingOrder(false);
    }
  };

  // protection
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading checkout...
      </div>
    );
  }

  if (!isResumePayment && !quickProduct && (!cart || cart.length === 0)) {
    return <Navigate to="/cart" replace />;
  }

  // loading
  if (loadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading checkout...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* BACK */}
        <Button
          variant="ghost"
          onClick={() =>
            isResumePayment
              ? navigate(`/orders/${resumeOrderId}`)
              : navigate("/cart")
          }
          className="mb-6"
        >
          <ArrowLeft className="mr-2" size={16} />
          Back to Cart
        </Button>

        {/* TITLE */}
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {isResumePayment ? `Complete Payment #${resumeOrderId}` : "Checkout"}
        </h1>

        {/* STEPS */}
        <CheckoutSteps step={step} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* STEP 1 */}
            {step === 1 && (
              <ShippingForm
                formData={formData}
                handleInputChange={handleInputChange}
                nextStep={nextShippingStep}
                subtotal={subtotal}
              />
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <PaymentMethodStep setStep={setStep} formData={formData} />
            )}

            {/* STEP 3 */}
            {step === 3 && <SavedCardsStep setStep={setStep} />}

            {/* STEP 4 */}
            {step === 4 && (
              <PaymentForm
                formData={formData}
                handleInputChange={handleInputChange}
                nextStep={() => {
                  if (validatePaymentStep()) {
                    setStep(5);
                  } else {
                    toast.error("Please fill in all required fields");
                  }
                }}
                setStep={setStep}
              />
            )}

            {/* STEP 5 */}
            {step === 5 && (
              <ReviewOrder
                formData={formData}
                cart={cartItems}
                setStep={setStep}
                placeOrder={placeOrder}
                placingOrder={placingOrder}
              />
            )}
          </div>

          {/* SUMMARY */}
          <CheckoutSummary
            subtotal={subtotal}
            tax={tax}
            shipping={shipping}
            total={total}
          />
        </div>
      </div>
    </div>
  );
}
