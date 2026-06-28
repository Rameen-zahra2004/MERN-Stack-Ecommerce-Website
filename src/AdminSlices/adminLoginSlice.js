import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import adminApi from "../api/adminApi";

// ─── LOGIN ────────────────────────────────────────────────
export const loginAdmin = createAsyncThunk(
  "adminLogin/loginAdmin",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await adminApi.post("/admin/login", { email, password });
      return res.data.admin;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

// ─── LOGOUT ───────────────────────────────────────────────
export const logoutAdmin = createAsyncThunk(
  "adminLogin/logoutAdmin",
  async (_, { rejectWithValue }) => {
    try {
      await adminApi.post("/admin/logout");
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

// ─── GET OWN PROFILE (used on app load to rehydrate) ─────
export const getAdminProfile = createAsyncThunk(
  "adminLogin/getAdminProfile",
  async (_, { rejectWithValue }) => {
    try {
      const res = await adminApi.get("/admin/me");
      return res.data.admin;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

// ─── LOGIN LOGS (kept here, localStorage only) ────────────
const getLoginLogs = () =>
  JSON.parse(localStorage.getItem("loginLogs") || "[]");

const saveLoginLog = (logs) =>
  localStorage.setItem("loginLogs", JSON.stringify(logs));

export const trackLogin = (admin) => {
  const logs = getLoginLogs();
  const newLog = {
    id: Date.now(),
    userId: admin._id || admin.id,
    email: admin.email,
    fullName: admin.fullName || admin.name || "Unknown",
    role: admin.role || "admin",
    loginTime: new Date().toISOString(),
    status: "success",
  };
  saveLoginLog([newLog, ...logs]);
};

// ─── SLICE ────────────────────────────────────────────────
const adminLoginSlice = createSlice({
  name: "adminLogin",
  initialState: {
    admin: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    // login logs (activity tracking, localStorage only)
    logins: [],
  },

  reducers: {
    clearAdminError: (state) => {
      state.error = null;
    },
    clearLogins: (state) => {
      state.logins = [];
      localStorage.removeItem("loginLogs");
    },
  },

  extraReducers: (builder) => {
    builder
      // ── LOGIN ──
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.admin = action.payload;
        state.isAuthenticated = true;
        // track in localStorage logs
        trackLogin(action.payload);
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── LOGOUT ──
      .addCase(logoutAdmin.fulfilled, (state) => {
        state.admin = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logoutAdmin.rejected, (state, action) => {
        // even if backend fails, clear frontend state
        state.admin = null;
        state.isAuthenticated = false;
        state.error = action.payload;
      })

      // ── GET PROFILE (rehydrate on app load) ──
      .addCase(getAdminProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAdminProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.admin = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(getAdminProfile.rejected, (state) => {
        state.loading = false;
        state.admin = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearAdminError, clearLogins } = adminLoginSlice.actions;
export default adminLoginSlice.reducer;
