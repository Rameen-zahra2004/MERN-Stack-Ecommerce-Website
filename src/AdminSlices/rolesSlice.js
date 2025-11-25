import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchRoles = createAsyncThunk("role/fetchRoles", async () => {
  const res = await axios.get("http://localhost:3000/roles"); // db.json:
  return res.data;
});

export const addRole = createAsyncThunk("role/addRole", async (role) => {
  const res = await axios.post("http://localhost:3000/roles", role);
  return res.data;
});

export const removeRole = createAsyncThunk("role/removeRole", async (id) => {
  await axios.delete(`http://localhost:3000/roles/${id}`);
  return id;
});

const roleSlice = createSlice({
  name: "role",
  initialState: { roles: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.loading = false;
        state.roles = action.payload;
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(addRole.pending, (state) => {
        state.loading = true;
      })
      .addCase(addRole.fulfilled, (state, action) => {
        state.loading = false;
        state.roles.push(action.payload);
      })
      .addCase(addRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(removeRole.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeRole.fulfilled, (state, action) => {
        state.loading = false;
        state.roles = state.roles.filter((r) => r.id !== action.payload);
      })
      .addCase(removeRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default roleSlice.reducer;
