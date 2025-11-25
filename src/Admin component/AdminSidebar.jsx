import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  FaHome,
  FaCube,
  FaUsers,
  FaClipboardList,
  FaShoppingCart,
  FaCog,
  FaSignOutAlt,
  FaBars,
} from "react-icons/fa";
import { logOut } from "../Slices/signinSlice";

const ADMIN_LINKS = [
  { to: "/admin/dashboard", label: "Dashboard", icon: FaHome },
  { to: "/admin/products", label: "Products", icon: FaCube },
  { to: "/admin/users", label: "Users", icon: FaUsers },
  { to: "/admin/orders", label: "Orders", icon: FaClipboardList },
  { to: "/admin/carts", label: "Carts", icon: FaShoppingCart },
  { to: "/admin/settings", label: "Settings", icon: FaCog },
];

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.signinuser || {});

  if (!user || user.role !== "admin") return null;

  const handleLogout = () => {
    dispatch(logOut());
    navigate("/signin"); // fixed route
  };

  return (
    <aside
      className={`bg-white dark:bg-gray-800 border-r dark:border-gray-700 h-screen fixed left-0 top-0 z-50 flex flex-col shadow-md transition-all ${
        isOpen ? "w-64" : "w-16"
      }`}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
        <h1
          className={`text-xl font-bold text-blue-600 dark:text-blue-400 transition-opacity ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
        >
          Admin Panel
        </h1>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-700 dark:text-gray-300 hover:text-blue-600 transition"
        >
          <FaBars />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 flex flex-col p-2 gap-1 overflow-y-auto">
        {ADMIN_LINKS.map((item) => {
          const Icon = item.icon;
          const active = location.pathname.startsWith(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                active
                  ? "bg-blue-100 text-blue-700 font-semibold dark:bg-blue-900 dark:text-blue-300"
                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span
                className={`ml-3 transition-opacity ${
                  isOpen ? "opacity-100" : "opacity-0"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t mt-auto dark:border-gray-700">
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center px-3 py-2 w-full text-red-600 rounded-md hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900 transition"
        >
          <FaSignOutAlt className="w-5 h-5" />
          <span
            className={`ml-3 transition-opacity ${
              isOpen ? "opacity-100" : "opacity-0"
            }`}
          >
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
}
