import { useDispatch, useSelector } from "react-redux";
import {
  exportCSV,
  exportJSON,
  deleteAccount,
  clearExportData,
} from "../AdminSlices/exportdeleteSlice";
import { useState } from "react";

// Reusable action button component
function ActionButton({ onClick, loading, children, color = "blue" }) {
  const base =
    "py-2 px-4 rounded-lg font-medium text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2";

  const colors = {
    blue: "bg-blue-600 hover:bg-blue-700",
    gray: "bg-gray-700 hover:bg-gray-800",
    red: "bg-red-600 hover:bg-red-700",
  };

  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`${base} ${colors[color]}`}
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
      )}
      {children}
    </button>
  );
}

export default function ExportDeletePanel() {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.export?.loading || false);
  const error = useSelector((state) => state.export?.error);
  const [success, setSuccess] = useState("");

  const showSuccess = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(""), 3000);
  };

  const downloadJSON = async () => {
    try {
      const result = await dispatch(exportJSON()).unwrap();

      const blob = new Blob([JSON.stringify(result, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `export-${Date.now()}`.json;
      a.click();
      URL.revokeObjectURL(url);

      dispatch(clearExportData());
      showSuccess("JSON exported successfully!");
    } catch (err) {
      console.error(err);
      showSuccess("Failed to export JSON.");
    }
  };

  const downloadCSV = async () => {
    try {
      const csvData = await dispatch(exportCSV()).unwrap();

      const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `export-${Date.now()}`.csv;
      a.click();
      URL.revokeObjectURL(url);

      dispatch(clearExportData());
      showSuccess("CSV exported successfully!");
    } catch (err) {
      console.error(err);
      showSuccess("Failed to export CSV.");
    }
  };

  const removeAccount = async () => {
    if (!window.confirm("Are you sure you want to delete the account?")) return;

    try {
      await dispatch(deleteAccount()).unwrap();
      showSuccess("Account reset to demo defaults. Reloading...");
      setTimeout(() => window.location.reload(), 1200);
    } catch (err) {
      console.error(err);
      showSuccess("Failed to reset account.");
    }
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow-md space-y-4 border border-gray-200">
      <h3 className="text-xl font-semibold text-gray-800">
        Export & Danger Zone
      </h3>

      {/* Success message */}
      {success && (
        <div className="p-3 rounded bg-green-100 text-green-700 text-sm animate-fade">
          {success}
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="p-3 rounded bg-red-100 text-red-700 text-sm animate-fade">
          {error}
        </div>
      )}

      <div className="flex gap-3">
        <ActionButton onClick={downloadJSON} loading={loading} color="blue">
          Export JSON
        </ActionButton>
        <ActionButton onClick={downloadCSV} loading={loading} color="gray">
          Export CSV
        </ActionButton>
      </div>

      <div className="pt-4 border-t">
        <ActionButton onClick={removeAccount} loading={loading} color="red">
          Delete Account / Reset Demo
        </ActionButton>
      </div>
    </div>
  );
}
