// import { useEffect, useState, useMemo } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import {
//   BiBarChart,
//   BiShoppingBag,
//   BiUser,
//   BiCube,
//   BiCart,
//   BiCog,
// } from "react-icons/bi";
// import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts";

// import {
//   fetchUsers,
//   fetchOrders,
//   fetchRevenue,
// } from "../Slices/dashBoardSlice";
// import SearchBar from "../Admin component/AdminSearchBar";

// // Single dashboard card
// function DashboardCard({ card, onClick, loading, isDisabled }) {
//   return (
//     <div
//       onClick={isDisabled ? undefined : onClick}
//       className={`transition-transform transform hover:-translate-y-1 hover:scale-[1.02] hover:shadow-xl
//                   bg-white rounded-2xl p-5 shadow-md border border-gray-200 flex flex-col justify-between
//                   ${
//                     isDisabled
//                       ? "cursor-not-allowed opacity-50"
//                       : "cursor-pointer"
//                   }`}
//     >
//       <div className="flex justify-between items-center mb-3">
//         <div>
//           <h3 className="text-gray-900 text-base font-bold">{card.title}</h3>
//           {card.value !== undefined && (
//             <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
//               {loading ? (
//                 <span className="animate-pulse bg-gray-300 rounded w-16 h-7 inline-block"></span>
//               ) : (
//                 card.value || 0
//               )}
//             </p>
//           )}
//           {card.growth !== undefined && (
//             <p
//               className={`text-sm mt-1 font-semibold ${
//                 card.growth >= 0 ? "text-green-600" : "text-red-600"
//               }`}
//             >
//               {card.growth >= 0 ? "▲" : "▼"} {card.growth || 0}% vs last month
//             </p>
//           )}
//         </div>
//         <div
//           className={`${card.bg} p-3 rounded-xl flex items-center justify-center shadow-inner`}
//         >
//           {card.icon}
//         </div>
//       </div>

//       {card.trend && (
//         <ResponsiveContainer width="100%" height={60}>
//           <LineChart data={card.trend.map((v) => ({ value: v }))}>
//             <Line
//               type="monotone"
//               dataKey="value"
//               stroke="#7C3AED"
//               strokeWidth={2}
//               dot={false}
//             />
//             <Tooltip
//               contentStyle={{
//                 backgroundColor: "#fff",
//                 border: "1px solid #e5e7eb",
//                 borderRadius: "8px",
//                 fontSize: "12px",
//                 padding: "4px 8px",
//               }}
//             />
//           </LineChart>
//         </ResponsiveContainer>
//       )}
//     </div>
//   );
// }

// export default function DashboardHome({ sidebarOpen }) {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { users, orders, revenue, loading, error } = useSelector(
//     (state) => state.dashboard
//   );
//   const { user } = useSelector((state) => state.signinuser);

//   const storedUser = localStorage.getItem("user");
//   const currentUser = user || (storedUser ? JSON.parse(storedUser) : null);

//   const [searchQuery, setSearchQuery] = useState("");

//   useEffect(() => {
//     dispatch(fetchUsers());
//     dispatch(fetchOrders());
//     dispatch(fetchRevenue());
//   }, [dispatch]);

//   const goToPage = (page, adminOnly = false) => {
//     if (adminOnly && currentUser?.role !== "admin") {
//       alert("You are not authorized to view this page!");
//       return;
//     }
//     navigate(page);
//   };

//   const cards = useMemo(
//     () => [
//       {
//         title: "Total Users",
//         value: users,
//         icon: <BiUser className="text-blue-700 w-6 h-6" />,
//         bg: "bg-blue-200",
//         page: "/admin/users",
//       },
//       {
//         title: "Orders Today",
//         value: orders,
//         icon: <BiShoppingBag className="text-green-700 w-6 h-6" />,
//         bg: "bg-green-200",
//         page: "/admin/carts",
//         adminOnly: true,
//       },
//       {
//         title: "Revenue",
//         value: revenue?.totalRevenue,
//         growth: revenue?.growthPercent,
//         icon: <BiBarChart className="text-purple-700 w-6 h-6" />,
//         bg: "bg-purple-200",
//         page: "/admin/revenue",
//         adminOnly: true,
//         trend: revenue?.trend,
//       },
//       {
//         title: "Products",
//         icon: <BiCube className="text-orange-700 w-6 h-6" />,
//         bg: "bg-orange-200",
//         page: "/admin/products",
//       },
//       {
//         title: "Carts",
//         icon: <BiCart className="text-teal-700 w-6 h-6" />,
//         bg: "bg-teal-200",
//         page: "/admin/carts",
//         adminOnly: true,
//       },
//       {
//         title: "Settings",
//         icon: <BiCog className="text-gray-800 w-6 h-6" />,
//         bg: "bg-gray-200",
//         page: "/admin/settings",
//         adminOnly: true,
//       },
//     ],
//     [users, orders, revenue]
//   );

//   const filteredCards = cards.filter((c) => {
//     const query = searchQuery.toLowerCase();
//     return (
//       c.title.toLowerCase().includes(query) ||
//       (c.value !== undefined && String(c.value).includes(query))
//     );
//   });

//   return (
//     <div className="p-4 sm:p-6 bg-gray-50 min-h-screen transition-all duration-300">
//       {/* Header: SearchBar left, Dashboard title right */}
//       <div className="flex items-center justify-between mb-6 w-full">
//         <div className="w-64">
//           <SearchBar
//             value={searchQuery}
//             onChange={setSearchQuery}
//             placeholder="Search metrics..."
//           />
//         </div>
//         <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
//           Dashboard
//         </h1>
//       </div>

//       <p className="text-gray-600 mb-6 text-sm sm:text-base">
//         Here's what's happening with your store today.
//       </p>

//       {error && (
//         <p className="text-red-500 mb-4 text-center text-sm">{error}</p>
//       )}

//       {/* Cards Grid */}
//       <div
//         className={`grid gap-6 transition-all duration-300 ${
//           sidebarOpen
//             ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
//             : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
//         }`}
//       >
//         {filteredCards.length > 0 ? (
//           filteredCards.map((card, idx) => {
//             const isDisabled = card.adminOnly && currentUser?.role !== "admin";
//             return (
//               <DashboardCard
//                 key={idx}
//                 card={card}
//                 onClick={() => goToPage(card.page, card.adminOnly)}
//                 loading={loading}
//                 isDisabled={isDisabled}
//               />
//             );
//           })
//         ) : (
//           <p className="text-center text-gray-500 col-span-full">
//             No metrics found for "{searchQuery}"
//           </p>
//         )}
//       </div>
//     </div>
//   );
// }
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  BiBarChart,
  BiShoppingBag,
  BiUser,
  BiCube,
  BiCart,
  BiCog,
} from "react-icons/bi";
import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts";

import {
  fetchUsers,
  fetchOrders,
  fetchRevenue,
} from "../Slices/dashBoardSlice";
import SearchBar from "../Admin component/AdminSearchBar";

// Single dashboard card
function DashboardCard({ card, onClick, loading, isDisabled }) {
  return (
    <div
      onClick={isDisabled ? undefined : onClick}
      className={`transition-transform transform hover:-translate-y-1 hover:scale-[1.02] hover:shadow-xl 
                  bg-white/90 backdrop-blur-md rounded-2xl p-5 shadow-lg border border-rose-100 flex flex-col justify-between
                  ${
                    isDisabled
                      ? "cursor-not-allowed opacity-50"
                      : "cursor-pointer"
                  }`}
    >
      <div className="flex justify-between items-center mb-3">
        <div>
          <h3 className="text-rose-900 text-base font-bold">{card.title}</h3>

          {card.value !== undefined && (
            <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
              {loading ? (
                <span className="animate-pulse bg-rose-200 rounded w-16 h-7 inline-block"></span>
              ) : (
                card.value || 0
              )}
            </p>
          )}

          {card.growth !== undefined && (
            <p
              className={`text-sm mt-1 font-semibold ${
                card.growth >= 0 ? "text-green-600" : "text-red-500"
              }`}
            >
              {card.growth >= 0 ? "▲" : "▼"} {card.growth || 0}% vs last month
            </p>
          )}
        </div>

        <div
          className={`${card.bg} p-3 rounded-xl flex items-center justify-center shadow-md`}
        >
          {card.icon}
        </div>
      </div>

      {card.trend && (
        <ResponsiveContainer width="100%" height={60}>
          <LineChart data={card.trend.map((v) => ({ value: v }))}>
            <Line
              type="monotone"
              dataKey="value"
              stroke="#E11D48"
              strokeWidth={2}
              dot={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #fecdd3",
                borderRadius: "10px",
                fontSize: "12px",
                padding: "4px 8px",
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default function DashboardHome({ sidebarOpen }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users, orders, revenue, loading, error } = useSelector(
    (state) => state.dashboard,
  );
  const { user } = useSelector((state) => state.signinuser);

  const storedUser = localStorage.getItem("user");
  const currentUser = user || (storedUser ? JSON.parse(storedUser) : null);

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchOrders());
    dispatch(fetchRevenue());
  }, [dispatch]);

  const goToPage = (page, adminOnly = false) => {
    if (adminOnly && currentUser?.role !== "admin") {
      alert("You are not authorized to view this page!");
      return;
    }
    navigate(page);
  };

  // 🎨 THEMED CARDS ONLY (no logic change)
  const cards = useMemo(
    () => [
      {
        title: "Total Users",
        value: users,
        icon: <BiUser className="text-rose-600 w-6 h-6" />,
        bg: "bg-rose-100",
        page: "/admin/users",
      },
      {
        title: "Orders Today",
        value: orders,
        icon: <BiShoppingBag className="text-pink-600 w-6 h-6" />,
        bg: "bg-pink-100",
        page: "/admin/carts",
        adminOnly: true,
      },
      {
        title: "Revenue",
        value: revenue?.totalRevenue,
        growth: revenue?.growthPercent,
        icon: <BiBarChart className="text-fuchsia-600 w-6 h-6" />,
        bg: "bg-fuchsia-100",
        page: "/admin/revenue",
        adminOnly: true,
        trend: revenue?.trend,
      },
      {
        title: "Products",
        icon: <BiCube className="text-rose-700 w-6 h-6" />,
        bg: "bg-rose-200",
        page: "/admin/products",
      },
      {
        title: "Carts",
        icon: <BiCart className="text-pink-700 w-6 h-6" />,
        bg: "bg-pink-200",
        page: "/admin/carts",
        adminOnly: true,
      },
      {
        title: "Settings",
        icon: <BiCog className="text-gray-700 w-6 h-6" />,
        bg: "bg-rose-50",
        page: "/admin/settings",
        adminOnly: true,
      },
    ],
    [users, orders, revenue],
  );

  const filteredCards = cards.filter((c) => {
    const query = searchQuery.toLowerCase();
    return (
      c.title.toLowerCase().includes(query) ||
      (c.value !== undefined && String(c.value).includes(query))
    );
  });

  return (
    <div className="p-4 sm:p-6 bg-linear-to-br from-rose-50 via-pink-50 to-fuchsia-50 min-h-screen transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 w-full">
        <div className="w-64">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search metrics..."
          />
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-rose-900">
          Dashboard
        </h1>
      </div>

      <p className="text-rose-700 mb-6 text-sm sm:text-base">
        Here's what's happening with your store today.
      </p>

      {error && (
        <p className="text-red-500 mb-4 text-center text-sm">{error}</p>
      )}

      {/* Cards Grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {filteredCards.length > 0 ? (
          filteredCards.map((card, idx) => {
            const isDisabled = card.adminOnly && currentUser?.role !== "admin";

            return (
              <DashboardCard
                key={idx}
                card={card}
                onClick={() => goToPage(card.page, card.adminOnly)}
                loading={loading}
                isDisabled={isDisabled}
              />
            );
          })
        ) : (
          <p className="text-center text-rose-500 col-span-full">
            No metrics found for "{searchQuery}"
          </p>
        )}
      </div>
    </div>
  );
}
