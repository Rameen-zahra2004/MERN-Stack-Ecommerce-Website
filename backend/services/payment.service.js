import logger from "../config/logger.js";


const PAYMENT_STATUS = {
  PAID: "paid",
  PENDING: "pending",
  FAILED: "failed",
  COD: "cod",
};


export const processPayment = async (
  method,
  amount,
  meta = {}
) => {
  try {
    if (!method || !amount) {
      throw new Error(
        "Payment method and amount are required"
      );
    }

    if (method === "stripe") {
      return {
        status: PAYMENT_STATUS.PAID,
        provider: "stripe",
        amount,
        transactionId: `st_${Date.now()}`,
        meta,
      };
    }

    if (method === "jazzcash") {
      return {
        status: PAYMENT_STATUS.PENDING,
        provider: "jazzcash",
        amount,
        transactionId: `jc_${Date.now()}`,
        meta,
      };
    }

    return {
      status: PAYMENT_STATUS.COD,
      provider: "cash",
      amount,
      transactionId: `cod_${Date.now()}`,
      meta,
    };
  } catch (error) {
    logger.error(
      "Payment processing failed",
      error
    );

    return {
      status: PAYMENT_STATUS.FAILED,
      provider: method || "unknown",
      amount,
      error: error.message,
    };
  }
};