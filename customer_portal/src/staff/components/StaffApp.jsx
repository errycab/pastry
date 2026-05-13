import React from "react";
import { Routes, Route } from "react-router-dom";

/* STAFF PAGES */
import DashboardStaff from "../pages/DashboardStaff";
import Orders from "../pages/Orders";
import Products from "../pages/Products";

export default function StaffApp() {
  return (
    <Routes>
      <Route index element={<DashboardStaff />} />
      <Route path="dashboard" element={<DashboardStaff />} />
      <Route path="orders" element={<Orders />} />
      <Route path="products" element={<Products />} />
      <Route path="customers" element={<div>Customers page coming soon</div>} />
    </Routes>
  );
}