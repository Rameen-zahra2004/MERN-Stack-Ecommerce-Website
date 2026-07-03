import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getAdminProfile } from "../AdminSlices/adminLoginSlice";

/* ─────────────────────────────────────────
   ADMIN GUARD — checks the Admin-collection session
   (adminAccessToken cookie, state.adminLogin slice)
───────────────────────────────────────── */
export function ProtectedAdminRoute({ children }) {
  const dispatch = useDispatch();
  const { admin, isAuthenticated, loading } = useSelector(
    (state) => state.adminLogin,
  );

  // On mount: rehydrate admin session from cookie
  useEffect(() => {
    if (!isAuthenticated && !admin) {
      dispatch(getAdminProfile());
    }
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 text-sm">Checking session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

/* ─────────────────────────────────────────
   USER GUARD — checks the regular User-collection session
   (accessToken cookie, state.signinuser slice)
───────────────────────────────────────── */
export function ProtectedRoute({ children }) {
  const { user, loading } = useSelector((state) => state.signinuser);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 text-sm">Checking session...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  return children;
}

// Default export kept for backward compatibility — points to the USER guard,
// since that was this file's most recent default behavior before the split.
export default ProtectedRoute;
