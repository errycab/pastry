import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import StaffNavbar from "../components/StaffNavbar";
import { BASE, STAFF_BASE } from "../../services/config";

export default function Products() {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [qty, setQty] = useState("");
  const [updateError, setUpdateError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  // ⭐ NEW: CATEGORY FILTER
  const [activeCat, setActiveCat] = useState("All");

  /* =========================
     FETCH PRODUCTS
  ========================= */
  const fetchProducts = () => {

    setLoading(true);
    setFetchError(null);

    fetch(`${STAFF_BASE}/api_products.php?action=list`)
      .then(res => res.json())
      .then(data => {

        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          setFetchError("Invalid server response.");
          setProducts([]);
        }

      })
      .catch(() => {
        setFetchError("Cannot connect to server.");
        setProducts([]);
      })
      .finally(() => setLoading(false));

  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchTerm(params.get("search") || "");
  }, [location.search]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmed = searchTerm.trim();
    navigate(`/staff/products${trimmed ? `?search=${encodeURIComponent(trimmed)}` : ""}`);
  };

  /* =========================
     UPDATE STOCK
  ========================= */
  const updateStock = (type) => {

    const parsed = Number(qty);

    if (!qty || parsed <= 0) {
      setUpdateError("Enter a valid quantity.");
      return;
    }

    fetch(`${STAFF_BASE}/api_update_stocks.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: selectedProduct.id,
        qty: parsed,
        type
      })
    })
      .then(res => res.json())
      .then(data => {

        if (data.status === "success") {
          fetchProducts();
          setSelectedProduct(null);
          setQty("");
        } else {
          setUpdateError("Update failed.");
        }

      })
      .catch(() => setUpdateError("Server error"));

  };

  /* =========================
     STOCK COLORS
  ========================= */
  const getStockColor = (stock) => {
    if (!stock || stock <= 0) return "text-red-500 bg-red-50";
    if (stock <= 5) return "text-yellow-600 bg-yellow-50";
    return "text-green-600 bg-green-50";
  };

  /* =========================
     FILTER PRODUCTS
  ========================= */
  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      activeCat === "All" ||
      p.category?.toLowerCase() === activeCat.toLowerCase();

    const query = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !query ||
      p.name?.toLowerCase().includes(query) ||
      p.category?.toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });

  const categories = ["All", "Cakes", "Meals", "Pasta", "Starter"];

  return (

    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">

      <StaffNavbar />

      <div className="p-6 xl:p-10 pt-24">

        {/* HEADER */}
        <div className="mb-10">
          <p className="text-[10px] tracking-[0.3em] text-gray-400 uppercase">
            Inventory Control
          </p>
          <h1 className="text-4xl font-extrabold text-gray-800">
            Products Management
          </h1>
        </div>

        {/* =========================
            CATEGORY FILTER + SEARCH
        ========================= */}
        <div className="flex flex-col gap-4 mb-8 lg:flex-row lg:items-center lg:justify-between">

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCat(cat)}
                className={`px-5 py-2 rounded-full text-xs tracking-widest border transition ${
                  activeCat === cat
                    ? "bg-black text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <form onSubmit={handleSearchSubmit} className="w-full max-w-md">
            <label className="sr-only" htmlFor="staff-product-search">
              Search products
            </label>
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                id="staff-product-search"
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products"
                className="w-full pl-10 pr-28 py-3 rounded-full border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-20 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black text-white px-4 py-2 rounded-full text-[10px] uppercase tracking-[0.2em]"
              >
                Go
              </button>
            </div>
          </form>

        </div>

        {/* ERROR */}
        {fetchError && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6">
            {fetchError}
            <button
              onClick={fetchProducts}
              className="ml-3 underline text-xs"
            >
              Retry
            </button>
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <p className="text-gray-500">Loading products...</p>
        )}

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

          {!loading && filteredProducts.map(product => (

            <motion.div
              key={product.id}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100"
            >

              {/* IMAGE */}
              <div className="flex justify-center pt-6 bg-gray-100">
                <div className="w-24 h-24 md:w-28 md:h-28 overflow-hidden rounded-full bg-white shadow-inner border border-gray-50">
                  <img
                    src={`${BASE}/uploads/${product.image}`}
                    className="w-full h-full object-cover"
                    alt={product.name}
                  />
                </div>
              </div>

              {/* CONTENT */}
              <div className="p-5">

                <h2 className="font-bold text-lg text-gray-800">
                  {product.name}
                </h2>

                <p className="text-xs text-gray-400 mb-3">
                  {product.category}
                </p>

                {/* STOCK BADGE */}
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold mb-4 ${getStockColor(product.stock)}`}>
                  Stock: {product.stock ?? 0}
                </div>

                {/* BUTTON */}
                <button
                  onClick={() => {
                    setSelectedProduct(product);
                    setQty("");
                  }}
                  className="w-full bg-black text-white py-2 rounded-xl text-xs tracking-widest hover:bg-gray-800 transition"
                >
                  MANAGE STOCK
                </button>

              </div>

            </motion.div>

          ))}

        </div>

        {/* MODAL */}
        <AnimatePresence>

          {selectedProduct && (

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            >

              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="bg-white w-[360px] rounded-2xl p-6 shadow-xl"
              >

                <h2 className="text-xl font-bold mb-1">
                  {selectedProduct.name}
                </h2>

                <p className="text-sm text-gray-500 mb-4">
                  Current Stock: {selectedProduct.stock ?? 0}
                </p>

                <input
                  type="number"
                  min="1"
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                  placeholder="Enter quantity"
                  className="w-full border rounded-xl p-3 mb-3 outline-none focus:ring-2 focus:ring-black"
                />

                {updateError && (
                  <p className="text-red-500 text-xs mb-3">
                    {updateError}
                  </p>
                )}

                <div className="flex gap-2">

                  <button
                    onClick={() => updateStock("in")}
                    className="flex-1 bg-green-500 text-white py-2 rounded-xl text-sm hover:bg-green-600"
                  >
                    Stock In
                  </button>

                  <button
                    onClick={() => updateStock("out")}
                    className="flex-1 bg-red-500 text-white py-2 rounded-xl text-sm hover:bg-red-600"
                  >
                    Stock Out
                  </button>

                </div>

                <button
                  onClick={() => setSelectedProduct(null)}
                  className="mt-4 text-xs text-gray-500 w-full hover:text-gray-700"
                >
                  Cancel
                </button>

              </motion.div>

            </motion.div>

          )}

        </AnimatePresence>

      </div>

    </div>

  );
}