import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllOrders, updateOrderStatus } from "../AdminSlices/cartSlice";

export default function AdminOrdersPage() {
  const dispatch = useDispatch();
  const { orders = [], loading, error } = useSelector((state) => state.cart);

  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  // Filter + search
  const filteredOrders = useMemo(() => {
    return orders
      .filter((o) => filter === "all" || o.status === filter)
      .filter(
        (o) =>
          o.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          o.id.toString().includes(searchQuery)
      );
  }, [orders, filter, searchQuery]);

  const totalRevenue = filteredOrders.reduce(
    (sum, order) => sum + order.totalPrice,
    0
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleStatusChange = (order, newStatus) => {
    if (
      window.confirm(
        `Are you sure you want to mark this order as ${newStatus}?`
      )
    ) {
      dispatch(updateOrderStatus({ id: order.id, status: newStatus }));
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">📦 All Orders</h1>

      {/* Filter + Search + Revenue */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex gap-4 items-center">
          <span className="font-semibold text-gray-700">
            Total Revenue: ${totalRevenue.toFixed(2)}
          </span>
          <select
            className="border rounded p-1"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>
        <input
          type="text"
          placeholder="Search by username or order ID..."
          className="border rounded p-1 w-full sm:w-64"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Loading / Error */}
      {loading && (
        <p className="text-center text-gray-500 py-4">Loading orders...</p>
      )}
      {error && <p className="text-center text-red-500 py-4">{error}</p>}

      {/* Orders Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3 text-left border-b">#</th>
              <th className="p-3 text-left border-b">Order ID</th>
              <th className="p-3 text-left border-b">User</th>
              <th className="p-3 text-left border-b">Items</th>
              <th className="p-3 text-left border-b">Total</th>
              <th className="p-3 text-left border-b">Status</th>
              <th className="p-3 text-left border-b">Date</th>
              <th className="p-3 text-left border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedOrders.map((order, index) => (
              <tr
                key={order.id}
                className="hover:bg-gray-50 transition duration-150 border-b"
              >
                <td className="p-3 text-gray-500">
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </td>
                <td className="p-3 font-medium">{order.id}</td>
                <td className="p-3">{order.username}</td>
                <td className="p-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="text-sm">
                      {item.title} x {item.quantity} (${item.price.toFixed(2)})
                    </div>
                  ))}
                </td>
                <td className="p-3 font-semibold">
                  ${order.totalPrice.toFixed(2)}
                </td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded-full text-sm font-semibold ${
                      order.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="p-3">
                  {new Date(order.date).toLocaleDateString()}
                </td>
                <td className="p-3 flex gap-2">
                  {order.status === "pending" && (
                    <button
                      onClick={() => handleStatusChange(order, "delivered")}
                      className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 transition"
                    >
                      Mark Delivered
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded border disabled:opacity-50"
        >
          Prev
        </button>
        <span className="px-3 py-1">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded border disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
