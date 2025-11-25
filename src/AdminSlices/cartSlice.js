import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// ✅ Fetch products
export const fetchProduct = createAsyncThunk(
  "cart/fetchProduct",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("https://fakestoreapi.com/products");
      if (!response.ok) throw new Error("Failed to fetch products");
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ✅ Fetch cart items
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:3000/cart");
      if (!response.ok) throw new Error("Failed to fetch cart items");
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ✅ Add to cart
export const addTocart = createAsyncThunk(
  "cart/addTocart",
  async (product, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:3000/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...product, quantity: 1 }),
      });
      if (!response.ok) throw new Error("Failed to add item to cart");
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ✅ Update cart quantity
export const updateCartQuantity = createAsyncThunk(
  "cart/updateCartQuantity",
  async ({ id, quantity }, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:3000/cart/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      });
      if (!response.ok) throw new Error("Failed to update quantity");
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ✅ Delete cart item
export const deleteCartItem = createAsyncThunk(
  "cart/deleteCartItem",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:3000/cart/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete item");
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ✅ Submit order
export const submitOrder = createAsyncThunk(
  "cart/submitOrder",
  async (order, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:3000/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      });
      if (!response.ok) throw new Error("Failed to submit order");
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ✅ Fetch all orders (admin)
export const fetchAllOrders = createAsyncThunk(
  "cart/fetchAllOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:3000/orders");
      if (!response.ok) throw new Error("Failed to fetch orders");
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ✅ Update order status (admin)
export const updateOrderStatus = createAsyncThunk(
  "cart/updateOrderStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:3000/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error("Failed to update order status");
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ✅ Delete/cancel order
export const deleteOrder = createAsyncThunk(
  "cart/deleteOrder",
  async ({ orderId, reason }, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:3000/orders/${orderId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete order");
      console.log("Cancellation reason:", reason); // Optional: send to backend
      return orderId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    product: [],
    cart: [],
    orders: [],
    loading: false,
    error: null,
  },
  reducers: {
    // ✅ Clear cart
    clearCart: (state) => {
      state.cart = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch products
      .addCase(fetchProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add to cart
      .addCase(addTocart.fulfilled, (state, action) => {
        state.cart.push(action.payload);
      })

      // Update quantity
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        const index = state.cart.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) state.cart[index] = action.payload;
      })

      // Delete cart item
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.cart = state.cart.filter((item) => item.id !== action.payload);
      })

      // Submit order
      .addCase(submitOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.push(action.payload);
        state.cart = []; // ✅ Clear cart after successful order
      })
      .addCase(submitOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch all orders
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update order status
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const index = state.orders.findIndex((o) => o.id === action.payload.id);
        if (index !== -1) state.orders[index] = action.payload;
      })

      // Delete/cancel order
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.orders = state.orders.filter(
          (order) => order.id !== action.payload
        );
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
