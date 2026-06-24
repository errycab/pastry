import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* STAFF NAVBAR */
import StaffNavbar from "../components/StaffNavbar";
import { STAFF_BASE } from "../../services/config";

const POLL_INTERVAL = 15000; // auto-refresh every 15 seconds

/* =========================
   TOAST COMPONENT
========================= */
function Toast({ toasts }) {
  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-2 z-50">
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className={`rounded-2xl px-5 py-3 text-sm shadow-lg text-white max-w-xs
              ${t.type === "success" ? "bg-green-600"
              : t.type === "sms_fail" ? "bg-yellow-500"
              : "bg-red-500"}`}
          >
            {t.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export default function Orders() {

  const [orders, setOrders]             = useState([]);
  const [loading, setLoading]           = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchId, setSearchId]         = useState("");
  const [sortOption, setSortOption]     = useState("Oldest");
  const [updatingId, setUpdatingId]     = useState(null);
  const [toasts, setToasts]             = useState([]);
  const [lastRefreshed, setLastRefreshed] = useState(null);
  const pollRef = useRef(null);

  const statusFilterOptions = ["All", "Pending", "Preparing", "To Receive", "Completed", "Cancelled"];
  const sortOptions = ["Newest", "Oldest", "Highest total"];

  const statusColors = {
    Pending:      "bg-yellow-100 text-yellow-700",
    Preparing:    "bg-blue-100 text-blue-700",
    "To Receive": "bg-purple-100 text-purple-700",
    Completed:    "bg-green-100 text-green-700",
    Cancelled:    "bg-red-100 text-red-500",
  };

  const statusPriority = {
    Pending: 0,
    Preparing: 1,
    "To Receive": 2,
    Completed: 3,
    Cancelled: 4,
  };

  /* =========================
     TOAST HELPERS
  ========================= */
  const addToast = (message, type = "success") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  /* =========================
     FETCH ORDERS
  ========================= */
  const fetchOrders = (silent = false) => {
    if (!silent) setLoading(true);
    fetch(`${STAFF_BASE}/api_orders.php`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const parsed = data.map(order => ({
            ...order,
            items:
              typeof order.items === "string"
                ? JSON.parse(order.items)
                : order.items || [],
          }));
          setOrders(parsed);
        } else {
          setOrders([]);
        }
        setLastRefreshed(new Date());
      })
      .catch(() => setOrders([]))
      .finally(() => { if (!silent) setLoading(false); });
  };

  // Initial load + polling
  useEffect(() => {
    fetchOrders();
    pollRef.current = setInterval(() => fetchOrders(true), POLL_INTERVAL);
    return () => clearInterval(pollRef.current);
  }, []);

  /* =========================
     FILTER + SORT
  ========================= */
  const displayedOrders = orders
    .filter(order => {
      const matchesFilter = statusFilter === "All" || order.status === statusFilter;
      const query = searchId.trim();
      const matchesSearch = !query || String(order.id).includes(query);
      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => {
      const statusDiff = (statusPriority[a.status] ?? 99) - (statusPriority[b.status] ?? 99);
      if (statusDiff !== 0) return statusDiff;
      if (sortOption === "Highest total") return Number(b.total) - Number(a.total);
      const dateA = a.created_at ? new Date(a.created_at).getTime() : Number(a.id);
      const dateB = b.created_at ? new Date(b.created_at).getTime() : Number(b.id);
      if (sortOption === "Oldest") return dateA - dateB;
      return dateB - dateA;
    });

    /* =========================
      UPDATE STATUS
    ========================= */
  const canAdvance = (status) => {
    return status === "Pending" || status === "Preparing";
  };

  const updateStatus = (id, status) => {
    setUpdatingId(id);
    fetch(`${STAFF_BASE}/api_update_order_status.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status })
    })
      .then(res => res.json())
      .then((data) => {
        if (data.success) {
          fetchOrders(true);
          if (status === "To Receive") {
            if (data.sms_sent) {
              addToast(`✓ Order #${id} updated — SMS sent to customer`, "success");
            } else {
              addToast(
                `Order #${id} updated, but SMS failed: ${data.sms_error ?? "Unknown error"}`,
                "sms_fail"
              );
            }
          } else {
            addToast(`Order #${id} → ${status}`, "success");
          }
        } else {
          addToast(`Update failed: ${data.message}`, "error");
        }
      })
      .catch(() => addToast("Network error — could not update order.", "error"))
      .finally(() => setUpdatingId(null));
  };

  return (
    <div className="bg-[#fafafa] min-h-screen">

      <StaffNavbar />
      <Toast toasts={toasts} />

      <div className="p-8 xl:p-10">

        {/* HEADER */}
        <div className="mb-10 pt-20 flex items-end justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400">
              Staff Control Panel
            </p>
            <h1 className="text-3xl font-bold">Orders Management</h1>
          </div>
          {/* Refresh + last updated */}
          <div className="flex items-center gap-3">
            {lastRefreshed && (
              <p className="text-[10px] text-gray-400">
                Updated {lastRefreshed.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            )}
            <button
              onClick={() => fetchOrders()}
              className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 hover:border-black hover:text-black transition"
            >
              ↻ Refresh
            </button>
          </div>
        </div>

        {/* FILTERS */}
        <div className="mb-8 grid gap-3 lg:grid-cols-[1fr_auto] items-center">
          <div className="flex flex-wrap gap-2">
            {statusFilterOptions.map(option => (
              <button
                key={option}
                onClick={() => setStatusFilter(option)}
                className={`rounded-full border px-4 py-2 text-sm transition ${
                  statusFilter === option
                    ? option === "Cancelled"
                      ? "border-red-400 bg-red-500 text-white"
                      : "border-black bg-black text-white"
                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-400"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              type="search"
              value={searchId}
              onChange={e => setSearchId(e.target.value)}
              placeholder="Search Order ID"
              className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none focus:border-black"
            />
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 whitespace-nowrap">Sort By:</span>
              <select
                value={sortOption}
                onChange={e => setSortOption(e.target.value)}
                className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none"
              >
                {sortOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ORDERS GRID */}
        {loading ? (
          <p className="text-gray-400">Loading orders...</p>
        ) : orders.length === 0 ? (
          <p className="text-gray-400">No orders found.</p>
        ) : displayedOrders.length === 0 ? (
          <p className="text-gray-400">No orders match your search or filter.</p>
        ) : (
          <div className="overflow-x-auto bg-white rounded-[30px] border border-gray-100 shadow-sm">
            <table className="w-full min-w-[1000px]">
              <thead className="bg-black text-white">
                <tr>
                  <th className="px-6 py-5 text-left text-[11px] uppercase tracking-[0.2em]">Order</th>
                  <th className="px-6 py-5 text-left text-[11px] uppercase tracking-[0.2em]">Customer</th>
                  <th className="px-6 py-5 text-left text-[11px] uppercase tracking-[0.2em]">Method</th>
                  <th className="px-6 py-5 text-left text-[11px] uppercase tracking-[0.2em]">Items</th>
                  <th className="px-6 py-5 text-left text-[11px] uppercase tracking-[0.2em]">Total</th>
                  <th className="px-6 py-5 text-left text-[11px] uppercase tracking-[0.2em]">Status</th>
                  <th className="px-6 py-5 text-left text-[11px] uppercase tracking-[0.2em]">Date</th>
                  <th className="px-6 py-5 text-left text-[11px] uppercase tracking-[0.2em]">Action</th>
                </tr>
              </thead>
              <tbody>
                {displayedOrders.map(order => {
                  const isCancelled = order.status === "Cancelled";
                  const isCompleted = order.status === "Completed";
                  const isToReceive = order.status === "To Receive";

                  const customerLabel = order.phone || order.name || "No Customer";
                  const itemNames = order.items?.slice(0, 2).map(item => `${item.name} x${item.qty}`).join(", ");
                  const itemLabel = order.items?.length > 0
                    ? `${order.items.length} item${order.items.length > 1 ? "s" : ""}${itemNames ? ` • ${itemNames}` : ""}`
                    : "No items";

                  return (
                    <tr
                      key={order.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-5 font-bold">#{order.id}</td>
                      <td className="px-6 py-5 text-sm text-gray-700">{customerLabel}</td>
                      <td className="px-6 py-5 text-sm text-gray-700">{order.method || "N/A"}</td>
                      <td className="px-6 py-5 text-sm text-gray-600">{itemLabel}</td>
                      <td className="px-6 py-5 font-black">₱{Number(order.total).toLocaleString()}</td>
                      <td className="px-6 py-5">
                        <span className={`px-3 py-1 text-[10px] rounded-full ${statusColors[order.status] ?? "bg-gray-100 text-gray-500"}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-sm text-gray-500">
                        {order.created_at ? new Date(order.created_at).toLocaleString([], {
                          month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
                        }) : "No Date"}
                      </td>
                      <td className="px-6 py-5 text-sm">
                        {isCancelled ? (
                          <span className="rounded-full border border-red-200 bg-red-50 px-3 py-2 text-red-500">Cancelled</span>
                        ) : isCompleted ? (
                          <span className="rounded-full border border-green-200 bg-green-50 px-3 py-2 text-green-600">Completed</span>
                        ) : isToReceive ? (
                          <span className="rounded-full border border-purple-200 bg-purple-50 px-3 py-2 text-purple-600">Waiting for receipt</span>
                        ) : canAdvance(order.status) ? (
                          <select
                            value={order.status}
                            onChange={(e) => updateStatus(order.id, e.target.value)}
                            disabled={updatingId === order.id}
                            className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm outline-none w-full"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Preparing">Preparing</option>
                            <option value="To Receive">To Receive</option>
                          </select>
                        ) : (
                          <span className="text-sm text-gray-500">No action</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}
