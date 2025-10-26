const express = require("express");
const { authenticate } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");
const router = express.Router();
const {
 createTestimonial,
 getApprovedTestimonials,
 getNonApprovedTestimonials,
 deleteTestimonial,
 approveTestimonial
 
} = require("../controllers/testimonials.controller");

router.get("/approved",authenticate,authorize('admin'), getApprovedTestimonials);
router.get("/non-approved",authenticate,authorize('admin'), getNonApprovedTestimonials);
router.post("/", authenticate,authorize('user'), createTestimonial);
router.put("/:id", authenticate, authorize("admin"), deleteTestimonial);
router.patch(
  "/:id/approve",
  authenticate,
  authorize("admin"),
  approveTestimonial
);
module.exports = router
