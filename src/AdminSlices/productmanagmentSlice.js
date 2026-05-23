// src/redux/adminProductsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Fetch products from DummyJSON API
export const fetchAdminProducts = createAsyncThunk(
  "adminProducts/fetchProducts",
  async () => {
    const res = await fetch(
      `${import.meta.env.VITE_PRODUCTS_API}/products?limit=100`
    );
    if (!res.ok) throw new Error("Failed to fetch");
    const data = await res.json();

    // DummyJSON returns { products: [...] }
    return data.products.map((item) => ({
      id: item.id,
      title: item.title,
      price: item.price,
      category: item.category,
      description: item.description,
      image: item.thumbnail, // dummyjson uses "thumbnail" instead of "image"
      rating: item.rating,
    }));
  }
);

const adminProductsSlice = createSlice({
  name: "adminProducts",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    // Add product locally (id uses Date.now())
    addProduct: (state, action) => {
      const newProduct = { ...action.payload, id: Date.now() };
      state.items.unshift(newProduct);
    },

    // Update product by id
    updateProduct: (state, action) => {
      const idx = state.items.findIndex((p) => p.id === action.payload.id);
      if (idx !== -1) state.items[idx] = action.payload;
    },

    // Delete locally
    deleteProduct: (state, action) => {
      state.items = state.items.filter((p) => p.id !== action.payload);
    },

    // Replace all products
    setProducts: (state, action) => {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchAdminProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || "Failed to fetch";
      });
  },
});

export const { addProduct, updateProduct, deleteProduct, setProducts } =
  adminProductsSlice.actions;

export default adminProductsSlice.reducer;