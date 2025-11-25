import { useDispatch, useSelector } from "react-redux";
import {
  setTheme,
  setAccent,
  toggleSidebarCompact,
} from "../AdminSlices/themeSlice";

export default function ThemePanel({ profile }) {
  const dispatch = useDispatch();

  const theme = useSelector((state) => state.theme.theme);
  const accent = useSelector((state) => state.theme.accent);
  const sidebarCompact = useSelector((state) => state.theme.sidebarCompact);

  const currentTheme = theme || profile?.theme || "light";
  const currentAccent = accent || profile?.accent || "#0ea5e9";
  const currentCompact =
    sidebarCompact !== undefined
      ? sidebarCompact
      : profile?.sidebarCompact || false;

  const handleThemeChange = (t) => dispatch(setTheme(t));
  const handleAccentChange = (e) => dispatch(setAccent(e.target.value));
  const handleToggleCompact = () => dispatch(toggleSidebarCompact());

  return (
    <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200 space-y-6">
      <h3 className="text-xl font-semibold text-gray-800">
        Appearance Settings
      </h3>

      {/* Theme Selection */}
      <div>
        <label
          className="block text-sm mb-2 font-medium"
          htmlFor="themeButtons"
        >
          Theme
        </label>
        <div className="flex gap-3" id="themeButtons">
          {["light", "dark"].map((mode) => (
            <button
              key={mode}
              onClick={() => handleThemeChange(mode)}
              className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors
                ${
                  currentTheme === mode
                    ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-300"
                }`}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Accent Color Picker */}
      <div>
        <label
          className="block text-sm mb-2 font-medium"
          htmlFor="accentColorPicker"
        >
          Accent Color
        </label>
        <div className="flex items-center gap-3">
          <input
            type="color"
            id="accentColorPicker"
            value={currentAccent}
            onChange={handleAccentChange}
            className="w-12 h-10 border rounded cursor-pointer"
          />
          <div
            className="w-10 h-10 rounded border shadow-inner"
            style={{ backgroundColor: currentAccent }}
          ></div>
        </div>
      </div>

      {/* Sidebar Compact Toggle */}
      <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border">
        <div>
          <p className="text-sm font-medium">Compact Sidebar</p>
          <p className="text-xs text-gray-500">
            Reduce the size of sidebar for more workspace
          </p>
        </div>
        <label
          htmlFor="sidebarCompactToggle"
          className="inline-flex items-center cursor-pointer relative"
        >
          <input
            type="checkbox"
            id="sidebarCompactToggle"
            checked={currentCompact}
            onChange={handleToggleCompact}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-300 rounded-full peer-focus:ring-2 peer-focus:ring-blue-400 peer-checked:bg-blue-600 transition"></div>
          <div className="absolute ml-1 h-4 w-4 bg-white rounded-full shadow transform transition peer-checked:translate-x-5"></div>
        </label>
      </div>
    </div>
  );
}
