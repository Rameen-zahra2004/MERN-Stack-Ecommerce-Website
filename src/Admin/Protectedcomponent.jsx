import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute({ children, role }) {
  const { user } = useSelector((state) => state.signinuser);

  // Get user from Redux or localStorage
  const storedUser = localStorage.getItem("user");
  const currentUser = user || (storedUser ? JSON.parse(storedUser) : null);

  // Not logged in → redirect
  if (!currentUser) {
    return <Navigate to="/signin" replace />;
  }

  // Role mismatch → redirect to home
  if (role && currentUser.role !== role) {
    return <Navigate to="/" replace />;
  }

  // Access granted
  return children;
}
