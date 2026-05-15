import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";

/*
==================================================
FETCH USERS
==================================================
*/
export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/users");
      return res.data;
    } catch (err) {
      return rejectWithValue("Failed to fetch users");
    }
  }
);

/*
==================================================
ADD USER
==================================================
*/
export const addUser = createAsyncThunk(
  "users/addUser",
  async (newUser, { rejectWithValue }) => {
    try {
      const res = await api.post("/users", newUser);
      return res.data;
    } catch (err) {
      return rejectWithValue("Failed to add user");
    }
  }
);

/*
==================================================
DELETE USER
==================================================
*/
export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/users/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue("Failed to delete user");
    }
  }
);

/*
==================================================
UPDATE USER
==================================================
*/
export const updateUser = createAsyncThunk(
  "users/updateUser",
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/users/${id}`, updatedData);
      return res.data;
    } catch (err) {
      return rejectWithValue("Failed to update user");
    }
  }
);

/*
==================================================
BLOCK / UNBLOCK USER  (FIX YOUR ERROR HERE)
==================================================
*/
export const updateUserStatus = createAsyncThunk(
  "users/updateUserStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/users/${id}`, { status });
      return res.data;
    } catch (err) {
      return rejectWithValue("Failed to update user status");
    }
  }
);

/*
==================================================
SLICE
==================================================
*/
const userSlice = createSlice({
  name: "users",

  initialState: {
    items: [],
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      /*
      FETCH USERS
      */
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /*
      ADD USER
      */
      .addCase(addUser.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })

      /*
      DELETE USER
      */
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (user) => user.id !== action.payload
        );
      })

      /*
      UPDATE USER
      */
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (u) => u.id === action.payload.id
        );
        if (index !== -1) state.items[index] = action.payload;
      })

      /*
      BLOCK / UNBLOCK USER
      */
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (u) => u.id === action.payload.id
        );
        if (index !== -1) state.items[index] = action.payload;
      });
  },
});

/*
==================================================
EXPORT REDUCER
==================================================
*/
export default userSlice.reducer;