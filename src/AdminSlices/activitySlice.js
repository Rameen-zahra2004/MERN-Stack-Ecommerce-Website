import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to fetch activities
export const fetchActivity = createAsyncThunk(
  "activity/fetchActivity",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "/http://localhost:3000/activityLogs/activity"
      ); // Replace with your API
      // Ensure we return an array
      if (!Array.isArray(response.data)) {
        // If API wraps data in a property like { data: [...] }
        return response.data.data ?? [];
      }
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const initialState = {
  activities: [],
  loading: false,
  error: null,
};

const activitySlice = createSlice({
  name: "activity",
  initialState,
  reducers: {},
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

// Selector to get all activities safely
export const selectAllActivity = (state) => state.activity.activities ?? [];

export default activitySlice.reducer;
