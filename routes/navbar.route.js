const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload.middleware");
const {
  getNavbar,
  createNavbar,
  updateNavbar,
} = require("../controllers/navbar.controller");
const { authenticate } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");

router.get("/", getNavbar);

router.post(
  "/",
  upload.single("logo"),
  createNavbar
);
router.put("/", authorize("admin"), upload.single("logo"), updateNavbar);

module.exports = router;
