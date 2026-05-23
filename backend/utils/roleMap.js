export const normalizeRole = (role) => {
  if (!role) return "user";

  return role.toLowerCase(); // USER → user, ADMIN → admin
};