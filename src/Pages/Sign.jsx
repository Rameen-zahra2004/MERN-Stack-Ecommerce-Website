import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaEnvelope, FaUser, FaLock } from "react-icons/fa";
import { loginUser, SignupUser, clearError } from "../Slices/signinSlice";
import ForgotPasswordModal from "../Component/forgetpassword";

/* ─────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────── */
const ADMIN_ROLES = new Set(["admin", "super_admin", "moderator"]);
const INITIAL_FORM = { name: "", email: "", password: "" };

/* ─────────────────────────────────────────
   INPUT FIELD
───────────────────────────────────────── */
const InputField = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  icon,
  rightIcon,
  autoComplete = "off",
}) => (
  <div className="w-full mb-4">
    <label className="block text-sm font-semibold text-gray-600 mb-1">
      {label}
    </label>

    <div className="relative flex items-center">
      {icon && (
        <span className="absolute left-3 text-gray-400 pointer-events-none">
          {icon}
        </span>
      )}

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required
        className={`w-full border border-gray-300 rounded-xl py-3 pr-10
          ${icon ? "pl-10" : "pl-4"}
          bg-white text-gray-900 placeholder-gray-500
          focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500
          transition-all duration-200 text-sm`}
      />

      {rightIcon && (
        <span className="absolute right-3 text-gray-400">{rightIcon}</span>
      )}
    </div>
  </div>
);

/* ─────────────────────────────────────────
   MAIN SIGN COMPONENT
───────────────────────────────────────── */
export default function Sign() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user: storeUser } = useSelector((s) => s.signinuser);

  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    if (storeUser) redirectByRole(storeUser);
  }, [storeUser]);

  useEffect(() => () => dispatch(clearError()), []);

  const redirectByRole = (user) => {
    const role = user?.role?.toLowerCase();
    navigate(ADMIN_ROLES.has(role) ? "/admin/dashboard" : "/user", {
      replace: true,
    });
  };

  const handleChange = (field) => (e) =>
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));

  const handleModeSwitch = (newMode) => {
    if (newMode === mode) return;
    setMode(newMode);
    setFormData(INITIAL_FORM);
    setLocalError("");
    dispatch(clearError());
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLocalError("");

    if (!formData.email.trim() || !formData.password.trim()) {
      setLocalError("Please fill in all fields.");
      return;
    }

    try {
      const result = await dispatch(
        loginUser({
          email: formData.email.trim().toLowerCase(),
          password: formData.password.trim(),
        }),
      ).unwrap();

      const user = result?.user ?? result;

      if (!user) {
        setLocalError("Login failed. Please try again.");
        return;
      }

      redirectByRole(user);
    } catch (err) {
      setLocalError(
        typeof err === "string"
          ? err
          : (err?.message ?? "Invalid email or password."),
      );
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLocalError("");

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.password.trim()
    ) {
      setLocalError("Please fill in all fields.");
      return;
    }

    if (formData.password.trim().length < 6) {
      setLocalError("Password must be at least 6 characters.");
      return;
    }

    try {
      const result = await dispatch(
        SignupUser({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password.trim(),
        }),
      ).unwrap();

      const user = result?.user ?? result;

      if (!user) {
        setLocalError("Signup failed. Please try again.");
        return;
      }

      redirectByRole(user);
    } catch (err) {
      setLocalError(
        typeof err === "string"
          ? err
          : (err?.message ?? "Signup failed. Please try again."),
      );
    }
  };

  const displayError = localError || error;

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-pink-50 via-white to-pink-100 p-4">
      {showForgotModal && (
        <ForgotPasswordModal onClose={() => setShowForgotModal(false)} />
      )}

      <div className="bg-white shadow-2xl rounded-3xl w-full max-w-md p-8 border border-gray-100">
        {/* HEADER */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
            {mode === "login" ? "Welcome Back" : "Create Account"}
          </h1>

          <p className="text-gray-400 text-sm mt-1">
            {mode === "login"
              ? "Sign in to continue to The 999 Boxs"
              : "Join The 999 Boxs today"}
          </p>
        </div>

        {/* TOGGLE */}
        <div className="flex bg-gray-100 rounded-2xl p-1 mb-6">
          {["login", "signup"].map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => handleModeSwitch(m)}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all duration-200 capitalize
                ${
                  mode === m
                    ? "bg-white text-pink-600 shadow-sm"
                    : "text-gray-400 hover:text-gray-600"
                }`}
            >
              {m}
            </button>
          ))}
        </div>

        {/* FORM */}
        <form
          onSubmit={mode === "login" ? handleLogin : handleSignup}
          noValidate
        >
          {mode === "signup" && (
            <InputField
              label="Full Name"
              value={formData.name}
              placeholder="John Doe"
              icon={<FaUser size={13} />}
              autoComplete="name"
              onChange={handleChange("name")}
            />
          )}

          <InputField
            label="Email Address"
            type="email"
            value={formData.email}
            placeholder="you@example.com"
            icon={<FaEnvelope size={13} />}
            autoComplete="email"
            onChange={handleChange("email")}
          />

          <InputField
            label="Password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            placeholder="••••••••"
            icon={<FaLock size={13} />}
            autoComplete={
              mode === "login" ? "current-password" : "new-password"
            }
            onChange={handleChange("password")}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="focus:outline-none cursor-pointer"
              >
                {showPassword ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
              </button>
            }
          />

          {displayError && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-500 text-sm text-center">{displayError}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl text-white font-semibold text-sm transition-all duration-200
              ${
                loading
                  ? "bg-pink-300 cursor-not-allowed"
                  : "bg-pink-600 hover:bg-pink-700 active:scale-[0.98] shadow-md hover:shadow-lg"
              }`}
          >
            {loading
              ? "Loading..."
              : mode === "login"
                ? "Sign In"
                : "Create Account"}
          </button>

          {mode === "login" && (
            <button
              type="button"
              onClick={() => setShowForgotModal(true)}
              className="w-full text-center mt-4 text-pink-500 text-sm hover:text-pink-700 transition-colors duration-150 font-medium"
            >
              Forgot Password?
            </button>
          )}
        </form>

        <p className="text-center text-gray-400 text-xs mt-6">
          {mode === "login"
            ? "Don't have an account? "
            : "Already have an account? "}

          <button
            type="button"
            onClick={() =>
              handleModeSwitch(mode === "login" ? "signup" : "login")
            }
            className="text-pink-600 font-semibold hover:underline"
          >
            {mode === "login" ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}
