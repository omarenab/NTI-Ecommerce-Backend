const express = require("express");
const { authenticate } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");
const {
  getCategories,
  createCategory,
  deleteCategory,
  updateCategory,
} = require("../controllers/category.controller");
const router = express.Router();

//Categories routes
router.get("/", getCategories);
router.post("/",authenticate,authorize('admin'), createCategory);
router.put('/',authenticate,authorize('admin'),updateCategory)
router.put("/:id", authenticate, authorize("admin"), deleteCategory);


module.exports = router;
