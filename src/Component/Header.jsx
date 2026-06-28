// import {
//   FiMenu,
//   FiShoppingBag,
//   FiShoppingCart,
//   FiUser,
//   FiX,
// } from "react-icons/fi";
// import { Link } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { logOut } from "../Slices/signinSlice";
// import Searchbar from "./Searchbar";

// export default function Header({ open, setOpen }) {
//   const dispatch = useDispatch();
//   const { user } = useSelector((state) => state.signinuser);
//   const cartCount = useSelector((state) => state.cart?.items?.length ?? 0);

//   return (
//     <header className="sticky top-0 z-50 flex items-center justify-between gap-5 h-18 px-6 bg-white/85 backdrop-blur-xl border-b border-pink-100/60 shadow-[0_4px_20px_rgba(236,72,153,0.08)]">
//       {/* Left — menu + logo */}
//       <div className="flex items-center gap-4 shrink-0">
//         <button
//           onClick={() => setOpen(!open)}
//           className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-pink-100 shadow-sm hover:shadow-md hover:border-pink-300 hover:bg-pink-50 transition-all duration-300"
//         >
//           {open ? (
//             <FiX size={18} className="text-pink-500" />
//           ) : (
//             <FiMenu size={18} className="text-pink-500" />
//           )}
//         </button>

//         <Link to="/" className="flex items-center gap-3 group">
//           <div className="w-11 h-11 rounded-2xl bg-linear-to-br from-pink-400 via-pink-500 to-rose-600 flex items-center justify-center shrink-0 shadow-lg shadow-pink-300/40 ring-2 ring-white group-hover:scale-105 transition-transform duration-300">
//             <span className="text-white text-sm font-bold">999</span>
//           </div>

//           <div className="flex flex-col leading-none">
//             <span className="text-xl font-bold tracking-tight text-gray-900">
//               THE 999 <span className="text-pink-600">BOXS</span>
//             </span>

//             <span className="text-[10px] uppercase tracking-[0.22em] text-pink-500 font-semibold">
//               Curated Finds
//             </span>
//           </div>
//         </Link>
//       </div>

//       {/* Center — search */}
//       <div className="flex-1 max-w-150 hidden md:block">
//         <Searchbar />
//       </div>

//       {/* Right — nav */}
//       <nav className="flex items-center gap-1 shrink-0">
//         <Link
//           to="/"
//           className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-pink-50 hover:text-pink-600 transition-all duration-300"
//         >
//           <FiShoppingBag size={18} />
//           <span className="hidden md:inline">Products</span>
//         </Link>

//         {!user ? (
//           <Link
//             to="/signin"
//             className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-pink-50 hover:text-pink-600 transition-all duration-300"
//           >
//             <FiUser size={18} />
//             <span className="hidden md:inline">Sign In</span>
//           </Link>
//         ) : (
//           <button
//             onClick={() => dispatch(logOut())}
//             className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-all duration-300"
//           >
//             <FiX size={18} />
//             <span className="hidden md:inline">Logout</span>
//           </button>
//         )}

//         {user?.role === "admin" && (
//           <Link
//             to="/admin"
//             className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-pink-50 hover:text-pink-600 transition-all duration-300"
//           >
//             <FiUser size={18} />
//             <span className="hidden md:inline">Admin</span>
//           </Link>
//         )}

//         <Link
//           to="/cart"
//           className="relative flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-pink-50 hover:text-pink-600 transition-all duration-300"
//         >
//           <FiShoppingCart size={18} />
//           <span className="hidden md:inline">Cart</span>

//           {cartCount > 0 && (
//             <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-linear-to-br  from-pink-500 to-rose-600 text-white text-[10px] font-bold flex items-center justify-center shadow-lg ring-2 ring-white animate-pulse">
//               {cartCount}
//             </span>
//           )}
//         </Link>
//       </nav>
//     </header>
//   );
// }
import {
  FiMenu,
  FiShoppingBag,
  FiShoppingCart,
  FiUser,
  FiX,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "../Slices/signinSlice";
import Searchbar from "./Searchbar";

export default function Header({ open, setOpen }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.signinuser);
  const cartCount = useSelector((state) => state.cart?.items?.length ?? 0);

  return (
    <header
      className="sticky top-0 z-50 flex items-center justify-between gap-5 h-18 px-6
      bg-linear-to-r from-[#fff1f7] via-[#fff8fb] to-[#ffe8f1]
      backdrop-blur-2xl
      border-b border-pink-200/50
      shadow-[0_8px_30px_rgba(236,72,153,0.12)]"
    >
      {/* LEFT */}
      <div className="flex items-center gap-4 shrink-0">
        <button
          onClick={() => setOpen(!open)}
          className="w-10 h-10 flex items-center justify-center rounded-xl
          bg-white/70 backdrop-blur-md
          border border-pink-200/50
          shadow-[0_4px_15px_rgba(236,72,153,0.08)]
          hover:bg-pink-50
          hover:border-pink-300
          hover:shadow-[0_6px_20px_rgba(236,72,153,0.18)]
          transition-all duration-300"
        >
          {open ? (
            <FiX size={18} className="text-[#e11d74]" />
          ) : (
            <FiMenu size={18} className="text-[#e11d74]" />
          )}
        </button>

        <Link to="/" className="flex items-center gap-3 group">
          <div
            className="w-11 h-11 rounded-2xl
            bg-linear-to-br from-[#ff7eb3] via-[#ff4fa0] to-[#e11d74]
            flex items-center justify-center shrink-0
            shadow-[0_10px_25px_rgba(255,79,160,0.35)]
            ring-2 ring-white
            group-hover:scale-105 transition-transform duration-300"
          >
            <span className="text-white text-sm font-bold">999</span>
          </div>

          <div className="flex flex-col leading-none">
            <span className="text-xl font-extrabold tracking-tight text-gray-800">
              THE 999 <span className="text-[#e11d74]">BOXS</span>
            </span>

            <span className="text-[10px] uppercase tracking-[0.25em] text-[#ff4fa0] font-semibold">
              Curated Finds
            </span>
          </div>
        </Link>
      </div>

      {/* CENTER */}
      <div className="flex-1 max-w-150 hidden md:block">
        <Searchbar />
      </div>

      {/* RIGHT */}
      <nav className="flex items-center gap-1 shrink-0">
        <Link
          to="/"
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium
          text-gray-700
          hover:bg-white/80
          hover:text-[#e11d74]
          hover:shadow-md
          transition-all duration-300"
        >
          <FiShoppingBag size={18} />
          <span className="hidden md:inline">Products</span>
        </Link>

        {!user ? (
          <Link
            to="/signin"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium
            text-gray-700
            hover:bg-white/80
            hover:text-[#e11d74]
            hover:shadow-md
            transition-all duration-300"
          >
            <FiUser size={18} />
            <span className="hidden md:inline">Sign In</span>
          </Link>
        ) : (
          <button
            onClick={() => dispatch(logOut())}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium
            text-rose-500
            hover:bg-rose-50
            hover:text-rose-600
            hover:shadow-md
            transition-all duration-300"
          >
            <FiX size={18} />
            <span className="hidden md:inline">Logout</span>
          </button>
        )}

        {user?.role === "admin" && (
          <Link
            to="/admin"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium
            text-gray-700
            hover:bg-white/80
            hover:text-[#e11d74]
            hover:shadow-md
            transition-all duration-300"
          >
            <FiUser size={18} />
            <span className="hidden md:inline">Admin</span>
          </Link>
        )}

        <Link
          to="/cart"
          className="relative flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium
          text-gray-700
          hover:bg-white/80
          hover:text-[#e11d74]
          hover:shadow-md
          transition-all duration-300"
        >
          <FiShoppingCart size={18} />
          <span className="hidden md:inline">Cart</span>

          {cartCount > 0 && (
            <span
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full
            bg-linear-to-br from-[#ff4fa0] to-[#e11d74]
            text-white text-[10px] font-bold
            flex items-center justify-center
            shadow-[0_6px_15px_rgba(255,79,160,0.45)]
            ring-2 ring-white animate-pulse"
            >
              {cartCount}
            </span>
          )}
        </Link>
      </nav>
    </header>
  );
}
