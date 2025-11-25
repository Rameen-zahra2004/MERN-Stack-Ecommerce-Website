import { Link, useLocation } from "react-router-dom";
import { FiUsers, FiShoppingBag, FiHome } from "react-icons/fi";

export default function Sidebar({ open, setOpen }) {
  const location = useLocation();

  const items = [
    { to: "/", label: "Home", icon: <FiHome /> },
    // { to: "/", label: "Products", icon: <FiShoppingBag /> },
    { to: "/user", label: "User", icon: <FiUsers /> },
  ];

  return (
    <>
      {/* Overlay (dark background when sidebar is open) */}
      {open && (
        <div
          className="fixed inset-0  bg-opacity-40 z-40"
          onClick={() => setOpen(false)}
        ></div>
      )}

      {/* Sidebar (Off-canvas) */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white border-r shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full"
        } w-64`}
      >
        <div className="h-full flex flex-col">
          {/* Header section */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-3">
              <div className="rounded-md h-10 w-10 flex items-center justify-center bg-gray-100 text-sm font-bold">
                Logo
              </div>
            </div>
          </div>

          {/* Navigation links */}
          <nav className="flex-1 px-2 py-4">
            {items.map((it) => (
              <Link
                key={it.to}
                to={it.to}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 p-3 rounded-md my-1 hover:bg-gray-100 ${
                  location.pathname === it.to ? "bg-gray-100 font-medium" : ""
                }`}
              >
                <div className="text-lg">{it.icon}</div>
                <div>{it.label}</div>
              </Link>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}
