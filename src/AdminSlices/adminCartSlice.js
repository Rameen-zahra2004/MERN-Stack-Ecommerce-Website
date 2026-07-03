// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import api from "../api";

// /*
// =====================================
// PRODUCTS
// =====================================
// */
// export const fetchProduct = createAsyncThunk(
//   "cart/fetchProduct",
//   async (_, { rejectWithValue }) => {
//     try {
//       const res = await api.get("/products");
//       return res.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.message || "Failed to fetch products");
//     }
//   }
// );

// /*
// =====================================
// CART - READ
// =====================================
// */
// export const fetchCart = createAsyncThunk(
//   "cart/fetchCart",
//   async (_, { rejectWithValue }) => {
//     try {
//       const res = await api.get("/cart");
//       return res.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.message || "Failed to fetch cart");
//     }
//   }
// );

// /*
// =====================================
// CART - ADD
// =====================================
// */
// export const addTocart = createAsyncThunk(
//   "cart/addTocart",
//   async (item, { rejectWithValue }) => {
//     try {
//       const res = await api.post("/cart", { ...item, quantity: 1 });
//       return res.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.message || "Failed to add to cart");
//     }
//   }
// );

// /*
// =====================================
// CART - UPDATE
// =====================================
// */
// export const updateCartQuantity = createAsyncThunk(
//   "cart/updateCartQuantity",
//   async ({ id, quantity }, { rejectWithValue }) => {
//     try {
//       const res = await api.patch(`/cart/${id}`, { quantity });
//       return res.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.message || "Failed to update cart");
//     }
//   }
// );

// /*
// =====================================
// CART - DELETE
// =====================================
// */
// export const deleteCartItem = createAsyncThunk(
//   "cart/deleteCartItem",
//   async (id, { rejectWithValue }) => {
//     try {
//       await api.delete(`/cart/${id}`);
//       return id;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.message || "Failed to delete cart item");
//     }
//   }
// );

// /*
// =====================================
// ORDERS - CREATE
// =====================================
// */
// export const submitOrder = createAsyncThunk(
//   "cart/submitOrder",
//   async (order, { rejectWithValue }) => {
//     try {
//       const res = await api.post("/orders", order);
//       return res.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.message || "Failed to submit order");
//     }
//   }
// );

// /*
// =====================================
// ORDERS - READ ALL
// =====================================
// */
// export const fetchAllOrders = createAsyncThunk(
//   "cart/fetchAllOrders",
//   async (_, { rejectWithValue }) => {
//     try {
//       const res = await api.get("/orders");
//       return res.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.message || "Failed to fetch orders");
//     }
//   }
// );

// /*
// =====================================
// ORDERS - UPDATE STATUS
// =====================================
// */
// export const updateOrderStatus = createAsyncThunk(
//   "cart/updateOrderStatus",
//   async ({ id, status }, { rejectWithValue }) => {
//     try {
//       const res = await api.patch(`/orders/${id}`, { status });
//       return res.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.message || "Failed to update order");
//     }
//   }
// );

// /*
// =====================================
// ORDERS - DELETE
// =====================================
// */
// export const deleteOrder = createAsyncThunk(
//   "cart/deleteOrder",
//   async (id, { rejectWithValue }) => {
//     try {
//       await api.delete(`/orders/${id}`);
//       return id;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.message || "Failed to delete order");
//     }
//   }
// );

// /*
// =====================================
// INITIAL STATE
// =====================================
// */
// const initialState = {
//   products: [],
//   cart: [],
//   orders: [],
//   loading: false,
//   error: null,
// };

// /*
// =====================================
// SLICE
// =====================================
// */
// const cartSlice = createSlice({
//   name: "cart",
//   initialState,

//   reducers: {
//     clearCart: (state) => {
//       state.cart = [];
//     },
//     clearError: (state) => {
//       state.error = null;
//     },
//   },

//   extraReducers: (builder) => {
//     const pending = (state) => {
//       state.loading = true;
//       state.error = null;
//     };

//     const rejected = (state, action) => {
//       state.loading = false;
//       state.error = action.payload;
//     };

//     builder

//       /*
//       PRODUCTS
//       */
//       .addCase(fetchProduct.pending, pending)
//       .addCase(fetchProduct.fulfilled, (state, action) => {
//         state.loading = false;
//         state.products = action.payload;
//       })
//       .addCase(fetchProduct.rejected, rejected)

//       /*
//       CART
//       */
//       .addCase(fetchCart.pending, pending)
//       .addCase(fetchCart.fulfilled, (state, action) => {
//         state.loading = false;
//         state.cart = action.payload;
//       })
//       .addCase(fetchCart.rejected, rejected)

//       .addCase(addTocart.fulfilled, (state, action) => {
//         state.cart.push(action.payload);
//       })

//       .addCase(updateCartQuantity.fulfilled, (state, action) => {
//         const index = state.cart.findIndex(
//           (i) => i._id === action.payload._id
//         );
//         if (index !== -1) state.cart[index] = action.payload;
//       })

//       .addCase(deleteCartItem.fulfilled, (state, action) => {
//         state.cart = state.cart.filter(
//           (i) => i._id !== action.payload
//         );
//       })

//       /*
//       ORDERS
//       */
//       .addCase(submitOrder.pending, pending)
//       .addCase(submitOrder.fulfilled, (state, action) => {
//         state.orders.push(action.payload);
//         state.cart = [];
//       })
//       .addCase(submitOrder.rejected, rejected)

//       .addCase(fetchAllOrders.pending, pending)
//       .addCase(fetchAllOrders.fulfilled, (state, action) => {
//         state.orders = action.payload;
//       })
//       .addCase(fetchAllOrders.rejected, rejected)

//       .addCase(updateOrderStatus.fulfilled, (state, action) => {
//         const index = state.orders.findIndex(
//           (o) => o._id === action.payload._id
//         );
//         if (index !== -1) state.orders[index] = action.payload;
//       })

//       .addCase(deleteOrder.fulfilled, (state, action) => {
//         state.orders = state.orders.filter(
//           (o) => o._id !== action.payload
//         );
//       });
//   },
// });

// export const { clearCart, clearError } = cartSlice.actions;
// export default cartSlice.reducer;
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import publicApi from "../../publicApi";

// ─── localStorage helpers ─────────────────────────────────
const loadCart = () => JSON.parse(localStorage.getItem("cart") || "[]");
const saveCart = (cart) => localStorage.setItem("cart", JSON.stringify(cart));
const loadOrders = () => JSON.parse(localStorage.getItem("orders") || "[]");
const saveOrders = (orders) =>
  localStorage.setItem("orders", JSON.stringify(orders));

// ─── Products (dummyjson) ─────────────────────────────────
export const fetchProduct = createAsyncThunk(
  "cart/fetchProduct",
  async (_, { rejectWithValue }) => {
    try {
      const res = await publicApi.get("/products?limit=20");
      return res.data.products; // dummyjson wraps in { products: [...] }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch products",
      );
    }
  },
);

// ─── Cart thunks (localStorage) ──────────────────────────
export const fetchCart = createAsyncThunk("cart/fetchCart", async () =>
  loadCart(),
);

export const addTocart = createAsyncThunk(
  "cart/addTocart",
  async (item, { getState }) => {
    const { cart } = getState().cart;
    const existing = cart.find((i) => i.id === item.id && i.size === item.size);
    let updated;
    if (existing) {
      updated = cart.map((i) =>
        i.id === item.id && i.size === item.size
          ? { ...i, quantity: i.quantity + (item.quantity ?? 1) }
          : i,
      );
    } else {
      updated = [...cart, { ...item, quantity: item.quantity ?? 1 }];
    }
    saveCart(updated);
    return updated;
  },
);

export const updateCartQuantity = createAsyncThunk(
  "cart/updateCartQuantity",
  async ({ id, size, quantity }, { getState }) => {
    const { cart } = getState().cart;
    const updated = cart.map((i) =>
      i.id === id && i.size === size
        ? { ...i, quantity: Math.max(1, quantity) }
        : i,
    );
    saveCart(updated);
    return updated;
  },
);

export const deleteCartItem = createAsyncThunk(
  "cart/deleteCartItem",
  async ({ id, size }, { getState }) => {
    const { cart } = getState().cart;
    const updated = cart.filter((i) => !(i.id === id && i.size === size));
    saveCart(updated);
    return updated;
  },
);

// ─── Order thunks (localStorage) ─────────────────────────
export const submitOrder = createAsyncThunk(
  "cart/submitOrder",
  async (orderInfo, { getState }) => {
    const { cart, orders } = getState().cart;
    const newOrder = {
      ...orderInfo,
      id: Date.now(),
      status: "pending",
      createdAt: new Date().toISOString(),
      items: cart,
    };
    const updated = [...orders, newOrder];
    saveOrders(updated);
    saveCart([]);
    return newOrder;
  },
);

export const fetchAllOrders = createAsyncThunk(
  "cart/fetchAllOrders",
  async () => loadOrders(),
);

export const updateOrderStatus = createAsyncThunk(
  "cart/updateOrderStatus",
  async ({ id, status }, { getState }) => {
    const { orders } = getState().cart;
    const updated = orders.map((o) => (o.id === id ? { ...o, status } : o));
    saveOrders(updated);
    return updated;
  },
);

export const deleteOrder = createAsyncThunk(
  "cart/deleteOrder",
  async (id, { getState }) => {
    const { orders } = getState().cart;
    const updated = orders.filter((o) => o.id !== id);
    saveOrders(updated);
    return updated;
  },
);

// ─── Slice ────────────────────────────────────────────────
const cartSlice = createSlice({
  name: "cart",
  initialState: {
    products: [],
    cart: loadCart(),
    orders: loadOrders(),
    loading: false,
    error: null,
  },

  reducers: {
    clearCart: (state) => {
      state.cart = [];
      localStorage.removeItem("cart");
    },
    clearError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    const pending = (state) => {
      state.loading = true;
      state.error = null;
    };
    const rejected = (state, action) => {
      state.loading = false;
      state.error = action.payload;
    };

    builder
      // Products
      .addCase(fetchProduct.pending, pending)
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProduct.rejected, rejected)

      // Cart
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.cart = action.payload;
      })
      .addCase(addTocart.fulfilled, (state, action) => {
        state.cart = action.payload;
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.cart = action.payload;
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.cart = action.payload;
      })

      // Orders
      .addCase(submitOrder.pending, pending)
      .addCase(submitOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.push(action.payload);
        state.cart = [];
      })
      .addCase(submitOrder.rejected, rejected)

      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.orders = action.payload;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.orders = action.payload;
      });
  },
});

export const { clearCart, clearError } = cartSlice.actions;

// ─── Selectors ────────────────────────────────────────────
export const selectAllOrders = (state) => state.cart.orders;
export const selectCart = (state) => state.cart.cart;
export const selectProducts = (state) => state.cart.products;

export default cartSlice.reducer;
