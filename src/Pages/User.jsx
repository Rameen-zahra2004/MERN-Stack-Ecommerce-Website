import { useState, useEffect, useMemo } from "react";
import { useNavigate, Outlet } from "react-router-dom"; // Outlet for nested routes
import { FaShoppingCart, FaCog, FaClipboardList } from "react-icons/fa";
import SearchBar from "../Admin component/AdminSearchBar";
import { useSelector } from "react-redux";

export default function UserPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredDashboardItems, setFilteredDashboardItems] = useState([]);

  // Dashboard items with paths
  const dashboardItems = useMemo(
    () => [
      {
        label: "Orders",
        path: "/user/orders",
        color: "bg-blue-500",
        icon: <FaClipboardList size={30} />,
      },
      {
        label: "Wishlist",
        path: "/user/wishlist",
        color: "bg-purple-500",
        icon: <FaShoppingCart size={30} />,
      },
      {
        label: "Settings",
        path: "/user/setting",
        color: "bg-green-500",
        icon: <FaCog size={30} />,
      },
    ],
    []
  );

  // Redux state
  const { products = [] } = useSelector((state) => state.products || {});
  const { wishlist: wishlistItems = [] } = useSelector(
    (state) => state.wishlist || {}
  );

  // Filter dashboard items based on search
  useEffect(() => {
    if (!searchQuery) {
      setFilteredDashboardItems(dashboardItems);
    } else {
      const lower = searchQuery.toLowerCase();
      setFilteredDashboardItems(
        dashboardItems.filter((item) =>
          item.label.toLowerCase().includes(lower)
        )
      );
    }
  }, [searchQuery, dashboardItems]);

  // Filter products for search
  const filteredProducts = useMemo(() => {
    if (!searchQuery) return [];
    const lower = searchQuery.toLowerCase();
    return products.filter((p) => p.title.toLowerCase().includes(lower));
  }, [searchQuery, products]);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      {/* Search Bar */}
      <div className="max-w-md mx-auto mb-8">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search dashboard or products..."
        />
      </div>

      <h1 className="text-3xl font-bold mb-8 text-center">
        Welcome to Your Dashboard
      </h1>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
        {filteredDashboardItems.map((item) => (
          <div
            key={item.label}
            className={`flex flex-col items-center justify-center p-6 rounded-xl shadow-lg cursor-pointer transform transition duration-300 hover:scale-105 hover:shadow-2xl ${item.color} text-white`}
            onClick={() => navigate(item.path)} // Navigate to actual page
          >
            <div className="mb-4">{item.icon}</div>
            <h2 className="text-xl font-semibold">{item.label}</h2>
          </div>
        ))}
      </div>

      {/* Products matching search */}
      {filteredProducts.length > 0 && (
        <div className="mt-10 max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Matching Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white shadow rounded-lg p-4 flex flex-col items-center transition hover:shadow-2xl hover:scale-105 cursor-pointer"
                onClick={() => navigate(`/products/${product.id}`)}
              >
                <div className="relative w-full h-40 flex items-center justify-center mb-2">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="max-h-36 object-contain"
                  />
                  {wishlistItems.some((p) => p.id === product.id) && (
                    <span className="absolute top-2 right-2 text-red-500 text-2xl">
                      ❤
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-center">{product.title}</h3>
                <p className="text-blue-600 font-bold">
                  ${product.price.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
