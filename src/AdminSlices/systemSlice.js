import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api"; // ✅ FIXED: use api instead of raw axios

export const fetchSystem = createAsyncThunk(
  "system/fetchSystem",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/system-settings"); // ✅ FIXED: was localhost:3000/systemSettings
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch system");
    }
  }
);

export const updateSystem = createAsyncThunk(
  "system/updateSystem",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.put("/system-settings", data); // ✅ FIXED
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update system");
    }
  }
);

export const createApiKey = createAsyncThunk(
  "system/createApiKey",
  async (name, { rejectWithValue }) => {
    try {
      const newKey = {
        id: Date.now(),
        name,
        key: crypto.randomUUID(),
      };

      const res = await api.post("/api-keys", newKey); // ✅ FIXED: was localhost:3000/apiKeys
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to create API key");
    }
  }
);

export const revokeApiKey = createAsyncThunk(
  "system/revokeApiKey",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/api-keys/${id}`); // ✅ FIXED: was localhost:3000/apiKeys
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete API key");
    }
  }
);

const systemSlice = createSlice({
  name: "system",
  initialState: {
    system: null,
    apiKeys: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      /* FETCH */
      .addCase(fetchSystem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSystem.fulfilled, (state, action) => {
        state.loading = false;
        state.system = action.payload;
        state.apiKeys = action.payload?.apiKeys || [];
      })
      .addCase(fetchSystem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* UPDATE */
      .addCase(updateSystem.fulfilled, (state, action) => {
        state.system = action.payload;
      })

      /* CREATE API KEY */
      .addCase(createApiKey.fulfilled, (state, action) => {
        state.apiKeys.push(action.payload);
        if (state.system) {
          if (!state.system.apiKeys) state.system.apiKeys = [];
          state.system.apiKeys.push(action.payload);
        }
      })

      /* DELETE API KEY */
      .addCase(revokeApiKey.fulfilled, (state, action) => {
        state.apiKeys = state.apiKeys.filter((k) => k.id !== action.payload);
        if (state.system?.apiKeys) {
          state.system.apiKeys = state.system.apiKeys.filter(
            (k) => k.id !== action.payload
          );
        }
      });
  },
});

export default systemSlice.reducer;