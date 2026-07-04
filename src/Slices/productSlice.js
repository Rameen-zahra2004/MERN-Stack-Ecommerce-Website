import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import publicApi from "../../publicApi";
import api from "../api"; // <-- your authenticated axios instance (with JWT interceptor) for admin actions

const IMAGE_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

// turns relative "/uploads/xyz.jpg" into a full browser-loadable URL
const normalizeProduct = (p) => {
  if (!p) return p;

  const primaryImage = p.images?.find((img) => img.isPrimary) || p.images?.[0];

  return {
    ...p,
    image: primaryImage ? `${IMAGE_BASE_URL}${primaryImage.url}` : null,
    images: (p.images ?? []).map((img) => ({
      ...img,
      url: `${IMAGE_BASE_URL}${img.url}`,
    })),
  };
};

const extractErrorMessage = (err) =>
  err.response?.data?.message || err.message || "Something went wrong";

/* ------------------------------------------------------------------ */
/* ------------------------------------------------------------------ */
export const selectPagination = (state) => state.products.pagination;
export const fetchProducts = createAsyncThunk(
  "products/fetchAll",
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await publicApi.get("/products", { params });
      return res.data.data; // backend wraps array in { data: [...] }
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  },
);

export const fetchProductById = createAsyncThunk(
  "products/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await publicApi.get(`/products/${id}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  },
);

/* ------------------------------------------------------------------ */
/* ------------------------------------------------------------------ */

export const createProduct = createAsyncThunk(
  "products/create",
  async ({ productData, imageFiles = [] }, { rejectWithValue }) => {
    try {
      // Step 1 — create product with text fields only
      const res = await api.post("/products", productData);
      const created = res.data.data;

      // Step 2 — upload images if any were provided
      if (imageFiles.length > 0) {
        const formData = new FormData();
        imageFiles.forEach((file) => formData.append("images", file));
        const imgRes = await api.post(
          `/products/${created._id}/images`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } },
        );
        // Return the product with images attached
        return imgRes.data.data;
      }

      return created;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  },
);

export const updateProduct = createAsyncThunk(
  "products/update",
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const isFormData = updates instanceof FormData;
      const res = await api.put(`/products/${id}`, updates, {
        headers: isFormData
          ? { "Content-Type": "multipart/form-data" }
          : undefined,
      });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  },
);

export const deleteProduct = createAsyncThunk(
  "products/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/products/${id}`);
      return id; // return the deleted id so we can remove it from state
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  },
);

/* ------------------------------------------------------------------ */
/* Slice                                                               */
/* ------------------------------------------------------------------ */

const initialState = {
  items: [],
  selectedProduct: null,
  pagination: { total: 0, page: 1, pages: 1 }, // ← add this
  status: {
    fetchAll: "idle",
    fetchById: "idle",
    create: "idle",
    update: "idle",
    delete: "idle",
  },
  error: {
    fetchAll: null,
    fetchById: null,
    create: null,
    update: null,
    delete: null,
  },
  pendingId: null,
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
    clearProductErrors: (state) => {
      state.error = { ...initialState.error };
    },
  },
  extraReducers: (builder) => {
    builder
      /* ----------------------- fetchProducts ----------------------- */
      .addCase(fetchProducts.pending, (state) => {
        state.status.fetchAll = "loading";
        state.error.fetchAll = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status.fetchAll = "succeeded";
        state.items = action.payload.products.map(normalizeProduct); // ← .products
        state.pagination = {
          total: action.payload.total,
          page: action.payload.page,
          pages: action.payload.pages,
        };
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status.fetchAll = "failed";
        state.error.fetchAll = action.payload;
      })

      /* ---------------------- fetchProductById ----------------------- */
      .addCase(fetchProductById.pending, (state) => {
        state.status.fetchById = "loading";
        state.error.fetchById = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.status.fetchById = "succeeded";
        state.selectedProduct = normalizeProduct(action.payload);
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.status.fetchById = "failed";
        state.error.fetchById = action.payload;
      })

      /* ------------------------ createProduct ------------------------ */
      .addCase(createProduct.pending, (state) => {
        state.status.create = "loading";
        state.error.create = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.status.create = "succeeded";
        state.items.unshift(normalizeProduct(action.payload));
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.status.create = "failed";
        state.error.create = action.payload;
      })

      /* ------------------------ updateProduct ------------------------ */
      .addCase(updateProduct.pending, (state, action) => {
        state.status.update = "loading";
        state.error.update = null;
        state.pendingId = action.meta.arg.id;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.status.update = "succeeded";
        state.pendingId = null;

        const updated = normalizeProduct(action.payload);
        const index = state.items.findIndex((p) => p._id === updated._id);
        if (index !== -1) state.items[index] = updated;

        if (state.selectedProduct?._id === updated._id) {
          state.selectedProduct = updated;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.status.update = "failed";
        state.error.update = action.payload;
        state.pendingId = null;
      })

      /* ------------------------ deleteProduct ------------------------ */
      .addCase(deleteProduct.pending, (state, action) => {
        state.status.delete = "loading";
        state.error.delete = null;
        state.pendingId = action.meta.arg; // the id being deleted
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.status.delete = "succeeded";
        state.pendingId = null;
        state.items = state.items.filter((p) => p._id !== action.payload);

        if (state.selectedProduct?._id === action.payload) {
          state.selectedProduct = null;
        }
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.status.delete = "failed";
        state.error.delete = action.payload;
        state.pendingId = null;
      });
  },
});

/* ------------------------------------------------------------------ */
/* Actions & selectors                                                */
/* ------------------------------------------------------------------ */

export const { clearSelectedProduct, clearProductErrors } =
  productSlice.actions;

export const selectAllProducts = (state) => state.products.items;
export const selectSelectedProduct = (state) => state.products.selectedProduct;
export const selectProductById = (id) => (state) =>
  state.products.items.find((p) => p._id === id);

export const selectProductsStatus = (state) => state.products.status;
export const selectProductsError = (state) => state.products.error;
export const selectPendingProductId = (state) => state.products.pendingId;

// convenience boolean for components that just want "is anything loading"
export const selectIsProductsLoading = (state) =>
  state.products.status.fetchAll === "loading";

export default productSlice.reducer;
