export const buildOrderDetailPayload =
  (orderId, userId, items) => {
    return items.map((item) => ({
      order: orderId,
      user: userId,
      product: item.product,
      productName:
        item.productName ||
        item.name,

      quantity: item.quantity,

      unitPrice: item.price,

      subtotal:
        item.quantity *
        item.price,
    }));
  };

/*
=========================
CALCULATE ITEM TOTALS
=========================
*/

export const calculateItemTotal =
  (quantity, price) => {
    return quantity * price;
  };