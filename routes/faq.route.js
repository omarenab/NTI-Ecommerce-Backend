const express = require("express");
const router = express.Router();
const { authenticate } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");
const {createFaq,getFaqs,updateFaq,deleteFaq} = require('../controllers/faq.controller')

router.post("/", authenticate, authorize("admin"), createFaq);
router.get("/", getFaqs);
router.put("/:id", authenticate, authorize("admin"), updateFaq);
router.delete("/:id", authenticate, authorize("admin"), deleteFaq);

module.exports = router;
