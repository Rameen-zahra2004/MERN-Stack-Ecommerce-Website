import { Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import Sidebar from "./Component/Sidebar";
import Header from "./Component/Header";
import Footer from "./Component/Footer";

import {
  ProtectedRoute,
  ProtectedAdminRoute,
} from "./Admin/Protectedcomponent";
/* ── Public Pages ─────────────────────────────────────── */
import Product from "./Pages/Product";
import ProductPage from "./Pages/ProductPage";
import UserCartPage from "./Pages/Cart";
import Checkout from "./Component/CheckoutPage";
import Signin from "./Pages/Sign";
import NotFound from "./Component/Errorpage";
import ServerError from "./Component/ServerError";

/* ── Admin Pages ──────────────────────────────────────── */
import AdminLogin from "./Admin/AdminLogin";
import Admin from "./Admin/Admin";
import DashboardHome from "./Admin/Dashboard";
import AdminUserPage from "./Admin/Userpage";
import AdminCartPage from "./Admin/CartPage";
import AdminProductManagement from "./Admin/ProductManagment";
import RevenueCard from "./Admin component/RevenueComponent";
import ActiveUsers from "./Admin component/ActiveUserComponent";
import AdminSettings from "./AdminSettinngComponent/AdminSetting";
import AdminOrdersPage from "./Admin/AdminOrderspage";

/* ── User Pages ───────────────────────────────────────── */
import UserPage from "./Pages/User";
import UserOrdersPage from "./Pages/UserOrder";
import UserWishlistPage from "./Pages/WishList";
import UserSettingsPage from "./Pages/UserSettingPage";
import UserOrderDetailPage from "./Pages/UserOrderDetailPage";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();
  const theme = useSelector((state) => state.theme.theme);

  const isAdminRoute = pathname.startsWith("/admin");

  useEffect(() => {
    const html = document.documentElement;
    if (theme === "dark") html.classList.add("dark");
    else html.classList.remove("dark");
  }, [theme]);

  return (
    <div className="min-h-screen bg-linear-to-br from-[#fff1f7] via-[#fff8fb] to-[#ffe8f1] dark:bg-gray-900 text-gray-900 dark:text-gray-200">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-pink-300/20 blur-3xl rounded-full" />
        <div className="absolute top-1/2 right-0 w-md h-112 bg-rose-300/20 blur-3xl rounded-full" />
        <div className="absolute bottom-0 left-1/3 w-120 h-120 bg-pink-200/20 blur-3xl rounded-full" />
      </div>

      {/* User layout shell (sidebar + header) */}
      {!isAdminRoute && (
        <>
          <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
          <div
            className={`transition-all duration-300 relative z-10 ${sidebarOpen ? "ml-64" : "ml-0"}`}
          >
            <Header open={sidebarOpen} setOpen={setSidebarOpen} />
          </div>
        </>
      )}

      {/* Main content */}
      <main className={`relative z-10 ${!isAdminRoute ? "p-4" : ""}`}>
        <Routes>
          {/* ── PUBLIC ──────────────────────────────────── */}
          <Route path="/" element={<Product />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/products/:id" element={<ProductPage />} />
          <Route path="/cart" element={<UserCartPage />} />

          {/* ── USER (protected) ────────────────────────── */}
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
              <ProtectedRoute role="user">
                <UserOrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/orders/:orderId"
            element={
              <ProtectedRoute role="user">
                <UserOrderDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/wishlist"
            element={
              <ProtectedRoute role="user">
                <UserWishlistPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/setting"
            element={
              <ProtectedRoute role="user">
                <UserSettingsPage />
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

          {/* ── ADMIN LOGIN (public) ─────────────────────── */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* ── ADMIN (protected) ───────────────────────── */}
          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <Admin />
              </ProtectedAdminRoute>
            }
          >
            <Route index element={<DashboardHome />} />
            <Route path="dashboard" element={<DashboardHome />} />
            <Route path="products" element={<AdminProductManagement />} />
            <Route path="users" element={<AdminUserPage />} />
            <Route path="carts" element={<AdminCartPage />} />
            <Route path="revenue" element={<RevenueCard />} />
            <Route path="active-users" element={<ActiveUsers />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* ── ERRORS ──────────────────────────────────── */}
          <Route path="/server-error" element={<ServerError />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {!isAdminRoute && <Footer />}
    </div>
  );
}

export default App;
