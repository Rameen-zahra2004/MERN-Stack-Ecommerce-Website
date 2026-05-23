import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import store from "./Store/store.js";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router";

// ✅ FIX: Removed StrictMode — in development it mounts every component TWICE
// which fires useEffect twice even with empty [] deps, causing double API calls
// and triggering the backend rate limiter (429 Too Many Requests).
// You can re-add StrictMode before production deployment after fixing the rate limiter.

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);