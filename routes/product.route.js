const express = require("express");
const {
  getPaginateProducts,
  getProductById,
  getProductBySlug,
  deleteProduct,
  createProduct,
} = require("../controllers/product.controller");

const router = express.Router();
const upload = require("../middlewares/upload.middleware");
const paginate = require("../middlewares/paginate.middleware");
const Product = require("../models/product.model");
const { authenticate } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");
const filter = require("../middlewares/filter.middleware");

router.get("/all", filter, paginate(Product), getPaginateProducts);
router.get("/id/:id", getProductById);
router.post(
  "/create",
  authenticate,
  authorize("admin"),
  upload.single("iconProduct"),
  createProduct
);
router.put(
  "/edit",
  authenticate,
  authorize("admin"),
  upload.single("iconProduct"),
  updateProduct
);
router.put("/delete", authenticate, authorize("admin"), deleteProduct);
router.get("/:slug", getProductBySlug);

module.exports = router;
