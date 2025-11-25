import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const submitForm = createAsyncThunk("form/submit", async (userData) => {
  const response = await fetch("http://localhost:3000/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
  const data = await response.json();

  return data;
});
const formSlice = createSlice({
  name: "form",
  initialState: {
    formUser: {},
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(submitForm.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitForm.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(submitForm.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to Submit Form!";
      });
  },
});

export default formSlice.reducer;
