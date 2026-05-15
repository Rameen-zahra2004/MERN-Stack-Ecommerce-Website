import Product from "./product.model.js";

import {
  generateSlug,
} from "./product.utils.js";

import {
  PRODUCT_MESSAGES,
} from "./product.constants.js";

/*
=========================
CREATE PRODUCT
=========================
*/

export const createProductService =
  async (payload) => {
    const product =
      await Product.create({
        ...payload,

        slug: generateSlug(
          payload.name
        ),
      });

    return product;
  };

/*
=========================
GET ALL PRODUCTS
=========================
*/

export const getProductsService =
  async (query) => {
    const {
      page = 1,
      limit = 10,
      category,
      search,
    } = query;

    const filter = {
      isActive: true,
    };

    if (category) {
      filter.category = category;
    }

    if (search) {
      filter.$text = {
        $search: search,
      };
    }

    const products =
      await Product.find(filter)
        .skip(
          (page - 1) * limit
        )
        .limit(limit)
        .sort({
          createdAt: -1,
        });

    return products;
  };

/*
=========================
GET SINGLE PRODUCT
=========================
*/

export const getProductService =
  async (id) => {
    const product =
      await Product.findById(id);

    if (!product) {
      throw new Error(
        PRODUCT_MESSAGES.NOT_FOUND
      );
    }

    return product;
  };

/*
=========================
UPDATE PRODUCT
=========================
*/

export const updateProductService =
  async (id, payload) => {
    if (payload.name) {
      payload.slug =
        generateSlug(
          payload.name
        );
    }

    const product =
      await Product.findByIdAndUpdate(
        id,
        payload,
        {
          new: true,
        }
      );

    if (!product) {
      throw new Error(
        PRODUCT_MESSAGES.NOT_FOUND
      );
    }

    return product;
  };

/*
=========================
DELETE PRODUCT (SOFT)
=========================
*/

export const deleteProductService =
  async (id) => {
    const product =
      await Product.findByIdAndUpdate(
        id,
        {
          isActive: false,
        },
        { new: true }
      );

    if (!product) {
      throw new Error(
        PRODUCT_MESSAGES.NOT_FOUND
      );
    }

    return product;
  };