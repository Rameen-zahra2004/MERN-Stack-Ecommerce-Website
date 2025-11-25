import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchLogins = createAsyncThunk("login/fetchLogins", async () => {
  const res = await axios.get("http://localhost:3000/login"); // db.json: "logins": [ ... ]
  return res.data;
});

const loginSlice = createSlice({
  name: "login",
  initialState: {
    logins: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLogins.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLogins.fulfilled, (state, action) => {
        state.loading = false;
        state.logins = action.payload;
      })
      .addCase(fetchLogins.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default loginSlice.reducer;
