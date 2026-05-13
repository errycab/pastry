import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import AdminNavbar from "../components/Navbar";

const BASE = "http://localhost/pastry_system";
const API = `${BASE}/admin/api_orders.php`;

export default function Orders() {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [statusFilter, setStatusFilter] = useState("All");
  const [searchId, setSearchId] = useState("");
  const [sortOption, setSortOption] = useState("Newest");

  const statusFilterOptions = [
    "All",
    "Pending",
    "Preparing",
    "Delivered",
    "Cancelled"
  ];

  const sortOptions = ["Newest", "Oldest", "Highest total"];

  // =========================
  // FETCH ORDERS (ADMIN API)
  // =========================
  const fetchOrders = () => {
    setLoading(true);

    fetch(`${API}?action=list`)
      .then(res => res.json())
      .then(data => {

        if (Array.isArray(data)) {
          setOrders(data);
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

  // =========================
  // FILTER + SORT
  // =========================
  const displayedOrders = orders
    .filter(order => {
      const matchesFilter =
        statusFilter === "All" || order.status === statusFilter;

      const query = searchId.trim();
      const matchesSearch =
        !query || String(order.id).includes(query);

      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => {

      if (sortOption === "Highest total") {
        return Number(b.total_price) - Number(a.total_price);
      }

      const dateA = a.created_at
        ? new Date(a.created_at).getTime()
        : Number(a.id);

      const dateB = b.created_at
        ? new Date(b.created_at).getTime()
        : Number(b.id);

      if (sortOption === "Oldest") return dateA - dateB;

      return dateB - dateA;
    });

  // =========================
  // UPDATE STATUS (ADMIN)
  // =========================
  const updateStatus = (id, status) => {

    const form = new FormData();
    form.append("id", id);
    form.append("status", status);

    fetch(`${API}?action=update_status`, {
      method: "POST",
      body: form
    })
      .then(res => res.json())
      .then(() => fetchOrders())
      .catch(err => console.error("Update error:", err));
  };

  const getNextStatus = (status) => {
    const steps = ["Pending", "Preparing", "Delivered", "Cancelled"];
    const idx = steps.indexOf(status);
    return idx >= 0 && idx < steps.length - 1 ? steps[idx + 1] : null;
  };

  const statusColors = {
    Pending: "bg-yellow-100 text-yellow-700",
    Preparing: "bg-blue-100 text-blue-700",
    Delivered: "bg-green-100 text-green-700",
    Cancelled: "bg-red-100 text-red-700",
  };

  return (
    <div className="bg-[#fafafa] min-h-screen">

      <AdminNavbar />

      <div className="p-8 xl:p-10 pt-24">

        {/* HEADER */}
        <div className="mb-10">
          <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400">
            Admin Control Panel
          </p>

          <h1 className="text-3xl font-bold">
            Orders Management
          </h1>
        </div>

        {/* FILTERS */}
        <div className="mb-8 flex flex-wrap gap-2">
          {statusFilterOptions.map(option => (
            <button
              key={option}
              onClick={() => setStatusFilter(option)}
              className={`px-4 py-2 rounded-full text-sm border ${
                statusFilter === option
                  ? "bg-black text-white border-black"
                  : "bg-white text-gray-700 border-gray-200"
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        {/* SEARCH + SORT */}
        <div className="mb-6 flex gap-3 flex-wrap">

          <input
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="Search Order ID"
            className="border p-2 rounded"
          />

          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="border p-2 rounded"
          >
            {sortOptions.map(opt => (
              <option key={opt}>{opt}</option>
            ))}
          </select>

        </div>

        {/* CONTENT */}
        {loading ? (
          <p>Loading orders...</p>
        ) : displayedOrders.length === 0 ? (
          <p>No orders found.</p>
        ) : (

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {displayedOrders.map(order => (

              <motion.div
                key={order.id}
                whileHover={{ y: -5 }}
                className="bg-white p-6 rounded-xl shadow"
              >

                {/* HEADER */}
                <div className="flex justify-between mb-4">
                  <h2 className="font-bold">#{order.id}</h2>

                  <span className={`px-3 py-1 text-xs rounded-full ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                </div>

                {/* CUSTOMER + PRODUCT */}
                <div className="text-sm text-gray-600 mb-2">
                  <div>Customer: {order.customer_name}</div>
                  <div>Product: {order.product_name}</div>
                </div>

                {/* TOTAL */}
                <div className="font-bold mb-3">
                  ₱{Number(order.total_price).toLocaleString()}
                </div>

                {/* ACTION */}
                {getNextStatus(order.status) && (
                  <button
                    onClick={() =>
                      updateStatus(order.id, getNextStatus(order.status))
                    }
                    className="w-full bg-black text-white py-2 rounded"
                  >
                    Move to {getNextStatus(order.status)}
                  </button>
                )}

              </motion.div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}