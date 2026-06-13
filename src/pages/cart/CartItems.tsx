import { memo, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { Plus, Minus, Trash2 } from "lucide-react";

// ================= TYPES =================

interface CartItemType {
  cartItemId: number;

  // NEW API
  productId?: number | null;

  ghostCraftOrderId?: number | null;

  name?: string;

  imageUrl?: string | null;

  price?: number;
ء
  quantity: number;

  total?: number;

  // OLD API
  product?: {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
  };
}

interface Props {
  cart: CartItemType[];
  updateQuantity: (id: number, q: number) => void;
  removeFromCart: (id: number) => void;
}

// ================= SINGLE ITEM =================

const CartItem = memo(
  function CartItem({
    item,
    onIncrease,
    onDecrease,
    onRemove,
  }: {
    item: CartItemType;
    onIncrease: (item: CartItemType) => void;
    onDecrease: (item: CartItemType) => void;
    onRemove: (item: CartItemType) => void;
  }) {
    // detect ghost craft
    const isGhostCraft = !!item.ghostCraftOrderId;

    // support old + new api
    const productId = item.product?.id || item.productId || "";

    const productName = isGhostCraft
      ? item.name || "Ghost Craft Meal"
      : item.product?.name || item.name || "Unknown Product";

    const productPrice = isGhostCraft
      ? Number(item.price || 0)
      : Number(item.product?.price ?? item.price ?? 0);

    const productImage = item.product?.imageUrl || item.imageUrl || "";

    const quantity = Number(item.quantity) || 0;

    // CONTENT
    const content = (
      <>
        {/* IMAGE / GHOST */}
        {productImage ? (
          <div className="w-20 h-20 rounded overflow-hidden">
            <ImageWithFallback
              src={productImage}
              alt={productName}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-green-100 to-emerald-50 border border-green-200 flex items-center justify-center">
            <div className="text-center">
              <p className="text-[11px] font-bold text-green-700 leading-tight">
                Ghost
              </p>

              <p className="text-[11px] font-bold text-green-700 leading-tight">
                Craft
              </p>
            </div>
          </div>
        )}

        {/* INFO */}
        <div>
          {/* GHOST LABEL */}
          {isGhostCraft && (
            <div className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-700 text-[11px] font-semibold mb-2">
              Ghost Craft
            </div>
          )}

          <h3 className="font-semibold">{productName}</h3>

          <p className="text-green-600 font-bold">
            ${productPrice.toFixed(2)}
          </p>
        </div>
      </>
    );

    return (
      <Card className="border-0 shadow-md">
        <CardContent className="p-4 flex items-center gap-4">
          {/* LEFT */}

          {isGhostCraft ? (
            // NO CLICK FOR GHOST CRAFT
            <div className="flex items-center gap-4 flex-1 cursor-default">
              {content}
            </div>
          ) : (
            // NORMAL PRODUCTS KEEP LINK
            <Link
              to={`/product/${productId}`}
              className="flex items-center gap-4 flex-1"
            >
              {content}
            </Link>
          )}

          {/* QUANTITY */}
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onDecrease(item)}
              disabled={quantity <= 1}
            >
              <Minus size={14} />
            </Button>

            <span className="min-w-[20px] text-center">{quantity}</span>

            <Button
              size="sm"
              variant="outline"
              onClick={() => onIncrease(item)}
            >
              <Plus size={14} />
            </Button>
          </div>

          {/* PRICE */}
          <div className="text-right">
            <p className="font-bold">${(productPrice * quantity).toFixed(2)}</p>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(item)}
              className="text-red-500"
            >
              <Trash2 size={14} />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  },

  (prevProps, nextProps) => {
    return (
      prevProps.item.cartItemId === nextProps.item.cartItemId &&
      prevProps.item.quantity === nextProps.item.quantity
    );
  },
);

// ================= MAIN =================

export const CartItems = memo(function CartItems({
  cart,
  updateQuantity,
  removeFromCart,
}: Props) {
  const handleIncrease = useCallback(
    (item: CartItemType) => {
      updateQuantity(item.cartItemId, item.quantity + 1);
    },
    [updateQuantity],
  );

  const handleDecrease = useCallback(
    (item: CartItemType) => {
      if (item.quantity <= 1) return;

      updateQuantity(item.cartItemId, item.quantity - 1);
    },
    [updateQuantity],
  );

  const handleRemove = useCallback(
    (item: CartItemType) => {
      removeFromCart(item.cartItemId);
    },
    [removeFromCart],
  );

  // ================= RENDER =================

  const renderedItems = useMemo(() => {
    return cart.map((item) => (
      <CartItem
        key={item.cartItemId}
        item={item}
        onIncrease={handleIncrease}
        onDecrease={handleDecrease}
        onRemove={handleRemove}
      />
    ));
  }, [cart, handleIncrease, handleDecrease, handleRemove]);

  if (!cart || cart.length === 0) {
    return null;
  }

  return <div className="lg:col-span-2 space-y-4">{renderedItems}</div>;
});