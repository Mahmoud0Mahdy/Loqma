import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
  useCallback,
  useState,
} from "react";

import {
  getCart,
  getCartSummary,
  addCartItem,
  updateCartItem,
  deleteCartItem,
} from "../api/cartApi";

// ================= TYPES =================

export interface CartItem {
  cartItemId: number;
  // 🔥 NEW API FIELDS
  productId?: number | null;
  ghostCraftOrderId?: number | null;
  name?: string;
  imageUrl?: string | null;
  price?: number;
  total?: number;
  // 🔥 OLD PRODUCT FORMAT
  product?: {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
  };
  quantity: number;
}

interface CartState {
  cart: CartItem[];
  cartSummary: any;
}

// ================= ACTIONS =================

type CartAction =
  | { type: "SET_CART"; cart: CartItem[] }
  | { type: "SET_SUMMARY"; summary: any }
  | { type: "UPDATE_ITEM"; itemId: number; quantity: number }
  | { type: "REMOVE_ITEM"; itemId: number }
  | { type: "ADD_ITEM"; item: CartItem };

// ================= INIT STATE =================

const initialState: CartState = {
  cart: [],
  cartSummary: null,
};

// ================= REDUCER =================

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "SET_CART":
      return { ...state, cart: action.cart };
    case "SET_SUMMARY":
      return { ...state, cartSummary: action.summary };
    case "UPDATE_ITEM":
      return {
        ...state,
        cart: state.cart.map((item) =>
          item.cartItemId === action.itemId
            ? { ...item, quantity: action.quantity }
            : item,
        ),
      };
    case "REMOVE_ITEM":
      return {
        ...state,
        cart: state.cart.filter((item) => item.cartItemId !== action.itemId),
      };
    case "ADD_ITEM":
      return { ...state, cart: [action.item, ...state.cart] };
    default:
      return state;
  }
}

// ================= CONTEXT =================

const CartContext = createContext<any>(null);

// ================= PROVIDER =================

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const [loading, setLoading] = useState(true);

  // ================= FETCH CART =================
  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);

      const data = await getCart();

      const mapped = data.items.map((item: any) => ({
        cartItemId: item.cartItemId,
        quantity: item.quantity,
        productId: item.productId,
        ghostCraftOrderId: item.ghostCraftOrderId,
        name: item.name,
        imageUrl: item.imageUrl,
        price: item.price,
        total: item.total,
        product: item.productId
          ? {
              id: String(item.productId),
              name: item.name,
              price: item.price,
              imageUrl: item.imageUrl,
            }
          : undefined,
      }));

      dispatch({
        type: "SET_CART",
        cart: mapped,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // ================= FETCH SUMMARY =================
  const fetchSummary = useCallback(async () => {
    try {
      const data = await getCartSummary();
      dispatch({ type: "SET_SUMMARY", summary: data });
    } catch (err) {
      console.error(err);
    }
  }, []);

  // ================= ADD PRODUCT =================
  const addToCart = useCallback(
    async (product: any, quantity = 1) => {
      const tempItem: CartItem = {
        cartItemId: Date.now(),
        product,
        quantity,
      };

      dispatch({ type: "ADD_ITEM", item: tempItem });

      try {
        await addCartItem({ productId: Number(product.id), quantity });
        await fetchCart();
        await fetchSummary();
      } catch (err) {
        console.error(err);
      }
    },
    [fetchCart, fetchSummary],
  );

  // ================= ADD GHOST CRAFT =================
  const addGhostCraftToCart = useCallback(
    async (ghostCraftOrderId: number) => {
      try {
        await addCartItem({ ghostCraftOrderId, quantity: 1 });
        await fetchCart();
        await fetchSummary();
      } catch (err) {
        console.error(err);
      }
    },
    [fetchCart, fetchSummary],
  );

  // ================= UPDATE =================
  const updateItem = useCallback(
    async (itemId: number, quantity: number) => {
      dispatch({ type: "UPDATE_ITEM", itemId, quantity });

      try {
        await updateCartItem(itemId, quantity);
        await fetchSummary();
      } catch (err) {
        console.error(err);
        await fetchCart(); // rollback
      }
    },
    [fetchCart, fetchSummary],
  );

  // ================= REMOVE =================
  const removeItem = useCallback(
    async (itemId: number) => {
      dispatch({ type: "REMOVE_ITEM", itemId });

      try {
        await deleteCartItem(itemId);
        await fetchSummary();
      } catch (err) {
        console.error(err);
        await fetchCart(); // rollback
      }
    },
    [fetchCart, fetchSummary],
  );

  // ================= INIT (الصحيح هنا جوه الـ Provider) =================
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchCart();
      fetchSummary();
    }
  }, [fetchCart, fetchSummary]);

  return (
    <CartContext.Provider
      value={{
        cart: state.cart,
        cartSummary: state.cartSummary,
        loading,

        addToCart,
        addGhostCraftToCart,

        updateItem,
        removeItem,

        fetchCart,
        fetchSummary,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// ================= HOOK =================

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
