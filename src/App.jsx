import { Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import Sidebar from "./Component/Sidebar";
import Header from "./Component/Header";
import Footer from "./Component/Footer";

import Admin from "./Admin/Admin";
import ProtectedRoute from "./Admin/Protectedcomponent";

import Product from "./Pages/Product";
import ProductPage from "./Pages/ProductPage";
import UserOrderPage from "./Pages/UserOrder";
import UserCartPage from "./Pages/Cart";
import Checkout from "./Component/CheckoutPage";
import Signin from "./Pages/Sign";
import DashboardHome from "./Admin/Dashboard";
import NotFound from "./Component/Errorpage";
import ServerError from "./Component/ServerError";

import AdminuserPage from "./Admin/Userpage";
import AdminCartPage from "./Admin/CartPage";
import AdminProductManagement from "./Admin/ProductManagment";
import RevenueCard from "./Admin component/RevenueComponent";
import ActiveUsers from "./Admin component/ActiveUserComponent";
import AdminSettings from "./AdminSettinngComponent/AdminSetting";
import AdminOrdersPage from "./Admin/AdminOrderspage";

import UserPage from "./Pages/User";
import UserOrdersPage from "./Pages/UserOrder";
import UserWishlistPage from "./Pages/WishList";
import UserSettingsPage from "./Pages/UserSettingPage";
import UserOrderDetailPage from "./Pages/UserOrderDetailPage";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();

  const isAdminRoute = pathname.startsWith("/admin");
  const theme = useSelector((state) => state.theme.theme);

  useEffect(() => {
    const html = document.documentElement;
    if (theme === "dark") html.classList.add("dark");
    else html.classList.remove("dark");
  }, [theme]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 relative overflow-x-hidden text-gray-900 dark:text-gray-200 transition-colors duration-300">
      {/* Sidebar + Header only for non-admin routes */}
      {!isAdminRoute && (
        <>
          <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

          <div
            className={`transition-all duration-300 ease ${
              sidebarOpen ? "ml-64" : "ml-0"
            }`}
          >
            <Header open={sidebarOpen} setOpen={setSidebarOpen} />
          </div>
        </>
      )}

      {/* Main content */}
      <main
        className={!isAdminRoute ? "p-4 transition-colors duration-300" : ""}
      >
        <Routes>
          {/* Public Routes */}
          <Route path="/signin" element={<Signin />} />
          <Route path="/" element={<Product />} />
          <Route path="/products/:id" element={<ProductPage />} />
          <Route path="/cart" element={<UserCartPage />} />

          {/* User Protected Routes */}
          <Route
            path="/user/*"
            element={
              <ProtectedRoute role="user">
                <UserPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/orders"
            element={
              <ProtectedRoute>
                <UserOrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/orders/:orderId"
            element={
              <ProtectedRoute>
                <UserOrderDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/wishlist"
            element={
              <ProtectedRoute>
                <UserWishlistPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/setting"
            element={
              <ProtectedRoute>
                <UserSettingsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/user/cart"
            element={
              <ProtectedRoute role="user">
                <UserCartPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute role="user">
                <Checkout />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <Admin />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardHome />} />
            <Route path="dashboard" element={<DashboardHome />} />
            <Route path="products" element={<AdminProductManagement />} />
            <Route path="users" element={<AdminuserPage />} />
            <Route path="carts" element={<AdminCartPage />} />
            <Route path="revenue" element={<RevenueCard />} />
            <Route path="active-users" element={<ActiveUsers />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* Error Pages */}
          <Route path="/server-error" element={<ServerError />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Footer only for non-admin routes */}
      {!isAdminRoute && <Footer />}
    </div>
  );
}

export default App;
