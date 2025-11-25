import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addRole, removeRole, fetchRoles } from "../AdminSlices/rolesSlice";

// Reusable button with loading spinner
function ActionButton({
  onClick,
  loading,
  children,
  color = "blue",
  className = "",
}) {
  const base =
    "py-2 px-4 rounded-md font-medium text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2";
  const colors = {
    blue: "bg-blue-600 hover:bg-blue-700",
    red: "bg-red-600 hover:bg-red-700",
    green: "bg-green-600 hover:bg-green-700",
  };
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`${base} ${colors[color]} ${className}`}
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
      )}
      {children}
    </button>
  );
}

export default function PermissionsPanel({ roles: rolesProp = [] }) {
  const dispatch = useDispatch();
  const rolesFromStore = useSelector((state) => state.admin?.roles);
  const loading = useSelector((state) => state.admin?.loading);

  const [form, setForm] = useState({ id: "", name: "", desc: "" });
  const [message, setMessage] = useState({ type: "", text: "" });

  const triggerMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const roles =
    Array.isArray(rolesFromStore) && rolesFromStore.length > 0
      ? rolesFromStore
      : Array.isArray(rolesProp)
      ? rolesProp
      : [];

  const add = async () => {
    if (!form.id.trim() || !form.name.trim()) {
      return triggerMessage("error", "Role ID & Name are required");
    }

    try {
      await dispatch(addRole(form)).unwrap();
      triggerMessage("success", "Role added successfully");
      setForm({ id: "", name: "", desc: "" });
      dispatch(fetchRoles());
    } catch (error) {
      triggerMessage("error", error.message || "Failed to add role");
    }
  };

  const removeRoleHandler = async (id) => {
    if (!window.confirm("Are you sure you want to delete this role?")) return;

    try {
      await dispatch(removeRole(id)).unwrap();
      triggerMessage("success", "Role removed successfully");
      dispatch(fetchRoles());
    } catch (error) {
      triggerMessage("error", error.message || "Failed to remove role");
    }
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200 space-y-4">
      <h3 className="text-xl font-semibold text-gray-800">
        Roles & Permissions
      </h3>

      {/* Alerts */}
      {message.text && (
        <div
          className={`p-3 rounded text-sm animate-fade ${
            message.type === "error"
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Add Role Form */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Role ID */}
        <div className="flex flex-col">
          <label htmlFor="roleId" className="font-medium text-sm text-gray-700">
            ID
          </label>
          <input
            id="roleId"
            name="roleId"
            autoComplete="off"
            placeholder="ID"
            value={form.id}
            onChange={(e) => setForm({ ...form, id: e.target.value })}
            className="border p-2 rounded-md w-full"
          />
        </div>

        {/* Role Name */}
        <div className="flex flex-col">
          <label
            htmlFor="roleName"
            className="font-medium text-sm text-gray-700"
          >
            Name
          </label>
          <input
            id="roleName"
            name="roleName"
            autoComplete="off"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border p-2 rounded-md w-full"
          />
        </div>

        {/* Description */}
        <div className="flex flex-col">
          <label
            htmlFor="roleDesc"
            className="font-medium text-sm text-gray-700"
          >
            Description
          </label>
          <input
            id="roleDesc"
            name="roleDesc"
            autoComplete="off"
            placeholder="Description"
            value={form.desc}
            onChange={(e) => setForm({ ...form, desc: e.target.value })}
            className="border p-2 rounded-md w-full"
          />
        </div>

        {/* Add Role Button */}
        <div className="sm:col-span-3 flex justify-end">
          <ActionButton
            onClick={add}
            loading={loading}
            color="blue"
            className="w-full sm:w-auto"
          >
            Add Role
          </ActionButton>
        </div>
      </div>

      {/* Role List */}
      {roles.length > 0 ? (
        <ul className="space-y-3 pt-2">
          {roles.map((r) => (
            <li
              key={r.id}
              className="p-4 rounded-xl border bg-gray-50 flex justify-between items-start hover:shadow-md transition-all"
            >
              <div>
                <div className="font-semibold text-gray-800 text-sm">
                  {r.name}{" "}
                  <span className="text-xs text-gray-500">({r.id})</span>
                </div>
                {r.desc && (
                  <div className="text-xs text-gray-600 mt-1">{r.desc}</div>
                )}
              </div>

              <button
                onClick={() => removeRoleHandler(r.id)}
                className="text-red-600 hover:text-red-800 hover:underline text-sm"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500">No roles found</p>
      )}
    </div>
  );
}
