import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

/* =========================
   FETCH USER PROFILE
========================= */
export const fetchUser = createAsyncThunk(
  "userSettings/fetchUser",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { user: authUser } = getState().auth;

      if (!authUser) {
        return rejectWithValue("User not authenticated");
      }

      const res = await fetch(
        `http://localhost:3000/users/${authUser.id}`
      );

      if (!res.ok) {
        return rejectWithValue("Failed to fetch user data");
      }

      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/* =========================
   UPDATE USER PROFILE
========================= */
export const updateUser = createAsyncThunk(
  "userSettings/updateUser",
  async (updatedUser, { getState, rejectWithValue }) => {
    try {
      const { user: authUser } = getState().auth;

      if (!authUser || authUser.role !== "user") {
        return rejectWithValue("Unauthorized");
      }

      const res = await fetch(
        `http://localhost:3000/users/${authUser.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedUser),
        }
      );

      if (!res.ok) {
        return rejectWithValue("Failed to update profile");
      }

      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/* =========================
   SLICE
========================= */
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
    builder

      /* FETCH USER */
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
      })

      /* UPDATE USER */
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