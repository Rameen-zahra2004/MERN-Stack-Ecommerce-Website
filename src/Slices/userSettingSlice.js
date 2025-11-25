import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// -------------------------
// Fetch logged-in user profile
// -------------------------
export const fetchUser = createAsyncThunk(
  "userSettings/fetchUser",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { user: authUser } = getState().auth; // get logged-in user from auth slice
      if (!authUser) throw new Error("User not authenticated");

      // Only fetch from users endpoint if role is "user"
      if (authUser.role === "user") {
        const res = await fetch(`http://localhost:3000/users/${authUser.id}`);
        if (!res.ok) throw new Error("Failed to fetch user data");
        const data = await res.json();
        return data;
      }

      // Admins should not fetch this slice
      return rejectWithValue("Admins cannot fetch user settings");
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// -------------------------
// Update profile
// -------------------------
export const updateUser = createAsyncThunk(
  "userSettings/updateUser",
  async (updatedUser, { getState, rejectWithValue }) => {
    try {
      const { user: authUser } = getState().auth;
      if (!authUser || authUser.role !== "user") {
        throw new Error("Unauthorized");
      }

      const res = await fetch(`http://localhost:3000/users/${authUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      });

      if (!res.ok) throw new Error("Failed to update profile");
      const data = await res.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// -------------------------
// Slice
// -------------------------
const userSettingsSlice = createSlice({
  name: "userSettings",
  initialState: {
    user: null,
    loading: false,
    saving: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // Fetch user
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update profile
    builder
      .addCase(updateUser.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.saving = false;
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      });
  },
});

export default userSettingsSlice.reducer;
