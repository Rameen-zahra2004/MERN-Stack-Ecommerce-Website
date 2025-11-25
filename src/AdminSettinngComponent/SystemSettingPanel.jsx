import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateSystem,
  createApiKey,
  revokeApiKey,
  fetchSystem,
} from "../AdminSlices/systemSlice";

export default function SystemSettingsPanel({ system: systemProp }) {
  const dispatch = useDispatch();
  const systemFromStore = useSelector((state) => state.system?.system);
  const loading = useSelector((state) => state.system?.loading || false);

  const system = systemFromStore || systemProp || null;

  // Fully controlled form state
  const [form, setForm] = useState({
    siteTitle: "",
    footer: "",
    smtp: { host: "" },
    notifications: { email: false },
  });

  const [message, setMessage] = useState({ type: "", text: "" });

  // Update form when system data loads
  useEffect(() => {
    if (system) {
      setForm({
        siteTitle: system.siteTitle || "",
        footer: system.footer || "",
        smtp: { host: system.smtp?.host || "" },
        notifications: { email: system.notifications?.email || false },
      });
    }
  }, [system]);

  // Fetch system if not available
  useEffect(() => {
    if (!systemFromStore && !systemProp) dispatch(fetchSystem());
  }, [dispatch, systemFromStore, systemProp]);

  const triggerMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const saveSettings = async () => {
    try {
      await dispatch(updateSystem(form)).unwrap();
      triggerMessage("success", "System settings saved successfully");
      dispatch(fetchSystem());
    } catch (err) {
      triggerMessage("error", err.message || "Failed to save system settings");
    }
  };

  const createKey = async () => {
    const name = prompt("Enter API key name:");
    if (!name?.trim()) return;
    try {
      await dispatch(createApiKey(name.trim())).unwrap();
      triggerMessage("success", "API key created successfully");
      dispatch(fetchSystem());
    } catch (err) {
      triggerMessage("error", err.message || "Failed to create API key");
    }
  };

  const revokeKey = async (id) => {
    if (!window.confirm("Are you sure you want to revoke this API key?"))
      return;
    try {
      await dispatch(revokeApiKey(id)).unwrap();
      triggerMessage("success", "API key revoked successfully");
      dispatch(fetchSystem());
    } catch (err) {
      triggerMessage("error", err.message || "Failed to revoke API key");
    }
  };

  const apiKeys = system?.apiKeys || [];

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 space-y-6">
      <h3 className="text-2xl font-semibold text-gray-800">System Settings</h3>

      {/* Alerts */}
      {message.text && (
        <div
          className={`p-3 rounded-md text-sm ${
            message.type === "error"
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {message.text}
        </div>
      )}

      {loading && (
        <p className="text-gray-500 text-sm flex items-center gap-2">
          <span className="animate-spin">⏳</span> Loading system settings...
        </p>
      )}

      <div className="flex flex-col md:flex-row gap-6">
        {/* General Settings */}
        <div className="flex-1 space-y-4">
          <div>
            <label
              htmlFor="siteTitle"
              className="block text-sm font-medium mb-1"
            >
              Site Title
            </label>
            <input
              id="siteTitle"
              name="siteTitle"
              autoComplete="off"
              value={form.siteTitle}
              onChange={(e) => setForm({ ...form, siteTitle: e.target.value })}
              className="w-full border rounded-md p-2"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="footer" className="block text-sm font-medium mb-1">
              Footer
            </label>
            <input
              id="footer"
              name="footer"
              autoComplete="off"
              value={form.footer}
              onChange={(e) => setForm({ ...form, footer: e.target.value })}
              className="w-full border rounded-md p-2"
              disabled={loading}
            />
          </div>

          <div>
            <label
              htmlFor="smtpHost"
              className="block text-sm font-medium mb-1"
            >
              SMTP Host
            </label>
            <input
              id="smtpHost"
              name="smtpHost"
              autoComplete="off"
              value={form.smtp.host}
              onChange={(e) =>
                setForm({
                  ...form,
                  smtp: { ...form.smtp, host: e.target.value },
                })
              }
              className="w-full border rounded-md p-2"
              disabled={loading}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="emailNotifications"
              checked={form.notifications.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  notifications: {
                    ...form.notifications,
                    email: e.target.checked,
                  },
                })
              }
              disabled={loading}
              className="w-4 h-4"
            />
            <label htmlFor="emailNotifications" className="text-sm">
              Email Notifications
            </label>
          </div>

          <button
            onClick={saveSettings}
            disabled={loading}
            className="bg-green-600 w-full md:w-auto text-white py-2 px-4 rounded-md hover:bg-green-700 transition disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Settings"}
          </button>
        </div>

        {/* API Keys */}
        <div className="flex-1 space-y-4">
          <h4 className="text-lg font-medium">API Keys</h4>

          {apiKeys.length > 0 ? (
            <div className="space-y-2 max-h-96 overflow-auto">
              {apiKeys.map((key) => (
                <div
                  key={key.id}
                  className="flex justify-between items-center border p-3 rounded-md bg-gray-50 hover:shadow-sm transition"
                >
                  <div className="text-xs">
                    <div className="font-semibold">{key.name}</div>
                    <div className="font-mono text-gray-600">{key.key}</div>
                  </div>
                  <button
                    onClick={() => revokeKey(key.id)}
                    className="text-red-600 hover:text-red-800 hover:underline text-sm"
                    disabled={loading}
                  >
                    Revoke
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No API keys found.</p>
          )}

          <button
            onClick={createKey}
            disabled={loading}
            className="bg-indigo-600 w-full text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition disabled:opacity-50"
          >
            Create New Key
          </button>
        </div>
      </div>
    </div>
  );
}
