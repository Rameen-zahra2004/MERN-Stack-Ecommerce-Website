import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaEnvelope } from "react-icons/fa";

import {
  loginUser,
  SignupUser,
  logOut,
  deleteUser,
} from "../Slices/signinSlice";
import { addActiveUser, removeActiveUser } from "../Slices/activeuserSlice";
import ForgotPasswordModal from "../Component/forgetpassword";

// -------------------- Reusable Input --------------------
const InputField = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  icon,
  autoComplete = "off",
}) => (
  <div className="relative w-full mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    {icon && (
      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
        {icon}
      </span>
    )}
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      autoComplete={autoComplete}
      className={`w-full border rounded-lg p-3 pl-${
        icon ? "10" : "3"
      } focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
      required
    />
  </div>
);

export default function Signin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.signinuser);

  const [mode, setMode] = useState("login"); // login/signup toggle
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  // -------------------- Handlers --------------------
  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(
      loginUser({
        email: formData.email.trim(),
        password: formData.password.trim(),
      })
    );
  };

  const handleSignup = (e) => {
    e.preventDefault();
    dispatch(
      SignupUser({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password.trim(),
      })
    );
  };

  const handleLogout = () => {
    if (user) {
      dispatch(logOut());
      dispatch(removeActiveUser(user.id));
      localStorage.removeItem("authUser");
      setFormData({ name: "", email: "", password: "" });
      navigate("/signin");
    }
  };

  const handleDelete = () => {
    if (user) {
      dispatch(deleteUser(user.id));
      dispatch(removeActiveUser(user.id));
      setFormData({ name: "", email: "", password: "" });
    }
  };

  // -------------------- Effects --------------------
  useEffect(() => {
    if (user) {
      dispatch(
        addActiveUser({
          id: user.id,
          name: user.name || user.email,
          isLoggedIn: true,
          lastActive: new Date().toISOString(),
        })
      );
      if (user.role === "admin") navigate("/admin");
      else navigate("/user");
    }
  }, [user, dispatch, navigate]);

  // -------------------- UI --------------------
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-r from-indigo-50 to-blue-50 p-4">
      {showForgotModal && (
        <ForgotPasswordModal onClose={() => setShowForgotModal(false)} />
      )}

      <div className="bg-white bg-opacity-90 backdrop-blur-md shadow-xl rounded-3xl w-full max-w-md p-8 relative animate-fade-in">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          {mode === "login" ? "Login" : "Signup"} to Your Account
        </h2>

        {!user ? (
          <>
            {/* Mode Toggle */}
            <div className="flex justify-center mb-6 gap-2">
              <button
                className={`px-5 py-2 rounded-full transition ${
                  mode === "login"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
                onClick={() => setMode("login")}
              >
                Login
              </button>
              <button
                className={`px-5 py-2 rounded-full transition ${
                  mode === "signup"
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
                onClick={() => setMode("signup")}
              >
                Signup
              </button>
            </div>

            {/* Form */}
            <form onSubmit={mode === "login" ? handleLogin : handleSignup}>
              {mode === "signup" && (
                <InputField
                  label="Full Name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              )}

              <InputField
                label="Email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                icon={<FaEnvelope />}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />

              <div className="relative">
                <InputField
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  autoComplete="new-password"
                />
                <span
                  className="absolute right-3 top-[42px] cursor-pointer text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              {error && (
                <p className="text-red-500 text-center mb-3">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 mt-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
              >
                {loading
                  ? "Processing..."
                  : mode === "login"
                  ? "Log In"
                  : "Create Account"}
              </button>

              {mode === "login" && (
                <p
                  className="text-center mt-4 text-blue-500 cursor-pointer hover:underline"
                  onClick={() => setShowForgotModal(true)}
                >
                  Forgot Password?
                </p>
              )}
            </form>
          </>
        ) : (
          <div className="text-center">
            <p className="text-lg text-green-600 mb-4">
              Welcome, {user.name || user.email}!
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={handleLogout}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Logout
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Delete Account
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
