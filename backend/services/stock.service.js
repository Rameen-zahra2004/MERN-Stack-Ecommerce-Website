import Product from "../models/Product.js";
import logger from "../config/logger.js";

/*
=========================
DECREASE STOCK (ATOMIC SAFE VERSION)
=========================
*/

export const decreaseStock = async (
  items,
  session = null
) => {
  try {
    if (!Array.isArray(items)) {
      throw new Error(
        "Items must be an array"
      );
    }

    /*
    =========================
    PROCESS EACH ITEM SAFELY
    =========================
    */
    for (const item of items) {
      const { productId, quantity } =
        item;

      /*
      =========================
      ATOMIC STOCK DECREMENT
      =========================
      */
      const product =
        await Product.findOneAndUpdate(
          {
            _id: productId,
            stock: {
              $gte: quantity,
            },
          },
          {
            $inc: {
              stock: -quantity,
            },
          },
          {
            new: true,
            session,
          }
        );

      /*
      =========================
      VALIDATION
      =========================
      */
      if (!product) {
        throw new Error(
          `Insufficient stock or product not found: ${productId}`
        );
      }
    }
  } catch (error) {
    logger.error(
      "Stock decrease failed",
      error
    );

    throw error;
  }
};