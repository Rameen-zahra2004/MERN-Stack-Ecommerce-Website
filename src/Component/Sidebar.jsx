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
          className="fixed inset-0 bg-pink-900/30 backdrop-blur-[2px] z-40 transition-opacity"
          onClick={() => setOpen(false)}
        ></div>
      )}

      {/* Sidebar (Off-canvas) */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white border-r border-pink-100 shadow-xl shadow-pink-200/50 z-50 transform transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full"
        } w-64`}
      >
        <div className="h-full flex flex-col">
          {/* Header section */}
          <div className="flex items-center gap-3 p-4 border-b border-pink-100">
            {/* Logo */}
            <div className="relative h-11 w-11 shrink-0">
              <div className="absolute inset-0 rounded-full bg-linear-to-br from-pink-400 to-rose-500 rotate-3"></div>
              <div className="absolute inset-0 rounded-full flex items-center justify-center text-white">
                <FiShoppingBag size={18} />
              </div>
              <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-white border-2 border-pink-400 flex items-center justify-center">
                <span className="text-[8px] font-bold text-pink-500">9</span>
              </div>
            </div>
            <div className="leading-tight">
              <p className="font-extrabold text-pink-600 tracking-wide text-sm">
                THE 999 BOX
              </p>
              <p className="text-[10px] text-pink-300 tracking-wider uppercase">
                Boutique Store
              </p>
            </div>
          </div>

          {/* Navigation links */}
          <nav className="flex-1 px-2 py-4">
            {items.map((it) => {
              const isActive = location.pathname === it.to;
              return (
                <Link
                  key={it.to}
                  to={it.to}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 p-3 rounded-lg my-1 transition ${
                    isActive
                      ? "bg-pink-50 text-pink-700 font-medium border-l-4 border-pink-500"
                      : "text-gray-600 hover:bg-pink-50 hover:text-pink-600 border-l-4 border-transparent"
                  }`}
                >
                  <div
                    className={`text-lg ${isActive ? "text-pink-600" : "text-pink-300"}`}
                  >
                    {it.icon}
                  </div>
                  <div>{it.label}</div>
                </Link>
              );
            })}
          </nav>

          {/* Footer note */}
          <div className="p-4 border-t border-pink-100 text-center text-xs text-pink-300">
            🌸 THE 999 BOX
          </div>
        </div>
      </aside>
    </>
  );
}
