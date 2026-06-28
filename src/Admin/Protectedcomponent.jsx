// import { useEffect } from "react";
// import { Navigate } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import { getAdminProfile } from "../AdminSlices/adminLoginSlice";

// export default function ProtectedAdminRoute({ children }) {
//   const dispatch = useDispatch();
//   const { admin, isAuthenticated, loading } = useSelector(
//     (state) => state.adminLogin,
//   );

//   // ── On mount: rehydrate admin session from cookie ──────
//   useEffect(() => {
//     if (!isAuthenticated && !admin) {
//       dispatch(getAdminProfile());
//     }
//   }, []);

//   // ── Still checking session ─────────────────────────────
//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <p className="text-gray-500 text-sm">Checking session...</p>
//       </div>
//     );
//   }

//   // ── Not authenticated → go to admin login ──────────────
//   if (!isAuthenticated) {
//     return <Navigate to="/admin/login" replace />;
//   }

//   // ── Authenticated → render page ────────────────────────
//   return children;
// }
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function ProtectedAdminRoute({ children }) {
  const { user, loading } = useSelector((state) => state.signinuser);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 text-sm">Checking session...</p>
      </div>
    );
  }

  const role = user?.role?.toLowerCase();
  const ADMIN_ROLES = new Set(["admin", "super_admin", "moderator"]);

  if (!user || !ADMIN_ROLES.has(role)) {
    return <Navigate to="/signin" replace />;
  }

  return children;
}
