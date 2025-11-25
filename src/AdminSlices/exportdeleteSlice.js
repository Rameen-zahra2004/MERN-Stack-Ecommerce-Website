import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Export JSON async thunk
export const exportJSON = createAsyncThunk("export/exportJSON", async () => {
  const res = await axios.get("/api/admin/export/json");
  return res.data;
});

// Export CSV async thunk
export const exportCSV = createAsyncThunk("export/exportCSV", async () => {
  const res = await axios.get("/api/admin/export/csv", {
    responseType: "text", // Important for CSV
  });
  return res.data;
});

// Delete account async thunk
export const deleteAccount = createAsyncThunk(
  "export/deleteAccount",
  async () => {
    const res = await axios.delete("/api/admin/account");
    return res.data;
  }
);

const initialState = {
  loading: false,
  error: null,
  exportData: null,
  csvData: null,
};

const exportSlice = createSlice({
  name: "export",
  initialState,
  reducers: {
    clearExportData: (state) => {
      state.exportData = null;
      state.csvData = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Export JSON
      .addCase(exportJSON.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(exportJSON.fulfilled, (state, action) => {
        state.loading = false;
        state.exportData = action.payload;
      })
      .addCase(exportJSON.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Export CSV
      .addCase(exportCSV.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(exportCSV.fulfilled, (state, action) => {
        state.loading = false;
        state.csvData = action.payload;
      })
      .addCase(exportCSV.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Delete Account
      .addCase(deleteAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAccount.fulfilled, (state) => {
        state.loading = false;
        // Clear all data after account deletion
        state.exportData = null;
        state.csvData = null;
      })
      .addCase(deleteAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearExportData } = exportSlice.actions;
export default exportSlice.reducer;
