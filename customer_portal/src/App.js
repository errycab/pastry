import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

/* CUSTOMER */
import CustomerApp from "./customer/components/CustomerApp";

/* STAFF */
import StaffApp from "./staff/components/StaffApp";

/* ADMIN */
import AdminApp from "./admin/components/AdminApp";

function App() {
  return (
    <Router basename="/pastry_system">

      <Routes>

        {/* ROOT */}
        <Route
          path="/"
          element={<Navigate to="customer" replace />}
        />

        {/* ================= CUSTOMER ================= */}
        <Route
          path="customer/*"
          element={<CustomerApp />}
        />

        {/* ================= STAFF ================= */}
        <Route
          path="staff/*"
          element={<StaffApp />}
        />

        {/* ================= ADMIN ================= */}
        <Route
          path="admin/*"
          element={<AdminApp />}
        />

        {/* FALLBACK */}
        <Route
          path="*"
          element={<div style={{ padding: 20 }}>404 Not Found</div>}
        />

      </Routes>

    </Router>
  );
}

export default App;