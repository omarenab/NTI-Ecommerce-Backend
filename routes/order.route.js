const express = require("express");
const { authenticate } = require("../middlewares/auth.middleware");
const {
  placeOrder,
  getOrderById,
  updateOrderStatus,
  getOrderStats,
  getUserOrders
} = require("../controllers/order.controller");
const { authorize } = require("../middlewares/role.middleware");
const router = express.Router();

router.post("/place", authenticate, placeOrder);
router.get("/my-orders", authenticate, getUserOrders);
router.get("/:id", authenticate, getOrderById);
router.patch(
  "/:orderId/status",
  authenticate,
  authorize("admin"),
  updateOrderStatus
);
router.get("/stats",authenticate,authorize('admin'),getOrderStats)

module.exports = router;
