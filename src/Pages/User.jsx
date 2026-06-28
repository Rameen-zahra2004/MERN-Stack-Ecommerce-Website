import { useState, useEffect, useMemo } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { FaShoppingCart, FaCog, FaClipboardList } from "react-icons/fa";
import SearchBar from "../Admin component/AdminSearchBar";
import { useSelector } from "react-redux";

export default function UserPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredDashboardItems, setFilteredDashboardItems] = useState([]);

  const dashboardItems = useMemo(
    () => [
      {
        label: "Orders",
        path: "/user/orders",
        color:
          "bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600",
        icon: <FaClipboardList size={30} />,
      },
      {
        label: "Wishlist",
        path: "/user/wishlist",
        color:
          "bg-gradient-to-r from-fuchsia-500 to-pink-500 hover:from-fuchsia-600 hover:to-pink-600",
        icon: <FaShoppingCart size={30} />,
      },
      {
        label: "Settings",
        path: "/user/setting",
        color:
          "bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700",
        icon: <FaCog size={30} />,
      },
    ],
    [],
  );

  const { products = [] } = useSelector((state) => state.products || {});
  const { wishlist: wishlistItems = [] } = useSelector(
    (state) => state.wishlist || {},
  );

  useEffect(() => {
    if (!searchQuery) {
      setFilteredDashboardItems(dashboardItems);
    } else {
      const lower = searchQuery.toLowerCase();
      setFilteredDashboardItems(
        dashboardItems.filter((item) =>
          item.label.toLowerCase().includes(lower),
        ),
      );
    }
  }, [searchQuery, dashboardItems]);

  const filteredProducts = useMemo(() => {
    if (!searchQuery) return [];
    const lower = searchQuery.toLowerCase();
    return products.filter((p) => p.title.toLowerCase().includes(lower));
  }, [searchQuery, products]);

  return (
    <div className="min-h-screen bg-linear-to-br from-pink-50 via-rose-50 to-fuchsia-100 p-8">
      {/* Search Bar */}
      <div className="max-w-md mx-auto mb-8">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search dashboard or products..."
        />
      </div>

      <h1 className="text-4xl font-extrabold text-center mb-10 bg-linear-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
        Welcome to Your Dashboard
      </h1>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-12">
        {filteredDashboardItems.map((item) => (
          <div
            key={item.label}
            className={`flex flex-col items-center justify-center p-8 rounded-2xl shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl text-white ${item.color}`}
            onClick={() => navigate(item.path)}
          >
            <div className="mb-4">{item.icon}</div>
            <h2 className="text-xl font-bold">{item.label}</h2>
          </div>
        ))}
      </div>

      {/* Products matching search */}
      {filteredProducts.length > 0 && (
        <div className="mt-10 max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-pink-700 mb-6">
            Matching Products
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white/90 backdrop-blur-sm border border-pink-100 rounded-2xl shadow-md p-5 flex flex-col items-center transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 cursor-pointer"
                onClick={() => navigate(`/products/${product.id}`)}
              >
                <div className="relative w-full h-44 flex items-center justify-center mb-4">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="max-h-40 object-contain"
                  />

                  {wishlistItems.some((p) => p.id === product.id) && (
                    <span className="absolute top-2 right-2 text-pink-600 text-2xl">
                      ❤
                    </span>
                  )}
                </div>

                <h3 className="font-semibold text-center text-gray-800 line-clamp-2">
                  {product.title}
                </h3>

                <p className="text-pink-600 font-bold text-lg mt-2">
                  ${product.price.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <Outlet />
    </div>
  );
}
