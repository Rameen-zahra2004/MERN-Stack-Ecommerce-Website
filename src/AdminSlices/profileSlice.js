import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";

const API = "/profile"; // ✅ FIXED: was "/admin/profile"

// ─── Thunks ───────────────────────────────────────────────

export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get(API);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load profile");
    }
  }
);

export const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.put(API, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update profile");
    }
  }
);

export const uploadAvatar = createAsyncThunk(
  "profile/uploadAvatar",
  async (avatarDataUrl, { rejectWithValue }) => {
    try {
      const res = await api.patch(API, { avatar: avatarDataUrl });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to upload avatar");
    }
  }
);

export const deleteAvatar = createAsyncThunk(
  "profile/deleteAvatar",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.patch(API, { avatar: null });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete avatar");
    }
  }
);

// ─── Slice ────────────────────────────────────────────────

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    profile: null,
    loading: false,
    error: null,
    success: false,
    theme: "light",
    accent: "#0ea5e9",
    sidebarCompact: false,
  },

  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
      if (state.profile) state.profile.theme = action.payload;
    },
    setAccent: (state, action) => {
      state.accent = action.payload;
      if (state.profile) state.profile.accent = action.payload;
    },
    toggleSidebarCompact: (state) => {
      state.sidebarCompact = !state.sidebarCompact;
      if (state.profile) state.profile.sidebarCompact = state.sidebarCompact;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        state.theme = action.payload.theme || "light";
        state.accent = action.payload.accent || "#0ea5e9";
        state.sidebarCompact = action.payload.sidebarCompact || false;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.profile = { ...state.profile, ...action.payload };
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(uploadAvatar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadAvatar.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        if (state.profile) state.profile.avatar = action.payload.avatar;
      })
      .addCase(uploadAvatar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteAvatar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAvatar.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        if (state.profile) state.profile.avatar = null;
      })
      .addCase(deleteAvatar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setTheme, setAccent, toggleSidebarCompact, clearSuccess } =
  profileSlice.actions;

export default profileSlice.reducer;