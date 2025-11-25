import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// FETCH SYSTEM SETTINGS

export const fetchSystem = createAsyncThunk("system/fetchSystem", async () => {
  const res = await axios.get("http://localhost:3000/systemSettings");
  return res.data;
});

// UPDATE SYSTEM SETTINGS

export const updateSystem = createAsyncThunk(
  "system/updateSystem",
  async (data) => {
    const res = await axios.put("http://localhost:3000/systemSettings", data);
    return res.data;
  }
);

// CREATE NEW API KEY

// This posts to /apiKeys (NOT systemSettings)
export const createApiKey = createAsyncThunk(
  "system/createApiKey",
  async (name) => {
    const newKey = {
      id: Date.now(),
      name,
      key: crypto.randomUUID(),
    };

    const res = await axios.post("http://localhost:3000/apiKeys", newKey);
    return res.data;
  }
);

// REVOKE (DELETE) API KEY

export const revokeApiKey = createAsyncThunk(
  "system/revokeApiKey",
  async (id) => {
    await axios.delete(`http://localhost:3000/apiKeys/${id}`);
    return id;
  }
);

// SLICE

const systemSlice = createSlice({
  name: "system",
  initialState: {
    system: null, // system settings
    apiKeys: [], // api key list
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ========== FETCH SYSTEM ==========
      .addCase(fetchSystem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSystem.fulfilled, (state, action) => {
        state.loading = false;
        state.system = action.payload;
      })
      .addCase(fetchSystem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // ========== UPDATE SYSTEM ==========
      .addCase(updateSystem.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateSystem.fulfilled, (state, action) => {
        state.loading = false;
        state.system = action.payload;
      })
      .addCase(updateSystem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // ========== CREATE API KEY ==========
      .addCase(createApiKey.pending, (state) => {
        state.loading = true;
      })
      .addCase(createApiKey.fulfilled, (state, action) => {
        state.loading = false;

        // Add new key into Redux
        if (!state.system.apiKeys) {
          state.system.apiKeys = [];
        }
        state.system.apiKeys.push(action.payload);
      })
      .addCase(createApiKey.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // ========== REVOKE API KEY ==========
      .addCase(revokeApiKey.pending, (state) => {
        state.loading = true;
      })
      .addCase(revokeApiKey.fulfilled, (state, action) => {
        state.loading = false;

        if (state.system.apiKeys) {
          state.system.apiKeys = state.system.apiKeys.filter(
            (k) => k.id !== action.payload
          );
        }
      })
      .addCase(revokeApiKey.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default systemSlice.reducer;
