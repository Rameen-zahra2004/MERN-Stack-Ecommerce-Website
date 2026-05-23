// import { useEffect, useState, useMemo, useCallback } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchUsers,
//   deleteUser,
//   updateUserStatus,
// } from "../AdminSlices/userSlice";
// import SearchBar from "../Admin component/AdminSearchBar"; // keep your existing search bar
// import { FiTrash2, FiSlash, FiChevronDown, FiChevronUp } from "react-icons/fi";

// /* ---------- Small reusable components (inline) ---------- */

// // Simple accessible modal (confirm)
// function ConfirmModal({
//   open,
//   title,
//   message,
//   onCancel,
//   onConfirm,
//   processing,
// }) {
//   if (!open) return null;
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//       <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
//       <div className="relative z-10 w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden">
//         <div className="p-4 border-b">
//           <h3 className="text-lg font-semibold">{title}</h3>
//         </div>
//         <div className="p-4">
//           <p className="text-sm text-gray-700">{message}</p>
//         </div>
//         <div className="p-4 flex justify-end gap-2 border-t">
//           <button
//             onClick={onCancel}
//             className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200"
//             disabled={processing}
//           >
//             Cancel
//           </button>
//           <button
//             onClick={onConfirm}
//             className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 flex items-center gap-2"
//             disabled={processing}
//           >
//             {processing ? "Processing..." : "Confirm"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // Small skeleton row for loading state
// function SkeletonRow() {
//   return (
//     <tr className="animate-pulse">
//       <td className="p-3">
//         <div className="h-4 bg-gray-200 rounded w-6" />
//       </td>
//       <td className="p-3">
//         <div className="h-4 bg-gray-200 rounded w-32" />
//       </td>
//       <td className="p-3">
//         <div className="h-4 bg-gray-200 rounded w-44" />
//       </td>
//       <td className="p-3">
//         <div className="h-4 bg-gray-200 rounded w-24" />
//       </td>
//       <td className="p-3">
//         <div className="h-4 bg-gray-200 rounded w-20" />
//       </td>
//       <td className="p-3">
//         <div className="h-4 bg-gray-200 rounded w-32" />
//       </td>
//     </tr>
//   );
// }

// // Simple toggle-like button (Block/Unblock) with better UX
// function StatusButton({ status, onClick, disabled }) {
//   const isActive = status === "active";
//   return (
//     <button
//       onClick={onClick}
//       disabled={disabled}
//       className={`flex items-center gap-2 px-3 py-1 rounded-lg text-white font-medium transition ${
//         isActive
//           ? "bg-yellow-500 hover:bg-yellow-600"
//           : "bg-green-500 hover:bg-green-600"
//       }`}
//       aria-pressed={!isActive}
//       title={isActive ? "Block user" : "Unblock user"}
//     >
//       <FiSlash />
//       {isActive ? "Block" : "Unblock"}
//     </button>
//   );
// }

// // Pagination controls
// function Pagination({ page, totalPages, onPrev, onNext, onGoTo }) {
//   if (totalPages <= 1) return null;
//   const showPages = [];
//   // show limited set of pages if many
//   const start = Math.max(1, page - 2);
//   const end = Math.min(totalPages, page + 2);
//   for (let i = start; i <= end; i++) showPages.push(i);

//   return (
//     <div className="mt-4 flex items-center justify-between gap-4">
//       <div className="text-sm text-gray-600">
//         Page {page} of {totalPages}
//       </div>
//       <div className="flex items-center gap-2">
//         <button
//           onClick={onPrev}
//           disabled={page === 1}
//           className="px-3 py-1 rounded bg-white border hover:bg-gray-50 disabled:opacity-50"
//         >
//           Prev
//         </button>

//         {start > 1 && (
//           <>
//             <button
//               onClick={() => onGoTo(1)}
//               className="px-3 py-1 rounded bg-white border hover:bg-gray-50"
//             >
//               1
//             </button>
//             {start > 2 && <span className="px-2">…</span>}
//           </>
//         )}

//         {showPages.map((p) => (
//           <button
//             key={p}
//             onClick={() => onGoTo(p)}
//             className={`px-3 py-1 rounded border ${
//               p === page
//                 ? "bg-blue-600 text-white"
//                 : "bg-white hover:bg-gray-50"
//             }`}
//           >
//             {p}
//           </button>
//         ))}

//         {end < totalPages && (
//           <>
//             {end < totalPages - 1 && <span className="px-2">…</span>}
//             <button
//               onClick={() => onGoTo(totalPages)}
//               className="px-3 py-1 rounded bg-white border hover:bg-gray-50"
//             >
//               {totalPages}
//             </button>
//           </>
//         )}

//         <button
//           onClick={onNext}
//           disabled={page === totalPages}
//           className="px-3 py-1 rounded bg-white border hover:bg-gray-50 disabled:opacity-50"
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// }

// /* ---------- Main Admin Users Page ---------- */

// export default function AdminUsersPage() {
//   const dispatch = useDispatch();
//   const {
//     items: users = [],
//     loading,
//     error,
//   } = useSelector((state) => state.user || {});

//   // UI states
//   const [searchQuery, setSearchQuery] = useState("");
//   const [perPage] = useState(10); // fixed as you requested
//   const [page, setPage] = useState(1);
//   const [sortBy, setSortBy] = useState("username"); // username|email|role|status
//   const [sortDir, setSortDir] = useState("asc"); // asc | desc

//   // Modal state for delete
//   const [confirmOpen, setConfirmOpen] = useState(false);
//   const [selectedForDelete, setSelectedForDelete] = useState(null);
//   const [processing, setProcessing] = useState(false);

//   useEffect(() => {
//     dispatch(fetchUsers());
//   }, [dispatch]);

//   // normalize accessor: prefer username, fallback to name
//   const normalizeUser = useCallback((u) => {
//     return {
//       _raw: u,
//       id: u.id ?? u._id,
//       username: u.username ?? u.name ?? "Unknown",
//       email: u.email ?? "—",
//       role: u.role ?? "user",
//       status: u.status ?? "active",
//     };
//   }, []);

//   // Memoized normalized list
//   const normalized = useMemo(
//     () => users.map(normalizeUser),
//     [users, normalizeUser]
//   );

//   // Filtered by searchQuery
//   const filtered = useMemo(() => {
//     const q = (searchQuery || "").trim().toLowerCase();
//     if (!q) return normalized;
//     return normalized.filter((u) => {
//       return (
//         (u.username || "").toLowerCase().includes(q) ||
//         (u.email || "").toLowerCase().includes(q) ||
//         (u.role || "").toLowerCase().includes(q)
//       );
//     });
//   }, [normalized, searchQuery]);

//   // Sorted list
//   const sorted = useMemo(() => {
//     const arr = [...filtered];
//     arr.sort((a, b) => {
//       const A = (a[sortBy] || "").toString().toLowerCase();
//       const B = (b[sortBy] || "").toString().toLowerCase();
//       if (A < B) return sortDir === "asc" ? -1 : 1;
//       if (A > B) return sortDir === "asc" ? 1 : -1;
//       return 0;
//     });
//     return arr;
//   }, [filtered, sortBy, sortDir]);

//   // Pagination
//   const totalPages = Math.max(1, Math.ceil(sorted.length / perPage));
//   useEffect(() => {
//     // keep page in valid range when list changes
//     if (page > totalPages) setPage(totalPages);
//   }, [totalPages, page]);

//   const paginated = useMemo(() => {
//     const start = (page - 1) * perPage;
//     return sorted.slice(start, start + perPage);
//   }, [sorted, page, perPage]);

//   // Sorting toggle
//   const toggleSort = (field) => {
//     if (sortBy === field) {
//       setSortDir((d) => (d === "asc" ? "desc" : "asc"));
//     } else {
//       setSortBy(field);
//       setSortDir("asc");
//     }
//   };

//   // Delete flow
//   const confirmDelete = (user) => {
//     setSelectedForDelete(user);
//     setConfirmOpen(true);
//   };

//   const doDelete = async () => {
//     if (!selectedForDelete) return;
//     setProcessing(true);
//     try {
//       // dispatch deleteUser and let slice update the store
//       await dispatch(deleteUser(selectedForDelete.id)).unwrap();
//       // show success-ish feedback could be added (toast)
//       // ensure fetch stays in sync (optional)
//       // await dispatch(fetchUsers());
//     } catch (err) {
//       // handle error (toast/log)
//       console.error("Delete error:", err);
//     } finally {
//       setProcessing(false);
//       setConfirmOpen(false);
//       setSelectedForDelete(null);
//     }
//   };

//   // Toggle status (block/unblock)
//   const toggleStatus = async (u) => {
//     const newStatus = u.status === "active" ? "blocked" : "active";
//     try {
//       await dispatch(
//         updateUserStatus({ id: u.id, status: newStatus })
//       ).unwrap();
//       // optional: we could update local state, but slice should update on fulfilled
//     } catch (err) {
//       console.error("Status update error:", err);
//     }
//   };

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       {/* Header + Search */}
//       <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
//         <h1 className="text-3xl font-bold text-gray-800">
//           👥 Registered Users
//         </h1>

//         <div className="w-full sm:w-80 flex items-center gap-3">
//           <SearchBar
//             value={searchQuery}
//             onChange={(v) => {
//               setSearchQuery(v);
//               setPage(1);
//             }}
//             placeholder="Search users..."
//           />
//         </div>
//       </div>

//       {/* Controls row */}
//       <div className="flex items-center justify-between gap-4 mb-4">
//         <div className="text-sm text-gray-600">
//           Showing <span className="font-semibold">{sorted.length}</span> result
//           {sorted.length !== 1 ? "s" : ""}
//         </div>

//         <div className="flex items-center gap-3">
//           <div className="text-sm text-gray-600">
//             Per page: <span className="font-semibold ml-1">{perPage}</span>
//           </div>
//           <div className="flex items-center gap-2 bg-white border rounded p-1 shadow-sm">
//             <button
//               onClick={() => {
//                 setPage((p) => Math.max(1, p - 1));
//               }}
//               disabled={page === 1}
//               className="px-2 py-1 rounded disabled:opacity-50"
//             >
//               Prev
//             </button>
//             <div className="px-3 py-1 text-sm">Page {page}</div>
//             <button
//               onClick={() => {
//                 setPage((p) => Math.min(totalPages, p + 1));
//               }}
//               disabled={page === totalPages}
//               className="px-2 py-1 rounded disabled:opacity-50"
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Loading / Error */}
//       {loading && (
//         <div className="bg-white rounded-lg shadow p-4">
//           <table className="w-full">
//             <thead>
//               <tr>
//                 <th className="p-3 text-left">#</th>
//                 <th className="p-3 text-left">Username</th>
//                 <th className="p-3 text-left">Email</th>
//                 <th className="p-3 text-left">Role</th>
//                 <th className="p-3 text-left">Status</th>
//                 <th className="p-3 text-left">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {Array.from({ length: perPage }).map((_, i) => (
//                 <SkeletonRow key={i} />
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {error && <p className="text-center text-red-500 py-4">Error: {error}</p>}

//       {/* Users Table */}
//       {!loading && (
//         <>
//           {sorted.length === 0 ? (
//             <p className="text-center text-gray-500 mt-6">No users found.</p>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full border border-gray-200 rounded-lg overflow-hidden bg-white shadow-md">
//                 <thead className="bg-gray-100 text-gray-700">
//                   <tr>
//                     <th className="p-3 text-left">#</th>

//                     <th
//                       className="p-3 text-left cursor-pointer select-none"
//                       onClick={() => toggleSort("username")}
//                     >
//                       <div className="flex items-center gap-2">
//                         Username
//                         {sortBy === "username" ? (
//                           sortDir === "asc" ? (
//                             <FiChevronUp />
//                           ) : (
//                             <FiChevronDown />
//                           )
//                         ) : null}
//                       </div>
//                     </th>

//                     <th
//                       className="p-3 text-left cursor-pointer select-none"
//                       onClick={() => toggleSort("email")}
//                     >
//                       <div className="flex items-center gap-2">
//                         Email
//                         {sortBy === "email" ? (
//                           sortDir === "asc" ? (
//                             <FiChevronUp />
//                           ) : (
//                             <FiChevronDown />
//                           )
//                         ) : null}
//                       </div>
//                     </th>

//                     <th
//                       className="p-3 text-left cursor-pointer select-none"
//                       onClick={() => toggleSort("role")}
//                     >
//                       <div className="flex items-center gap-2">
//                         Role
//                         {sortBy === "role" ? (
//                           sortDir === "asc" ? (
//                             <FiChevronUp />
//                           ) : (
//                             <FiChevronDown />
//                           )
//                         ) : null}
//                       </div>
//                     </th>

//                     <th
//                       className="p-3 text-left cursor-pointer select-none"
//                       onClick={() => toggleSort("status")}
//                     >
//                       <div className="flex items-center gap-2">
//                         Status
//                         {sortBy === "status" ? (
//                           sortDir === "asc" ? (
//                             <FiChevronUp />
//                           ) : (
//                             <FiChevronDown />
//                           )
//                         ) : null}
//                       </div>
//                     </th>

//                     <th className="p-3 text-left">Actions</th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {paginated.map((u, idx) => (
//                     <tr
//                       key={u.id ?? `user-${idx}`}
//                       className="border-b hover:bg-gray-50 transition duration-150"
//                     >
//                       <td className="p-3 text-gray-500">
//                         {(page - 1) * perPage + idx + 1}
//                       </td>
//                       <td className="p-3 font-medium">{u.username}</td>
//                       <td className="p-3">{u.email}</td>
//                       <td className="p-3 capitalize text-blue-600">{u.role}</td>
//                       <td className="p-3">
//                         <span
//                           className={`px-2 py-1 rounded-full text-sm font-semibold ${
//                             u.status === "active"
//                               ? "bg-green-100 text-green-700"
//                               : "bg-red-100 text-red-700"
//                           }`}
//                         >
//                           {u.status}
//                         </span>
//                       </td>
//                       <td className="p-3">
//                         <div className="flex items-center justify-start gap-3">
//                           <StatusButton
//                             status={u.status}
//                             onClick={() => toggleStatus(u)}
//                           />
//                           <button
//                             onClick={() => confirmDelete(u)}
//                             className="flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition font-medium"
//                           >
//                             <FiTrash2 />
//                             Delete
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}

//           {/* Pagination */}
//           <Pagination
//             page={page}
//             totalPages={totalPages}
//             onPrev={() => setPage((p) => Math.max(1, p - 1))}
//             onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
//             onGoTo={(p) => setPage(p)}
//           />
//         </>
//       )}

//       {/* Confirm delete modal */}
//       <ConfirmModal
//         open={confirmOpen}
//         title="Delete user"
//         message={`Are you sure you want to permanently delete "${
//           selectedForDelete?.username ?? selectedForDelete?.email
//         }"? This cannot be undone.`}
//         onCancel={() => {
//           if (!processing) setConfirmOpen(false);
//         }}
//         onConfirm={doDelete}
//         processing={processing}
//       />
//     </div>
//   );
// }
import { useEffect, useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUsers,
  deleteUser,
  updateUserStatus,
} from "../AdminSlices/userSlice";
import SearchBar from "../Admin component/AdminSearchBar";
import { FiTrash2, FiSlash, FiChevronDown, FiChevronUp } from "react-icons/fi";

/* ---------- Small reusable components (inline) ---------- */

function ConfirmModal({
  open,
  title,
  message,
  onCancel,
  onConfirm,
  processing,
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative z-10 w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <div className="p-4">
          <p className="text-sm text-gray-700">{message}</p>
        </div>
        <div className="p-4 flex justify-end gap-2 border-t">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200"
            disabled={processing}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 flex items-center gap-2"
            disabled={processing}
          >
            {processing ? "Processing..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      <td className="p-3">
        <div className="h-4 bg-gray-200 rounded w-6" />
      </td>
      <td className="p-3">
        <div className="h-4 bg-gray-200 rounded w-32" />
      </td>
      <td className="p-3">
        <div className="h-4 bg-gray-200 rounded w-44" />
      </td>
      <td className="p-3">
        <div className="h-4 bg-gray-200 rounded w-24" />
      </td>
      <td className="p-3">
        <div className="h-4 bg-gray-200 rounded w-20" />
      </td>
      <td className="p-3">
        <div className="h-4 bg-gray-200 rounded w-32" />
      </td>
    </tr>
  );
}

function StatusButton({ status, onClick, disabled }) {
  const isActive = status === "active";
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-2 px-3 py-1 rounded-lg text-white font-medium transition ${
        isActive
          ? "bg-yellow-500 hover:bg-yellow-600"
          : "bg-green-500 hover:bg-green-600"
      }`}
      aria-pressed={!isActive}
      title={isActive ? "Block user" : "Unblock user"}
    >
      <FiSlash />
      {isActive ? "Block" : "Unblock"}
    </button>
  );
}

function Pagination({ page, totalPages, onPrev, onNext, onGoTo }) {
  if (totalPages <= 1) return null;
  const showPages = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, page + 2);
  for (let i = start; i <= end; i++) showPages.push(i);

  return (
    <div className="mt-4 flex items-center justify-between gap-4">
      <div className="text-sm text-gray-600">
        Page {page} of {totalPages}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onPrev}
          disabled={page === 1}
          className="px-3 py-1 rounded bg-white border hover:bg-gray-50 disabled:opacity-50"
        >
          Prev
        </button>

        {start > 1 && (
          <>
            <button
              onClick={() => onGoTo(1)}
              className="px-3 py-1 rounded bg-white border hover:bg-gray-50"
            >
              1
            </button>
            {start > 2 && <span className="px-2">…</span>}
          </>
        )}

        {showPages.map((p) => (
          <button
            key={p}
            onClick={() => onGoTo(p)}
            className={`px-3 py-1 rounded border ${
              p === page
                ? "bg-blue-600 text-white"
                : "bg-white hover:bg-gray-50"
            }`}
          >
            {p}
          </button>
        ))}

        {end < totalPages && (
          <>
            {end < totalPages - 1 && <span className="px-2">…</span>}
            <button
              onClick={() => onGoTo(totalPages)}
              className="px-3 py-1 rounded bg-white border hover:bg-gray-50"
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={onNext}
          disabled={page === totalPages}
          className="px-3 py-1 rounded bg-white border hover:bg-gray-50 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

/* ---------- Main Admin Users Page ---------- */

export default function AdminUsersPage() {
  const dispatch = useDispatch();

  // ✅ FIXED: removed "|| {}" — state.user always exists in store
  const { items: users, loading, error } = useSelector((state) => state.user);

  // ✅ FIXED: safe array fallback in case items is undefined/null
  const safeUsers = Array.isArray(users) ? users : [];

  const [searchQuery, setSearchQuery] = useState("");
  const [perPage] = useState(10);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("username");
  const [sortDir, setSortDir] = useState("asc");

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedForDelete, setSelectedForDelete] = useState(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const normalizeUser = useCallback((u) => {
    return {
      _raw: u,
      id: u.id ?? u._id,
      username: u.username ?? u.name ?? "Unknown",
      email: u.email ?? "—",
      role: u.role ?? "user",
      status: u.status ?? "active",
    };
  }, []);

  // ✅ FIXED: using safeUsers instead of users
  const normalized = useMemo(
    () => safeUsers.map(normalizeUser),
    [safeUsers, normalizeUser]
  );

  const filtered = useMemo(() => {
    const q = (searchQuery || "").trim().toLowerCase();
    if (!q) return normalized;
    return normalized.filter((u) => {
      return (
        (u.username || "").toLowerCase().includes(q) ||
        (u.email || "").toLowerCase().includes(q) ||
        (u.role || "").toLowerCase().includes(q)
      );
    });
  }, [normalized, searchQuery]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      const A = (a[sortBy] || "").toString().toLowerCase();
      const B = (b[sortBy] || "").toString().toLowerCase();
      if (A < B) return sortDir === "asc" ? -1 : 1;
      if (A > B) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return arr;
  }, [filtered, sortBy, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / perPage));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  const paginated = useMemo(() => {
    const start = (page - 1) * perPage;
    return sorted.slice(start, start + perPage);
  }, [sorted, page, perPage]);

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortDir("asc");
    }
  };

  const confirmDelete = (user) => {
    setSelectedForDelete(user);
    setConfirmOpen(true);
  };

  const doDelete = async () => {
    if (!selectedForDelete) return;
    setProcessing(true);
    try {
      await dispatch(deleteUser(selectedForDelete.id)).unwrap();
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setProcessing(false);
      setConfirmOpen(false);
      setSelectedForDelete(null);
    }
  };

  const toggleStatus = async (u) => {
    const newStatus = u.status === "active" ? "blocked" : "active";
    try {
      await dispatch(
        updateUserStatus({ id: u.id, status: newStatus })
      ).unwrap();
    } catch (err) {
      console.error("Status update error:", err);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header + Search */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">
          👥 Registered Users
        </h1>

        <div className="w-full sm:w-80 flex items-center gap-3">
          <SearchBar
            value={searchQuery}
            onChange={(v) => {
              setSearchQuery(v);
              setPage(1);
            }}
            placeholder="Search users..."
          />
        </div>
      </div>

      {/* Controls row */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="text-sm text-gray-600">
          Showing <span className="font-semibold">{sorted.length}</span> result
          {sorted.length !== 1 ? "s" : ""}
        </div>

        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-600">
            Per page: <span className="font-semibold ml-1">{perPage}</span>
          </div>
          <div className="flex items-center gap-2 bg-white border rounded p-1 shadow-sm">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-2 py-1 rounded disabled:opacity-50"
            >
              Prev
            </button>
            <div className="px-3 py-1 text-sm">Page {page}</div>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-2 py-1 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="bg-white rounded-lg shadow p-4">
          <table className="w-full">
            <thead>
              <tr>
                <th className="p-3 text-left">#</th>
                <th className="p-3 text-left">Username</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Role</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: perPage }).map((_, i) => (
                <SkeletonRow key={i} />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {error && (
        <p className="text-center text-red-500 py-4">Error: {error}</p>
      )}

      {/* Users Table */}
      {!loading && (
        <>
          {sorted.length === 0 ? (
            <p className="text-center text-gray-500 mt-6">No users found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 rounded-lg overflow-hidden bg-white shadow-md">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="p-3 text-left">#</th>

                    <th
                      className="p-3 text-left cursor-pointer select-none"
                      onClick={() => toggleSort("username")}
                    >
                      <div className="flex items-center gap-2">
                        Username
                        {sortBy === "username" ? (
                          sortDir === "asc" ? <FiChevronUp /> : <FiChevronDown />
                        ) : null}
                      </div>
                    </th>

                    <th
                      className="p-3 text-left cursor-pointer select-none"
                      onClick={() => toggleSort("email")}
                    >
                      <div className="flex items-center gap-2">
                        Email
                        {sortBy === "email" ? (
                          sortDir === "asc" ? <FiChevronUp /> : <FiChevronDown />
                        ) : null}
                      </div>
                    </th>

                    <th
                      className="p-3 text-left cursor-pointer select-none"
                      onClick={() => toggleSort("role")}
                    >
                      <div className="flex items-center gap-2">
                        Role
                        {sortBy === "role" ? (
                          sortDir === "asc" ? <FiChevronUp /> : <FiChevronDown />
                        ) : null}
                      </div>
                    </th>

                    <th
                      className="p-3 text-left cursor-pointer select-none"
                      onClick={() => toggleSort("status")}
                    >
                      <div className="flex items-center gap-2">
                        Status
                        {sortBy === "status" ? (
                          sortDir === "asc" ? <FiChevronUp /> : <FiChevronDown />
                        ) : null}
                      </div>
                    </th>

                    <th className="p-3 text-left">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {paginated.map((u, idx) => (
                    <tr
                      key={u.id ?? `user-${idx}`}
                      className="border-b hover:bg-gray-50 transition duration-150"
                    >
                      <td className="p-3 text-gray-500">
                        {(page - 1) * perPage + idx + 1}
                      </td>
                      <td className="p-3 font-medium">{u.username}</td>
                      <td className="p-3">{u.email}</td>
                      <td className="p-3 capitalize text-blue-600">{u.role}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded-full text-sm font-semibold ${
                            u.status === "active"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {u.status}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center justify-start gap-3">
                          <StatusButton
                            status={u.status}
                            onClick={() => toggleStatus(u)}
                          />
                          <button
                            onClick={() => confirmDelete(u)}
                            className="flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition font-medium"
                          >
                            <FiTrash2 />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <Pagination
            page={page}
            totalPages={totalPages}
            onPrev={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
            onGoTo={(p) => setPage(p)}
          />
        </>
      )}

      {/* Confirm delete modal */}
      <ConfirmModal
        open={confirmOpen}
        title="Delete user"
        message={`Are you sure you want to permanently delete "${
          selectedForDelete?.username ?? selectedForDelete?.email
        }"? This cannot be undone.`}
        onCancel={() => {
          if (!processing) setConfirmOpen(false);
        }}
        onConfirm={doDelete}
        processing={processing}
      />
    </div>
  );
}