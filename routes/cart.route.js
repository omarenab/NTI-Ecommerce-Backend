const express = require("express");
const router = express.Router();
const {authenticate_optional} = require('../middlewares/auth.middleware')
const { addToCart, getCart } = require("../controllers/cart.controller");


router.get('/',authenticate_optional,getCart)
router.post('/add',authenticate_optional,addToCart)
// router.put('/update/:productId',authenticate_optional,)
// router.delete("/remove/:productId", authenticate_optional, );

module.exports = router



