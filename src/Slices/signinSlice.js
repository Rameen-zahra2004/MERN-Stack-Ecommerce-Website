import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ─── localStorage helpers ─────────────────────────────────
const getUsers = () => JSON.parse(localStorage.getItem("users") || "[]");
const saveUsers = (users) => localStorage.setItem("users", JSON.stringify(users));
const getCurrentUser = () => JSON.parse(localStorage.getItem("currentUser") || "null");
const saveCurrentUser = (user) => localStorage.setItem("currentUser", JSON.stringify(user));

// ─── LOGIN ────────────────────────────────────────────────
export const loginUser = createAsyncThunk(
  "signinuser/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const users = getUsers();
      const user = users.find(
        (u) => u.email === email && u.password === password
      );
      if (!user) return rejectWithValue("Invalid email or password");
      saveCurrentUser(user);
      return user;
    } catch {
      return rejectWithValue("Login failed");
    }
  }
);

// ─── SIGNUP ───────────────────────────────────────────────
export const SignupUser = createAsyncThunk(
  "signinuser/SignupUser",
  async (newUser, { rejectWithValue }) => {
    try {
      const users = getUsers();
      if (users.find((u) => u.email === newUser.email)) {
        return rejectWithValue("Email already registered");
      }
      const user = {
        id: Date.now(),
        ...newUser,
        role: newUser.role || "user",
      };
      saveUsers([...users, user]);
      saveCurrentUser(user);
      return user;
    } catch {
      return rejectWithValue("Signup failed");
    }
  }
);

// ─── RESET PASSWORD ───────────────────────────────────────
export const resetPassword = createAsyncThunk(
  "signinuser/resetPassword",
  async ({ email, newPassword }, { rejectWithValue }) => {
    try {
      const users = getUsers();
      const index = users.findIndex((u) => u.email === email);
      if (index === -1) return rejectWithValue("Email not found");
      users[index].password = newPassword;
      saveUsers(users);

      // Update currentUser if it's the same user
      const current = getCurrentUser();
      if (current?.email === email) {
        saveCurrentUser({ ...current, password: newPassword });
      }
      return { message: "Password reset successful" };
    } catch {
      return rejectWithValue("Reset password failed");
    }
  }
);

// ─── DELETE USER ──────────────────────────────────────────
export const deleteUser = createAsyncThunk(
  "signinuser/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      const users = getUsers().filter((u) => u.id !== id);
      saveUsers(users);
      const current = getCurrentUser();
      if (current?.id === id) {
        localStorage.removeItem("currentUser");
      }
      return id;
    } catch {
      return rejectWithValue("Delete user failed");
    }
  }
);

// ─── Slice ────────────────────────────────────────────────
const signinSlice = createSlice({
  name: "signinuser",
  initialState: {
    user: getCurrentUser(), // ← hydrate from localStorage on refresh
    loading: false,
    error: null,
    resetLoading: false,
    resetSuccess: null,
    resetError: null,
  },

  reducers: {
    logOut: (state) => {
      state.user = null;
      state.error = null;
      localStorage.removeItem("currentUser");
      localStorage.removeItem("token");
    },
    clearResetState: (state) => {
      state.resetLoading = false;
      state.resetSuccess = null;
      state.resetError = null;
    },
  },

  extraReducers: (builder) => {
    const pending = (state) => {
      state.loading = true;
      state.error = null;
    };
    const rejected = (state, action) => {
      state.loading = false;
      state.error = action.payload;
    };

    builder
      // Login
      .addCase(loginUser.pending, pending)
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, rejected)

      // Signup
      .addCase(SignupUser.pending, pending)
      .addCase(SignupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(SignupUser.rejected, rejected)

      // Reset password
      .addCase(resetPassword.pending, (state) => {
        state.resetLoading = true;
        state.resetError = null;
        state.resetSuccess = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.resetLoading = false;
        state.resetSuccess = action.payload?.message || "Password reset successful";
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.resetLoading = false;
        state.resetError = action.payload;
      })

      // Delete user
      .addCase(deleteUser.fulfilled, (state, action) => {
        if (state.user?.id === action.payload) {
          state.user = null;
          localStorage.removeItem("currentUser");
        }
      });
  },
});

export const { logOut, clearResetState } = signinSlice.actions;
export default signinSlice.reducer;
