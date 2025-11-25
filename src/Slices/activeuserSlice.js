import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// FETCH ACTIVE USERS
export const fetchActiveUsers = createAsyncThunk(
  "activeUsers/fetchActiveUsers",
  async () => {
    const res = await fetch("http://localhost:3000/activeusers");
    if (!res.ok) throw new Error("Failed to fetch active users");
    return await res.json();
  }
);

// ADD ACTIVE USER
export const addActiveUser = createAsyncThunk(
  "activeUsers/addActiveUser",
  async (user, { getState }) => {
    const { activeUsers } = getState();
    const exists = activeUsers.list.find((u) => u.id === user.id);
    if (exists) return exists;

    const res = await fetch("http://localhost:3000/activeusers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });
    if (!res.ok) throw new Error("Failed to add active user");
    return await res.json();
  }
);

// REMOVE ACTIVE USER
export const removeActiveUser = createAsyncThunk(
  "activeUsers/removeActiveUser",
  async (userId) => {
    await fetch(`http://localhost:3000/activeusers/${userId}`, {
      method: "DELETE",
    });
    return userId;
  }
);

const activeUsersSlice = createSlice({
  name: "activeUsers",
  initialState: { list: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchActiveUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchActiveUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchActiveUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addActiveUser.fulfilled, (state, action) => {
        if (!state.list.some((u) => u.id === action.payload.id))
          state.list.push(action.payload);
      })
      .addCase(removeActiveUser.fulfilled, (state, action) => {
        state.list = state.list.filter((u) => u.id !== action.payload);
      });
  },
});

export default activeUsersSlice.reducer;
