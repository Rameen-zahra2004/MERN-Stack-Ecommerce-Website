// src/redux/adminProductsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Fetch products from FakeStore API
export const fetchAdminProducts = createAsyncThunk(
  "adminProducts/fetchProducts",
  async () => {
    const res = await fetch("https://fakestoreapi.com/products");
    if (!res.ok) throw new Error("Failed to fetch");
    return await res.json();
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
