// src/admin/pages/Products.jsx

import React, {
  useState,
  useEffect
} from 'react';

import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';

export default function Products() {

  const [products, setProducts] =
    useState([]);

  const [activeCat, setActiveCat] =
    useState('All');

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [selectedProduct, setSelectedProduct] =
    useState(null);

  /* =========================
     FETCH PRODUCTS
  ========================= */

  const fetchProducts = async () => {

    try {

      const res = await fetch(
        'http://localhost/pastry_system/customer/api_products.php?action=list',
        {
          cache: 'no-store'
        }
      );

      const data = await res.json();

      if (Array.isArray(data)) {

        const filtered = data.filter(
          (p) =>
            p.name?.toLowerCase() !==
            'cake customization'
        );

        setProducts(filtered);

      }

    } catch (err) {

      console.log(err);

    }

  };

  useEffect(() => {

    fetchProducts();

  }, []);

  /* =========================
     FILTER
  ========================= */

  const filtered = products.filter(
    (p) =>
      activeCat === 'All' ||
      p.category?.toLowerCase() ===
        activeCat.toLowerCase()
  );

  /* =========================
     CATEGORIES
  ========================= */

  const categories = [
    'All',
    'Cakes',
    'Meals',
    'Pasta',
    'Starter'
  ];

  return (

    <div className="bg-white min-h-screen font-['DM_Sans']">

      <Navbar />

      <main className="px-6 md:px-10 py-10">

        <div className="max-w-[1400px] mx-auto">

          {/* HEADER */}

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-14">

            <div>

              <p className="text-[10px] uppercase tracking-[0.35em] text-[#d4af37] font-black mb-3">

                Admin Product Management

              </p>

              <h2 className="text-5xl md:text-6xl tracking-tight font-bold font-['Playfair_Display'] leading-none">

                {activeCat === 'All'
                  ? 'Products'
                  : activeCat}

              </h2>

            </div>

            {/* CATEGORY */}

            <div className="flex items-center gap-5 flex-wrap">

              <div className="flex bg-gray-50 p-1.5 rounded-full border border-gray-100 shadow-inner overflow-x-auto no-scrollbar">

                {categories.map((cat) => (

                  <button
                    key={cat}
                    onClick={() =>
                      setActiveCat(cat)
                    }
                    className={`px-7 py-2.5 rounded-full text-[10px] uppercase tracking-[0.18em] whitespace-nowrap transition-all ${
                      activeCat === cat
                        ? 'bg-black text-white shadow-lg font-bold'
                        : 'text-gray-400 hover:text-black font-medium'
                    }`}
                  >

                    {cat}

                  </button>

                ))}

              </div>

            </div>

          </div>

          {/* PRODUCTS */}

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">

            {filtered.map((p) => (

              <ProductCard
                key={p.id}
                product={p}
                onEdit={(product) => {

                  setSelectedProduct(
                    product
                  );

                  setIsModalOpen(true);

                }}
              />

            ))}

          </div>

        </div>

      </main>

      {/* MODAL */}

      <ProductModal
        isOpen={isModalOpen}
        onClose={() =>
          setIsModalOpen(false)
        }
        product={selectedProduct}
        onSave={fetchProducts}
      />

    </div>

  );

}