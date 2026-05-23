// import { Navigate } from "react-router-dom";
// import { useSelector } from "react-redux";

// export default function ProtectedRoute({ children, role }) {
//   const { user } = useSelector((state) => state.signinuser);

//   const storedUser = localStorage.getItem("currentUser");
//   const currentUser = user || (storedUser ? JSON.parse(storedUser) : null);

//   // Not logged in → redirect to signin
//   if (!currentUser) {
//     return <Navigate to="/signin" replace />;
//   }

//   // Role mismatch → redirect to home
//   if (role && currentUser.role !== role) {
//     return <Navigate to="/" replace />;
//   }

//   // Access granted
//   return children;
// }
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute({ children, role }) {
  const { user } = useSelector((state) => state.signinuser);

  const storedUser = localStorage.getItem("currentUser");

  const currentUser =
    user || (storedUser ? JSON.parse(storedUser) : null);

  // =========================
  // ❌ NOT LOGGED IN
  // =========================
  if (!currentUser) {
    return <Navigate to="/signin" replace />;
  }

  // =========================
  // ❌ ROLE NOT ALLOWED
  // =========================
  if (role && currentUser.role !== role) {
    // redirect based on actual role
    if (currentUser.role === "admin") {
      return <Navigate to="/admin" replace />;
    }

    return <Navigate to="/user" replace />;
  }

  // =========================
  // ✅ ACCESS GRANTED
  // =========================
  return children;
}