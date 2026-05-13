// src/admin/components/ProductCard.jsx

import React, { useState } from 'react';

export default function ProductCard({
  product,
  onEdit
}) {

  const [selectedOption, setSelectedOption] =
    useState('');

  if (!product) return null;

  /* =========================
     CATEGORY
  ========================= */

  const category = product.category
    ? product.category.toUpperCase()
    : '';

  /* =========================
     OPTIONS
  ========================= */

  const options =
    category === 'CAKES'
      ? ['SLICE', 'SMALL', 'BIG']
      : category === 'STARTER'
      ? ['SOLO', 'SHARING']
      : category === 'MEALS'
      ? ['REGULAR', 'MEAL', 'COMBO']
      : ['REGULAR', 'MEAL'];

  const currentOption =
    selectedOption || options[0];

  /* =========================
     PRICE
  ========================= */

  const getDisplayPrice = () => {

    if (category === 'CAKES') {

      if (currentOption === 'SLICE') {

        return (
          parseFloat(product.slice_price) || 0
        );

      }

      if (currentOption === 'SMALL') {

        return (
          parseFloat(product.small_price) || 0
        );

      }

      if (currentOption === 'BIG') {

        return (
          parseFloat(product.big_price) || 0
        );

      }

    }

    if (category === 'PASTA') {

      return currentOption === 'REGULAR'
        ? 140
        : 165;

    }

    if (category === 'MEALS') {

      return currentOption === 'REGULAR'
        ? 199
        : currentOption === 'MEAL'
        ? 219
        : 309;

    }

    return parseFloat(product.price) || 0;

  };

  /* =========================
     AVAILABLE
  ========================= */

  const isAvailable =
    product.available === 1 ||
    product.available === '1';

  return (

    <div
      className={`group relative bg-white rounded-[35px] p-5 transition-all duration-300 border border-gray-100 flex flex-col overflow-hidden ${
        isAvailable
          ? 'hover:shadow-2xl hover:-translate-y-1'
          : 'opacity-70 pointer-events-auto'
      }`}
    >

      {/* UNAVAILABLE RIBBON */}

      {!isAvailable && (

        <div className="absolute top-5 -right-10 rotate-45 bg-red-600 text-white text-[9px] font-black tracking-[0.25em] py-2 w-[160px] text-center shadow-xl z-20">

          UNAVAILABLE

        </div>

      )}

      {/* IMAGE */}

      <div className="relative mb-5 flex justify-center">

        <div className="w-28 h-28 rounded-full overflow-hidden bg-[#faf7f2] shadow-inner border border-gray-100">

          <img
            src={
              product.image
                ? `http://localhost/pastry_system/uploads/${product.image}`
                : 'https://via.placeholder.com/150'
            }
            alt={product.name}
            className={`w-full h-full object-cover transition-transform duration-500 ${
              isAvailable
                ? 'group-hover:scale-110'
                : 'grayscale'
            }`}
          />

        </div>

      </div>

      {/* CATEGORY */}

      <p className="text-[9px] uppercase tracking-[0.3em] text-[#d4af37] font-black mb-2 text-center">

        {product.category}

      </p>

      {/* NAME */}

      <h3 className="text-[15px] font-bold text-black leading-tight text-center min-h-[45px] mb-3">

        {product.name}

      </h3>

      {/* STOCKS */}

      <div className="bg-[#faf7f2] rounded-2xl py-2 px-4 mb-4 text-center">

        <p className="text-[9px] uppercase tracking-[0.2em] text-gray-400 font-bold">

          Stocks

        </p>

        <h4 className="text-lg font-black text-black">

          {product.stock || 0}

        </h4>

      </div>

      {/* OPTIONS */}

      <div className="flex justify-center mb-4">

        <div className="flex bg-[#faf7f2] p-1 rounded-2xl border border-gray-100">

          {options.map((opt) => (

            <button
              key={opt}
              type="button"
              onClick={(e) => {

                e.stopPropagation();

                setSelectedOption(opt);

              }}
              className={`px-3 py-1 rounded-xl text-[8px] font-black transition-all ${
                currentOption === opt
                  ? 'bg-black text-white shadow-md'
                  : 'text-gray-400 hover:text-black'
              }`}
            >

              {opt}

            </button>

          ))}

        </div>

      </div>

      {/* PRICE */}

      <div className="text-center mb-5">

        <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold mb-1">

          Price

        </p>

        <h2 className="text-2xl font-black text-black">

          ₱
          {getDisplayPrice().toLocaleString()}

        </h2>

      </div>

      {/* BUTTON */}

      <button
        onClick={(e) => {

          e.stopPropagation();

          if (onEdit) {

            onEdit(product);

          }

        }}
        className="mt-auto w-full h-[52px] rounded-2xl bg-black text-white text-[10px] uppercase tracking-[0.25em] font-black hover:bg-[#d4af37] hover:text-black transition-all duration-300 shadow-lg"
      >

        Edit Product

      </button>

    </div>

  );

}