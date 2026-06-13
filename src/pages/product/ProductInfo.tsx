import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Plus, Minus, ShoppingCart, Star, Heart } from "lucide-react";

import { type Product } from "../../contexts/AppContext";

import { useCart } from "../../contexts/CartContext";

import { useCheckout } from "../../contexts/CheckoutContext"; 

import { toast } from "sonner";

import MiniCart from "./MiniCart";

import { useProductFavorite } from "./hooks/useProductFavorite";
import { useApp } from "../../contexts/AppContext";

interface ProductInfoProps {
  product: Product;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const { addToCart } = useCart();

  const { resetCheckout, setCheckoutData } = useCheckout();

  const navigate = useNavigate();
  const { state } = useApp();

  const [quantity, setQuantity] = useState(1);

  const [openCart, setOpenCart] = useState(false);

  const { isFavorite, toggleSaveProduct } = useProductFavorite(product);

  // Add To Cart
  const handleAddToCart = useCallback(() => {
    if (!state.isAuthenticated) {
      toast.error("Please login first to add products to your cart");

      navigate("/login", {
        state: {
          from: {
            pathname: `/product/${product.id}`,
          },
        },
      });

      return;
    }

    if (!product.inStock) return;

    addToCart(product, quantity);

    toast.success(`Added ${quantity} ${product.name} to cart!`);

    setOpenCart(true);
  }, [addToCart, product, quantity, navigate, state.isAuthenticated]);

  // Buy Now
  const handleBuyNow = useCallback(() => {
    if (!state.isAuthenticated) {
      toast.error("Please login first to continue checkout");

      navigate("/login", {
        state: {
          from: {
            pathname: `/product/${product.id}`,
          },
        },
      });

      return;
    }

    resetCheckout();

    setCheckoutData({
      source: "buynow",
      productId: Number(product.id),
      quantity,
      requestId: crypto.randomUUID(),
    });

    navigate("/checkout", {
      state: {
        quickProduct: product,
        quickQuantity: quantity,
      },
    });
  }, [
    navigate,
    product,
    quantity,
    resetCheckout,
    setCheckoutData,
    state.isAuthenticated,
  ]);

  const incrementQuantity = () => setQuantity((prev) => prev + 1);

  const decrementQuantity = () => setQuantity((prev) => Math.max(1, prev - 1));

  const handleToggleFavorite = () => {
    const didToggle = toggleSaveProduct();

    if (!didToggle) {
      navigate("/login", {
        state: {
          from: {
            pathname: `/product/${product.id}`,
          },
        },
      });
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div>
          <Badge variant="secondary" className="mb-2 capitalize">
            {product.category}
          </Badge>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {product.name}
          </h1>

          <p className="text-gray-600 mb-6">{product.description}</p>

          <div className="flex items-center space-x-4 mb-6">
            <span className="text-3xl font-bold text-green-600">
              ${product.price.toFixed(2)}
            </span>

            <Badge
              className={
                product.inStock
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }
            >
              {product.inStock ? "In Stock" : "Out of Stock"}
            </Badge>
          </div>

          <div className="flex items-center space-x-2 mb-6">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} fill="currentColor" />
              ))}
            </div>

            <span className="text-sm text-gray-600">(4.8 out of 5 stars)</span>
          </div>
        </div>

        {/* Quantity */}
        <div className="space-y-4">
          <label className="block font-medium text-gray-900">Quantity</label>

          <div className="flex items-center space-x-4">
            <div className="flex items-center border rounded-lg">
              <Button variant="ghost" size="sm" onClick={decrementQuantity}>
                <Minus size={16} />
              </Button>

              <span className="px-4 py-2 border-x">{quantity}</span>

              <Button variant="ghost" size="sm" onClick={incrementQuantity}>
                <Plus size={16} />
              </Button>
            </div>

            <div className="text-sm text-gray-600">
              Total: ${(product.price * quantity).toFixed(2)}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-4">
          <Button
            size="lg"
            className="w-full bg-green-600 hover:bg-green-700"
            onClick={handleAddToCart}
            disabled={!product.inStock}
          >
            <ShoppingCart className="mr-2" size={20} />
            Add to Cart
          </Button>

          <Button
            size="lg"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white"
            onClick={handleBuyNow}
            disabled={!product.inStock}
          >
            Buy Now
          </Button>

          <div className="flex space-x-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleToggleFavorite}
            >
              <Heart
                className={`mr-2 ${
                  isFavorite ? "fill-red-500 text-red-500" : ""
                }`}
                size={16}
              />

              {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
            </Button>
          </div>
        </div>
      </div>

      {openCart && (
        <MiniCart isOpen={openCart} onClose={() => setOpenCart(false)} />
      )}
    </>
  );
}
