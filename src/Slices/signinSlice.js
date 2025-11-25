import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// FAKE JWT GENERATOR
function createFakeJWT(payload) {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = btoa(JSON.stringify(payload));
  const signature = btoa("fake_signature_key");
  return `${header}.${body}.${signature}`;
}

// -------------------- LOGIN USER --------------------
export const loginUser = createAsyncThunk(
  "signinuser/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const adminRes = await fetch("http://localhost:3000/admins");
      const admins = await adminRes.json();
      const admin = admins.find(
        (a) => a.email === email && a.password === password
      );
      if (admin) return { ...admin, role: "admin" };

      const userRes = await fetch("http://localhost:3000/users");
      const users = await userRes.json();
      const user = users.find(
        (u) => u.email === email && u.password === password
      );
      if (user) return { ...user, role: "user" };

      return rejectWithValue("Invalid email or password!");
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// -------------------- SIGNUP USER --------------------
export const SignupUser = createAsyncThunk(
  "signinuser/SignupUser",
  async (newUser, { rejectWithValue }) => {
    try {
      const res = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newUser, id: Date.now(), role: "user" }),
      });
      if (!res.ok) throw new Error("Failed to sign up");
      return await res.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// -------------------- RESET PASSWORD --------------------
export const resetPassword = createAsyncThunk(
  "signinuser/resetPassword",
  async ({ email, newPassword }, { rejectWithValue }) => {
    try {
      // Admins
      const adminRes = await fetch("http://localhost:3000/admins");
      const admins = await adminRes.json();
      const admin = admins.find((a) => a.email === email);
      if (admin) {
        const res = await fetch(`http://localhost:3000/admins/${admin.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: newPassword }),
        });
        if (!res.ok) throw new Error("Failed to update password");
        return { message: "Admin password updated successfully" };
      }

      // Users
      const userRes = await fetch("http://localhost:3000/users");
      const users = await userRes.json();
      const user = users.find((u) => u.email === email);
      if (user) {
        const res = await fetch(`http://localhost:3000/users/${user.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: newPassword }),
        });
        if (!res.ok) throw new Error("Failed to update password");
        return { message: "User password updated successfully" };
      }

      return rejectWithValue("Email not found");
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// -------------------- DELETE USER --------------------
export const deleteUser = createAsyncThunk(
  "signinuser/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      const res = await fetch(`http://localhost:3000/users/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete user");
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// -------------------- SLICE --------------------
const signinSlice = createSlice({
  name: "signinuser",
  initialState: {
    user: null,
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
      localStorage.removeItem("token");
    },
    clearResetState: (state) => {
      state.resetLoading = false;
      state.resetSuccess = null;
      state.resetError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        const token = createFakeJWT({
          id: action.payload.id,
          email: action.payload.email,
          role: action.payload.role,
          exp: Date.now() + 3600 * 1000,
        });
        localStorage.setItem("token", token);
        state.user = { ...action.payload, token };
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // SIGNUP
      .addCase(SignupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(SignupUser.fulfilled, (state, action) => {
        state.loading = false;
        const token = createFakeJWT({
          id: action.payload.id,
          email: action.payload.email,
          role: "user",
          exp: Date.now() + 3600 * 1000,
        });
        localStorage.setItem("token", token);
        state.user = { ...action.payload, token };
      })
      .addCase(SignupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // RESET PASSWORD
      .addCase(resetPassword.pending, (state) => {
        state.resetLoading = true;
        state.resetError = null;
        state.resetSuccess = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.resetLoading = false;
        state.resetSuccess = action.payload.message;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.resetLoading = false;
        state.resetError = action.payload;
      })

      // DELETE USER
      .addCase(deleteUser.fulfilled, (state, action) => {
        if (state.user?.id === action.payload) {
          state.user = null;
          localStorage.removeItem("token");
        }
      });
  },
});

export const { logOut, clearResetState } = signinSlice.actions;
export default signinSlice.reducer;
