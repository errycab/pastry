import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Users, ShoppingCart, Search, Bell, BarChart3, AlertTriangle, Activity } from "lucide-react";
import AdminNavbar from "../components/AdminNavbar";
import { CUSTOMER_BASE, STAFF_BASE } from "../../services/config";

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState("Week");

  const normalizeOrders = (items = [], source) =>
    (Array.isArray(items) ? items : []).map((order) => ({
      ...order,
      source,
      items:
        typeof order.items === "string" && order.items.length
          ? JSON.parse(order.items)
          : Array.isArray(order.items)
          ? order.items
          : [],
    }));

  const fetchOrders = () => {
    return Promise.all([
      fetch(`${CUSTOMER_BASE}/api_orders.php?action=list`).then((res) => res.json()).catch(() => []),
      fetch(`${STAFF_BASE}/api_orders.php`).then((res) => res.json()).catch(() => []),
    ])
      .then(([customerOrders, staffOrders]) => {
        const combined = [
          ...normalizeOrders(customerOrders, "Customer"),
          ...normalizeOrders(staffOrders, "Staff"),
        ].sort((a, b) => {
          const dateA = a.created_at ? new Date(a.created_at).getTime() : Number(a.id);
          const dateB = b.created_at ? new Date(b.created_at).getTime() : Number(b.id);
          return dateB - dateA;
        });
        setOrders(combined);
      })
      .catch((err) => {
        console.log(err);
        setOrders([]);
      });
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetch(`${CUSTOMER_BASE}/api_products.php?action=list`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          setProducts([]);
        }
      })
      .catch((err) => {
        console.log(err);
        setProducts([]);
      });
  }, []);

  useEffect(() => {
    if (orders.length || products.length) {
      setLoading(false);
    }
  }, [orders, products]);

  /* =========================
     ANALYTICS - Revenue
  ========================= */
  const totalRevenue = useMemo(() => {
    return orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
  }, [orders]);

  /* =========================
     ANALYTICS - Most Ordered Products
  ========================= */
  const mostOrderedProducts = useMemo(() => {
    const tally = {};
    orders.forEach(order => {
      if (Array.isArray(order.items)) {
        order.items.forEach(item => {
          const name = item.name || "Unknown";
          tally[name] = (tally[name] || 0) + Number(item.qty || 1);
        });
      }
    });
    return Object.entries(tally)
      .map(([name, qty]) => ({ name, qty }))
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);
  }, [orders]);

  /* =========================
     ANALYTICS - Customer Activity
  ========================= */
  const uniqueCustomers = useMemo(() => {
    const unique = new Set();
    orders.forEach(order => {
      const email = order.email?.toLowerCase();
      if (email) unique.add(email);
    });
    return unique.size;
  }, [orders]);

  /* =========================
     ANALYTICS - System Statistics
  ========================= */
  const systemStats = useMemo(() => {
    const completed = orders.filter((o) => o.status === "Completed").length;
    const pending = orders.filter((o) => o.status === "Pending").length;
    const avgOrderValue = orders.length ? totalRevenue / orders.length : 0;
    return { completed, pending, avgOrderValue };
  }, [orders, totalRevenue]);

  const salesByProduct = useMemo(() => {
    const tally = {};
    orders.forEach((order) => {
      if (Array.isArray(order.items)) {
        order.items.forEach((item) => {
          const name = item.name || item.product || "Unknown";
          const qty = Number(item.qty || item.quantity || 1);
          tally[name] = (tally[name] || 0) + qty;
        });
      }
    });
    return Object.entries(tally)
      .map(([name, qty]) => ({ name, qty }))
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);
  }, [orders]);

  const lowStockProducts = useMemo(() => {
    return products
      .filter((product) => Number(product.stock || product.on_hand || 0) > 0 && Number(product.stock || product.on_hand || 0) <= 5)
      .slice(0, 5);
  }, [products]);

  const liveOrderQueue = useMemo(() => {
    return orders.filter((order) => order.status !== "Completed").slice(0, 4);
  }, [orders]);

  const chartTimeline = useMemo(() => {
    const now = new Date();
    const orderSeries = orders
      .map((order) => {
        const date = new Date(order.created_at || order.createdAt || order.date || "");
        return {
          date,
          revenue: Number(order.total || 0),
        };
      })
      .filter((order) => !Number.isNaN(order.date.getTime()));

    const buildPeriods = (count, unit) => {
      const periods = [];
      const start = new Date(now);
      if (unit === "hour") {
        start.setHours(now.getHours() - 23, 0, 0, 0);
        for (let i = 0; i < count; i++) {
          const from = new Date(start);
          from.setHours(start.getHours() + i);
          const to = new Date(from);
          to.setHours(from.getHours() + 1);
          const label = `${from.getHours().toString().padStart(2, "0")}h`;
          periods.push({ label, from, to });
        }
      } else if (unit === "day") {
        start.setDate(now.getDate() - 6);
        start.setHours(0, 0, 0, 0);
        for (let i = 0; i < count; i++) {
          const from = new Date(start);
          from.setDate(start.getDate() + i);
          const to = new Date(from);
          to.setDate(from.getDate() + 1);
          const label = from.toLocaleDateString("en-US", { weekday: "short" });
          periods.push({ label, from, to });
        }
      } else if (unit === "week") {
        start.setDate(now.getDate() - 27);
        start.setHours(0, 0, 0, 0);
        for (let i = 0; i < count; i++) {
          const from = new Date(start);
          from.setDate(start.getDate() + i * 7);
          const to = new Date(from);
          to.setDate(from.getDate() + 7);
          const week = `${from.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
          periods.push({ label: `W${i + 1}`, from, to, subtitle: week });
        }
      } else {
        start.setMonth(now.getMonth() - 11);
        start.setDate(1);
        start.setHours(0, 0, 0, 0);
        for (let i = 0; i < count; i++) {
          const from = new Date(start);
          from.setMonth(start.getMonth() + i);
          const to = new Date(from);
          to.setMonth(from.getMonth() + 1);
          const label = from.toLocaleDateString("en-US", { month: "short" });
          periods.push({ label, from, to });
        }
      }
      return periods;
    };

    const periods =
      timeframe === "Day"
        ? buildPeriods(24, "hour")
        : timeframe === "Week"
        ? buildPeriods(7, "day")
        : timeframe === "Month"
        ? buildPeriods(4, "week")
        : buildPeriods(12, "month");

    const points = periods.map((period) => {
      const revenue = orderSeries.reduce((sum, order) => {
        return order.date >= period.from && order.date < period.to ? sum + order.revenue : sum;
      }, 0);
      return {
        ...period,
        revenue,
      };
    });

    const maxRevenue = Math.max(...points.map((point) => point.revenue), 1);
    return points.map((point) => ({
      ...point,
      percent: Math.round((point.revenue / maxRevenue) * 100),
    }));
  }, [orders, timeframe]);

  return (
    <div className="bg-[#f7f7f7] min-h-screen text-slate-900">
      <AdminNavbar />

      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between mb-10">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-[#d4af37] font-black mb-3">
              Admin Panel
            </p>
            <h1 className="text-5xl font-black">Dashboard</h1>
            <p className="mt-3 text-sm text-gray-500 max-w-2xl">
              Monitor real customer sales, orders, and inventory health across the pastry business.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={18} className="text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search orders, ingredients, reports..."
                className="w-full md:w-96 pl-10 pr-4 py-3 rounded-[24px] bg-white border border-gray-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-gold"
              />
            </div>
            <button className="w-12 h-12 rounded-full bg-white flex items-center justify-center border border-gray-200 hover:border-gray-300 transition">
              <Bell size={20} className="text-gray-600" />
            </button>
            <button className="w-12 h-12 rounded-full bg-white flex items-center justify-center border border-gray-200 hover:border-gray-300 transition">
              <Users size={20} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* KPI ROW */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-8">
          <motion.div whileHover={{ y: -4 }} className="bg-white rounded-[28px] p-8 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <p className="text-gray-400 text-[10px] uppercase tracking-[2px] font-bold">Total Orders</p>
                <h2 className="text-4xl font-bold font-serif mt-3 text-slate-900">{orders.length}</h2>
              </div>
              <div className="inline-flex items-center justify-center h-12 w-12 bg-slate-50 rounded-2xl">
                <ShoppingCart size={20} className="text-slate-700" />
              </div>
            </div>
            <p className="text-xs text-gray-500">Live sales orders across customer and staff channels.</p>
          </motion.div>

          <motion.div whileHover={{ y: -4 }} className="bg-white rounded-[28px] p-8 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <p className="text-gray-400 text-[10px] uppercase tracking-[2px] font-bold">Gross Revenue</p>
                <h2 className="text-4xl font-bold font-serif mt-3 text-slate-900">₱{totalRevenue.toLocaleString()}</h2>
              </div>
              <div className="inline-flex items-center justify-center h-12 w-12 bg-slate-50 rounded-2xl">
                <TrendingUp size={20} className="text-slate-700" />
              </div>
            </div>
            <p className="text-xs text-gray-500">Computed from real order totals.</p>
          </motion.div>

          <motion.div whileHover={{ y: -4 }} className="bg-white rounded-[28px] p-8 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <p className="text-red-500 text-[10px] uppercase tracking-[2px] font-bold">Low Stock Items</p>
                <h2 className="text-4xl font-bold font-serif mt-3 text-slate-900">{lowStockProducts.length}</h2>
              </div>
              <div className="inline-flex items-center justify-center h-12 w-12 bg-slate-50 rounded-2xl">
                <AlertTriangle size={20} className="text-red-500" />
              </div>
            </div>
            <p className="text-xs text-gray-500">Products at or below restock threshold.</p>
          </motion.div>

          <motion.div whileHover={{ y: -4 }} className="bg-white rounded-[28px] p-8 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <p className="text-gray-400 text-[10px] uppercase tracking-[2px] font-bold">Pending Orders</p>
                <h2 className="text-4xl font-bold font-serif mt-3 text-slate-900">{liveOrderQueue.length}</h2>
              </div>
              <div className="inline-flex items-center justify-center h-12 w-12 bg-slate-50 rounded-2xl">
                <BarChart3 size={20} className="text-slate-700" />
              </div>
            </div>
            <p className="text-xs text-gray-500">Orders not yet completed in the queue.</p>
          </motion.div>
        </div>

        {/* CONTENT GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <motion.div whileHover={{ y: -4 }} className="xl:col-span-2 bg-white rounded-[28px] p-8 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-gray-400 text-[10px] uppercase tracking-[2px] font-bold">Sales & Demand</p>
                <h3 className="text-xl font-semibold text-slate-900">Live sales performance</h3>
              </div>
              <div className="flex gap-2">
                {['Day', 'Week', 'Month', 'Year'].map((label) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setTimeframe(label)}
                    className={`rounded-full px-4 py-2 text-sm transition ${
                      timeframe === label
                        ? 'bg-black text-white'
                        : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-[280px] rounded-[24px] bg-slate-50 border border-gray-100 overflow-hidden p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.25em] text-slate-500">{timeframe} revenue</p>
                  <h4 className="text-xl font-semibold text-slate-900">₱{chartTimeline.reduce((sum, point) => sum + point.revenue, 0).toLocaleString()}</h4>
                </div>
                <span className="text-xs text-slate-500">Updated from recent orders</span>
              </div>
              <div className="flex items-end gap-2 h-[180px] w-full">
                {chartTimeline.map((point) => (
                  <div key={point.label} className="flex-1 flex flex-col justify-end gap-2">
                    <div className="h-full flex items-end">
                      <div
                        className="w-full rounded-t-3xl bg-black transition-all"
                        style={{ height: `${point.percent}%` }}
                      />
                    </div>
                    <div className="text-[10px] text-slate-500 text-center">{point.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div whileHover={{ y: -4 }} className="bg-white rounded-[28px] p-8 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-gray-400 text-[10px] uppercase tracking-[2px] font-bold">Live Order Queue</p>
                <h3 className="text-xl font-semibold text-slate-900">{liveOrderQueue.length} active orders</h3>
              </div>
              <div className="inline-flex items-center justify-center h-12 w-12 bg-slate-50 rounded-2xl">
                <Activity size={20} className="text-slate-700" />
              </div>
            </div>
            <div className="space-y-4">
              {liveOrderQueue.length === 0 ? (
                <div className="rounded-3xl border border-gray-100 bg-slate-50 p-6 text-sm text-slate-500">
                  No active orders at the moment.
                </div>
              ) : (
                liveOrderQueue.map((order, idx) => (
                  <div key={order.id || idx} className="rounded-3xl border border-gray-100 bg-slate-50 p-4">
                    <p className="text-sm text-slate-900 font-semibold">Order #{order.id || order.order_number || idx + 1}</p>
                    <p className="text-xs text-slate-600">
                      {order.items.length > 0 ? order.items.map((item) => item.name || item.product).filter(Boolean).join(', ') : 'No items'}
                    </p>
                    <p className="text-xs text-slate-500 mt-2">{order.status || 'Pending'} · {order.source || 'Unknown'}</p>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
          <motion.div whileHover={{ y: -3 }} className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-red-500">Critical Stock Status</p>
                <h3 className="text-xl font-semibold text-slate-900">Ingredients nearing expiry or low stock</h3>
              </div>
              <span className="text-sm text-red-500">{lowStockProducts.length} items</span>
            </div>
            <div className="space-y-4">
              {lowStockProducts.length === 0 ? (
                <p className="text-sm text-slate-500">No low-stock products found.</p>
              ) : (
                lowStockProducts.map((product) => {
                  const label = product.name || product.product || product.item || 'Unknown';
                  const quantity = Number(product.stock || product.on_hand || 0);
                  const minStock = Number(product.minimum_stock || product.reorder_qty || 1);
                  const fill = Math.min(100, Math.round((quantity / Math.max(minStock, 1)) * 100));
                  return (
                    <div key={label} className="space-y-2">
                      <div className="flex items-center justify-between text-sm text-slate-900">
                        <span>{label}</span>
                        <span>{quantity}</span>
                      </div>
                      <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
                        <div className="h-full rounded-full bg-slate-900" style={{ width: `${fill}%` }} />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>

          <motion.div whileHover={{ y: -3 }} className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Top Selling Pastries</p>
                <h3 className="text-xl font-semibold text-slate-900">Actual pastry sales</h3>
              </div>
              <span className="text-sm text-slate-500">Last 5 best sellers</span>
            </div>
            <div className="space-y-4">
              {salesByProduct.length === 0 ? (
                <p className="text-sm text-slate-500">Waiting for live order data.</p>
              ) : (
                salesByProduct.map((item) => {
                  const width = Math.min(100, Math.round((item.qty / Math.max(salesByProduct[0]?.qty || 1, 1)) * 100));
                  return (
                    <div key={item.name} className="space-y-2">
                      <div className="flex items-center justify-between text-sm text-slate-900">
                        <span>{item.name}</span>
                        <span>{item.qty}</span>
                      </div>
                      <div className="h-4 rounded-full bg-slate-100 overflow-hidden">
                        <div className="h-full rounded-full bg-slate-900" style={{ width: `${width}%` }} />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
