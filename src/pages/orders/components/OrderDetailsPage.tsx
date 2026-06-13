import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import {
  ArrowLeft,
  Package,
  CalendarDays,
  CreditCard,
  CircleDollarSign,
  ShoppingBag,
} from "lucide-react";
import { toast } from "sonner";
import { getOrderDetails, cancelOrder } from "../../../api/orderApi";
import { OrderDetails } from "../types/orderTypes";
import "./Orders.css";

export function OrderDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelLoading, setCancelLoading] = useState(false);

  // ================= FETCH =================
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getOrderDetails(Number(id));
        setOrder(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  // ================= PAY NOW =================
  const handlePayNow = () => {
    if (!order) return;

    navigate(`/checkout?resumeOrder=${order.id}`);
  };

  // ================= CANCEL =================
  const handleCancel = async () => {
    if (!order) return;

    try {
      setCancelLoading(true);

      await cancelOrder(order.id);

      toast.success("Order cancelled successfully");

      setOrder({
        ...order,
        orderStatus: "Cancelled",
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to cancel order");
    } finally {
      setCancelLoading(false);
    }
  };

  // ================= STATUS STYLE =================
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "status-badge status-confirmed lg-badge";

      case "Cancelled":
        return "status-badge status-cancelled lg-badge";

      default:
        return "status-badge status-pending lg-badge";
    }
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader-content">
          <div className="spinner mx-auto mb-4" />
          <p className="loader-text">Loading order details...</p>
        </div>
      </div>
    );
  }

  // ================= NOT FOUND =================
  if (!order) {
    return (
      <div className="loader-container">
        <div className="loader-content">
          <ShoppingBag size={48} className="icon-muted mx-auto mb-4" />
          <p className="loader-text">Order not found</p>
        </div>
      </div>
    );
  }

  // ================= PAGE =================
  return (
    <div className="page-wrapper py-10">
      <div className="container-lg">
        {/* BACK */}
        <Button
          variant="ghost"
          onClick={() => navigate("/orders")}
          className="back-btn"
        >
          <ArrowLeft className="mr-2" size={16} />
          Back to Orders
        </Button>

        {/* HEADER */}
        <div className="details-header-card">
          <div className="details-header-inner">
            <div>
              <h1 className="details-id">Order #{order.id}</h1>

              <div className="order-date">
                <CalendarDays size={16} />

                <span>
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>

            <span className={getStatusStyle(order.orderStatus)}>
              {order.orderStatus}
            </span>
          </div>
        </div>

        <div className="details-grid">
          {/* LEFT */}
          <div className="details-left">
            <Card className="section-card">
              <div className="section-header">
                <h2 className="section-title">Order Items</h2>
              </div>

              <CardContent className="section-content bg-muted">
                {(order.items || []).map((item: any, index: number) => {
                  const isGhostCraft = !!item.ghostCraftOrderId;

                  const itemName =
                    item.name?.trim() ||
                    (isGhostCraft ? "Ghost Craft Meal" : "Unknown Product");

                  const itemPrice = Number(item.price || 0);

                  const quantity = Number(item.quantity || 0);

                  return (
                    <div key={index} className="item-card">
                      <div className="item-info-wrapper">
                        <div className="item-icon">
                          <Package size={24} />
                        </div>

                        <div>
                          {isGhostCraft && (
                            <div className="ghost-badge">Ghost Craft</div>
                          )}

                          <h3 className="item-name">{itemName}</h3>

                          <p className="item-qty">Quantity: {quantity}</p>
                        </div>
                      </div>

                      <div className="item-price-wrapper">
                        <p className="item-price-label">Total</p>

                        <p className="item-price-value">
                          ${(itemPrice * quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* RIGHT */}
          <div className="details-right">
            <Card className="section-card">
              <div className="section-header">
                <h2 className="section-title">Summary</h2>
              </div>

              <CardContent className="section-content">
                <div className="summary-row">
                  <div className="summary-label">
                    <CreditCard size={17} />
                    <span>Payment Method</span>
                  </div>

                  <span className="summary-value">{order.paymentMethod}</span>
                </div>

                <div className="summary-row">
                  <div className="summary-label">
                    <CircleDollarSign size={17} />
                    <span>Payment Status</span>
                  </div>

                  <span className="summary-value">
                    {order.paymentStatus || "Pending"}
                  </span>
                </div>

                <div className="summary-total-row">
                  <span className="summary-total-label">Total</span>

                  <span className="summary-total-value">
                    ${Number(order.totalPrice || 0).toFixed(2)}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* ACTIONS */}
            {order.orderStatus === "Pending" && (
              <div className="flex flex-col gap-3">
                {order.paymentMethod === "Card" &&
                  order.paymentStatus === "Pending" && (
                    <Button
                      onClick={handlePayNow}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      Complete Payment
                    </Button>
                  )}

                <Button
                  onClick={handleCancel}
                  disabled={cancelLoading}
                  variant="destructive"
                  className="cancel-btn"
                >
                  {cancelLoading ? "Cancelling..." : "Cancel Order"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
