import { useState, useEffect, useCallback } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";

export default function SearchBar({
  value = "",
  onChange,
  placeholder = "Search...",
  debounceMs = 300,
  loading = false,
  className = "",
}) {
  const [internalValue, setInternalValue] = useState(value);
  const [focused, setFocused] = useState(false);

  // Sync external value → internal
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  // Debounced change event
  useEffect(() => {
    const timer = setTimeout(() => {
      onChange?.(internalValue);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [internalValue, onChange, debounceMs]);

  const handleInput = useCallback((e) => {
    setInternalValue(e.target.value);
  }, []);

  const clearSearch = useCallback(() => {
    setInternalValue("");
    onChange?.("");
  }, [onChange]);

  return (
    <div
      className={`transition-all duration-300 flex items-center border rounded-xl px-4 py-2 
      shadow-sm bg-white/70 backdrop-blur-md dark:bg-black/30 dark:border-gray-700

      ${focused ? "ring-2 ring-blue-400 dark:ring-blue-600" : ""}
      ${className}
      `}
      role="search"
    >
      <FaSearch
        className={`mr-2 transition-all ${
          focused ? "text-blue-500 dark:text-blue-400" : "text-gray-400"
        }`}
      />

      {/* Input */}
      <input
        type="text"
        className="flex-1 outline-none bg-transparent text-sm dark:text-white"
        placeholder={placeholder}
        value={internalValue}
        onChange={handleInput}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />

      {/* Loading Spinner */}
      {loading && (
        <div className="animate-spin h-4 w-4 border-2 border-t-transparent border-gray-400 rounded-full ml-2" />
      )}

      {/* Clear Button */}
      {internalValue && !loading && (
        <button
          onClick={clearSearch}
          className="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          aria-label="Clear search"
        >
          <FaTimes />
        </button>
      )}
    </div>
  );
}
