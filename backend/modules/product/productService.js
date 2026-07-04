import Product from "./product.model.js";

import { generateSlug } from "./product.utils.js";

import { PRODUCT_MESSAGES } from "./product.constants.js";


export const createProductService = async (payload) => {
  const product = await Product.create({
    ...payload,

    slug: generateSlug(payload.name),
  });

  return product;
};


export const getProductsService = async (query) => {
  const { page = 1, limit = 10, category, search } = query;

  const filter = { isActive: true };

  if (category) filter.category = category;
  if (search) filter.$text = { $search: search };

  const [products, total] = await Promise.all([
    Product.find(filter)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .sort({ createdAt: -1 }),
    Product.countDocuments(filter),
  ]);

  return {
    products,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
  };
};

export const getProductService = async (id) => {
  const product = await Product.findById(id);

  if (!product) {
    throw new Error(PRODUCT_MESSAGES.NOT_FOUND);
  }

  return product;
};


export const updateProductService = async (id, payload) => {
  if (payload.name) {
    payload.slug = generateSlug(payload.name);
  }

  const product = await Product.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    throw new Error(PRODUCT_MESSAGES.NOT_FOUND);
  }

  return product;
};


export const deleteProductService = async (id) => {
  const product = await Product.findByIdAndUpdate(
    id,
    {
      isActive: false,
    },
    { new: true },
  );

  if (!product) {
    throw new Error(PRODUCT_MESSAGES.NOT_FOUND);
  }

  return product;
};
