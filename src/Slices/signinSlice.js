import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";

/* ─────────────────────────────────────────
   HELPER
───────────────────────────────────────── */
const normalizeUser = (user) =>
  user ? { ...user, role: user.role?.toLowerCase() ?? "user" } : null;

const saveToStorage = (user, accessToken) => {
  localStorage.setItem("currentUser", JSON.stringify(user));
  localStorage.setItem("token", accessToken ?? "");
};

const clearStorage = () => {
  localStorage.removeItem("currentUser");
  localStorage.removeItem("token");
};

/* ─────────────────────────────────────────
   INITIAL STATE
───────────────────────────────────────── */
const initialState = {
  user: JSON.parse(localStorage.getItem("currentUser")) || null,
  accessToken: localStorage.getItem("token") || null,
  refreshToken: null,

  loading: false,
  error: null,

  resetLoading: false,
  resetSuccess: null,
  resetError: null,
};

/* ─────────────────────────────────────────
   THUNKS
───────────────────────────────────────── */
export const loginUser = createAsyncThunk(
  "signinuser/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/auth/login", { email, password });

      const raw = data?.data ?? data;

      // user may be nested as raw.user OR raw itself may be the user object
      // accessToken may be raw.accessToken OR raw.token
      const user         = raw?.user        ?? (raw?._id ? raw : null);
      const accessToken  = raw?.accessToken ?? raw?.token ?? raw?.user?.accessToken ?? null;
      const refreshToken = raw?.refreshToken ?? raw?.user?.refreshToken ?? null;

      if (!user) {
        console.error("[loginUser] Full response →", JSON.stringify(data, null, 2));
        return rejectWithValue("Login failed: user not returned by server");
      }

      return { user, accessToken, refreshToken };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Invalid email or password"
      );
    }
  }
);

export const SignupUser = createAsyncThunk(
  "signinuser/SignupUser",
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/auth/register", { name, email, password });
      const raw = data?.data ?? data;

      const user         = raw?.user        ?? (raw?._id ? raw : null);
      const accessToken  = raw?.accessToken ?? raw?.token ?? raw?.user?.accessToken ?? null;
      const refreshToken = raw?.refreshToken ?? raw?.user?.refreshToken ?? null;

      if (!user) {
        console.error("[SignupUser] Full response →", JSON.stringify(data, null, 2));
        return rejectWithValue("Signup failed: user not returned by server");
      }

      return { user, accessToken, refreshToken };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Signup failed"
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  "signinuser/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await api.post("/auth/logout");
      return true;
    } catch {
      // Even if API fails, still log out locally
      return true;
    }
  }
);

export const resetPassword = createAsyncThunk(
  "signinuser/resetPassword",
  async ({ email, newPassword }, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/auth/reset-password", { email, newPassword });
      return data?.message || "Password reset successful";
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Reset password failed"
      );
    }
  }
);

export const deleteUser = createAsyncThunk(
  "signinuser/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/users/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue("Delete user failed");
    }
  }
);

/* ─────────────────────────────────────────
   REUSABLE REDUCERS
───────────────────────────────────────── */
const handleAuthFulfilled = (state, action) => {
  const user = normalizeUser(action.payload?.user);

  state.loading = false;
  state.error = null;
  state.user = user;
  state.accessToken = action.payload?.accessToken ?? null;
  state.refreshToken = action.payload?.refreshToken ?? null;

  saveToStorage(user, state.accessToken);
};

const handleAuthRejected = (state, action) => {
  state.loading = false;
  state.error = action.payload;
  // ✅ Do NOT clear state.user here — keep existing session intact
};

const clearAuthState = (state) => {
  state.user = null;
  state.accessToken = null;
  state.refreshToken = null;
  state.error = null;
  clearStorage();
};

/* ─────────────────────────────────────────
   SLICE
───────────────────────────────────────── */
const signinSlice = createSlice({
  name: "signinuser",
  initialState,
  reducers: {
    logOut: clearAuthState,

    clearError: (state) => {
      state.error = null;
    },

    clearResetState: (state) => {
      state.resetLoading = false;
      state.resetSuccess = null;
      state.resetError = null;
    },
  },

  extraReducers: (builder) => {
    /* ── LOGIN ── */
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        // ✅ FIXED: Do NOT wipe state.user on pending —
        // it causes the redirect useEffect to mis-fire
      })
      .addCase(loginUser.fulfilled, handleAuthFulfilled)
      .addCase(loginUser.rejected, handleAuthRejected);

    /* ── SIGNUP ── */
    builder
      .addCase(SignupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(SignupUser.fulfilled, handleAuthFulfilled)
      .addCase(SignupUser.rejected, handleAuthRejected);

    /* ── LOGOUT ── */
    builder.addCase(logoutUser.fulfilled, clearAuthState);

    /* ── RESET PASSWORD ── */
    builder
      .addCase(resetPassword.pending, (state) => {
        state.resetLoading = true;
        state.resetSuccess = null;
        state.resetError = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.resetLoading = false;
        state.resetSuccess = action.payload;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.resetLoading = false;
        state.resetError = action.payload;
      });

    /* ── DELETE USER ── */
    builder.addCase(deleteUser.fulfilled, (state, action) => {
      if (state.user?._id === action.payload) {
        clearAuthState(state);
      }
    });
  },
});

export const { logOut, clearError, clearResetState } = signinSlice.actions;
export default signinSlice.reducer;
