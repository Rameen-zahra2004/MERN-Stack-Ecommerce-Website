import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// -------------------- THUNKS --------------------

// Fetch all orders for a user
export const fetchUserOrders = createAsyncThunk(
  "order/fetchUserOrders",
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `http://localhost:3000/orders?userId=${userId}`
      );
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Fetch single order detail
export const fetchOrdersDetail = createAsyncThunk(
  "order/fetchOrdersDetail",
  async (orderId, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `http://localhost:3000/orders/${orderId}`
      );
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Update order status
export const updateOrderStatus = createAsyncThunk(
  "order/updateOrderStatus",
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(
        `http://localhost:3000/orders/${orderId}`,
        { status }
      );
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// -------------------- INITIAL STATE --------------------

const initialState = {
  orders: [],
  ordersDetail: null,
  loading: false,
  error: null,
  updatingOrderId: null,
};

// -------------------- SLICE --------------------

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    clearOrdersDetail: (state) => {
      state.ordersDetail = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchOrdersDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrdersDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.ordersDetail = action.payload;
      })
      .addCase(fetchOrdersDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const updatedOrder = action.payload;

        const index = state.orders.findIndex(
          (o) => o._id === updatedOrder._id
        );

        if (index !== -1) {
          state.orders[index] = updatedOrder;
        }

        if (state.ordersDetail?._id === updatedOrder._id) {
          state.ordersDetail = updatedOrder;
        }
      });
  },
});

// -------------------- EXPORTS --------------------

export const { clearOrdersDetail } = orderSlice.actions;
export default orderSlice.reducer;