const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/auth.controller");
const { authenticate } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");
const {
  getAllUsers,
  getLoggedInUser,
  getUserById,
  deleteMySelfUser,
  deleteUserById,
  restoreUser,
  updateLoggedInUser
  
} = require("../controllers/user.controller");
const { login, register } = require("../controllers/auth.controller");

router.post("/register", register("user"));
router.post("/login", login);
router.get("/all", authenticate, authorize("admin"), getAllUsers);
router.get('/',authenticate,authorize('user','admin'),getLoggedInUser)
router.get('/:id',authenticate,authorize('admin'),getUserById)
router.put('/',authenticate,authorize('user'),deleteMySelfUser)
router.put('/:id',authenticate,authorize('admin'),deleteUserById)
router.put('/update/:id',authenticate,authorize('admin'),updateLoggedInUser)
router.put('/restore/:id',authenticate,authorize('admin'),restoreUser)



module.exports = router;
