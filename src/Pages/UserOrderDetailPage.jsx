// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchOrdersDetail, clearOrdersDetail } from "../Slices/orderSlice";
// import { useParams, useNavigate } from "react-router-dom";
// import StatusBadge from "../Component/StatusBadge";

// export default function UserOrderDetailPage() {
//   const { orderId } = useParams();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const { ordersDetail, loading, error } = useSelector(
//     (state) => state.orderDetail || {}
//   );

//   useEffect(() => {
//     if (orderId) dispatch(fetchOrdersDetail(orderId));
//     return () => dispatch(clearOrdersDetail());
//   }, [dispatch, orderId]);

//   if (loading)
//     return (
//       <p className="text-center mt-10 text-lg">Loading order details...</p>
//     );
//   if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
//   if (!ordersDetail)
//     return <p className="text-center mt-10">Order not found.</p>;

//   const {
//     _id,
//     products = [],
//     status = "Pending",
//     totalAmount = 0,
//     orderDate,
//     deliveryDate,
//   } = ordersDetail;

//   // Timeline steps based on status
//   const steps = ["Placed", "Processing", "Shipped", "Delivered"];
//   const currentStepIndex =
//     {
//       Placed: 0,
//       Pending: 1,
//       Processing: 1,
//       Shipped: 2,
//       Delivered: 3,
//     }[status] || 0;

//   return (
//     <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
//       {/* Back Button */}
//       <button
//         onClick={() => navigate(-1)}
//         className="mb-6 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
//       >
//         ← Back to Orders
//       </button>

//       {/* PAGE TITLE */}
//       <h1 className="text-2xl font-bold mb-6">Order Details</h1>

//       <div className="grid md:grid-cols-3 gap-6">
//         {/* =================== LEFT CONTENT =================== */}
//         <div className="md:col-span-2 space-y-6">
//           {/* Order Status Card */}
//           <div className="bg-white shadow rounded-lg p-6">
//             <h2 className="text-lg font-semibold mb-4">Order Status</h2>

//             <div className="flex items-center justify-between relative">
//               {steps.map((step, idx) => (
//                 <div key={step} className="flex flex-col items-center w-full">
//                   <div
//                     className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
//                       ${
//                         idx <= currentStepIndex
//                           ? "bg-blue-600 text-white"
//                           : "bg-gray-200 text-gray-600"
//                       }
//                     `}
//                   >
//                     {idx + 1}
//                   </div>
//                   <p
//                     className={`mt-2 text-sm ${
//                       idx <= currentStepIndex
//                         ? "text-blue-600"
//                         : "text-gray-500"
//                     }`}
//                   >
//                     {step}
//                   </p>
//                   {idx < steps.length - 1 && (
//                     <div
//                       className={`absolute top-4 left-0 right-0 h-1 z-[-1] ${
//                         idx < currentStepIndex ? "bg-blue-600" : "bg-gray-300"
//                       }`}
//                     ></div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Products List */}
//           <div className="bg-white shadow rounded-lg p-6">
//             <h2 className="text-lg font-semibold mb-4">Items in this Order</h2>

//             <div className="space-y-4">
//               {products.length === 0 && (
//                 <p className="text-gray-500">
//                   No products found in this order.
//                 </p>
//               )}

//               {products.map((p, index) => (
//                 <div
//                   key={p._id || index}
//                   className="flex justify-between items-center border rounded-lg p-4 hover:shadow transition"
//                 >
//                   <div className="flex items-center space-x-4">
//                     {p.image && (
//                       <img
//                         src={p.image}
//                         alt={p.name}
//                         className="w-16 h-16 object-cover rounded"
//                       />
//                     )}
//                     <div>
//                       <p className="font-semibold">{p.name}</p>
//                       <p className="text-sm text-gray-600">Qty: {p.quantity}</p>
//                     </div>
//                   </div>

//                   <div className="text-right font-semibold">
//                     ${(p.price * p.quantity).toFixed(2)}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* =================== RIGHT SIDEBAR =================== */}
//         <div className="space-y-6">
//           {/* Order Info */}
//           <div className="bg-white shadow rounded-lg p-6">
//             <h2 className="text-lg font-semibold mb-4">Order Information</h2>
//             <p>
//               <strong>Order ID:</strong> {_id}
//             </p>
//             <p>
//               <strong>Order Date:</strong>{" "}
//               {orderDate ? new Date(orderDate).toLocaleDateString() : "—"}
//             </p>
//             <p>
//               <strong>Delivery Date:</strong>{" "}
//               {deliveryDate
//                 ? new Date(deliveryDate).toLocaleDateString()
//                 : "Pending"}
//             </p>
//             <p className="mt-2">
//               <strong>Status:</strong> <StatusBadge status={status} />
//             </p>
//           </div>

//           {/* Summary */}
//           <div className="bg-white shadow rounded-lg p-6">
//             <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

//             <div className="flex justify-between py-1">
//               <span>Subtotal</span>
//               <span>${totalAmount.toFixed(2)}</span>
//             </div>

//             <div className="flex justify-between py-1">
//               <span>Shipping</span>
//               <span>$0.00</span>
//             </div>

//             <hr className="my-3" />

//             <div className="flex justify-between text-lg font-bold">
//               <span>Total</span>
//               <span>${totalAmount.toFixed(2)}</span>
//             </div>
//           </div>

//           {/* Pending Note */}
//           {status === "Pending" && (
//             <p className="text-yellow-700 bg-yellow-100 p-3 rounded">
//               Your order is being processed. Estimated delivery in 3–5 days.
//             </p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrdersDetail, clearOrdersDetail } from "../Slices/orderSlice";
import { useParams, useNavigate } from "react-router-dom";
import StatusBadge from "../Component/StatusBadge";

export default function UserOrderDetailPage() {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { ordersDetail, loading, error } = useSelector(
    (state) => state.orderDetail || {},
  );

  useEffect(() => {
    if (orderId) dispatch(fetchOrdersDetail(orderId));
    return () => dispatch(clearOrdersDetail());
  }, [dispatch, orderId]);

  if (loading)
    return (
      <p className="text-center mt-10 text-lg text-pink-600">
        Loading order details...
      </p>
    );

  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  if (!ordersDetail)
    return <p className="text-center mt-10 text-pink-600">Order not found.</p>;

  const {
    _id,
    products = [],
    status = "Pending",
    totalAmount = 0,
    orderDate,
    deliveryDate,
  } = ordersDetail;

  const steps = ["Placed", "Processing", "Shipped", "Delivered"];

  const currentStepIndex =
    {
      Placed: 0,
      Pending: 1,
      Processing: 1,
      Shipped: 2,
      Delivered: 3,
    }[status] || 0;

  return (
    <div className="max-w-6xl mx-auto p-6 bg-pink-50 min-h-screen">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 px-4 py-2 bg-pink-100 text-pink-700 rounded hover:bg-pink-200 transition"
      >
        ← Back to Orders
      </button>

      {/* PAGE TITLE */}
      <h1 className="text-2xl font-bold mb-6 text-pink-700">Order Details</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {/* =================== LEFT CONTENT =================== */}
        <div className="md:col-span-2 space-y-6">
          {/* Order Status Card */}
          <div className="bg-white shadow rounded-lg p-6 border border-pink-100">
            <h2 className="text-lg font-semibold mb-4 text-pink-700">
              Order Status
            </h2>

            <div className="flex items-center justify-between relative">
              {steps.map((step, idx) => (
                <div key={step} className="flex flex-col items-center w-full">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                      ${
                        idx <= currentStepIndex
                          ? "bg-pink-600 text-white"
                          : "bg-pink-100 text-pink-500"
                      }
                    `}
                  >
                    {idx + 1}
                  </div>

                  <p
                    className={`mt-2 text-sm ${
                      idx <= currentStepIndex
                        ? "text-pink-600"
                        : "text-gray-500"
                    }`}
                  >
                    {step}
                  </p>

                  {idx < steps.length - 1 && (
                    <div
                      className={`absolute top-4 left-0 right-0 h-1 z-[-1] ${
                        idx < currentStepIndex ? "bg-pink-600" : "bg-pink-200"
                      }`}
                    ></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Products List */}
          <div className="bg-white shadow rounded-lg p-6 border border-pink-100">
            <h2 className="text-lg font-semibold mb-4 text-pink-700">
              Items in this Order
            </h2>

            <div className="space-y-4">
              {products.length === 0 && (
                <p className="text-pink-500">
                  No products found in this order.
                </p>
              )}

              {products.map((p, index) => (
                <div
                  key={p._id || index}
                  className="flex justify-between items-center border border-pink-100 rounded-lg p-4 hover:shadow hover:border-pink-300 transition"
                >
                  <div className="flex items-center space-x-4">
                    {p.image && (
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}

                    <div>
                      <p className="font-semibold text-pink-800">{p.name}</p>

                      <p className="text-sm text-pink-600">Qty: {p.quantity}</p>
                    </div>
                  </div>

                  <div className="text-right font-semibold text-pink-700">
                    ${(p.price * p.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* =================== RIGHT SIDEBAR =================== */}
        <div className="space-y-6">
          {/* Order Info */}
          <div className="bg-white shadow rounded-lg p-6 border border-pink-100">
            <h2 className="text-lg font-semibold mb-4 text-pink-700">
              Order Information
            </h2>

            <div className="text-pink-800">
              <p>
                <strong>Order ID:</strong> {_id}
              </p>

              <p>
                <strong>Order Date:</strong>{" "}
                {orderDate ? new Date(orderDate).toLocaleDateString() : "—"}
              </p>

              <p>
                <strong>Delivery Date:</strong>{" "}
                {deliveryDate
                  ? new Date(deliveryDate).toLocaleDateString()
                  : "Pending"}
              </p>

              <p className="mt-2">
                <strong>Status:</strong> <StatusBadge status={status} />
              </p>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-white shadow rounded-lg p-6 border border-pink-100">
            <h2 className="text-lg font-semibold mb-4 text-pink-700">
              Order Summary
            </h2>

            <div className="flex justify-between py-1 text-pink-700">
              <span>Subtotal</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>

            <div className="flex justify-between py-1 text-pink-700">
              <span>Shipping</span>
              <span>$0.00</span>
            </div>

            <hr className="my-3 border-pink-100" />

            <div className="flex justify-between text-lg font-bold text-pink-800">
              <span>Total</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
          </div>

          {/* Pending Note */}
          {status === "Pending" && (
            <p className="text-pink-700 bg-pink-100 p-3 rounded">
              Your order is being processed. Estimated delivery in 3–5 days.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
