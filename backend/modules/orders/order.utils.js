export const calculateOrderTotals =
  (cart) => {
    const subtotal =
      cart.items.reduce(
        (acc, item) =>
          acc + item.subtotal,
        0
      );

    const tax =
      subtotal * 0.05;

    const shippingFee =
      subtotal > 5000
        ? 0
        : 250;

    const total =
      subtotal +
      tax +
      shippingFee;

    return {
      subtotal,
      tax,
      shippingFee,
      total,
    };
  };