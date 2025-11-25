import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = "http://localhost:3000/profile"; // Base URL for db.json profile

// FETCH PROFILE

export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async () => {
    const res = await axios.get(API); // GET /profile
    return res.data;
  }
);

// UPDATE PROFILE (PUT overwrites the object)

export const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async (data) => {
    const res = await axios.put(API, data); // PUT /profile
    return res.data;
  }
);

// UPLOAD AVATAR (PATCH updates only avatar field)

export const uploadAvatar = createAsyncThunk(
  "profile/uploadAvatar",
  async (avatarDataUrl) => {
    const res = await axios.patch(API, { avatar: avatarDataUrl }); // PATCH /profile
    return res.data;
  }
);

// DELETE AVATAR

export const deleteAvatar = createAsyncThunk(
  "profile/deleteAvatar",
  async () => {
    const res = await axios.patch(API, { avatar: null }); // PATCH /profile set avatar to null
    return res.data;
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    profile: null,
    loading: false,
    error: null,
    success: false,

    // UI preferences
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

      // FETCH PROFILE

      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;

        // Set UI preferences from DB
        state.theme = action.payload.theme || "light";
        state.accent = action.payload.accent || "#0ea5e9";
        state.sidebarCompact = action.payload.sidebarCompact || false;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load profile";
      })

      // UPDATE PROFILE

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
        state.error = action.error.message || "Failed to update profile";
      })

      // UPLOAD AVATAR

      .addCase(uploadAvatar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadAvatar.fulfilled, (state, action) => {
        state.loading = false;

        if (state.profile) {
          state.profile.avatar = action.payload.avatar;
        }

        state.success = true;
      })
      .addCase(uploadAvatar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to upload avatar";
      })

      // DELETE AVATAR

      .addCase(deleteAvatar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAvatar.fulfilled, (state) => {
        state.loading = false;

        if (state.profile) {
          state.profile.avatar = null;
        }

        state.success = true;
      })
      .addCase(deleteAvatar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete avatar";
      });
  },
});

export const { setTheme, setAccent, toggleSidebarCompact, clearSuccess } =
  profileSlice.actions;

export default profileSlice.reducer;
