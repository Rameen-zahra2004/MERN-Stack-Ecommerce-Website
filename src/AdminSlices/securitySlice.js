import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const ADMIN_URL = "http://localhost:3000/admins";

// Fetch admin info
export const fetchAdmin = createAsyncThunk("security/fetchAdmin", async () => {
  const res = await axios.get(ADMIN_URL);
  return res.data;
});

// Change password
export const changePassword = createAsyncThunk(
  "security/changePassword",
  async ({ oldPassword, newPassword }, { getState, rejectWithValue }) => {
    const { password } = getState().security;

    if (oldPassword !== password) {
      return rejectWithValue("Old password is incorrect!");
    }

    const res = await axios.patch(ADMIN_URL, { password: newPassword });
    return res.data;
  }
);

// Toggle 2FA
export const toggle2FA = createAsyncThunk(
  "security/toggle2FA",
  async (enabled) => {
    const res = await axios.patch(ADMIN_URL, { twoFA: enabled });
    return res.data;
  }
);

const securitySlice = createSlice({
  name: "security",
  initialState: {
    loading: false,
    error: null,
    username: "",
    password: "",
    twoFAEnabled: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch admin
      .addCase(fetchAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.username = action.payload.username;
        state.password = action.payload.password;
        state.twoFAEnabled = action.payload.twoFA;
      })
      .addCase(fetchAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Change password
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.password = action.payload.password;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // Toggle 2FA
      .addCase(toggle2FA.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggle2FA.fulfilled, (state, action) => {
        state.loading = false;
        state.twoFAEnabled = action.payload.twoFA;
      })
      .addCase(toggle2FA.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default securitySlice.reducer;
