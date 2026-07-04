
import express from "express";

console.log("USER ROUTES: importing auth.middleware");
const { protect } = await import("../auth/auth.middleware.js");
console.log("USER ROUTES: auth.middleware OK");

console.log("USER ROUTES: importing role.middleware");
const authorizeRoles = (await import("../roles/role.middleware.js")).default;
console.log("USER ROUTES: role.middleware OK");

console.log("USER ROUTES: importing user.controller");
const {
  createUserController,
  deleteUserController,
  getUserController,
  getUsersController,
  updateUserController,
} = await import("./user.controller.js");
console.log("USER ROUTES: user.controller OK");

const router = express.Router();

router.get(
  "/",
  protect,
  authorizeRoles("ADMIN", "SUPER_ADMIN"),
  getUsersController,
);
router.get("/:id", protect, getUserController);
router.post("/", createUserController);
router.put("/:id", protect, updateUserController);
router.delete(
  "/:id",
  protect,
  authorizeRoles("SUPER_ADMIN"),
  deleteUserController,
);

export default router;
