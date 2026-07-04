import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import adminApi from "../api/adminApi";

// ─── LOGIN ────────────────────────────────────────────────
export const loginAdmin = createAsyncThunk(
  "adminLogin/loginAdmin",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await adminApi.post("/login", { email, password });
      return res.data.data.admin;
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
      await adminApi.post("/logout");
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
      const res = await adminApi.get("/me");
      return res.data.data.admin;
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
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.admin = action.payload;
        state.isAuthenticated = true;
        trackLogin(action.payload);
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(logoutAdmin.fulfilled, (state) => {
        state.admin = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logoutAdmin.rejected, (state, action) => {
        state.admin = null;
        state.isAuthenticated = false;
        state.error = action.payload;
      })

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
