import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";
export const fetchActiveUsers = createAsyncThunk("activeUsers/fetch", async (_, { rejectWithValue }) => {
  try { const res = await api.get("/admin/active-users"); return res.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message || "Failed"); }
});
export const addActiveUser = createAsyncThunk("activeUsers/add", async (user, { rejectWithValue }) => {
  try { const res = await api.post("/admin/active-users", user); return res.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message || "Failed"); }
});
export const removeActiveUser = createAsyncThunk("activeUsers/remove", async (userId, { rejectWithValue }) => {
  try { await api.delete(`/admin/active-users/${userId}`); return userId; }
  catch (err) { return rejectWithValue(err.response?.data?.message || "Failed"); }
});
const activeUserSlice = createSlice({
  name: "activeUsers",
  initialState: { activeUsers: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchActiveUsers.pending, (s) => { s.loading = true; })
      .addCase(fetchActiveUsers.fulfilled, (s, a) => { s.loading = false; s.activeUsers = a.payload; })
      .addCase(fetchActiveUsers.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(addActiveUser.fulfilled, (s, a) => { s.activeUsers.push(a.payload); })
      .addCase(removeActiveUser.fulfilled, (s, a) => { s.activeUsers = s.activeUsers.filter((u) => u._id !== a.payload); });
  },
});
export default activeUserSlice.reducer;
