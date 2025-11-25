import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, deleteCartItem } from "../AdminSlices/cartSlice";

export default function AdminCartPage() {
  const dispatch = useDispatch();
  const { cart, loading, error } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  if (loading) return <p>Loading cart data...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div>
      <h3 className="text-2xl font-semibold mb-4 text-gray-800">
        🛒 All Cart Items
      </h3>
      {cart.length === 0 ? (
        <p className="text-gray-500">No cart items found.</p>
      ) : (
        <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="p-3 text-left">Product</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-left">Quantity</th>
              <th className="p-3 text-left">Total</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item) => (
              <tr
                key={item.id}
                className="border-b hover:bg-gray-50 transition duration-150"
              >
                <td className="p-3">{item.title}</td>
                <td className="p-3">${item.price.toFixed(2)}</td>
                <td className="p-3">{item.quantity}</td>
                <td className="p-3">
                  ${(item.price * item.quantity).toFixed(2)}
                </td>
                <td className="p-3">
                  <button
                    onClick={() => dispatch(deleteCartItem(item.id))}
                    className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
