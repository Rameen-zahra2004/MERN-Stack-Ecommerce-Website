import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk for fetching revenue data
export const fetchRevenue = createAsyncThunk(
  "revenue/fetchRevenue",
  async () => {
    const response = await fetch("http://localhost:3000/revenue");
    if (!response.ok) throw new Error("Failed to fetch revenue data");
    return await response.json();
  }
);

const revenueSlice = createSlice({
  name: "revenue",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRevenue.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRevenue.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchRevenue.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default revenueSlice.reducer;
