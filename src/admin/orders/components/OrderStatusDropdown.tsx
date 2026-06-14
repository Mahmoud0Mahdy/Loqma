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

  const dropdownValue = (currentStatus ?? OrderStatus.Pending).toString();

  const handleStatusChange = async (newStatusString: string) => {
    const newStatusInt = parseInt(newStatusString, 10);

    // Already in the selected status
    if (newStatusInt === currentStatus) {
      return;
    }

    // Cancelled orders cannot be changed
    if (currentStatus === OrderStatus.Cancelled) {
      toast.error("The order is already cancelled");
      return;
    }

    // Delivered orders cannot be changed
    if (currentStatus === OrderStatus.Delivered) {
      toast.error("The order is already delivered");
      return;
    }

    // Cancelled is only allowed from Pending
    if (
      newStatusInt === OrderStatus.Cancelled &&
      currentStatus !== OrderStatus.Pending
    ) {
      toast.error(
        `Can't be cancelled, it is already ${OrderStatus[
          currentStatus
        ].toLowerCase()}`,
      );
      return;
    }

    if (
      newStatusInt !== OrderStatus.Cancelled &&
      newStatusInt < currentStatus
    ) {
      const currentName = OrderStatus[currentStatus].toLowerCase();
      const targetName = OrderStatus[newStatusInt].toLowerCase();

      toast.error(
        `The order is already ${currentName} and can't be returned to ${targetName}`
      );
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

  const isTerminal =
    currentStatus === OrderStatus.Delivered ||
    currentStatus === OrderStatus.Cancelled;

  return (
    <Select
      value={dropdownValue}
      onValueChange={handleStatusChange}
      disabled={loading || isTerminal || !orderId}
    >
      <SelectTrigger className="w-[140px] h-8 text-xs">
        <SelectValue placeholder="Status" />
      </SelectTrigger>

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