import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

/* =========================
   PAGES
========================= */
import Dashboard from "../pages/Dashboard";
import Products from "../pages/Products";
import Orders from "../pages/Orders"; // ✅ FIXED: added Orders

export default function AdminApp() {
  return (
    <Routes>

      {/* ================= DEFAULT ADMIN REDIRECT ================= */}
      <Route
        path="/"
        element={<Navigate to="dashboard" replace />}
      />

      {/* ================= DASHBOARD ================= */}
      <Route
        path="dashboard"
        element={<Dashboard />}
      />

      {/* ================= PRODUCTS ================= */}
      <Route
        path="products"
        element={<Products />}
      />

      {/* ================= ORDERS (FIXED) ================= */}
      <Route
        path="orders"
        element={<Orders />}
      />

      {/* ================= OPTIONAL ================= */}
      {/*
      <Route
        path="customers"
        element={<Customers />}
      />
      */}

      {/* ================= FALLBACK ================= */}
      <Route
        path="*"
        element={<div className="p-10 text-center">Admin Page Not Found</div>}
      />

    </Routes>
  );
}