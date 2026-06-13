import { useState, useEffect } from "react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  ArrowUpDown,
  Filter,
} from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

import { OrdersStats } from "./components/OrdersStats";
import { OrdersTable } from "./components/OrdersTable";
import { OrderDetailsDialog } from "./components/OrderDetailsDialog";

import { getAllOrders, OrderStatus } from "../../api/adminApi";

const ITEMS_PER_PAGE = 7;

export function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  const [currentPage, setCurrentPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  // Load orders on page mount
  useEffect(() => {
    fetchOrders();
  }, []);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, sortBy]);

  // Normalize status value from API response
  const parseStatus = (statusFromApi: any): OrderStatus => {
    if (typeof statusFromApi === "number") return statusFromApi as OrderStatus;

    if (typeof statusFromApi === "string") {
      const parsedInt = parseInt(statusFromApi, 10);

      if (!isNaN(parsedInt)) return parsedInt as OrderStatus;

      const enumMatch = OrderStatus[statusFromApi as keyof typeof OrderStatus];

      if (enumMatch !== undefined) return enumMatch;
    }

    return OrderStatus.Pending;
  };

  // Fetch orders from API
  const fetchOrders = async () => {
    setLoading(true);

    try {
      const data = await getAllOrders();
      const rawOrders = Array.isArray(data) ? data : (data?.data ?? []);

      const normalizedOrders = rawOrders.map((o: any) => ({
        ...o,
        safeStatus: parseStatus(o.status ?? o.orderStatus),
        safeTotal: o.totalAmount ?? o.totalPrice ?? o.total ?? 0,
      }));

      setOrders(normalizedOrders);
    } catch (error) {
      toast.error("Failed to load orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Open order details dialog
  const handleViewDetails = (order: any) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
  };

  // Apply search, filtering, and sorting
  let processedOrders = [...orders];

  if (searchQuery) {
    const searchLower = searchQuery.toLowerCase();

    processedOrders = processedOrders.filter(
      (order) =>
        order.id?.toString().includes(searchLower) ||
        (order.userName || "").toLowerCase().includes(searchLower) ||
        (order.userEmail || "").toLowerCase().includes(searchLower),
    );
  }

  if (statusFilter !== "All") {
    processedOrders = processedOrders.filter(
      (order) => OrderStatus[order.safeStatus] === statusFilter,
    );
  }

  processedOrders.sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "oldest":
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      case "price_high":
        return b.safeTotal - a.safeTotal;
      case "price_low":
        return a.safeTotal - b.safeTotal;
      case "id_desc":
        return b.id - a.id;
      case "id_asc":
        return a.id - b.id;
      default:
        return 0;
    }
  });

  const totalPages = Math.ceil(processedOrders.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentOrders = processedOrders.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Order Management</h1>
        <p className="text-gray-600">View and update customer orders</p>
      </div>

      {/* Search and filter controls */}
      <Card className="p-4 border-gray-100 shadow-sm bg-white">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search by ID, name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full"
            />
          </div>

          <div className="flex gap-4">
            {/* Status filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px] bg-gray-50 border-gray-200">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <SelectValue placeholder="Status" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Statuses</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Confirmed">Confirmed</SelectItem>
                <SelectItem value="Shipped">Shipped</SelectItem>
                <SelectItem value="Delivered">Delivered</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort options */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px] bg-gray-50 border-gray-200">
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="w-4 h-4 text-gray-500" />
                  <SelectValue placeholder="Sort by" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="price_high">Price: High to Low</SelectItem>
                <SelectItem value="price_low">Price: Low to High</SelectItem>
                <SelectItem value="id_desc">Order ID: Descending</SelectItem>
                <SelectItem value="id_asc">Order ID: Ascending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Orders statistics */}
      <OrdersStats orders={orders} />

      {/* Orders content */}
      <div className="space-y-4">
        {loading ? (
          <Card className="p-12 text-center text-gray-500 border-gray-100">
            <p>Loading orders...</p>
          </Card>
        ) : currentOrders.length > 0 ? (
          <OrdersTable
            orders={currentOrders}
            onRefresh={fetchOrders}
            onViewDetails={handleViewDetails}
          />
        ) : (
          <Card className="p-12 text-center text-gray-500 border-gray-100">
            <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p>No orders found matching your criteria.</p>
          </Card>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-8">
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i}
              variant={currentPage === i + 1 ? "default" : "outline"}
              className={
                currentPage === i + 1
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : ""
              }
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </Button>
          ))}

          <Button
            variant="outline"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Order details dialog */}
      <OrderDetailsDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        order={selectedOrder}
      />
    </div>
  );
}
