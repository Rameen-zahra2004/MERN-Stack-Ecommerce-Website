import Cart from "./Cart.model.js";

import Product from "../product/product.model.js";

import { CART_MESSAGES } from "./cart.constants.js";

import { calculateCartTotals } from "./cart.utils.js";

/*
=========================
GET USER CART
=========================
*/

export const getCartService = async (userId) => {
  let cart = await Cart.findOne({
    user: userId,
  })
    .populate("items.product")
    .lean();

  if (!cart) {
    cart = await Cart.create({
      user: userId,
    });

    cart = await Cart.findById(cart._id).lean();
  }

  return cart;
};

/*
=========================
ADD TO CART
=========================
*/

export const addToCartService = async (userId, productId, quantity) => {
  if (quantity <= 0) {
    throw new Error(CART_MESSAGES.INVALID_QUANTITY);
  }

  const product = await Product.findById(productId);

  if (!product) {
    throw new Error(CART_MESSAGES.PRODUCT_NOT_FOUND);
  }

  if (product.stock < quantity) {
    throw new Error(CART_MESSAGES.OUT_OF_STOCK);
  }

  let cart = await Cart.findOne({
    user: userId,
  });

  if (!cart) {
    cart = await Cart.create({
      user: userId,
      items: [],
    });
  }

  const existingItem = cart.items.find(
    (item) => item.product.toString() === productId,
  );

  if (existingItem) {
    existingItem.quantity += quantity;

    existingItem.subtotal = existingItem.quantity * existingItem.price;
  } else {
    cart.items.push({
      product: product._id,

      quantity,

      price: product.price,

      subtotal: product.price * quantity,
    });
  }

  calculateCartTotals(cart);

  await cart.save();

  return await Cart.findById(cart._id).populate("items.product");
};

/*
=========================
UPDATE CART ITEM
=========================
*/

export const updateCartItemService = async (userId, productId, quantity) => {
  const cart = await Cart.findOne({
    user: userId,
  });

  if (!cart) {
    throw new Error(CART_MESSAGES.CART_NOT_FOUND);
  }

  const item = cart.items.find((item) => item.product.toString() === productId);

  if (!item) {
    throw new Error(CART_MESSAGES.PRODUCT_NOT_FOUND);
  }

  item.quantity = quantity;

  item.subtotal = item.price * quantity;

  calculateCartTotals(cart);

  await cart.save();

  return await Cart.findById(cart._id).populate("items.product");
};

/*
=========================
REMOVE CART ITEM
=========================
*/

export const removeCartItemService = async (userId, productId) => {
  const cart = await Cart.findOne({
    user: userId,
  });

  if (!cart) {
    throw new Error(CART_MESSAGES.CART_NOT_FOUND);
  }

  cart.items = cart.items.filter(
    (item) => item.product.toString() !== productId,
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

export const clearCartService = async (userId) => {
  const cart = await Cart.findOne({
    user: userId,
  });

  if (!cart) {
    throw new Error(CART_MESSAGES.CART_NOT_FOUND);
  }

  cart.items = [];

  calculateCartTotals(cart);

  await cart.save();

  return cart;
};
/*
=========================
ADD THIS TO cart.service.js — append below clearCartService.
Nothing above this in the existing file changes.
=========================
*/

/*
=========================
GET ALL CARTS (ADMIN)
=========================
Paginated listing across all users. Nothing else in this file provides
this — every other function is single-user-scoped, so this is genuinely
new, not a duplicate of anything.
*/
export const getAllCartsService = async ({ page = 1, limit = 20 } = {}) => {
  const skip = (page - 1) * limit;

  const [carts, total] = await Promise.all([
    Cart.find({})
      .populate("user", "firstName lastName email")
      .populate("items.product", "name price stock")
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Cart.countDocuments({}),
  ]);

  return {
    carts,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
};
