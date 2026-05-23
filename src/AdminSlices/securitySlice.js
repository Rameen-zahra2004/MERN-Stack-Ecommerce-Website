import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";

const API = "/admins/security"; // ✅ FIXED: was "/admin/security"

export const fetchAdmin = createAsyncThunk(
  "security/fetchAdmin",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get(API);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch admin");
    }
  }
);

export const changePassword = createAsyncThunk(
  "security/changePassword",
  async ({ oldPassword, newPassword }, { getState, rejectWithValue }) => {
    const { password } = getState().security;

    if (oldPassword !== password) {
      return rejectWithValue("Old password is incorrect!");
    }

    try {
      const res = await api.patch(API, { password: newPassword });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to change password");
    }
  }
);

export const toggle2FA = createAsyncThunk(
  "security/toggle2FA",
  async (enabled, { rejectWithValue }) => {
    try {
      const res = await api.patch(API, { twoFA: enabled });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to toggle 2FA");
    }
  }
);

const securitySlice = createSlice({
  name: "security",
  initialState: {
    loading: false,
    error: null,
    success: false,
    username: "",
    password: "",
    twoFAEnabled: false,
  },
  reducers: {
    clearSuccess: (state) => {
      state.success = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(fetchAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.username = action.payload.username;
        state.password = action.payload.password;
        state.twoFAEnabled = action.payload.twoFA;
      })
      .addCase(fetchAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.password = action.payload.password;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(toggle2FA.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggle2FA.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.twoFAEnabled = action.payload.twoFA;
      })
      .addCase(toggle2FA.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSuccess, clearError } = securitySlice.actions;
export default securitySlice.reducer;