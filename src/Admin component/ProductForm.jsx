//  adminProductmangment form section
import { useEffect, useState } from "react";

export default function ProductForm({ product, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    title: "",
    price: "",
    description: "",
    category: "",
    image: "",
  });

  useEffect(() => {
    if (product) setForm(product);
  }, [product]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.price)
      return alert("Title and price are required");
    onSubmit(form);
    setForm({ title: "", price: "", description: "", category: "", image: "" });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 bg-white p-4 rounded shadow space-y-3"
    >
      <h2 className="text-lg font-semibold">
        {product ? "Edit Product" : "Add Product"}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
          className="border p-2 rounded w-full"
          required
        />
        <input
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          placeholder="Price"
          className="border p-2 rounded w-full"
          required
        />
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          required
        >
          <option value="" disabled>
            Select Category
          </option>
          <option value="men">Men</option>
          <option value="women">Women</option>
          <option value="jewelry">Jewelry</option>
          <option value="electronics">Electronics</option>
        </select>
        <input
          name="image"
          value={form.image}
          onChange={handleChange}
          placeholder="Image URL"
          className="border p-2 rounded w-full"
        />
      </div>
      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Description"
        className="border p-2 rounded w-full"
      />
      <div className="flex gap-2 mt-2">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          {product ? "Update" : "Add"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 rounded"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
