import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";

export const fetchUsers = createAsyncThunk(
  "dashboard/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/users");
      return res.data.length;
    } catch (err) {
      return rejectWithValue("Failed to fetch users");
    }
  }
);

export const fetchOrders = createAsyncThunk(
  "dashboard/fetchOrders",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/orders");
      return res.data.length;
    } catch (err) {
      return rejectWithValue("Failed to fetch orders");
    }
  }
);

export const fetchRevenue = createAsyncThunk(
  "dashboard/fetchRevenue",
  async (period = "month", { rejectWithValue }) => {
    try {
      const res = await api.get("/orders");
      const orders = res.data;

      const now = new Date();
      let filteredOrders = orders;

      if (period === "month") {
        filteredOrders = orders.filter(
          (order) =>
            new Date(order.date).getMonth() === now.getMonth()
        );
      } else if (period === "lastMonth") {
        const lastMonth = now.getMonth() - 1;
        filteredOrders = orders.filter(
          (order) =>
            new Date(order.date).getMonth() === lastMonth
        );
      } else if (period === "year") {
        filteredOrders = orders.filter(
          (order) =>
            new Date(order.date).getFullYear() === now.getFullYear()
        );
      }

      const totalRevenue = filteredOrders.reduce(
        (sum, order) => sum + (order.totalPrice || 0),
        0
      );

      const lastPeriodRevenue = totalRevenue * 0.8;

      const growthPercent =
        lastPeriodRevenue === 0
          ? 100
          : ((totalRevenue - lastPeriodRevenue) / lastPeriodRevenue) *
            100;

      const trend = filteredOrders.map((_, index) =>
        filteredOrders
          .slice(0, index + 1)
          .reduce((sum, o) => sum + (o.totalPrice || 0), 0)
      );

      return { totalRevenue, growthPercent, trend };
    } catch (err) {
      return rejectWithValue("Failed to fetch revenue");
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",

  initialState: {
    users: 0,
    orders: 0,
    revenue: null,
    selectedPeriod: "month",
    loading: false,
    error: null,
  },

  reducers: {
    setPeriod: (state, action) => {
      state.selectedPeriod = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder

      /*
      USERS
      */
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /*
      ORDERS
      */
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /*
      REVENUE
      */
      .addCase(fetchRevenue.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRevenue.fulfilled, (state, action) => {
        state.loading = false;
        state.revenue = action.payload;
      })
      .addCase(fetchRevenue.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setPeriod } = dashboardSlice.actions;
export default dashboardSlice.reducer;