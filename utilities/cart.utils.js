const Cart = require("../models/cart.model");

exports.mergeCarts = async (userId, guestId) => {
  try {
    if (!guestId || !userId) return;
    const guestCart = await Cart.findOne({ guestId });
    if (!guestCart || guestCart.items.length === 0) return;

    let userCart = await Cart.findOne({ user: userId });
    if (!userCart) {
      guestCart.user = userId;
      guestCart.guestId = undefined;
      await guestCart.save();
      return;
    }
    guestCart.items.forEach((guestItem) => {
      const match = userCart.items.find(
        (userItem) =>
          userItem.product.toString() === guestItem.product.toString()
      );
      if (match) {
        match.quantity += guestItem.quantity;
      } else {
        userCart.items.push(guestItem);
      }
    });
    await userCart.save();
    await guestCart.deleteOne();
  } catch (error) {
    res.status(500).json({ message: "Error in mergin carts !" });
  }
};
