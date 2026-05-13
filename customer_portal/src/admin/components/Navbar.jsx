import React, { useState, useEffect, useRef } from "react";
import {
  Bell,
  Search,
  User,
  LogOut,
  ShoppingBag,
  Users,
  ClipboardList,
  LayoutDashboard,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function AdminNavbar() {
  const location = useLocation();

  const [openSearch, setOpenSearch] = useState(false);
  const [openNotif, setOpenNotif] = useState(false);
  const [openAccount, setOpenAccount] = useState(false);
  const [search, setSearch] = useState("");

  const searchRef = useRef(null);
  const notifRef = useRef(null);
  const accountRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setOpenSearch(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setOpenNotif(false);
      }
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setOpenAccount(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("admin");
    localStorage.removeItem("user");

    window.location.href =
      "http://localhost/GitHub/Capstone--Development/login.php";
  };

  // 🔥 FIX: safer active route matching
  const isActive = (path) => location.pathname.includes(path);

  const navs = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <LayoutDashboard size={15} /> },
    { name: "Orders", path: "/admin/orders", icon: <ClipboardList size={15} /> },
    { name: "Products", path: "/admin/products", icon: <ShoppingBag size={15} /> },
    { name: "Customers", path: "/admin/customers", icon: <Users size={15} /> },
  ];

  return (
    <nav className="sticky top-0 z-[50000] bg-white/90 backdrop-blur-xl border-b border-gray-100 px-6 xl:px-10 py-5">
      <div className="flex items-center justify-between">

        {/* LEFT */}
        <div className="flex items-center gap-14">

          <Link to="/admin/dashboard" className="flex items-center gap-4">
            <img
              src="http://localhost/GitHub/Capstone--Development/uploads/logo.jpg"
              alt="Logo"
              className="h-14 w-auto object-contain"
            />

            <div>
              <h1 className="text-[28px] font-bold italic">
                Pastry <span className="text-[#d4af37]">Admin</span>
              </h1>
              <p className="text-[8px] uppercase tracking-[0.35em] text-gray-400">
                management system
              </p>
            </div>
          </Link>

          {/* NAV LINKS */}
          <div className="hidden lg:flex items-center gap-10">
            {navs.map((nav) => (
              <Link
                key={nav.path}
                to={nav.path}
                className={`flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] transition ${
                  isActive(nav.path)
                    ? "text-black font-semibold"
                    : "text-gray-400 hover:text-black"
                }`}
              >
                {nav.icon}
                {nav.name}
              </Link>
            ))}
          </div>

        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4">

          {/* SEARCH */}
          <div ref={searchRef} className="relative">
            <button
              onClick={() => setOpenSearch(!openSearch)}
              className="w-12 h-12 rounded-full flex items-center justify-center"
            >
              <Search size={20} />
            </button>

            {openSearch && (
              <div className="absolute right-0 top-[65px] w-[300px] bg-white shadow-xl rounded-xl p-3">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full border p-2 text-sm"
                  placeholder="Search..."
                />
              </div>
            )}
          </div>

          {/* NOTIF */}
          <div ref={notifRef}>
            <button onClick={() => setOpenNotif(!openNotif)}>
              <Bell />
            </button>
          </div>

          {/* ACCOUNT */}
          <div ref={accountRef} className="relative">
            <button onClick={() => setOpenAccount(!openAccount)}>
              <User />
            </button>

            {openAccount && (
              <div className="absolute right-0 top-[65px] bg-white shadow-xl p-3 rounded">
                <button
                  onClick={handleLogout}
                  className="text-red-500 flex items-center gap-2"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </nav>
  );
}