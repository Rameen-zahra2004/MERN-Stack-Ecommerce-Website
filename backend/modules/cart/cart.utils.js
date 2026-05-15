export const calculateCartTotals =
  (cart) => {
    cart.totalItems =
      cart.items.length;

    cart.totalQuantity =
      cart.items.reduce(
        (acc, item) =>
          acc + item.quantity,
        0
      );

    cart.subtotal =
      cart.items.reduce(
        (acc, item) =>
          acc + item.subtotal,
        0
      );

    /*
    =========================
    TAX LOGIC
    =========================
    */

    cart.tax =
      Number(
        (cart.subtotal * 0.05).toFixed(
          2
        )
      );

    /*
    =========================
    SHIPPING LOGIC
    =========================
    */

    cart.shippingFee =
      cart.subtotal > 5000
        ? 0
        : 250;

    /*
    =========================
    FINAL TOTAL
    =========================
    */

    cart.totalAmount =
      cart.subtotal +
      cart.tax +
      cart.shippingFee -
      cart.discount;

    return cart;
  };