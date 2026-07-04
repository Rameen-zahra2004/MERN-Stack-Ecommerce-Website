import { useEffect, useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUsers,
  deleteUser,
  updateUserStatus,
} from "../AdminSlices/userSlice";
import SearchBar from "../Admin component/AdminSearchBar";
import { FiTrash2, FiSlash, FiChevronDown, FiChevronUp } from "react-icons/fi";

/* ---------- Confirm Modal ---------- */
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
      <div className="relative z-10 w-full max-w-md bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-rose-100 overflow-hidden">
        <div className="p-4 border-b border-rose-100">
          <h3 className="text-lg font-semibold text-rose-900">{title}</h3>
        </div>

        <div className="p-4">
          <p className="text-sm text-gray-700">{message}</p>
        </div>

        <div className="p-4 flex justify-end gap-2 border-t border-rose-100">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-md bg-rose-50 hover:bg-rose-100 text-rose-700"
            disabled={processing}
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-md bg-rose-600 text-white hover:bg-rose-700 flex items-center gap-2"
            disabled={processing}
          >
            {processing ? "Processing..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Skeleton Row ---------- */
function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: 6 }).map((_, i) => (
        <td key={i} className="p-3">
          <div className="h-4 bg-rose-100 rounded w-full" />
        </td>
      ))}
    </tr>
  );
}

/* ---------- Status Button ---------- */
function StatusButton({ status, onClick, disabled }) {
  const isActive = status === "active";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-2 px-3 py-1 rounded-lg font-medium text-white transition
        ${
          isActive
            ? "bg-amber-500 hover:bg-amber-600"
            : "bg-emerald-500 hover:bg-emerald-600"
        }`}
      title={isActive ? "Block user" : "Unblock user"}
    >
      <FiSlash />
      {isActive ? "Block" : "Unblock"}
    </button>
  );
}

/* ---------- Pagination ---------- */
function Pagination({ page, totalPages, onPrev, onNext, onGoTo }) {
  if (totalPages <= 1) return null;

  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, page + 2);
  const pages = [];

  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="mt-4 flex items-center justify-between">
      <p className="text-sm text-rose-700">
        Page {page} of {totalPages}
      </p>

      <div className="flex items-center gap-2">
        <button
          onClick={onPrev}
          disabled={page === 1}
          className="px-3 py-1 rounded bg-white border border-rose-100 hover:bg-rose-50 disabled:opacity-50"
        >
          Prev
        </button>

        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onGoTo(p)}
            className={`px-3 py-1 rounded border border-rose-100 ${
              p === page
                ? "bg-rose-600 text-white"
                : "bg-white hover:bg-rose-50"
            }`}
          >
            {p}
          </button>
        ))}

        <button
          onClick={onNext}
          disabled={page === totalPages}
          className="px-3 py-1 rounded bg-white border border-rose-100 hover:bg-rose-50 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

/* ---------- Main Page ---------- */
export default function AdminUsersPage() {
  const dispatch = useDispatch();
  const { items: users, loading, error } = useSelector((state) => state.user);

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

  const normalizeUser = useCallback(
    (u) => ({
      _raw: u,
      id: u.id ?? u._id,
      username: u.username ?? u.name ?? "Unknown",
      email: u.email ?? "—",
      role: u.role ?? "user",
      status: u.status ?? "active",
    }),
    [],
  );

  const normalized = useMemo(
    () => safeUsers.map(normalizeUser),
    [safeUsers, normalizeUser],
  );

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return normalized;

    return normalized.filter(
      (u) =>
        u.username.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q),
    );
  }, [normalized, searchQuery]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      const A = String(a[sortBy] || "").toLowerCase();
      const B = String(b[sortBy] || "").toLowerCase();
      if (A < B) return sortDir === "asc" ? -1 : 1;
      if (A > B) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return arr;
  }, [filtered, sortBy, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / perPage));

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
    } finally {
      setProcessing(false);
      setConfirmOpen(false);
      setSelectedForDelete(null);
    }
  };

  const toggleStatus = async (u) => {
    const newStatus = u.status === "active" ? "blocked" : "active";

    await dispatch(updateUserStatus({ id: u.id, status: newStatus })).unwrap();
  };

  return (
    <div className="p-6 min-h-screen bg-linear-to-br from-rose-50 via-pink-50 to-fuchsia-50">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-rose-900">
          👥 Registered Users
        </h1>

        <div className="w-full sm:w-80">
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

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full bg-white/90 backdrop-blur-md border border-rose-100 rounded-xl shadow-md overflow-hidden">
          <thead className="bg-rose-50 text-rose-900">
            <tr>
              <th className="p-3">#</th>
              <th
                className="p-3 cursor-pointer"
                onClick={() => toggleSort("username")}
              >
                Username
              </th>
              <th
                className="p-3 cursor-pointer"
                onClick={() => toggleSort("email")}
              >
                Email
              </th>
              <th
                className="p-3 cursor-pointer"
                onClick={() => toggleSort("role")}
              >
                Role
              </th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading
              ? Array.from({ length: perPage }).map((_, i) => (
                  <SkeletonRow key={i} />
                ))
              : paginated.map((u, idx) => (
                  <tr key={u.id} className="border-t hover:bg-rose-50">
                    <td className="p-3 text-rose-700">
                      {(page - 1) * perPage + idx + 1}
                    </td>
                    <td className="p-3">{u.username}</td>
                    <td className="p-3">{u.email}</td>
                    <td className="p-3 text-rose-600 capitalize">{u.role}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${
                          u.status === "active"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="p-3 flex gap-2">
                      <StatusButton
                        status={u.status}
                        onClick={() => toggleStatus(u)}
                      />
                      <button
                        onClick={() => confirmDelete(u)}
                        className="flex items-center gap-2 px-3 py-1 rounded bg-rose-600 text-white hover:bg-rose-700"
                      >
                        <FiTrash2 />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <ConfirmModal
        open={confirmOpen}
        title="Delete user"
        message={`Delete ${selectedForDelete?.username}?`}
        onCancel={() => !processing && setConfirmOpen(false)}
        onConfirm={doDelete}
        processing={processing}
      />
    </div>
  );
}
