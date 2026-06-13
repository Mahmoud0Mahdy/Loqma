import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import {
  ShoppingBag,
  CalendarDays,
  ChevronRight,
  Package,
  CreditCard,
  ChevronLeft,
  Filter,
} from "lucide-react";
import { getOrders } from "../../../api/orderApi";
import { Order } from "../types/orderTypes";
import "./Orders.css";

export function OrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // ================= STATES =================
  // Filter State
  const [statusFilter, setStatusFilter] = useState("All");
  const filterOptions = [
    "All",
    "Pending",
    "Confirmed",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  // ================= FETCH =================
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrders();
        setOrders(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Reset page to 1 when filter changes!
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter]);

  // ================= FILTER & PAGINATION LOGIC =================
  const filteredOrders =
    statusFilter === "All"
      ? orders
      : orders.filter((order) => order.status === statusFilter);

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder,
  );
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // ================= STATUS STYLE =================
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "status-badge status-confirmed";
      case "Shipped":
        return "status-badge status-shipped"; // Added Shipped style mapping
      case "Cancelled":
        return "status-badge status-cancelled";
      case "Delivered":
        return "status-badge status-delivered";
      default:
        return "status-badge status-pending";
    }
  };

  // ================= DATE =================
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="loader-container">
        <div className="spinner" />
      </div>
    );
  }

  // ================= EMPTY (NO ORDERS AT ALL) =================
  if (orders.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon-wrapper">
          <ShoppingBag size={40} className="icon-green" />
        </div>
        <h2 className="empty-title">No Orders Yet</h2>
        <p className="empty-subtitle">
          Start shopping and your orders will appear here.
        </p>
        <Button
          onClick={() => navigate("/shop")}
          className="btn btn-primary btn-lg"
        >
          Start Shopping
        </Button>
      </div>
    );
  }

  // ================= PAGE =================
  return (
    <div className="page-wrapper">
      <div className="container">
        {/* HEADER */}
        <div className="orders-header">
          <h1 className="page-title">My Orders</h1>
          <p className="page-subtitle">
            Track, manage and review your recent orders
          </p>
        </div>

        {/* FILTER SECTION */}
        <div className="filter-section">
          <div className="filter-icon-wrapper">
            <Filter size={18} />
          </div>
          <div className="filter-scroll">
            {filterOptions.map((option) => (
              <button
                key={option}
                onClick={() => setStatusFilter(option)}
                className={`filter-btn ${
                  statusFilter === option ? "active" : ""
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* EMPTY FILTER STATE */}
        {filteredOrders.length === 0 ? (
          <div className="empty-filter-state">
            <Package size={48} className="icon-muted mb-4" />
            <h3 className="empty-filter-title">No {statusFilter} orders</h3>
            <p className="empty-filter-subtitle">
              You don't have any orders with this status.
            </p>
            <Button
              onClick={() => setStatusFilter("All")}
              className="btn btn-primary mt-4"
            >
              View All Orders
            </Button>
          </div>
        ) : (
          /* ORDERS LIST */
          <div className="orders-list">
            {currentOrders.map((order) => (
              <Card key={order.id} className="order-card">
                <CardContent className="order-card-content">
                  {/* TOP SECTION */}
                  <div className="order-card-top">
                    <div className="order-icon-box">
                      <Package size={20} className="icon-green" />
                    </div>
                    <div className="order-info-main">
                      <h2 className="order-id">Order #{order.id}</h2>
                      <div className="order-date">
                        <CalendarDays size={14} />
                        <span>{formatDate(order.createdAt)}</span>
                      </div>
                      <span className={getStatusStyle(order.status)}>
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {/* BOTTOM SECTION */}
                  <div className="order-card-bottom">
                    <div className="order-data-blocks">
                      <div className="data-block">
                        <span className="data-block-label">Total Amount</span>
                        <span className="data-block-value">
                          ${order.totalPrice.toFixed(2)}
                        </span>
                      </div>

                      <div className="data-block">
                        <span className="data-block-label">
                          <CreditCard size={14} className="mr-1 inline-block" />
                          Payment Method
                        </span>
                        <span className="data-block-value">
                          {order.paymentMethod}
                        </span>
                      </div>
                    </div>

                    <div className="order-action-container">
                      <Button
                        onClick={() => navigate(`/orders/${order.id}`)}
                        className="btn btn-primary view-details-btn"
                      >
                        View Details
                        <ChevronRight size={16} className="ml-1" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="pagination-container">
            <Button
              disabled={currentPage === 1}
              onClick={() => paginate(currentPage - 1)}
              className="page-btn-nav"
            >
              <ChevronLeft size={16} />
            </Button>

            <div className="page-numbers">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => paginate(index + 1)}
                  className={`page-btn ${
                    currentPage === index + 1 ? "active" : ""
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <Button
              disabled={currentPage === totalPages}
              onClick={() => paginate(currentPage + 1)}
              className="page-btn-nav"
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
