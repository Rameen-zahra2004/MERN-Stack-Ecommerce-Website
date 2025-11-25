import { createSlice } from "@reduxjs/toolkit";

const savedTheme = localStorage.getItem("theme") || "light";
const savedAccent = localStorage.getItem("accent") || "#0ea5e9";
const savedSidebar = localStorage.getItem("sidebarCompact") === "true";

const initialState = {
  theme: savedTheme, // 'light' or 'dark'
  accent: savedAccent, // hex color
  sidebarCompact: savedSidebar, // true/false
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem("theme", action.payload);
    },
    setAccent: (state, action) => {
      state.accent = action.payload;
      localStorage.setItem("accent", action.payload);
    },
    toggleSidebarCompact: (state) => {
      state.sidebarCompact = !state.sidebarCompact;
      localStorage.setItem("sidebarCompact", state.sidebarCompact);
    },
  },
});

export const { setTheme, setAccent, toggleSidebarCompact } = themeSlice.actions;
export default themeSlice.reducer;
