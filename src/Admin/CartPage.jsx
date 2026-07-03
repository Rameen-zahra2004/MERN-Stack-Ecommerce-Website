import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllCarts,
  fetchCartByUserId,
  adminRemoveCartItem,
  adminClearCart,
  clearSelectedCart,
} from "../AdminSlices/adminCartSlice";

export default function AdminCartPage() {
  const dispatch = useDispatch();
  const { carts, pagination, selectedCart, loading, error } = useSelector(
    (state) => state.adminCarts,
  );

  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchAllCarts({ page, limit: 20 }));
  }, [dispatch, page]);

  const viewCart = (userId) => {
    dispatch(fetchCartByUserId(userId));
  };

  const backToList = () => {
    dispatch(clearSelectedCart());
  };

  const removeItem = (userId, productId) => {
    dispatch(adminRemoveCartItem({ userId, productId }));
  };

  const clearCart = (userId) => {
    dispatch(adminClearCart(userId));
  };

  return (
    <div className="p-6 min-h-screen bg-linear-to-br from-rose-50 via-pink-50 to-fuchsia-50">
      <h3 className="text-3xl font-bold mb-6 text-rose-900">
        🛒 Customer Carts
      </h3>

      {/* ── DETAIL VIEW: one user's cart ─────────────────── */}
      {selectedCart ? (
        <div>
          <button
            onClick={backToList}
            className="mb-4 text-rose-700 font-semibold hover:underline"
          >
            ← Back to all carts
          </button>

          {loading.single && (
            <p className="text-rose-600 animate-pulse py-4">Loading cart...</p>
          )}

          {error.single && (
            <p className="text-red-500 py-4">Error: {error.single}</p>
          )}

          {!loading.single && selectedCart && (
            <div className="bg-white/90 backdrop-blur-md border border-rose-100 rounded-xl shadow-lg p-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-rose-900 font-bold text-lg">
                    {selectedCart.user?.firstName} {selectedCart.user?.lastName}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {selectedCart.user?.email}
                  </p>
                </div>

                {selectedCart.items?.length > 0 && (
                  <button
                    onClick={() => clearCart(selectedCart.user._id)}
                    disabled={loading.clear}
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition shadow-sm disabled:opacity-50"
                  >
                    {loading.clear ? "Clearing..." : "Clear Entire Cart"}
                  </button>
                )}
              </div>

              {selectedCart.items?.length === 0 ? (
                <p className="text-gray-500">This cart is empty.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead className="bg-rose-50 text-rose-900">
                      <tr>
                        <th className="p-3 text-left">Product</th>
                        <th className="p-3 text-left">Price</th>
                        <th className="p-3 text-left">Quantity</th>
                        <th className="p-3 text-left">Subtotal</th>
                        <th className="p-3 text-left">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedCart.items?.map((item) => (
                        <tr
                          key={item.product?._id || item.product}
                          className="border-b border-rose-100 hover:bg-rose-50 transition"
                        >
                          <td className="p-3 text-gray-800 font-medium">
                            {item.product?.name || "Unknown product"}
                          </td>
                          <td className="p-3 text-rose-700">
                            ${item.price.toFixed(2)}
                          </td>
                          <td className="p-3 text-gray-700">{item.quantity}</td>
                          <td className="p-3 font-semibold text-rose-700">
                            ${item.subtotal.toFixed(2)}
                          </td>
                          <td className="p-3">
                            <button
                              onClick={() =>
                                removeItem(
                                  selectedCart.user._id,
                                  item.product?._id || item.product,
                                )
                              }
                              disabled={loading.removeItem}
                              className="bg-rose-600 text-white px-3 py-1 rounded-md hover:bg-rose-700 transition shadow-sm disabled:opacity-50"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="mt-4 text-right text-rose-900 font-bold text-lg">
                    Total: ${selectedCart.totalAmount?.toFixed(2)}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* ── LIST VIEW: all carts ─────────────────────────── */
        <>
          {loading.list && (
            <p className="text-center py-6 text-rose-600 animate-pulse">
              Loading carts...
            </p>
          )}

          {error.list && (
            <p className="text-center text-red-500 py-6">Error: {error.list}</p>
          )}

          {!loading.list && carts.length === 0 ? (
            <p className="text-gray-500">No carts found.</p>
          ) : (
            !loading.list && (
              <div className="overflow-x-auto bg-white/90 backdrop-blur-md border border-rose-100 rounded-xl shadow-lg">
                <table className="w-full border-collapse">
                  <thead className="bg-rose-50 text-rose-900">
                    <tr>
                      <th className="p-3 text-left">Customer</th>
                      <th className="p-3 text-left">Email</th>
                      <th className="p-3 text-left">Items</th>
                      <th className="p-3 text-left">Total</th>
                      <th className="p-3 text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {carts.map((cart) => (
                      <tr
                        key={cart._id}
                        className="border-b border-rose-100 hover:bg-rose-50 transition"
                      >
                        <td className="p-3 text-gray-800 font-medium">
                          {cart.user?.firstName} {cart.user?.lastName}
                        </td>
                        <td className="p-3 text-gray-600">
                          {cart.user?.email}
                        </td>
                        <td className="p-3 text-gray-700">{cart.totalItems}</td>
                        <td className="p-3 font-semibold text-rose-700">
                          ${cart.totalAmount?.toFixed(2)}
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() => viewCart(cart.user?._id)}
                            className="bg-rose-600 text-white px-3 py-1 rounded-md hover:bg-rose-700 transition shadow-sm"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination */}
                <div className="flex items-center justify-between p-4 text-sm text-rose-900">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="px-3 py-1 rounded-md border border-rose-200 disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <span>
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setPage((p) => Math.min(pagination.totalPages, p + 1))
                    }
                    disabled={page >= pagination.totalPages}
                    className="px-3 py-1 rounded-md border border-rose-200 disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            )
          )}
        </>
      )}
    </div>
  );
}
