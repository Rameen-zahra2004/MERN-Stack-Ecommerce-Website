import { useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { submitOrder } from "../AdminSlices/cartSlice";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.signinuser || {});
  const { cart } = useSelector((state) => state.cart || { cart: [] });

  const subtotal = useMemo(
    () =>
      (cart || []).reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  const [shipping, setShipping] = useState({
    fullName: user?.username || "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    phone: "",
  });

  const [payment, setPayment] = useState({
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const handleShippingChange = (e) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  const handlePaymentChange = (e) => {
    setPayment({ ...payment, [e.target.name]: e.target.value });
  };

  const handleConfirmOrder = () => {
    if (!user) return alert("⚠ Please log in to place the order!");
    if (!cart?.length) return alert("⚠ Your cart is empty!");

    for (let key in shipping)
      if (!shipping[key]) return alert(`⚠ Fill all shipping fields (${key})!`);
    for (let key in payment)
      if (!payment[key]) return alert(`⚠ Fill all payment fields (${key})!`);

    const order = {
      userId: user.id,
      username: user.username,
      shipping,
      payment: {
        cardName: payment.cardName,
        maskedCard: `**** **** **** ${payment.cardNumber.slice(-4)}`,
      },
      items: cart,
      totalPrice: subtotal,
      status: "pending",
      date: new Date().toLocaleString(),
    };

    dispatch(submitOrder(order));
    alert("✅ Order placed successfully!");
    navigate("/user");
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      <div className="grid md:grid-cols-2 gap-6">
        {/* Shipping & Payment */}
        <div className="bg-white shadow rounded-lg p-6 space-y-6">
          <div>
            <h2 className="font-semibold text-xl mb-3">Shipping Address</h2>
            {Object.keys(shipping).map((field) => (
              <div key={field} className="mb-2">
                <label
                  htmlFor={`shipping-${field}`}
                  className="block text-sm font-medium mb-1"
                >
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  id={`shipping-${field}`}
                  name={field}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={shipping[field]}
                  onChange={handleShippingChange}
                  className="w-full border p-2 rounded"
                />
              </div>
            ))}
          </div>

          <div>
            <h2 className="font-semibold text-xl mb-3">Payment Details</h2>
            <div className="mb-2">
              <label
                htmlFor="cardName"
                className="block text-sm font-medium mb-1"
              >
                Cardholder Name
              </label>
              <input
                type="text"
                id="cardName"
                name="cardName"
                placeholder="Cardholder Name"
                value={payment.cardName}
                onChange={handlePaymentChange}
                className="w-full border p-2 rounded"
              />
            </div>
            <div className="mb-2">
              <label
                htmlFor="cardNumber"
                className="block text-sm font-medium mb-1"
              >
                Card Number
              </label>
              <input
                type="text"
                id="cardNumber"
                name="cardNumber"
                placeholder="Card Number"
                value={payment.cardNumber}
                onChange={handlePaymentChange}
                className="w-full border p-2 rounded"
              />
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <label
                  htmlFor="expiry"
                  className="block text-sm font-medium mb-1"
                >
                  Expiry (MM/YY)
                </label>
                <input
                  type="text"
                  id="expiry"
                  name="expiry"
                  placeholder="MM/YY"
                  value={payment.expiry}
                  onChange={handlePaymentChange}
                  className="w-full border p-2 rounded"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="cvv" className="block text-sm font-medium mb-1">
                  CVV
                </label>
                <input
                  type="text"
                  id="cvv"
                  name="cvv"
                  placeholder="CVV"
                  value={payment.cvv}
                  onChange={handlePaymentChange}
                  className="w-full border p-2 rounded"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white shadow rounded-lg p-6 flex flex-col">
          <h2 className="font-semibold text-xl mb-4">Order Summary</h2>
          <div className="flex-1 space-y-3 overflow-y-auto">
            {cart?.length === 0 ? (
              <p className="text-gray-500">Your cart is empty.</p>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-12 h-12 rounded object-cover"
                    />
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <p className="font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))
            )}
          </div>

          <div className="border-t mt-4 pt-4 flex justify-between font-semibold">
            <span>Total:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>

          <button
            onClick={handleConfirmOrder}
            className="mt-4 w-full py-2 rounded bg-green-600 text-white hover:bg-green-700 transition"
          >
            Confirm Order
          </button>
        </div>
      </div>
    </div>
  );
}
