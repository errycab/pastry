import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* STAFF NAVBAR */
import StaffNavbar from "../components/StaffNavbar";
import { STAFF_BASE } from "../../services/config";

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

  const [orders, setOrders]           = useState([]);
  const [loading, setLoading]         = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchId, setSearchId]       = useState("");
  const [sortOption, setSortOption]   = useState("Newest");
  const [updatingId, setUpdatingId]   = useState(null);
  const [toasts, setToasts]           = useState([]);

  const statusFilterOptions = ["All", "Pending", "Preparing", "To Receive", "Completed"];
  const sortOptions = ["Newest", "Oldest", "Highest total"];

  /* =========================
     TOAST HELPERS
  ========================= */
  const addToast = (message, type = "success") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  /* =========================
     FETCH ORDERS (STAFF API)
  ========================= */
  const fetchOrders = () => {

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

      })
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));

  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const displayedOrders = orders
    .filter(order => {
      const matchesFilter = statusFilter === "All" || order.status === statusFilter;
      const query = searchId.trim();
      const matchesSearch = !query || String(order.id).includes(query);
      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => {
      if (sortOption === "Highest total") {
        return Number(b.total) - Number(a.total);
      }

      const dateA = a.created_at ? new Date(a.created_at).getTime() : Number(a.id);
      const dateB = b.created_at ? new Date(b.created_at).getTime() : Number(b.id);

      if (sortOption === "Oldest") {
        return dateA - dateB;
      }
      return dateB - dateA;
    });

  /* =========================
     UPDATE STATUS (STAFF)
  ========================= */
  const getNextStatus = status => {
    const statusSteps = ["Pending", "Preparing", "To Receive", "Completed"];
    const idx = statusSteps.indexOf(status);
    return idx >= 0 && idx < statusSteps.length - 1 ? statusSteps[idx + 1] : null;
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

          fetchOrders();

          // Show SMS result if this was a "To Receive" transition
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
      .catch(err => {
        console.error("Update error:", err);
        addToast("Network error — could not update order.", "error");
      })
      .finally(() => setUpdatingId(null));

  };

  const statusColors = {
    Pending: "bg-yellow-100 text-yellow-700",
    Preparing: "bg-blue-100 text-blue-700",
    "To Receive": "bg-purple-100 text-purple-700",
    Completed: "bg-green-100 text-green-700",
  };

  return (

    <div className="bg-[#fafafa] min-h-screen">

      {/* NAVBAR */}
      <StaffNavbar />

      {/* TOAST NOTIFICATIONS */}
      <Toast toasts={toasts} />

      {/* PAGE CONTENT */}
      <div className="p-8 xl:p-10">

        {/* HEADER */}
        <div className="mb-10 pt-20">
          <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400">
            Staff Control Panel
          </p>

          <h1 className="text-3xl font-bold">
            Orders Management
          </h1>
        </div>

        <div className="mb-8 grid gap-3 lg:grid-cols-[1fr_auto] items-center">
          <div className="flex flex-wrap gap-2">
            {statusFilterOptions.map(option => (
              <button
                key={option}
                onClick={() => setStatusFilter(option)}
                className={`rounded-full border px-4 py-2 text-sm transition ${statusFilter === option ? "border-black bg-black text-white" : "border-gray-200 bg-white text-gray-700 hover:border-gray-400"}`}
              >
                {option}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-auto">
              <input
                type="search"
                value={searchId}
                onChange={e => setSearchId(e.target.value)}
                placeholder=" Search Order ID"
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none focus:border-black"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500"> Sort By:</span>
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

        {/* LOADING */}
        {loading ? (
          <p className="text-gray-400">Loading orders...</p>
        ) : orders.length === 0 ? (
          <p className="text-gray-400">No orders found</p>
        ) : displayedOrders.length === 0 ? (
          <p className="text-gray-400">No orders match your search or filter.</p>
        ) : (

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {displayedOrders.map(order => (

              <motion.div
                key={order.id}
                whileHover={{ y: -5 }}
                className="bg-white rounded-[25px] p-6 shadow-lg border border-gray-100"
              >

                {/* HEADER */}
                <div className="flex justify-between mb-4">

                  <div>
                    <p className="text-[10px] text-gray-400 uppercase">
                      Order ID
                    </p>

                    <h2 className="font-bold">
                      #{order.id}
                    </h2>
                  </div>

                  <span className={`px-3 py-1 text-[10px] rounded-full ${statusColors[order.status]}`}>
                    {order.status}
                  </span>

                </div>

                {/* ITEMS */}
                <div className="mb-4 space-y-2">

                  {order.items.map((item, i) => (

                    <div key={i} className="flex justify-between text-sm">

                      <span>{item.name} x{item.qty}</span>

                      <span>₱{Number(item.price) * item.qty}</span>

                    </div>

                  ))}

                </div>

                {/* TOTAL */}
                <div className="border-t pt-3 flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="text-[#d4af37]">
                    ₱{Number(order.total).toLocaleString()}
                  </span>
                </div>

                {getNextStatus(order.status) ? (
                  <button
                    onClick={() => updateStatus(order.id, getNextStatus(order.status))}
                    disabled={updatingId === order.id}
                    className={`mt-4 w-full rounded-full px-4 py-2 text-sm text-white transition
                      ${updatingId === order.id
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-black hover:bg-gray-800"}`}
                  >
                    {updatingId === order.id
                      ? "Updating…"
                      : `Advance to ${getNextStatus(order.status)}`}
                  </button>
                ) : (
                  <div className="mt-4 rounded-full border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-700 text-center">
                    Order already completed
                  </div>
                )}

              </motion.div>

            ))}

          </div>

        )}

      </div>

    </div>

  );
}
