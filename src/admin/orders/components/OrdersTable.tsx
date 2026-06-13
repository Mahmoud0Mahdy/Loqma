import { Card } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Eye } from "lucide-react";
import { OrderStatusDropdown } from "./OrderStatusDropdown";
import { OrderStatus } from "../../../api/adminApi";
import "../components/orders-admin.css";

interface OrdersTableProps {
  orders: any[];
  onRefresh: () => void;
  onViewDetails: (order: any) => void;
}

export function OrdersTable({
  orders,
  onRefresh,
  onViewDetails,
}: OrdersTableProps) {
  // Return badge based on order status
  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.Pending:
        return (
          <Badge
            variant="outline"
            className="bg-orange-50 text-orange-600 border-orange-200"
          >
            Pending
          </Badge>
        );
      case OrderStatus.Confirmed:
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600">Confirmed</Badge>
        );
      case OrderStatus.Shipped:
        return (
          <Badge className="bg-purple-500 hover:bg-purple-600">Shipped</Badge>
        );
      case OrderStatus.Delivered:
        return (
          <Badge className="bg-green-500 hover:bg-green-600">Delivered</Badge>
        );
      case OrderStatus.Cancelled:
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <Card className="ot-card">
      <div className="ot-wrapper">
        <table className="ot-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User</th>
              <th style={{ textAlign: "center" }}>Total</th>
              <th>Status</th>
              <th>Update Status</th>
              <th style={{ textAlign: "right" }}>Details</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="ot-id">
                  #{order.id?.toString().padStart(5, "0") || "N/A"}
                </td>
                <td>
                  <div className="ot-user-cell">
                    <div className="ot-avatar">
                      <span className="ot-avatar-text">
                        {order.userName?.charAt(0).toUpperCase() || "G"}
                      </span>
                    </div>
                    <div>
                      <p className="ot-user-name">
                        {order.userName || "Guest"}
                      </p>
                      <p className="ot-user-date">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString()
                          : "-"}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="ot-total">
                  ${Number(order.safeTotal || 0).toFixed(2)}
                </td>
                <td>{getStatusBadge(order.safeStatus)}</td>
                <td>
                  <OrderStatusDropdown
                    orderId={order.id}
                    currentStatus={order.safeStatus}
                    onStatusUpdated={onRefresh}
                  />
                </td>
                <td className="ot-actions">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewDetails(order)}
                  >
                    <Eye className="w-4 h-4 mr-2" /> View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
