import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import {
  fetchAdmin,
  changePassword,
  toggle2FA,
} from "../AdminSlices/securitySlice";

// Action Button
function ActionButton({ onClick, loading, children, color = "green" }) {
  const base =
    "py-2 px-4 rounded-md font-medium text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2";
  const colors = {
    green: "bg-green-600 hover:bg-green-700",
    blue: "bg-blue-600 hover:bg-blue-700",
    red: "bg-red-600 hover:bg-red-700",
    gray: "bg-gray-700 hover:bg-gray-800",
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

export default function SecurityPanel() {
  const dispatch = useDispatch();
  const { loading, error, twoFAEnabled } = useSelector(
    (state) => state.security
  );

  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  useEffect(() => {
    dispatch(fetchAdmin());
  }, [dispatch]);

  const handlePasswordChange = () => {
    dispatch(changePassword(passwords));
    setPasswords({ oldPassword: "", newPassword: "" });
  };

  const handleToggle2FA = () => {
    dispatch(toggle2FA(!twoFAEnabled));
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow-md space-y-4 border border-gray-200">
      <h3 className="text-xl font-semibold text-gray-800">Admin Security</h3>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {/* Password Section */}
      <div className="space-y-2">
        <h4 className="font-medium">Change Password</h4>
        <div className="relative">
          <input
            type={showOldPassword ? "text" : "password"}
            placeholder="Old Password"
            value={passwords.oldPassword}
            onChange={(e) =>
              setPasswords({ ...passwords, oldPassword: e.target.value })
            }
            className="border p-2 rounded-md w-full pr-10"
          />
          <span
            className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
            onClick={() => setShowOldPassword(!showOldPassword)}
          >
            {showOldPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <div className="relative">
          <input
            type={showNewPassword ? "text" : "password"}
            placeholder="New Password"
            value={passwords.newPassword}
            onChange={(e) =>
              setPasswords({ ...passwords, newPassword: e.target.value })
            }
            className="border p-2 rounded-md w-full pr-10"
          />
          <span
            className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
            onClick={() => setShowNewPassword(!showNewPassword)}
          >
            {showNewPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <ActionButton onClick={handlePasswordChange} loading={loading}>
          Change Password
        </ActionButton>
      </div>

      {/* 2FA Section */}
      <div className="space-y-2">
        <h4 className="font-medium">Two-Factor Authentication</h4>
        <p className="text-sm text-gray-500">
          {twoFAEnabled ? "2FA is enabled." : "2FA is disabled."}
        </p>
        <ActionButton onClick={handleToggle2FA} loading={loading} color="blue">
          {twoFAEnabled ? "Disable 2FA" : "Enable 2FA"}
        </ActionButton>
      </div>
    </div>
  );
}
