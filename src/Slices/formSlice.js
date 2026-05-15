import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";
export const registerUser = createAsyncThunk("form/register", async (userData, { rejectWithValue }) => {
  try { const res = await api.post("/auth/register", userData); return res.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message || "Registration failed"); }
});
const formSlice = createSlice({
  name: "form",
  initialState: { loading: false, error: null, success: false },
  reducers: { resetForm: (s) => { s.loading = false; s.error = null; s.success = false; } },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(registerUser.fulfilled, (s) => { s.loading = false; s.success = true; })
      .addCase(registerUser.rejected, (s, a) => { s.loading = false; s.error = a.payload; });
  },
});
export const { resetForm } = formSlice.actions;
export default formSlice.reducer;
