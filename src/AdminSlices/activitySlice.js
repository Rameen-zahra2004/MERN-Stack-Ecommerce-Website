import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";

// Fetch activity logs
export const fetchActivity = createAsyncThunk(
  "activity/fetchActivity",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/activityLogs/activity");

      if (Array.isArray(res.data)) return res.data;
      return res.data?.data ?? [];
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch activity logs"
      );
    }
  }
);

const activitySlice = createSlice({
  name: "activity",
  initialState: {
    activities: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearActivity: (state) => {
      state.activities = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchActivity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActivity.fulfilled, (state, action) => {
        state.loading = false;
        state.activities = action.payload;
      })
      .addCase(fetchActivity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch activities";
      });
  },
});

// Selector
export const selectAllActivity = (state) => state.activity.activities ?? [];

export const { clearActivity } = activitySlice.actions;
export default activitySlice.reducer;