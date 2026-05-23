import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";

const API = "/admins/roles"; // ✅ FIXED: was "/admin/roles"

export const fetchRoles = createAsyncThunk(
  "roles/fetchRoles",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get(API);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch roles");
    }
  }
);

export const addRole = createAsyncThunk(
  "roles/addRole",
  async (role, { rejectWithValue }) => {
    try {
      const res = await api.post(API, role);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to add role");
    }
  }
);

export const deleteRole = createAsyncThunk(
  "roles/deleteRole",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`${API}/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete role");
    }
  }
);

// Alias so components using removeRole still work
export const removeRole = deleteRole;

const rolesSlice = createSlice({
  name: "roles",
  initialState: {
    roles: [],
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    clearSuccess: (state) => {
      state.success = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoles.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.loading = false;
        state.roles = action.payload;
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addRole.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.roles.push(action.payload);
      })
      .addCase(addRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteRole.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.roles = state.roles.filter(
          (r) => r._id !== action.payload && r.id !== action.payload
        );
      })
      .addCase(deleteRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSuccess, clearError } = rolesSlice.actions;
export default rolesSlice.reducer;