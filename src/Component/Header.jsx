// import {
//   FiMenu,
//   FiSearch,
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

//   return (
//     <header
//       className={`flex items-center justify-between bg-white px-4 py-3 border-b transition-all duration-300 ${
//         open ? "pl-6" : "pl-4"
//       }`}
//     >
//       <div className="flex items-center gap-3 w-full">
//         <button
//           onClick={() => setOpen(!open)}
//           className="p-2 rounded-md hover:bg-gray-100"
//         >
//           {open ? <FiX size={20} /> : <FiMenu size={20} />}
//         </button>

//        <div className="flex items-center gap-2.5">
//   <div className="w-8 h-8 rounded-lg bg-[#534AB7] flex items-center justify-center">
//     <span className="text-white text-base font-medium">N</span>
//   </div>
//   <span className="text-[22px] font-medium tracking-tight">
//     Nova<span className="text-[#534AB7]">Mart</span>
//   </span>
// </div>

//         <Searchbar />

//         <nav className="flex items-center gap-4">
//           <Link
//             to="/"
//             className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100"
//           >
//             <FiShoppingBag />
//             <span className="hidden md:inline">Products</span>
//           </Link>

//           {!user ? (
//             <Link
//               to="/signin"
//               className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 text-black font-medium"
//             >
//               <FiUser />
//               <span className="hidden md:inline">Sign In</span>
//             </Link>
//           ) : (
//             <button
//               onClick={() => dispatch(logOut())}
//               className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 text-red-500 font-medium"
//             >
//               <FiX />
//               <span className="hidden md:inline">Logout</span>
//             </button>
//           )}

//           {user?.role === "admin" && (
//             <Link
//               to="/admin"
//               className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 text-black font-medium"
//             >
//               <FiUser />
//               <span className="hidden md:inline">Admin</span>
//             </Link>
//           )}

//           <Link
//             to="/cart"
//             className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 text-black font-medium"
//           >
//             <FiShoppingCart />
//             <span>Cart</span>
//           </Link>
//         </nav>
//       </div>
//     </header>
//   );
// }
import {
  FiMenu,
  FiSearch,
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
    <header className="flex items-center justify-between bg-white border-b border-gray-100 px-5 h-15  gap-4 sticky top-0 z-50">

      {/* Left — menu + logo */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={() => setOpen(!open)}
          className="w-8.5 h-8.5 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          {open ? <FiX size={18} className="text-gray-500" /> : <FiMenu size={18} className="text-gray-500" />}
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#534AB7] flex items-center justify-center shrink-0">
            <span className="text-white text-[15px] font-medium">N</span>
          </div>
          <span className="text-[20px] font-medium tracking-tight leading-none">
            Nova<span className="text-[#534AB7]">Mart</span>
          </span>
        </div>
      </div>

      {/* Center — search */}
      <div className="flex-1 "max-w-95>
        <Searchbar />
      </div>

      {/* Right — nav */}
      <nav className="flex items-center gap-1 shrink-0">
        <Link
          to="/"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-colors"
        >
          <FiShoppingBag size={17} />
          <span className="hidden md:inline">Products</span>
        </Link>

        {!user ? (
          <Link
            to="/signin"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-colors"
          >
            <FiUser size={17} />
            <span className="hidden md:inline">Sign in</span>
          </Link>
        ) : (
          <button
            onClick={() => dispatch(logOut())}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <FiX size={17} />
            <span className="hidden md:inline">Logout</span>
          </button>
        )}

        {user?.role === "admin" && (
          <Link
            to="/admin"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-colors"
          >
            <FiUser size={17} />
            <span className="hidden md:inline">Admin</span>
          </Link>
        )}

        <Link
          to="/cart"
          className="relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-colors"
        >
          <FiShoppingCart size={17} />
          <span className="hidden md:inline">Cart</span>
          {cartCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#534AB7] text-white text-[10px] font-medium flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </Link>
      </nav>
    </header>
  );
}