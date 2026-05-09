import { memo, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { Plus, Minus, Trash2 } from "lucide-react";

// ================= TYPES =================

interface CartItemType {
  cartItemId: number;

  // 🔥 الشكل الجديد من الـ API
  productId?: number | null;

  ghostCraftOrderId?: number | null;

  name?: string;

  imageUrl?: string | null;

  price?: number;

  quantity: number;

  // 🔥 القديم
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
    // 🔥 دعم الشكلين
    const productId = item.product?.id || item.productId || "";

    const productName = item.product?.name || item.name || "Unknown Product";

    const productPrice = Number(item.product?.price ?? item.price ?? 0);

    const productImage =
      item.product?.imageUrl || item.imageUrl || "/placeholder.png";

    const quantity = Number(item.quantity) || 0;

    return (
      <Card className="border-0 shadow-md">
        <CardContent className="p-4 flex items-center gap-4">
          <Link
            to={`/product/${productId}`}
            className="flex items-center gap-4 flex-1"
          >
            <div className="w-20 h-20 rounded overflow-hidden">
              <ImageWithFallback
                src={productImage}
                alt={productName}
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <h3 className="font-semibold">{productName}</h3>

              <p className="text-green-600 font-bold">
                ${productPrice.toFixed(2)}
              </p>
            </div>
          </Link>

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

  // 🔥 تثبيت العناصر
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

  if (!cart || cart.length === 0) return null;

  return <div className="lg:col-span-2 space-y-4">{renderedItems}</div>;
});


