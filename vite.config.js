// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import tailwindcss from "@tailwindcss/vite";

// export default defineConfig({
//   plugins: [react(), tailwindcss()],
//   build: {
//     chunkSizeWarningLimit: 600,
//     rollupOptions: {
//       output: {
//         manualChunks: {
//           react: ["react", "react-dom", "react-router-dom"],
//           redux: ["@reduxjs/toolkit", "react-redux"],
//           icons: ["react-icons"],
//           axios: ["axios"],
//           recharts: ["recharts"],
//           d3: [
//             "d3-color",
//             "d3-format",
//             "d3-interpolate",
//             "d3-scale",
//             "d3-shape",
//             "d3-time",
//             "d3-time-format",
//             "d3-path",
//           ],
//           decimal: ["decimal.js-light"],
//         },
//       },
//     },
//   },
// });
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // node_modules splitting
          if (id.includes("emoji-picker-react"))  return "emoji-picker";
          if (id.includes("framer-motion"))       return "framer-motion";
          if (id.includes("immer"))               return "immer";
          if (id.includes("recharts"))            return "recharts";
          if (id.includes("d3-"))                 return "d3";
          if (id.includes("decimal.js-light"))    return "decimal";
          if (id.includes("react-dom"))           return "react-dom";
          if (id.includes("react-router"))        return "react-router";
          if (id.includes("react-redux") ||
              id.includes("@reduxjs"))            return "redux";
          if (id.includes("react-icons"))         return "icons";
          if (id.includes("axios"))               return "axios";
          if (id.includes("react"))               return "react";
        },
      },
    },
  },
});