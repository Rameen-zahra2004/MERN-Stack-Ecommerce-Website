import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";
export const fetchRevenue = createAsyncThunk("revenue/fetch", async (_, { rejectWithValue }) => {
  try { const res = await api.get("/admin/revenue"); return res.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message || "Failed"); }
});
const revenueSlice = createSlice({
  name: "revenue",
  initialState: { revenue: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRevenue.pending, (s) => { s.loading = true; })
      .addCase(fetchRevenue.fulfilled, (s, a) => { s.loading = false; s.revenue = a.payload; })
      .addCase(fetchRevenue.rejected, (s, a) => { s.loading = false; s.error = a.payload; });
  },
});
export default revenueSlice.reducer;
