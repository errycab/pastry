import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

import ProductCard from "../components/ProductCard";
import ProductModal from "../components/ProductModal";
import CustomCakeModal from "../components/CustomCakeModal";
import OrderChat from "../components/OrderChat"; // ✅ ADD CHAT COMPONENT

function Banner({ onOrderClick }) {
  return (
    <div className="relative w-full h-[500px] bg-[#1a1a1a] flex items-center justify-center overflow-hidden font-['DM_Sans']">
      <div
        className="absolute inset-0 opacity-40 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=2000')",
        }}
      />

      <div className="relative z-10 text-center px-6 max-w-4xl">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-[#d4af37] text-[10px] font-black tracking-[0.4em] uppercase mb-4"
        >
          Pastry Project by Chef Lawrence
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-white text-6xl md:text-7xl font-serif mb-8 leading-tight font-bold"
        >
          Baked Fresh,
          <br />
          <span className="italic text-[#d4af37]">Made with Love.</span>
        </motion.h1>

        <motion.button
          onClick={onOrderClick}
          whileHover={{ scale: 1.05 }}
          className="bg-[#d4af37] text-black px-12 py-4 rounded-full font-bold text-[11px] uppercase tracking-[0.2em] shadow-2xl"
        >
          Browse Menu
        </motion.button>
      </div>
    </div>
  );
}

export default function Dashboard({ onAddToCart, navigate }) {
  const [products, setProducts] = useState([]);

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [isCustomCakeOpen, setIsCustomCakeOpen] = useState(false);

  // ================= CHAT STATE =================
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedOrderForChat, setSelectedOrderForChat] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          "http://localhost/pastry_system/customer/api_products.php?action=list"
        );
        const data = await res.json();

        if (Array.isArray(data)) setProducts(data);
      } catch (err) {
        console.error("Failed to load products:", err);
        setProducts([]);
      }
    };

    fetchProducts();
  }, []);

  const handleAction = (product, size, price) => {
    const cat = product.category?.toUpperCase();

    if (cat === "CAKES" || cat === "STARTER") {
      onAddToCart({
        ...product,
        variant: size,
        qty: 1,
        price,
      });
    } else {
      setSelectedProduct({
        ...product,
        variant: size,
        basePrice: price,
      });
      setIsProductModalOpen(true);
    }
  };

  const bestSellers = useMemo(() => {
    return products
      .filter((p) => !p.name?.toLowerCase().includes("customization"))
      .slice(0, 6);
  }, [products]);

  const mustTry = useMemo(() => {
    return products
      .filter((p) => !p.name?.toLowerCase().includes("customization"))
      .slice(6, 12);
  }, [products]);

  return (
    <div className="bg-white min-h-screen font-['DM_Sans'] relative">

      {/* BANNER */}
      <Banner onOrderClick={() => navigate("/menu")} />

      <div className="max-w-7xl mx-auto px-10 py-12">

        {/* CUSTOM CAKE */}
        <div className="relative w-full h-[350px] rounded-[50px] overflow-hidden group bg-black shadow-2xl mb-20">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-60 group-hover:scale-110 transition-transform duration-1000"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1535141192574-5d4897c12636?q=80&w=2000')",
            }}
          />

          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent flex items-center px-16">
            <div className="max-w-md">
              <h2 className="text-white text-5xl font-serif font-bold mb-4">
                Want to customize <br />
                <span className="text-[#d4af37]">your cake?</span>
              </h2>

              <p className="text-gray-300 text-sm mb-8">
                Choose flavors, tiers, and design. We’ll bake it your way.
              </p>

              <button
                onClick={() => setIsCustomCakeOpen(true)}
                className="bg-white text-black px-10 py-4 rounded-full font-black text-[11px] uppercase tracking-widest hover:bg-[#d4af37]"
              >
                Customize Now
              </button>
            </div>
          </div>
        </div>

        {/* BEST SELLERS */}
        <section className="mb-20">
          <div className="flex justify-between mb-10">
            <div>
              <p className="text-[#d4af37] text-[10px] uppercase tracking-[0.4em]">
                Customer Favorites
              </p>
              <h2 className="text-4xl font-serif font-bold">Best Sellers</h2>
            </div>

            <button
              onClick={() => navigate("/menu")}
              className="text-[10px] uppercase tracking-[0.3em] text-gray-400 hover:text-black"
            >
              View Menu
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
            {bestSellers.map((p) => (
              <ProductCard key={p.id} product={p} onAction={handleAction} />
            ))}
          </div>
        </section>

        {/* MUST TRY */}
        <section className="pb-10">
          <div className="flex justify-between mb-10">
            <div>
              <p className="text-[#d4af37] text-[10px] uppercase tracking-[0.4em]">
                Chef Recommendation
              </p>
              <h2 className="text-4xl font-serif font-bold">Must Try</h2>
            </div>

            <button
              onClick={() => navigate("/menu")}
              className="text-[10px] uppercase tracking-[0.3em] text-gray-400 hover:text-black"
            >
              Explore More
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
            {mustTry.map((p) => (
              <ProductCard key={p.id} product={p} onAction={handleAction} />
            ))}
          </div>
        </section>
      </div>

      {/* ================= CHAT FLOAT BUTTON ================= */}
      <button
        onClick={() => setChatOpen(true)}
        className="fixed bottom-6 right-6 bg-black text-white w-14 h-14 rounded-full flex items-center justify-center shadow-xl z-[9999]"
      >
        <MessageCircle size={22} />
      </button>

      {/* ================= CHAT PANEL ================= */}
      {chatOpen && (
        <div className="fixed right-0 top-0 h-full w-[380px] bg-white shadow-2xl z-[10000] border-l">
          <div className="p-3 flex justify-between items-center border-b">
            <h2 className="font-semibold">Chat Support</h2>
            <button onClick={() => setChatOpen(false)}>✕</button>
          </div>

          {/* Placeholder: later connect real OrderChat */}
          <div className="p-3 text-sm text-gray-500">
            Select an order to start chatting...
          </div>
        </div>
      )}

      {/* MODALS */}
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        product={selectedProduct}
        allCakes={products.filter((p) => p.category === "Cakes")}
        onAddToCart={onAddToCart}
      />

      <CustomCakeModal
        isOpen={isCustomCakeOpen}
        onClose={() => setIsCustomCakeOpen(false)}
        allCakes={products.filter((p) => p.category === "Cakes")}
        onAddToCart={onAddToCart}
      />
    </div>
  );
}