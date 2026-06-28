import { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaEnvelope, FaCheckCircle } from "react-icons/fa";
import { resetPassword, clearResetState } from "../Slices/signinSlice";

export default function ForgotPasswordModal({ onClose }) {
  const dispatch = useDispatch();
  const { resetLoading, resetSuccess, resetError } = useSelector(
    (state) => state.signinuser,
  );

  const [email, setEmail] = useState("");
  const modalRef = useRef(null);
  const inputRef = useRef(null);

  // Auto focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Close modal on click outside
  const handleClickOutside = useCallback(
    (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

  // Close on ESC
  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // Email validation
  const isValidEmail = /^\S+@\S+\.\S+$/.test(email.trim());

  // Submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValidEmail || resetLoading) return;

    dispatch(
      resetPassword({
        email: email.trim(),
        newPassword: "", // backend handles actual reset
      }),
    );
  };

  // Auto-close after success
  useEffect(() => {
    if (resetSuccess) {
      const timer = setTimeout(() => {
        dispatch(clearResetState());
        onClose();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [resetSuccess, dispatch, onClose]);

  return (
    <div
      className="fixed inset-0 bg-pink-900/30 flex items-center justify-center z-50 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-xl shadow-pink-200 w-96 p-6 relative animate-slideUp border border-pink-100"
      >
        {/* Close Button */}
        <button
          aria-label="Close"
          className="absolute top-3 right-4 text-pink-300 hover:text-pink-600 text-xl transition"
          onClick={onClose}
        >
          &times;
        </button>

        {/* Brand */}
        <p className="text-center text-pink-600 font-extrabold tracking-wide text-sm mb-2">
          THE 999 BOX
        </p>

        {/* Success Block */}
        {resetSuccess ? (
          <div className="text-center py-8">
            <FaCheckCircle className="text-pink-500 text-5xl mx-auto mb-3 animate-pop" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Email Sent!
            </h2>
            <p className="text-gray-500">
              If your email exists, a reset link has been sent.
            </p>
          </div>
        ) : (
          <>
            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
              Forgot Password?
            </h2>
            <p className="text-sm text-gray-500 mb-5 text-center">
              Enter your email and we'll send you password reset instructions.
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-400" />
                <input
                  ref={inputRef}
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-pink-200 rounded-lg p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400 text-sm placeholder:text-pink-300"
                />
              </div>

              {resetError && (
                <p className="text-rose-500 text-sm">{resetError}</p>
              )}

              <button
                type="submit"
                disabled={!isValidEmail || resetLoading}
                className="w-full bg-pink-500 text-white py-3 rounded-lg text-sm font-medium
                           hover:bg-pink-600 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-pink-200"
              >
                {resetLoading ? "Sending..." : "Send Reset Link"}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full text-pink-500 py-2 rounded-lg text-sm font-medium hover:text-pink-600 transition"
              >
                Back to Sign In
              </button>
            </form>
          </>
        )}
      </div>

      {/* Animations */}
      <style>{`
        .animate-fadeIn { animation: fadeIn .25s ease-out; }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }

        .animate-slideUp { animation: slideUp .25s ease-out; }
        @keyframes slideUp { from { transform:translateY(20px); opacity:0; } to { transform:translateY(0); opacity:1; } }

        .animate-pop { animation: pop .3s ease-out; }
        @keyframes pop { 
          0% { transform: scale(0.5); opacity:0; }
          100% { transform: scale(1); opacity:1; }
        }
      `}</style>
    </div>
  );
}
