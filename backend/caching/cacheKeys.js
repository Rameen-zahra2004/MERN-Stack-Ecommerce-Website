export const CACHE_KEYS = {
  PRODUCTS: "products",
  USERS: "users",
  ORDERS: "orders",
  REVENUE: "revenue",
  ACTIVE_USERS: "active_users",
};


export const CACHE_BUILDERS = {
  products: (query = {}) => {
    const {
      page = 1,
      limit = 10,
      category = "all",
    } = query;

    return `products:page:${page}:limit:${limit}:category:${category}`;
  },

  productById: (id) =>
    `product:${id}`,

  users: (query = {}) => {
    const { page = 1, role = "all" } =
      query;

    return `users:page:${page}:role:${role}`;
  },

  orders: (query = {}) => {
    const {
      page = 1,
      status = "all",
    } = query;

    return `orders:page:${page}:status:${status}`;
  },

  revenue: (type = "monthly") =>
    `revenue:${type}`,

  activeUsers: (range = "24h") =>
    `active_users:${range}`,
};