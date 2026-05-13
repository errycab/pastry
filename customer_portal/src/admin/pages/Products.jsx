import React, { useEffect, useState } from "react";
import AdminNavbar from "../components/Navbar";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [form, setForm] = useState({
    name: "",
    category: "",
    stock: "",
    description: "",
    available: 1,

    // CAKE PRICES (FIXED STRUCTURE)
    slice_price: "",
    small_price: "",
    big_price: "",

    meal_price: "",
    combo_price: "",
    tag: "",
    is_custom: 0,
    reorder_level: "",
    image: null
  });

  const fetchProducts = async () => {
    const res = await fetch(
      "http://localhost/GitHub/Capstone--Development/customer/api_products.php?action=list"
    );
    const data = await res.json();
    setProducts(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFile = (e) => {
    setForm({ ...form, image: e.target.files[0] });
  };

  const resetForm = () => {
    setForm({
      name: "",
      category: "",
      stock: "",
      description: "",
      available: 1,

      slice_price: "",
      small_price: "",
      big_price: "",
      meal_price: "",
      combo_price: "",

      tag: "",
      is_custom: 0,
      reorder_level: "",
      image: null
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    Object.keys(form).forEach((key) => {
      if (key !== "image") data.append(key, form[key]);
    });

    if (form.image instanceof File) {
      data.append("image", form.image);
    }

    const action = editingId ? "update" : "add";
    if (editingId) data.append("id", editingId);

    await fetch(
      `http://localhost/GitHub/Capstone--Development/customer/api_products.php?action=${action}`,
      {
        method: "POST",
        body: data
      }
    );

    resetForm();
    fetchProducts();
  };

  const handleEdit = (p) => {
    setEditingId(p.id);
    setForm({ ...p, image: null });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    const data = new FormData();
    data.append("id", id);

    await fetch(
      "http://localhost/GitHub/Capstone--Development/customer/api_products.php?action=delete",
      {
        method: "POST",
        body: data
      }
    );

    fetchProducts();
  };

  const filteredProducts = selectedCategory === "All" 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50">

      <AdminNavbar />

      <div className="p-6">

        <h1 className="text-2xl font-bold mb-6">
          Products Management
        </h1>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="bg-white p-4 mb-6 grid grid-cols-2 gap-3">

          <input name="name" placeholder="Name" onChange={handleChange} className="border p-2" />
          <input name="category" placeholder="Category" onChange={handleChange} className="border p-2" />
          <input name="stock" placeholder="Stock" onChange={handleChange} className="border p-2" />

          {/* CAKE PRICES FIX */}
          <input name="slice_price" placeholder="Slice Price" onChange={handleChange} className="border p-2" />
          <input name="small_price" placeholder="Small Price" onChange={handleChange} className="border p-2" />
          <input name="big_price" placeholder="Big Price" onChange={handleChange} className="border p-2" />
          <input name="meal_price" placeholder="Meal Price" onChange={handleChange} className="border p-2" />
          <input name="combo_price" placeholder="Combo Price" onChange={handleChange} className="border p-2" />

          <input type="file" onChange={handleFile} className="col-span-2" />

          <button className="bg-black text-white p-2 col-span-2">
            {editingId ? "Update" : "Add"}
          </button>

        </form>

        {/* CATEGORY FILTER */}
        <div className="bg-white p-4 mb-6">
          <div className="flex gap-2 flex-wrap">
            {["All", "Cakes", "Drinks", "Meals", "Combos"].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded ${
                  selectedCategory === cat 
                    ? "bg-black text-white" 
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white">
          <table className="w-full text-sm">

            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Prices</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.map((p) => (
                <tr key={p.id}>
                  <td>
                    <img
                      src={`http://localhost/GitHub/Capstone--Development/uploads/${p.image}`}
                      className="w-10 h-10"
                    />
                  </td>

                  <td>{p.name}</td>
                  <td>{p.category}</td>

                  {/* UPDATED PRICE DISPLAY */}
                  <td>
                    {p.slice_price && <div>Slice: ₱{p.slice_price}</div>}
                    {p.small_price && <div>Small: ₱{p.small_price}</div>}
                    {p.big_price && <div>Big: ₱{p.big_price}</div>}
                    {p.meal_price && <div>Meal: ₱{p.meal_price}</div>}
                    {p.combo_price && <div>Combo: ₱{p.combo_price}</div>}
                  </td>

                  <td>{p.stock}</td>
                  <td>
                    <button 
                      onClick={() => handleEdit(p)}
                      className="bg-blue-500 text-white px-2 py-1 mr-2"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(p.id)}
                      className="bg-red-500 text-white px-2 py-1"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>

      </div>
    </div>
  );
}