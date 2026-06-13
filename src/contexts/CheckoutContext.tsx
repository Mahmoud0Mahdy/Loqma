import { createContext, useContext, useState, ReactNode } from "react";

export interface CheckoutData {
  fullName?: string;
  email?: string;
  phone?: string;

  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;

  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  cardName?: string;

  deliveryMethod?: string;

  paymentMethodId?: number;

  source?: "cart" | "buynow";

  productId?: number;

  quantity?: number;

  requestId?: string;

  orderId?: number;

  // NEW
  usedSavedCard?: boolean;
}

interface CheckoutContextType {
  checkoutData: CheckoutData;

  setCheckoutField: (field: string, value: any) => void;

  setCheckoutData: (data: CheckoutData) => void;

  resetCheckout: () => void;
}

const CheckoutContext = createContext<CheckoutContextType | null>(null);

export function CheckoutProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [checkoutData, setCheckoutDataState] =
    useState<CheckoutData>({});

  const setCheckoutField = (
    field: string,
    value: any
  ) => {
    setCheckoutDataState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const setCheckoutData = (
    data: CheckoutData
  ) => {
    setCheckoutDataState((prev) => ({
      ...prev,
      ...data,
    }));
  };

  const resetCheckout = () => {
    setCheckoutDataState({});
  };

  return (
    <CheckoutContext.Provider
      value={{
        checkoutData,
        setCheckoutField,
        setCheckoutData,
        resetCheckout,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  const context = useContext(CheckoutContext);

  if (!context) {
    throw new Error(
      "useCheckout must be used within CheckoutProvider"
    );
  }

  return context;
}