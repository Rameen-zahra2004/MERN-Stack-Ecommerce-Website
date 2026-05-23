import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdminSearchBar from "../Admin component/AdminSearchBar";
import ProductForm from "../Admin component/ProductForm";
import ProductTable from "../Admin component/ProductTable";
import {
  fetchAdminProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../AdminSlices/productmanagmentSlice";

export default function AdminProductManagement() {
  const dispatch = useDispatch();
  const {
    items: products,
    loading,
    error,
  } = useSelector((state) => state.adminProducts);

  const [searchQuery, setSearchQuery] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);

  const categories = useMemo(
    () => [
      { label: "Men", value: "men" },
      { label: "Women", value: "women" },
      { label: "Jewelry", value: "jewelry" },
      { label: "Electronics", value: "electronics" },
    ],
    []
  );

  const mapCategory = (apiCategory) => {
    const cat = apiCategory?.toLowerCase();
    if (cat === "men's clothing") return "men";
    if (cat === "women's clothing") return "women";
    if (cat === "jewelery") return "jewelry";
    if (cat === "electronics") return "electronics";
    return "other";
  };

  // ✅ FIX: only fetch if products not already loaded
  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchAdminProducts());
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const groupedProducts = useMemo(() => {
    const filtered = products.filter(
      (p) =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mapCategory(p.category).includes(searchQuery.toLowerCase())
    );

    return categories.map((c) => ({
      category: c.label,
      products: filtered.filter((p) => mapCategory(p.category) === c.value),
    }));
  }, [products, searchQuery, categories]);

  const handleSubmit = (product) => {
    if (editingProduct) {
      dispatch(updateProduct({ ...product, id: editingProduct.id }));
      setEditingProduct(null);
    } else {
      dispatch(addProduct({ ...product, id: Date.now() }));
    }
  };

  const handleEdit = (product) => setEditingProduct(product);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteProduct(id));
    }
  };

  return (
    <div className="p-4 md:p-6 w-full space-y-6">
      {/* Header with Title & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold">Admin Product Management</h1>
        <div className="w-full sm:w-1/3">
          <AdminSearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by title or category..."
          />
        </div>
      </div>

      {/* Product Form */}
      <ProductForm
        product={editingProduct}
        onSubmit={handleSubmit}
        onCancel={() => setEditingProduct(null)}
      />

      {/* Product Table */}
      {loading ? (
        <p className="text-center text-gray-500 py-6">Loading products...</p>
      ) : error ? (
        <p className="text-center text-red-500 py-6">{error}</p>
      ) : groupedProducts.length === 0 ? (
        <p className="text-center text-gray-500 py-6">No products found</p>
      ) : (
        <ProductTable
          products={groupedProducts}
          onEdit={handleEdit}
          onDelete={handleDelete}
          mapCategory={mapCategory}
        />
      )}
    </div>
  );
}