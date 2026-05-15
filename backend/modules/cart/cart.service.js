import Cart from "./cart.model.js";

import Product from
  "../product/product.model.js";

import {
  CART_MESSAGES,
} from "./cart.constants.js";

import {
  calculateCartTotals,
} from "./cart.utils.js";

/*
=========================
GET USER CART
=========================
*/

export const getCartService =
  async (userId) => {
    let cart =
      await Cart.findOne({
        user: userId,
      })
        .populate(
          "items.product"
        )
        .lean();

    if (!cart) {
      cart =
        await Cart.create({
          user: userId,
        });

      cart =
        await Cart.findById(
          cart._id
        ).lean();
    }

    return cart;
  };

/*
=========================
ADD TO CART
=========================
*/

export const addToCartService =
  async (
    userId,
    productId,
    quantity
  ) => {
    if (quantity <= 0) {
      throw new Error(
        CART_MESSAGES.INVALID_QUANTITY
      );
    }

    const product =
      await Product.findById(
        productId
      );

    if (!product) {
      throw new Error(
        CART_MESSAGES.PRODUCT_NOT_FOUND
      );
    }

    if (product.stock < quantity) {
      throw new Error(
        CART_MESSAGES.OUT_OF_STOCK
      );
    }

    let cart =
      await Cart.findOne({
        user: userId,
      });

    if (!cart) {
      cart =
        await Cart.create({
          user: userId,
          items: [],
        });
    }

    const existingItem =
      cart.items.find(
        (item) =>
          item.product.toString() ===
          productId
      );

    if (existingItem) {
      existingItem.quantity +=
        quantity;

      existingItem.subtotal =
        existingItem.quantity *
        existingItem.price;
    } else {
      cart.items.push({
        product: product._id,

        quantity,

        price: product.price,

        subtotal:
          product.price *
          quantity,
      });
    }

    calculateCartTotals(cart);

    await cart.save();

    return await Cart.findById(
      cart._id
    ).populate("items.product");
  };

/*
=========================
UPDATE CART ITEM
=========================
*/

export const updateCartItemService =
  async (
    userId,
    productId,
    quantity
  ) => {
    const cart =
      await Cart.findOne({
        user: userId,
      });

    if (!cart) {
      throw new Error(
        CART_MESSAGES.CART_NOT_FOUND
      );
    }

    const item =
      cart.items.find(
        (item) =>
          item.product.toString() ===
          productId
      );

    if (!item) {
      throw new Error(
        CART_MESSAGES.PRODUCT_NOT_FOUND
      );
    }

    item.quantity = quantity;

    item.subtotal =
      item.price * quantity;

    calculateCartTotals(cart);

    await cart.save();

    return await Cart.findById(
      cart._id
    ).populate("items.product");
  };

/*
=========================
REMOVE CART ITEM
=========================
*/

export const removeCartItemService =
  async (
    userId,
    productId
  ) => {
    const cart =
      await Cart.findOne({
        user: userId,
      });

    if (!cart) {
      throw new Error(
        CART_MESSAGES.CART_NOT_FOUND
      );
    }

    cart.items =
      cart.items.filter(
        (item) =>
          item.product.toString() !==
          productId
      );

    calculateCartTotals(cart);

    await cart.save();

    return cart;
  };

/*
=========================
CLEAR CART
=========================
*/

export const clearCartService =
  async (userId) => {
    const cart =
      await Cart.findOne({
        user: userId,
      });

    if (!cart) {
      throw new Error(
        CART_MESSAGES.CART_NOT_FOUND
      );
    }

    cart.items = [];

    calculateCartTotals(cart);

    await cart.save();

    return cart;
  };