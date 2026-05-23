// import { Routes, Route, useLocation } from "react-router-dom";
// import { useState, useEffect } from "react";
// import { useSelector } from "react-redux";

// import Sidebar from "./Component/Sidebar";
// import Header from "./Component/Header";
// import Footer from "./Component/Footer";

// import Admin from "./Admin/Admin";
// import ProtectedRoute from "./Admin/Protectedcomponent";

// import Product from "./Pages/Product";
// import ProductPage from "./Pages/ProductPage";
// import UserOrderPage from "./Pages/UserOrder";
// import UserCartPage from "./Pages/Cart";
// import Checkout from "./Component/CheckoutPage";
// import Signin from "./Pages/Sign";
// import DashboardHome from "./Admin/Dashboard";
// import NotFound from "./Component/Errorpage";
// import ServerError from "./Component/ServerError";

// import AdminuserPage from "./Admin/Userpage";
// import AdminCartPage from "./Admin/CartPage";
// import AdminProductManagement from "./Admin/ProductManagment";
// import RevenueCard from "./Admin component/RevenueComponent";
// import ActiveUsers from "./Admin component/ActiveUserComponent";
// import AdminSettings from "./AdminSettinngComponent/AdminSetting";
// import AdminOrdersPage from "./Admin/AdminOrderspage";

// import UserPage from "./Pages/User";
// import UserOrdersPage from "./Pages/UserOrder";
// import UserWishlistPage from "./Pages/WishList";
// import UserSettingsPage from "./Pages/UserSettingPage";
// import UserOrderDetailPage from "./Pages/UserOrderDetailPage";

// function App() {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const { pathname } = useLocation();

//   const isAdminRoute = pathname.startsWith("/admin");
//   const theme = useSelector((state) => state.theme.theme);

//   useEffect(() => {
//     const html = document.documentElement;
//     if (theme === "dark") html.classList.add("dark");
//     else html.classList.remove("dark");
//   }, [theme]);

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900 relative overflow-x-hidden text-gray-900 dark:text-gray-200 transition-colors duration-300">
//       {/* Sidebar + Header only for non-admin routes */}
//       {!isAdminRoute && (
//         <>
//           <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

//           <div
//             className={`transition-all duration-300 ease ${
//               sidebarOpen ? "ml-64" : "ml-0"
//             }`}
//           >
//             <Header open={sidebarOpen} setOpen={setSidebarOpen} />
//           </div>
//         </>
//       )}

//       {/* Main content */}
//       <main
//         className={!isAdminRoute ? "p-4 transition-colors duration-300" : ""}
//       >
//         <Routes>
//           {/* Public Routes */}
//           <Route path="/signin" element={<Signin />} />
//           <Route path="/" element={<Product />} />
//           <Route path="/products/:id" element={<ProductPage />} />
//           <Route path="/cart" element={<UserCartPage />} />

//           {/* User Protected Routes */}
//           <Route
//             path="/user/*"
//             element={
//               <ProtectedRoute role="user">
//                 <UserPage />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/user/orders"
//             element={
//               <ProtectedRoute>
//                 <UserOrdersPage />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/user/orders/:orderId"
//             element={
//               <ProtectedRoute>
//                 <UserOrderDetailPage />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/user/wishlist"
//             element={
//               <ProtectedRoute>
//                 <UserWishlistPage />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/user/setting"
//             element={
//               <ProtectedRoute>
//                 <UserSettingsPage />
//               </ProtectedRoute>
//             }
//           />

//           <Route
//             path="/user/cart"
//             element={
//               <ProtectedRoute role="user">
//                 <UserCartPage />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/checkout"
//             element={
//               <ProtectedRoute role="user">
//                 <Checkout />
//               </ProtectedRoute>
//             }
//           />

//           {/* Admin Routes */}
//           <Route
//             path="/admin"
//             element={
//               <ProtectedRoute role="admin">
//                 <Admin />
//               </ProtectedRoute>
//             }
//           >
//             <Route index element={<DashboardHome />} />
//             <Route path="dashboard" element={<DashboardHome />} />
//             <Route path="products" element={<AdminProductManagement />} />
//             <Route path="users" element={<AdminuserPage />} />
//             <Route path="carts" element={<AdminCartPage />} />
//             <Route path="revenue" element={<RevenueCard />} />
//             <Route path="active-users" element={<ActiveUsers />} />
//             <Route path="orders" element={<AdminOrdersPage />} />
//             <Route path="settings" element={<AdminSettings />} />
//           </Route>

//           {/* Error Pages */}
//           <Route path="/server-error" element={<ServerError />} />
//           <Route path="*" element={<NotFound />} />
//         </Routes>
//       </main>

//       {/* Footer only for non-admin routes */}
//       {!isAdminRoute && <Footer />}
//     </div>
//   );
// }

// export default App;
import { Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import Sidebar from "./Component/Sidebar";
import Header from "./Component/Header";
import Footer from "./Component/Footer";

import ProtectedRoute from "./Admin/Protectedcomponent";

/* ================= PUBLIC PAGES ================= */
import Product from "./Pages/Product";
import ProductPage from "./Pages/ProductPage";
import UserCartPage from "./Pages/Cart";
import Checkout from "./Component/CheckoutPage";
import Signin from "./Pages/Sign";
import NotFound from "./Component/Errorpage";
import ServerError from "./Component/ServerError";

/* ================= ADMIN ================= */
import Admin from "./Admin/Admin";
import DashboardHome from "./Admin/Dashboard";
import AdminUserPage from "./Admin/Userpage";
import AdminCartPage from "./Admin/CartPage";
import AdminProductManagement from "./Admin/ProductManagment";
import RevenueCard from "./Admin component/RevenueComponent";
import ActiveUsers from "./Admin component/ActiveUserComponent";
import AdminSettings from "./AdminSettinngComponent/AdminSetting";
import AdminOrdersPage from "./Admin/AdminOrderspage";

/* ================= USER ================= */
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-200">

      {/* ================= USER LAYOUT ================= */}
      {!isAdminRoute && (
        <>
          <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

          <div
            className={`transition-all duration-300 ${
              sidebarOpen ? "ml-64" : "ml-0"
            }`}
          >
            <Header open={sidebarOpen} setOpen={setSidebarOpen} />
          </div>
        </>
      )}

      {/* ================= MAIN CONTENT ================= */}
      <main className={!isAdminRoute ? "p-4" : ""}>
        <Routes>

          {/* ================= PUBLIC ROUTES ================= */}
          <Route path="/signin" element={<Signin />} />
          <Route path="/" element={<Product />} />
          <Route path="/products/:id" element={<ProductPage />} />
          <Route path="/cart" element={<UserCartPage />} />

          {/* ================= USER ROUTES ================= */}
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

          {/* ================= ADMIN ROUTES (FIXED) ================= */}
          {/*
            KEY FIX:
            1. path="/admin" (NOT "/admin/*")
            2. All child routes are NESTED inside this Route
            3. <Outlet /> in Admin.jsx will now render these child components
          */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <Admin />
              </ProtectedRoute>
            }
          >
            {/* Default: /admin → DashboardHome */}
            <Route index element={<DashboardHome />} />

            {/* /admin/dashboard */}
            <Route path="dashboard" element={<DashboardHome />} />

            {/* /admin/products */}
            <Route path="products" element={<AdminProductManagement />} />

            {/* /admin/users */}
            <Route path="users" element={<AdminUserPage />} />

            {/* /admin/carts */}
            <Route path="carts" element={<AdminCartPage />} />

            {/* /admin/revenue */}
            <Route path="revenue" element={<RevenueCard />} />

            {/* /admin/active-users */}
            <Route path="active-users" element={<ActiveUsers />} />

            {/* /admin/orders */}
            <Route path="orders" element={<AdminOrdersPage />} />

            {/* /admin/settings */}
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* ================= ERROR ROUTES ================= */}
          <Route path="/server-error" element={<ServerError />} />
          <Route path="*" element={<NotFound />} />

        </Routes>
      </main>

      {/* ================= FOOTER ================= */}
      {!isAdminRoute && <Footer />}
    </div>
  );
}

export default App;