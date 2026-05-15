export const CACHE_KEYS = {
  /*
  =========================
  BASE ENTITIES
  =========================
  */
  PRODUCTS: "products",
  USERS: "users",
  ORDERS: "orders",
  REVENUE: "revenue",
  ACTIVE_USERS: "active_users",
};

/*
=========================
CACHE KEY BUILDERS (IMPORTANT FOR REAL SYSTEMS)
=========================
*/

export const CACHE_BUILDERS = {
  /*
  =========================
  PRODUCTS
  =========================
  */
  products: (query = {}) => {
    const {
      page = 1,
      limit = 10,
      category = "all",
    } = query;

    return `products:page:${page}:limit:${limit}:category:${category}`;
  },

  /*
  =========================
  SINGLE PRODUCT
  =========================
  */
  productById: (id) =>
    `product:${id}`,

  /*
  =========================
  USERS
  =========================
  */
  users: (query = {}) => {
    const { page = 1, role = "all" } =
      query;

    return `users:page:${page}:role:${role}`;
  },

  /*
  =========================
  ORDERS
  =========================
  */
  orders: (query = {}) => {
    const {
      page = 1,
      status = "all",
    } = query;

    return `orders:page:${page}:status:${status}`;
  },

  /*
  =========================
  REVENUE (DAILY / MONTHLY / YEARLY)
  =========================
  */
  revenue: (type = "monthly") =>
    `revenue:${type}`,

  /*
  =========================
  ACTIVE USERS (TIME BASED)
  =========================
  */
  activeUsers: (range = "24h") =>
    `active_users:${range}`,
};