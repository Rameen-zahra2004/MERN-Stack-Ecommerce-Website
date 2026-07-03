import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import dashboardApi from "../api/dashboardApi";

// No BASE prefix needed — dashboardApi's baseURL is already
// http://localhost:5000/api/dashboard

/*
=========================
THUNKS — one per backend endpoint, no combining, so loading/error
states stay independent per widget (a slow chart shouldn't block
the summary cards from rendering).
=========================
*/

export const fetchDashboardSummary = createAsyncThunk(
  "dashboard/fetchSummary",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await dashboardApi.get("/summary");
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

export const fetchRevenueAnalytics = createAsyncThunk(
  "dashboard/fetchRevenue",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await dashboardApi.get("/revenue");
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

export const fetchSalesAnalytics = createAsyncThunk(
  "dashboard/fetchSales",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await dashboardApi.get("/sales");
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

export const fetchRecentOrders = createAsyncThunk(
  "dashboard/fetchRecentOrders",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await dashboardApi.get("/recent-orders");
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

export const fetchLatestCustomers = createAsyncThunk(
  "dashboard/fetchLatestCustomers",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await dashboardApi.get("/latest-users");
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

export const fetchCustomerGrowth = createAsyncThunk(
  "dashboard/fetchCustomerGrowth",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await dashboardApi.get("/customer-growth");
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

export const fetchLowStockProducts = createAsyncThunk(
  "dashboard/fetchLowStockProducts",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await dashboardApi.get("/low-stock");
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

export const fetchTopSellingProducts = createAsyncThunk(
  "dashboard/fetchTopSellingProducts",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await dashboardApi.get("/top-products");
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

export const fetchOrderStatusAnalytics = createAsyncThunk(
  "dashboard/fetchOrderStatusAnalytics",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await dashboardApi.get("/order-status");
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

export const fetchMonthlyChart = createAsyncThunk(
  "dashboard/fetchMonthlyChart",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await dashboardApi.get("/monthly-chart");
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

/*
=========================
INITIAL STATE
=========================
Shape intentionally mirrors backend response field names 1:1
(no renaming/transforming in the slice) so components can reference
state.dashboard.summary.totalRevenue etc. without a translation layer.
*/

const initialState = {
  summary: null,
  revenue: null,
  sales: null,
  recentOrders: [],
  latestCustomers: [],
  customerGrowth: [],
  lowStockProducts: [],
  topSellingProducts: [],
  orderStatusAnalytics: null,
  monthlyChart: [],

  // Per-section loading/error rather than one global flag — lets the UI
  // show skeleton loaders per-widget instead of blocking the whole page.
  loading: {
    summary: false,
    revenue: false,
    sales: false,
    recentOrders: false,
    latestCustomers: false,
    customerGrowth: false,
    lowStockProducts: false,
    topSellingProducts: false,
    orderStatusAnalytics: false,
    monthlyChart: false,
  },

  error: {
    summary: null,
    revenue: null,
    sales: null,
    recentOrders: null,
    latestCustomers: null,
    customerGrowth: null,
    lowStockProducts: null,
    topSellingProducts: null,
    orderStatusAnalytics: null,
    monthlyChart: null,
  },
};

/*
=========================
HELPER — builds the three extraReducers cases for a given thunk +
state key, so we're not hand-writing 30 near-identical case blocks.
=========================
*/
const addThunkCases = (builder, thunk, key) => {
  builder
    .addCase(thunk.pending, (state) => {
      state.loading[key] = true;
      state.error[key] = null;
    })
    .addCase(thunk.fulfilled, (state, action) => {
      state.loading[key] = false;
      state[key] = action.payload;
    })
    .addCase(thunk.rejected, (state, action) => {
      state.loading[key] = false;
      state.error[key] = action.payload || "Something went wrong";
    });
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    resetDashboardState: () => initialState,
  },
  extraReducers: (builder) => {
    addThunkCases(builder, fetchDashboardSummary, "summary");
    addThunkCases(builder, fetchRevenueAnalytics, "revenue");
    addThunkCases(builder, fetchSalesAnalytics, "sales");
    addThunkCases(builder, fetchRecentOrders, "recentOrders");
    addThunkCases(builder, fetchLatestCustomers, "latestCustomers");
    addThunkCases(builder, fetchCustomerGrowth, "customerGrowth");
    addThunkCases(builder, fetchLowStockProducts, "lowStockProducts");
    addThunkCases(builder, fetchTopSellingProducts, "topSellingProducts");
    addThunkCases(builder, fetchOrderStatusAnalytics, "orderStatusAnalytics");
    addThunkCases(builder, fetchMonthlyChart, "monthlyChart");
  },
});

export const { resetDashboardState } = dashboardSlice.actions;
export default dashboardSlice.reducer;
