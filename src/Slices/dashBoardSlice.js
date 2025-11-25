import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = "http://localhost:3000";

// Fetch users count
export const fetchUsers = createAsyncThunk("dashboard/fetchUsers", async () => {
  const response = await fetch(`${API_URL}/users`);
  if (!response.ok) throw new Error("Failed to fetch users");
  const data = await response.json();
  return data.length; // count of users
});

// Fetch orders count
export const fetchOrders = createAsyncThunk(
  "dashboard/fetchOrders",
  async () => {
    const response = await fetch(`${API_URL}/orders`);
    if (!response.ok) throw new Error("Failed to fetch orders");
    const data = await response.json();
    return data.length; // count of orders
  }
);

// Fetch revenue with optional period
export const fetchRevenue = createAsyncThunk(
  "dashboard/fetchRevenue",
  async (period = "month") => {
    const response = await fetch(`${API_URL}/orders`);
    if (!response.ok) throw new Error("Failed to fetch revenue");
    const orders = await response.json();

    // Filter orders based on period (simple example using dates)
    const now = new Date();
    let filteredOrders = orders;

    if (period === "month") {
      filteredOrders = orders.filter(
        (order) => new Date(order.date).getMonth() === now.getMonth()
      );
    } else if (period === "lastMonth") {
      const lastMonth = now.getMonth() - 1;
      filteredOrders = orders.filter(
        (order) => new Date(order.date).getMonth() === lastMonth
      );
    } else if (period === "year") {
      filteredOrders = orders.filter(
        (order) => new Date(order.date).getFullYear() === now.getFullYear()
      );
    }

    const totalRevenue = filteredOrders.reduce(
      (sum, order) => sum + order.totalPrice,
      0
    );

    const lastPeriodRevenue = totalRevenue * 0.8; // mock comparison
    const growthPercent =
      ((totalRevenue - lastPeriodRevenue) / lastPeriodRevenue) * 100;

    const trend = filteredOrders.map((order, index) =>
      filteredOrders
        .slice(0, index + 1)
        .reduce((sum, o) => sum + o.totalPrice, 0)
    );

    return { totalRevenue, growthPercent, trend };
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
      // Users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload;
        state.loading = false;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Orders
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.loading = false;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Revenue
      .addCase(fetchRevenue.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRevenue.fulfilled, (state, action) => {
        state.revenue = action.payload;
        state.loading = false;
      })
      .addCase(fetchRevenue.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setPeriod } = dashboardSlice.actions;
export default dashboardSlice.reducer;
