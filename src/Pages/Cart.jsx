import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProduct,
  fetchCart,
  addTocart,
  updateCartQuantity,
  deleteCartItem,
} from "../AdminSlices/cartSlice";
import { FiMinus, FiPlus, FiTrash2, FiLoader } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Checkout from "../Component/CheckoutPage";

// Reusable Loading Skeleton
const Skeleton = () => (
  <div className="animate-pulse p-4 border rounded-lg flex items-center gap-4">
    <div className="w-16 h-16 bg-gray-300 rounded"></div>
    <div className="flex-1 space-y-2">
      <div className="h-4 bg-gray-300 rounded"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
  </div>
);

export default function UserCartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    product = [],
    cart = [],
    loading,
    updating,
    error,
  } = useSelector((state) => state.cart);

  const { user: _user } = useSelector((state) => state.signinuser || {});

  // Fetch data on mount
  useEffect(() => {
    dispatch(fetchProduct());
    dispatch(fetchCart());
  }, [dispatch]);

  // Computed subtotal
  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  // Add or increment item
  const handleAddToCart = (productItem) => {
    const existing = cart.find((i) => i.id === productItem.id);
    if (existing) {
      dispatch(
        updateCartQuantity({ id: existing.id, quantity: existing.quantity + 1 })
      );
    } else {
      dispatch(addTocart(productItem));
    }
  };

  // Quantity update logic
  const handleQuantityChange = (item, change) => {
    const newQty = item.quantity + change;

    if (newQty <= 0) {
      dispatch(deleteCartItem(item.id));
    } else {
      dispatch(updateCartQuantity({ id: item.id, quantity: newQty }));
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        🛒 My Cart
      </h1>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {/* PRODUCTS SECTION */}
        <div className="md:col-span-2 bg-white shadow rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Products</h2>

          {loading ? (
            <div className="space-y-4">
              <Skeleton />
              <Skeleton />
              <Skeleton />
            </div>
          ) : (
            <div className="space-y-4">
              {product.map((p) => (
                <div
                  key={p.id}
                  className="flex justify-between items-center p-3 border rounded-md shadow-sm hover:shadow transition"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-16 h-16 rounded object-cover"
                    />
                    <div>
                      <h3 className="font-semibold">{p.title}</h3>
                      <p className="text-gray-600 text-sm">
                        ${p.price.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <button
                    disabled={updating}
                    onClick={() => handleAddToCart(p)}
                    className="bg-gray-700 text-white px-4 py-1 rounded hover:bg-black transition disabled:opacity-50"
                  >
                    {updating ? <FiLoader className="animate-spin" /> : "Add"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CART SECTION */}
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Your Cart</h2>

          {cart.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              🛍 Your cart is empty
              <p className="text-sm mt-1">Add items from the left section</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center border rounded p-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      className="w-14 h-14 rounded object-cover"
                    />
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-gray-500 text-sm">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      disabled={updating}
                      onClick={() => handleQuantityChange(item, -1)}
                      className="p-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                    >
                      <FiMinus />
                    </button>

                    <span className="w-6 text-center font-semibold">
                      {item.quantity}
                    </span>

                    <button
                      disabled={updating}
                      onClick={() => handleQuantityChange(item, 1)}
                      className="p-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                    >
                      <FiPlus />
                    </button>

                    <button
                      disabled={updating}
                      onClick={() => dispatch(deleteCartItem(item.id))}
                      className="text-red-600 hover:text-red-700 text-xl disabled:opacity-50"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              ))}

              {/* SUBTOTAL */}
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between font-semibold">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>

                {/* PROCEED TO CHECKOUT BUTTON */}
                <button
                  disabled={updating || cart.length === 0}
                  onClick={() => navigate("/checkout")} // navigates to route where <CheckOut /> is rendered
                  className="mt-4 w-full py-2 rounded bg-gray-600 text-white hover:bg-gray-700 transition disabled:opacity-50"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
