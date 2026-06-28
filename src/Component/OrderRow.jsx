// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { updateOrderStatus } from "../Slices/orderSlice";
// import StatusBadge from "../Component/StatusBadge";

// export default function OrderRow({ order }) {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { updatingOrderId } = useSelector((state) => state.orders);
//   const isUpdating = updatingOrderId === order._id;

//   const handleChange = (e) => {
//     dispatch(updateOrderStatus({ orderId: order._id, status: e.target.value }));
//   };

//   const rowClass =
//     order.status === "Pending"
//       ? "bg-yellow-50 hover:bg-yellow-100"
//       : "hover:bg-gray-50";

//   const deliveryText = order.deliveryDate
//     ? new Date(order.deliveryDate).toLocaleDateString()
//     : order.status === "Pending"
//     ? "Expected in 3-5 days"
//     : "-";

//   return (
//     <tr
//       className={`border-b ${rowClass} cursor-pointer`}
//       onClick={() => navigate(`/user/orders/${order._id}`)}
//     >
//       <td className="p-3">{order._id.slice(-6).toUpperCase()}</td>
//       <td className="p-3">{order.productName}</td>
//       <td className="p-3">{order.quantity}</td>
//       <td className="p-3">${order.price.toFixed(2)}</td>
//       <td className="p-3">
//         <StatusBadge status={order.status} />
//       </td>
//       <td className="p-3">{deliveryText}</td>
//       <td className="p-3" onClick={(e) => e.stopPropagation()}>
//         <select
//           value={order.status}
//           onChange={handleChange}
//           disabled={isUpdating}
//           className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring focus:ring-blue-200"
//         >
//           <option>Pending</option>
//           <option>Shipping</option>
//           <option>Delivered</option>
//           <option>Cancel</option>
//         </select>
//       </td>
//     </tr>
//   );
// }
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateOrderStatus } from "../Slices/orderSlice";
import StatusBadge from "../Component/StatusBadge";

export default function OrderRow({ order }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { updatingOrderId } = useSelector((state) => state.orders);
  const isUpdating = updatingOrderId === order._id;

  const handleChange = (e) => {
    dispatch(updateOrderStatus({ orderId: order._id, status: e.target.value }));
  };

  const rowClass =
    order.status === "Pending"
      ? "bg-pink-50 hover:bg-pink-100"
      : "hover:bg-pink-50/60";

  const deliveryText = order.deliveryDate
    ? new Date(order.deliveryDate).toLocaleDateString()
    : order.status === "Pending"
      ? "Expected in 3-5 days"
      : "-";

  return (
    <tr
      className={`border-b border-pink-100 ${rowClass} cursor-pointer transition`}
      onClick={() => navigate(`/user/orders/${order._id}`)}
    >
      <td className="p-3 font-medium text-gray-700">
        {order._id.slice(-6).toUpperCase()}
      </td>
      <td className="p-3 text-gray-700">{order.productName}</td>
      <td className="p-3 text-gray-700">{order.quantity}</td>
      <td className="p-3 text-pink-600 font-medium">
        ${order.price.toFixed(2)}
      </td>
      <td className="p-3">
        <StatusBadge status={order.status} />
      </td>
      <td className="p-3 text-gray-500">{deliveryText}</td>
      <td className="p-3" onClick={(e) => e.stopPropagation()}>
        <select
          value={order.status}
          onChange={handleChange}
          disabled={isUpdating}
          className="border border-pink-200 rounded-full px-3 py-1 text-sm text-pink-700 bg-white
                     focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400
                     disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          <option>Pending</option>
          <option>Shipping</option>
          <option>Delivered</option>
          <option>Cancel</option>
        </select>
      </td>
    </tr>
  );
}
