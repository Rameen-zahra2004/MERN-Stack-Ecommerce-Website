import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllOrders, deleteOrder } from "../AdminSlices/cartSlice";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

export default function UserOrdersPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.signinuser || {});
  const { orders = [], loading, error } = useSelector((state) => state.cart);

  useEffect(() => {
    if (user) dispatch(fetchAllOrders());
  }, [dispatch, user]);

  if (!user) return null;

  const userOrders = orders.filter(
    (o) => o.userId === user.id && o.items && o.items.length > 0
  );

  const handleCancelOrder = (e, orderId) => {
    e.stopPropagation(); // Prevent card click
    const reason = prompt("Enter a reason for cancelling your order:");
    if (
      window.confirm(
        `Are you sure you want to cancel this order?\nReason: ${
          reason || "No reason provided"
        }`
      )
    ) {
      dispatch(deleteOrder({ orderId, reason: reason || "" }));
      alert("✅ Order cancelled successfully!");
    }
  };

  const handleViewDetails = (orderId) => {
    navigate(`/user/orders/${orderId}`); // navigate to order detail page
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      {/* Back Button */}
      <button
        onClick={() => navigate("/user")} // <-- Navigate to UserPage dashboard
        className="flex items-center gap-2 mb-6 px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
      >
        <FiArrowLeft /> Back to Dashboard
      </button>

      <h1 className="text-3xl font-bold mb-6 text-center">🛒 Your Orders</h1>

      {loading ? (
        <div className="text-center text-lg">Loading orders...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : userOrders.length === 0 ? (
        <div className="text-center text-gray-500">
          You have no active orders!
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          {userOrders.map((order) => (
            <div
              key={order.id}
              onClick={() => handleViewDetails(order.id)}
              className="bg-white rounded-xl shadow p-4 border hover:shadow-md transition cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Order ID: {order.id}</span>
                  <span className="text-sm text-gray-500">{order.date}</span>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  Status: <span className="font-medium">{order.status}</span>
                </div>
                <div>
                  <strong>Items:</strong>
                  <ul className="list-disc pl-5 text-gray-700 mt-1">
                    {order.items.map((item) => (
                      <li key={item.id}>
                        {item.title} x {item.quantity} (${item.price.toFixed(2)}
                        )
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex justify-between items-center mt-4 pt-3 border-t">
                <div className="font-semibold text-gray-800">
                  Total: ${order.totalPrice.toFixed(2)}
                </div>

                <button
                  onClick={(e) => handleCancelOrder(e, order.id)}
                  className="bg-red-600 text-white py-1 px-3 rounded hover:bg-red-700 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
