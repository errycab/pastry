// src/admin/components/ProductModal.jsx

import React, {
  useState,
  useEffect
} from 'react';

import {
  X,
  Save,
  Image as ImageIcon
} from 'lucide-react';

import { motion } from 'framer-motion';

export default function ProductModal({
  isOpen,
  onClose,
  product,
  onSave
}) {

  const [form, setForm] =
    useState({

      name: '',
      category: '',
      stock: '',

      price: '',
      slice_price: '',
      small_price: '',
      big_price: '',

      available: 1,

      imageFile: null

    });

  const [preview, setPreview] =
    useState('');

  useEffect(() => {

    if (product) {

      setForm({

        name: product.name || '',
        category: product.category || '',

        stock:
          product.stock || 0,

        price:
          product.price || '',

        slice_price:
          product.slice_price || '',

        small_price:
          product.small_price || '',

        big_price:
          product.big_price || '',

        available:
          product.available ?? 1,

        imageFile: null

      });

      setPreview(

        product.image
          ? `http://localhost/pastry_system/uploads/${product.image}`
          : ''

      );

    }

  }, [product]);

  if (!isOpen || !product)
    return null;

  /* =========================
     CHANGE
  ========================= */

  const handleChange = (e) => {

    const {
      name,
      value
    } = e.target;

    setForm((prev) => ({

      ...prev,

      [name]: value

    }));

  };

  /* =========================
     IMAGE
  ========================= */

  const handleImage = (e) => {

    const file =
      e.target.files[0];

    if (!file) return;

    setForm((prev) => ({

      ...prev,

      imageFile: file

    }));

    setPreview(
      URL.createObjectURL(file)
    );

  };

  /* =========================
     SAVE
  ========================= */

  const handleSave = async () => {

    try {

      const formData =
        new FormData();

      /* IMPORTANT */
      formData.append(
        'id',
        product.id
      );

      formData.append(
        'name',
        form.name
      );

      formData.append(
        'category',
        form.category
      );

      formData.append(
        'stock',
        form.stock
      );

      formData.append(
        'available',
        form.available
      );

      formData.append(
        'price',
        form.price
      );

      formData.append(
        'slice_price',
        form.slice_price
      );

      formData.append(
        'small_price',
        form.small_price
      );

      formData.append(
        'big_price',
        form.big_price
      );

      if (form.imageFile) {

        formData.append(
          'image',
          form.imageFile
        );

      }

      console.log(
        [...formData.entries()]
      );

      const res = await fetch(

        'http://localhost/pastry_system/admin/api_product_update.php?action=update',

        {
          method: 'POST',
          body: formData
        }

      );

      const data =
        await res.json();

      console.log(data);

      if (data.success) {

        alert(
          'Product updated successfully!'
        );

        if (onSave) {

          await onSave();

        }

        onClose();

      } else {

        alert(
          data.message ||
          'Update failed'
        );

      }

    } catch (err) {

      console.log(err);

      alert(
        'Server error'
      );

    }

  };

  return (

    <div className="fixed inset-0 z-[99999] bg-black/40 backdrop-blur-sm flex items-center justify-center px-4 py-10">

      <motion.div

        initial={{
          opacity: 0,
          scale: 0.95
        }}

        animate={{
          opacity: 1,
          scale: 1
        }}

        className="bg-white w-full max-w-[520px] rounded-[40px] shadow-2xl overflow-hidden"

      >

        {/* HEADER */}

        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">

          <div>

            <p className="text-[10px] uppercase tracking-[0.3em] text-[#d4af37] font-black mb-2">

              Product Editor

            </p>

            <h2 className="text-3xl font-serif font-bold">

              Edit Product

            </h2>

          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
          >

            <X size={18} />

          </button>

        </div>

        {/* BODY */}

        <div className="p-8 space-y-6 max-h-[75vh] overflow-y-auto">

          {/* IMAGE */}

          <div className="flex flex-col items-center">

            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-100 shadow-lg mb-4">

              <img
                src={
                  preview ||
                  'https://via.placeholder.com/300'
                }
                alt=""
                className="w-full h-full object-cover"
              />

            </div>

            <label className="cursor-pointer bg-black text-white px-5 py-3 rounded-2xl text-[11px] uppercase tracking-[0.2em] font-black hover:bg-[#d4af37] hover:text-black transition-all flex items-center gap-2">

              <ImageIcon size={14} />

              Change Image

              <input
                type="file"
                hidden
                onChange={handleImage}
              />

            </label>

          </div>

          {/* NAME */}

          <div>

            <label className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-black block mb-3">

              Product Name

            </label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full h-[58px] rounded-2xl bg-[#f5f5f5] px-5 outline-none"
            />

          </div>

          {/* STOCK */}

          <div>

            <label className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-black block mb-3">

              Stock

            </label>

            <input
              type="number"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              className="w-full h-[58px] rounded-2xl bg-[#f5f5f5] px-5 outline-none"
            />

          </div>

          {/* STATUS */}

          <div>

            <label className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-black block mb-3">

              Availability

            </label>

            <select
              name="available"
              value={form.available}
              onChange={handleChange}
              className="w-full h-[58px] rounded-2xl bg-[#f5f5f5] px-5 outline-none"
            >

              <option value={1}>
                Available
              </option>

              <option value={0}>
                Out of Order
              </option>

            </select>

          </div>

        </div>

        {/* FOOTER */}

        <div className="p-8 border-t border-gray-100">

          <button
            onClick={handleSave}
            className="w-full h-[60px] rounded-2xl bg-black text-white hover:bg-[#d4af37] hover:text-black transition-all font-black uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-3"
          >

            <Save size={16} />

            Save Product

          </button>

        </div>

      </motion.div>

    </div>

  );

}