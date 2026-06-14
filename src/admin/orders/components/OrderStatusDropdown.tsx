import { useState } from "react";
import { toast } from "sonner";
import { OrderStatus, updateOrderStatus } from "../../../api/adminApi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";

interface OrderStatusDropdownProps {
  orderId: string | number;
  currentStatus: OrderStatus;
  onStatusUpdated: () => void;
}

export function OrderStatusDropdown({
  orderId,
  currentStatus,
  onStatusUpdated,
}: OrderStatusDropdownProps) {
  const [loading, setLoading] = useState(false);

  // Convert status to string for the select component
  const dropdownValue = (currentStatus ?? OrderStatus.Pending).toString();

  // Handle order status updates
  const handleStatusChange = async (newStatusString: string) => {
    const newStatusInt = parseInt(newStatusString, 10);

    if (currentStatus === OrderStatus.Cancelled) {
      toast.error("The order is already cancelled");
      return;
    }

    if (
      currentStatus === OrderStatus.Confirmed &&
      newStatusInt === OrderStatus.Cancelled
    ) {
      toast.error("Can't be cancelled, it is already confirmed");
      return;
    }

    setLoading(true);

    try {
      await updateOrderStatus(orderId, newStatusInt as OrderStatus);
      toast.success("Order status updated");
      onStatusUpdated();
    } catch (error) {
      toast.error("Failed to update order status");
    } finally {
      setLoading(false);
    }
  };

  // Check if order reached a final state
  const isTerminal =
    currentStatus === OrderStatus.Delivered ||
    currentStatus === OrderStatus.Cancelled;

  return (
    <Select
      value={dropdownValue}
      onValueChange={handleStatusChange}
      disabled={loading || isTerminal || !orderId}
    >
      {/* Status selector */}
      <SelectTrigger className="w-[140px] h-8 text-xs">
        <SelectValue placeholder="Status" />
      </SelectTrigger>

      {/* Available status options */}
      <SelectContent>
        <SelectItem value={OrderStatus.Pending.toString()}>Pending</SelectItem>
        <SelectItem value={OrderStatus.Confirmed.toString()}>
          Confirmed
        </SelectItem>
        <SelectItem value={OrderStatus.Shipped.toString()}>Shipped</SelectItem>
        <SelectItem value={OrderStatus.Delivered.toString()}>
          Delivered
        </SelectItem>
        <SelectItem value={OrderStatus.Cancelled.toString()}>
          Cancelled
        </SelectItem>
      </SelectContent>
    </Select>
  );
}