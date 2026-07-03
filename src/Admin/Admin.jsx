// import { useState, useEffect } from "react";
// import { Outlet, useLocation, Link, useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";

// import {
//   FaHome,
//   FaCube,
//   FaUsers,
//   FaClipboardList,
//   FaShoppingCart,
//   FaCog,
//   FaSignOutAlt,
//   FaBars,
//   FaUserCheck,
// } from "react-icons/fa";

// import { logOut } from "../Slices/signinSlice";

// const ADMIN_ROLES = new Set(["admin", "super_admin", "moderator"]);

// const links = [
//   { to: "/admin/dashboard", label: "Dashboard", icon: FaHome },
//   { to: "/admin/products", label: "Products", icon: FaCube },
//   { to: "/admin/users", label: "Users", icon: FaUsers },
//   { to: "/admin/orders", label: "Orders", icon: FaClipboardList },
//   { to: "/admin/carts", label: "Carts", icon: FaShoppingCart },
//   { to: "/admin/settings", label: "Settings", icon: FaCog },
//   { to: "/admin/active-users", label: "Active Users", icon: FaUserCheck },
// ];

// export default function Admin() {
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   const { pathname } = useLocation();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const { user } = useSelector((state) => state.signinuser || {});

//   /*
//   =========================
//   SAFE AUTH GUARD
//   =========================
//   */
//   useEffect(() => {
//     if (!user) {
//       navigate("/signin", { replace: true });
//       return;
//     }

//     const role = user?.role?.toLowerCase();
//     if (!ADMIN_ROLES.has(role)) {
//       navigate("/user", { replace: true });
//     }
//   }, [user, navigate]);

//   /*
//   =========================
//   LOADING GUARD (PREVENT FLICKER)
//   =========================
//   */
//   if (!user || !ADMIN_ROLES.has(user?.role?.toLowerCase())) {
//     return null;
//   }

//   /*
//   =========================
//   LOGOUT
//   =========================
//   */
//   const handleLogout = () => {
//     dispatch(logOut());
//     localStorage.removeItem("currentUser");
//     localStorage.removeItem("token");

//     navigate("/signin", { replace: true });
//   };

//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       {/* ================= SIDEBAR ================= */}
//       <aside
//         className={`shrink-0 h-screen bg-white border-r flex flex-col transition-all duration-300 ${
//           sidebarOpen ? "w-72" : "w-20"
//         }`}
//       >
//         {/* Header */}
//         <div className="flex items-center justify-between p-4 border-b">
//           {sidebarOpen && (
//             <h1 className="text-xl font-bold text-blue-600">Admin Panel</h1>
//           )}

//           <button
//             onClick={() => setSidebarOpen(!sidebarOpen)}
//             className="text-gray-600 hover:text-gray-800"
//           >
//             <FaBars className="w-5 h-5" />
//           </button>
//         </div>

//         {/* Navigation */}
//         <nav className="flex-1 flex flex-col p-2 gap-1 overflow-y-auto">
//           {links.map((l) => {
//             const Icon = l.icon;
//             const active = pathname.startsWith(l.to);

//             return (
//               <Link
//                 key={l.to}
//                 to={l.to}
//                 className={`flex items-center gap-3 px-3 py-2 rounded-md transition ${
//                   active
//                     ? "bg-blue-50 text-blue-600 font-semibold"
//                     : "text-gray-700 hover:bg-gray-50"
//                 }`}
//               >
//                 <Icon className="w-5 h-5" />
//                 {sidebarOpen && <span>{l.label}</span>}
//               </Link>
//             );
//           })}
//         </nav>

//         {/* Logout */}
//         <div className="p-4 border-t">
//           <button
//             onClick={handleLogout}
//             className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-red-600 hover:bg-red-50"
//           >
//             <FaSignOutAlt className="w-5 h-5" />
//             {sidebarOpen && "Logout"}
//           </button>
//         </div>
//       </aside>

//       {/* ================= MAIN CONTENT ================= */}
//       <div className="flex-1 flex flex-col">
//         <main className="p-4 md:p-6 flex-1 overflow-auto">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// }
import { useState } from "react";
import { Outlet, useLocation, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  FaHome,
  FaCube,
  FaUsers,
  FaClipboardList,
  FaShoppingCart,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaUserCheck,
} from "react-icons/fa";

import { logoutAdmin } from "../AdminSlices/adminLoginSlice";

const links = [
  { to: "/admin/dashboard", label: "Dashboard", icon: FaHome },
  { to: "/admin/products", label: "Products", icon: FaCube },
  { to: "/admin/users", label: "Users", icon: FaUsers },
  { to: "/admin/orders", label: "Orders", icon: FaClipboardList },
  { to: "/admin/carts", label: "Carts", icon: FaShoppingCart },
  { to: "/admin/settings", label: "Settings", icon: FaCog },
  { to: "/admin/active-users", label: "Active Users", icon: FaUserCheck },
];

export default function Admin() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Auth itself is already enforced by ProtectedAdminRoute (which wraps
  // this component in App.jsx and checks state.adminLogin). This component
  // just renders the layout — no need to re-check or redirect here.
  const { admin } = useSelector((state) => state.adminLogin || {});

  /*
  =========================
  LOGOUT
  =========================
  */
  const handleLogout = async () => {
    await dispatch(logoutAdmin());
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* ================= SIDEBAR ================= */}
      <aside
        className={`shrink-0 h-screen bg-white border-r flex flex-col transition-all duration-300 ${
          sidebarOpen ? "w-72" : "w-20"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          {sidebarOpen && (
            <div>
              <h1 className="text-xl font-bold text-blue-600">Admin Panel</h1>
              {admin?.name && (
                <p className="text-xs text-gray-400 mt-0.5">{admin.name}</p>
              )}
            </div>
          )}

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-600 hover:text-gray-800"
          >
            <FaBars className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col p-2 gap-1 overflow-y-auto">
          {links.map((l) => {
            const Icon = l.icon;
            const active = pathname.startsWith(l.to);

            return (
              <Link
                key={l.to}
                to={l.to}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition ${
                  active
                    ? "bg-blue-50 text-blue-600 font-semibold"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Icon className="w-5 h-5" />
                {sidebarOpen && <span>{l.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-red-600 hover:bg-red-50"
          >
            <FaSignOutAlt className="w-5 h-5" />
            {sidebarOpen && "Logout"}
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <div className="flex-1 flex flex-col">
        <main className="p-4 md:p-6 flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
