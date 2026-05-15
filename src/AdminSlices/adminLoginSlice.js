import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ─── localStorage helpers ─────────────────────────────────
const getLoginLogs = () =>
  JSON.parse(localStorage.getItem("loginLogs") || "[]");

const saveLoginLog = (logs) =>
  localStorage.setItem("loginLogs", JSON.stringify(logs));

// ─── Auto-track login: call this from signinSlice after login ─
export const trackLogin = (user) => {
  const logs = getLoginLogs();
  const newLog = {
    id: Date.now(),
    userId: user.id,
    email: user.email,
    fullName: user.fullName || user.name || "Unknown",
    role: user.role || "user",
    loginTime: new Date().toISOString(),
    status: "success",
  };
  saveLoginLog([newLog, ...logs]);
};

// ─── Fetch login logs ─────────────────────────────────────
export const fetchLogins = createAsyncThunk(
  "adminLogin/fetchLogins",
  async (_, { rejectWithValue }) => {
    try {
      const logs = getLoginLogs();
      return logs;
    } catch {
      return rejectWithValue("Failed to fetch login logs");
    }
  }
);

// ─── Clear all login logs ─────────────────────────────────
export const clearLoginLogs = createAsyncThunk(
  "adminLogin/clearLoginLogs",
  async (_, { rejectWithValue }) => {
    try {
      localStorage.removeItem("loginLogs");
      return [];
    } catch {
      return rejectWithValue("Failed to clear login logs");
    }
  }
);

// ─── Delete single log ────────────────────────────────────
export const deleteLoginLog = createAsyncThunk(
  "adminLogin/deleteLoginLog",
  async (id, { rejectWithValue }) => {
    try {
      const logs = getLoginLogs().filter((l) => l.id !== id);
      saveLoginLog(logs);
      return id;
    } catch {
      return rejectWithValue("Failed to delete login log");
    }
  }
);

// ─── Slice ────────────────────────────────────────────────
const adminLoginSlice = createSlice({
  name: "adminLogin",
  initialState: {
    logins: [],
    loading: false,
    error: null,
  },

  reducers: {
    clearLogins: (state) => {
      state.logins = [];
      state.error = null;
      localStorage.removeItem("loginLogs");
    },
  },

  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchLogins.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLogins.fulfilled, (state, action) => {
        state.loading = false;
        state.logins = action.payload;
      })
      .addCase(fetchLogins.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Clear all
      .addCase(clearLoginLogs.fulfilled, (state) => {
        state.logins = [];
      })

      // Delete single
      .addCase(deleteLoginLog.fulfilled, (state, action) => {
        state.logins = state.logins.filter((l) => l.id !== action.payload);
      });
  },
});

export const { clearLogins } = adminLoginSlice.actions;
export default adminLoginSlice.reducer;