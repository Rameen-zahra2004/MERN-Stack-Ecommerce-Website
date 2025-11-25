import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// ===================== FETCH USERS =====================
export const fetchUsers = createAsyncThunk(
  "users/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("http://localhost:3000/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      return await res.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ===================== ADD USER =====================
export const addUser = createAsyncThunk(
  "users/addUser",
  async (newUser, { rejectWithValue }) => {
    try {
      const res = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });
      if (!res.ok) throw new Error("Failed to add user");
      return await res.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ===================== DELETE USER =====================
export const deleteUser = createAsyncThunk(
  "users/deleteUser",
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

// ===================== UPDATE USER =====================
export const updateUser = createAsyncThunk(
  "users/updateUser",
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const res = await fetch(`http://localhost:3000/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      if (!res.ok) throw new Error("Failed to update user");
      return await res.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ===================== BLOCK / UNBLOCK USER =====================
export const updateUserStatus = createAsyncThunk(
  "users/updateStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const res = await fetch(`http://localhost:3000/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update user status");
      return await res.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ===================== SLICE =====================
const userSlice = createSlice({
  name: "user",
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH
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

      // ADD
      .addCase(addUser.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })

      // DELETE
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.items = state.items.filter((u) => u.id !== action.payload);
      })

      // UPDATE
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.items.findIndex((u) => u.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })

      // BLOCK / UNBLOCK
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        const index = state.items.findIndex((u) => u.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      });
  },
});

export default userSlice.reducer;
