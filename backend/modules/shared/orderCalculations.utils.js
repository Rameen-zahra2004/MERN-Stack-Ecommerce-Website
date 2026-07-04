/*
=========================
SHARED ORDER FINANCIAL CALCULATIONS
=========================
Single source of truth for tax, shipping, and total amount
logic. Used by both the Cart module and the Order module to
eliminate duplicated, drifting calculation logic.

Pure function: no database access, no side effects.
*/

const TAX_RATE = 0.05;

const FREE_SHIPPING_THRESHOLD = 5000;

const FLAT_SHIPPING_FEE = 250;


const roundMoney = (value) => {
  return Number(value.toFixed(2));
};


export const calculateOrderTotals = ({ subtotal, discount = 0 }) => {
  const safeSubtotal = subtotal || 0;

  const safeDiscount = discount || 0;

  const tax = roundMoney(safeSubtotal * TAX_RATE);

  const shippingFee =
    safeSubtotal > FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING_FEE;

  const totalAmount = roundMoney(
    safeSubtotal + tax + shippingFee - safeDiscount,
  );

  return {
    tax,
    shippingFee,
    discount: safeDiscount,
    totalAmount,
  };
};
