// import { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { FaEye, FaEyeSlash, FaEnvelope } from "react-icons/fa";

// import {
//   loginUser,
//   SignupUser,
//   logoutUser,
//   logOut,
//   clearError,
// } from "../Slices/signinSlice";

// import ForgotPasswordModal from "../Component/forgetpassword";

// /*
// =========================
// REUSABLE INPUT FIELD
// =========================
// */

// const InputField = ({
//   label,
//   type = "text",
//   value,
//   onChange,
//   placeholder,
//   icon,
//   autoComplete = "off",
// }) => (
//   <div className="relative w-full mb-4">
//     <label className="block text-sm font-medium text-gray-700 mb-1">
//       {label}
//     </label>

//     {icon && (
//       <span className="absolute left-3 top-[42px] text-gray-400 pointer-events-none">
//         {icon}
//       </span>
//     )}

//     <input
//       type={type}
//       value={value}
//       onChange={onChange}
//       placeholder={placeholder}
//       autoComplete={autoComplete}
//       className={`w-full border rounded-lg p-3 ${
//         icon ? "pl-10" : "pl-3"
//       } focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
//       required
//     />
//   </div>
// );

// /*
// =========================
// MAIN COMPONENT
// =========================
// */

// export default function Signin() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const { user, loading, error } = useSelector(
//     (state) => state.signinuser
//   );

//   const [mode, setMode] = useState("login");

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//   });

//   const [showPassword, setShowPassword] = useState(false);
//   const [showForgotModal, setShowForgotModal] = useState(false);

//   /*
//   =========================
//   MODE SWITCH
//   =========================
//   */

//   const handleModeSwitch = (newMode) => {
//     setMode(newMode);
//     setFormData({ name: "", email: "", password: "" });
//     dispatch(clearError());
//   };

//   /*
//   =========================
//   LOGIN
//   =========================
//   */

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     try {
//       const result = await dispatch(
//         loginUser({
//           email: formData.email.trim().toLowerCase(),
//           password: formData.password.trim(),
//         })
//       ).unwrap();

//       const role = result.user?.role?.toUpperCase();

//       if (
//         role === "ADMIN" ||
//         role === "SUPER_ADMIN" ||
//         role === "MODERATOR"
//       ) {
//         navigate("/admin");
//       } else {
//         navigate("/user");
//       }
//     } catch {
//       // Error already handled by Redux state
//     }
//   };

//   /*
//   =========================
//   SIGNUP
//   =========================
//   */

//   const handleSignup = async (e) => {
//     e.preventDefault();

//     try {
//       const result = await dispatch(
//         SignupUser({
//           name: formData.name.trim(),
//           email: formData.email.trim().toLowerCase(),
//           password: formData.password.trim(),
//         })
//       ).unwrap();
// const role = result.user?.role?.toLowerCase();

// if (role === "admin" || role === "super_admin" || role === "moderator") {
//   navigate("/admin");
// } else {
//   navigate("/user");
// }
      
//     } catch {
//       // Error already handled by Redux state
//     }
//   };

//   /*
//   =========================
//   LOGOUT
//   =========================
//   */

//   const handleLogout = () => {
//     dispatch(logoutUser());
//     dispatch(logOut());
//     navigate("/signin");
//   };

//   /*
//   =========================
//   UI
//   =========================
//   */

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-50 to-blue-50 p-4">
//       {showForgotModal && (
//         <ForgotPasswordModal
//           onClose={() => setShowForgotModal(false)}
//         />
//       )}

//       <div className="bg-white bg-opacity-90 backdrop-blur-md shadow-xl rounded-3xl w-full max-w-md p-8 relative animate-fade-in">
//         <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
//           {mode === "login" ? "Login" : "Signup"} to Your Account
//         </h2>

//         {!user ? (
//           <>
//             {/*
//             =========================
//             MODE TOGGLE
//             =========================
//             */}

//             <div className="flex justify-center mb-6 gap-2">
//               <button
//                 type="button"
//                 className={`px-5 py-2 rounded-full transition ${
//                   mode === "login"
//                     ? "bg-blue-600 text-white"
//                     : "bg-gray-200 text-gray-700"
//                 }`}
//                 onClick={() => handleModeSwitch("login")}
//               >
//                 Login
//               </button>

//               <button
//                 type="button"
//                 className={`px-5 py-2 rounded-full transition ${
//                   mode === "signup"
//                     ? "bg-green-600 text-white"
//                     : "bg-gray-200 text-gray-700"
//                 }`}
//                 onClick={() => handleModeSwitch("signup")}
//               >
//                 Signup
//               </button>
//             </div>

//             {/*
//             =========================
//             FORM
//             =========================
//             */}

//             <form
//               onSubmit={
//                 mode === "login" ? handleLogin : handleSignup
//               }
//             >
//               {mode === "signup" && (
//                 <InputField
//                   label="Full Name"
//                   placeholder="Enter your full name"
//                   value={formData.name}
//                   onChange={(e) =>
//                     setFormData({
//                       ...formData,
//                       name: e.target.value,
//                     })
//                   }
//                 />
//               )}

//               <InputField
//                 label="Email"
//                 type="email"
//                 placeholder="Enter your email"
//                 value={formData.email}
//                 icon={<FaEnvelope />}
//                 onChange={(e) =>
//                   setFormData({
//                     ...formData,
//                     email: e.target.value,
//                   })
//                 }
//               />

//               <div className="relative">
//                 <InputField
//                   label="Password"
//                   type={showPassword ? "text" : "password"}
//                   placeholder="Enter your password"
//                   value={formData.password}
//                   onChange={(e) =>
//                     setFormData({
//                       ...formData,
//                       password: e.target.value,
//                     })
//                   }
//                   autoComplete="current-password"
//                 />

//                 <span
//                   className="absolute right-3 top-[42px] cursor-pointer text-gray-500"
//                   onClick={() =>
//                     setShowPassword(!showPassword)
//                   }
//                 >
//                   {showPassword ? <FaEyeSlash /> : <FaEye />}
//                 </span>
//               </div>

//               {error && (
//                 <p className="text-red-500 text-center text-sm mb-3">
//                   {error}
//                 </p>
//               )}

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full py-3 mt-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium disabled:opacity-60 disabled:cursor-not-allowed"
//               >
//                 {loading
//                   ? "Processing..."
//                   : mode === "login"
//                   ? "Log In"
//                   : "Create Account"}
//               </button>

//               {mode === "login" && (
//                 <p
//                   className="text-center mt-4 text-blue-500 cursor-pointer hover:underline text-sm"
//                   onClick={() => setShowForgotModal(true)}
//                 >
//                   Forgot Password?
//                 </p>
//               )}
//             </form>
//           </>
//         ) : (
//           /*
//           =========================
//           LOGGED IN STATE
//           =========================
//           */

//           <div className="text-center">
//             <p className="text-lg text-green-600 mb-4">
//               Welcome,{" "}
//               {user.name || user.email}!
//             </p>

//             <button
//               onClick={handleLogout}
//               className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition"
//             >
//               Logout
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
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
        className={`w-full border border-gray-200 rounded-xl py-3 pr-10
          ${icon ? "pl-10" : "pl-4"}
          bg-gray-50 focus:bg-white
          focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent
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

  /* ── Redirect if already logged in ── */
  useEffect(() => {
    if (storeUser) redirectByRole(storeUser);
  }, [storeUser]);

  /* ── Clear errors on unmount ── */
  useEffect(() => () => dispatch(clearError()), []);

  /* ─────────────────────────────────────
     HELPERS
  ───────────────────────────────────── */
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

  /* ─────────────────────────────────────
     LOGIN  ← BUG FIX HERE
     The issue: loginUser thunk may return
     the user directly (not nested in .user)
     depending on your backend response.
     We handle BOTH shapes safely.
  ───────────────────────────────────── */
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
        })
      ).unwrap();

      // ✅ Handle both response shapes:
      // Shape 1: { user: { role, ... } }
      // Shape 2: { role, ... }  (user object directly)
      const user = result?.user ?? result;

      if (!user) {
        setLocalError("Login failed. Please try again.");
        return;
      }

      redirectByRole(user);
    } catch (err) {
      // err is already the rejected value from the thunk
      setLocalError(
        typeof err === "string"
          ? err
          : err?.message ?? "Invalid email or password."
      );
    }
  };

  /* ─────────────────────────────────────
     SIGNUP
  ───────────────────────────────────── */
  const handleSignup = async (e) => {
    e.preventDefault();
    setLocalError("");

    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
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
        })
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
          : err?.message ?? "Signup failed. Please try again."
      );
    }
  };

  /* ─────────────────────────────────────
     DISPLAY ERROR (Redux or local)
  ───────────────────────────────────── */
  const displayError = localError || error;

  /* ─────────────────────────────────────
     UI
  ───────────────────────────────────── */
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50 p-4">

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
              ? "Sign in to continue to NovaMart"
              : "Join NovaMart today"}
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
                ${mode === m
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-gray-400 hover:text-gray-600"
                }`}
            >
              {m}
            </button>
          ))}
        </div>

        {/* FORM */}
        <form onSubmit={mode === "login" ? handleLogin : handleSignup} noValidate>

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
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            onChange={handleChange("password")}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="focus:outline-none cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
              </button>
            }
          />

          {/* ERROR MESSAGE */}
          {displayError && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-500 text-sm text-center">{displayError}</p>
            </div>
          )}

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl text-white font-semibold text-sm
              transition-all duration-200
              ${loading
                ? "bg-indigo-300 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] shadow-md hover:shadow-lg"
              }`}
          >
            {loading
              ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  {mode === "login" ? "Signing in..." : "Creating account..."}
                </span>
              )
              : mode === "login" ? "Sign In" : "Create Account"
            }
          </button>

          {/* FORGOT PASSWORD */}
          {mode === "login" && (
            <button
              type="button"
              onClick={() => setShowForgotModal(true)}
              className="w-full text-center mt-4 text-indigo-500 text-sm hover:text-indigo-700 
                transition-colors duration-150 font-medium"
            >
              Forgot Password?
            </button>
          )}
        </form>

        {/* FOOTER SWITCH */}
        <p className="text-center text-gray-400 text-xs mt-6">
          {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          <button
            type="button"
            onClick={() => handleModeSwitch(mode === "login" ? "signup" : "login")}
            className="text-indigo-600 font-semibold hover:underline"
          >
            {mode === "login" ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}