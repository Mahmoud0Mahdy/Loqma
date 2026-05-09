import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../../components/ui/dialog";
import { Badge } from "../../../components/ui/badge";
import { OrderStatus } from "../../../api/adminApi";

interface OrderDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  order: any | null;
}

export function OrderDetailsDialog({ isOpen, onClose, order }: OrderDetailsDialogProps) {
  if (!order) return null;

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.Pending: return <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200">Pending</Badge>;
      case OrderStatus.Confirmed: return <Badge className="bg-blue-500">Confirmed</Badge>;
      case OrderStatus.Shipped: return <Badge className="bg-purple-500">Shipped</Badge>;
      case OrderStatus.Delivered: return <Badge className="bg-green-500">Delivered</Badge>;
      case OrderStatus.Cancelled: return <Badge variant="destructive">Cancelled</Badge>;
      default: return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          {/* ✅ Placed the badge immediately next to the title to avoid the close button */}
          <DialogTitle className="text-xl flex items-center gap-3">
            Order Details #{order.id}
            {getStatusBadge(order.safeStatus)}
          </DialogTitle>
          <DialogDescription className="sr-only">Detailed view of the selected order</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div className="grid grid-cols-2 gap-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
             <div>
               <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Customer Info</h4>
               <p className="font-medium text-gray-900">{order.userName || "Guest User"}</p>
             </div>
             <div>
               <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Order Info</h4>
               <p className="text-sm text-gray-600">
                 <span className="font-medium">Date:</span> {order.createdAt ? new Date(order.createdAt).toLocaleString() : "-"}
               </p>
             </div>
          </div>
          
          <div className="flex justify-end pt-4 border-t border-gray-100">
            <div className="w-64 space-y-2 text-right">
               <div className="flex justify-between text-lg font-bold text-gray-900 pt-2">
                 <span>Total</span>
                 <span className="text-green-600">${Number(order.safeTotal || 0).toFixed(2)}</span>
               </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}