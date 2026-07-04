import { calculateOrderTotals } from "../shared/orderCalculations.utils.js";


export const calculateCartTotals = (cart) => {
  cart.totalItems = cart.items.length;

  cart.totalQuantity = cart.items.reduce((acc, item) => acc + item.quantity, 0);

  cart.subtotal = cart.items.reduce((acc, item) => acc + item.subtotal, 0);

  const { tax, shippingFee, totalAmount } = calculateOrderTotals({
    subtotal: cart.subtotal,
    discount: cart.discount,
  });

  cart.tax = tax;

  cart.shippingFee = shippingFee;

  cart.totalAmount = totalAmount;

  return cart;
};
