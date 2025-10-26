const express = require("express");
const router = express.Router();
const { authenticate } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");
const {
  createSubCategory,
  getSubCategories,
  deleteSubCategory,
  modifySubCategory,
} = require("../controllers/subcategory.controller");

router.get("/", getSubCategories);
router.post("/", authenticate, authorize("admin"), createSubCategory);
router.put("/delete/:id", authenticate, authorize("admin"), deleteSubCategory);
router.put("/modify/:id", authenticate, authorize("admin"), modifySubCategory);

module.exports = router;
