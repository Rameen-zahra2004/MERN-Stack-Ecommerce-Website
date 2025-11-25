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

  return (
    <header
      className={`flex items-center justify-between bg-white px-4 py-3 border-b transition-all duration-300 ${
        open ? "pl-6" : "pl-4"
      }`}
    >
      <div className="flex items-center gap-3 w-full">
        <button
          onClick={() => setOpen(!open)}
          className="p-2 rounded-md hover:bg-gray-100"
        >
          {open ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>

        <div className="text-xl font-semibold">Practice Project</div>

        <Searchbar />

        <nav className="flex items-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100"
          >
            <FiShoppingBag />
            <span className="hidden md:inline">Products</span>
          </Link>

          {!user ? (
            <Link
              to="/signin"
              className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 text-black font-medium"
            >
              <FiUser />
              <span className="hidden md:inline">Sign In</span>
            </Link>
          ) : (
            <button
              onClick={() => dispatch(logOut())}
              className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 text-red-500 font-medium"
            >
              <FiX />
              <span className="hidden md:inline">Logout</span>
            </button>
          )}

          {user?.role === "admin" && (
            <Link
              to="/admin"
              className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 text-black font-medium"
            >
              <FiUser />
              <span className="hidden md:inline">Admin</span>
            </Link>
          )}

          <Link
            to="/cart"
            className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 text-black font-medium"
          >
            <FiShoppingCart />
            <span>Cart</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
