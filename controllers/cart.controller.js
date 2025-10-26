const Cart = require("../models/cart.model");
const Product = require("../models/product.model");
const { v4: uuidv4 } = require("uuid");

//HELPER FUNCTION
async function findCart(userId, guestId) {
  if (userId) {
    return await Cart.findOne({ user: userId }).populate("items.product",'');
  } else if (guestId) {
    return await Cart.findOne({ guestId }).populate("items.product");
  }
  return null;
}

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity, guestId } = req.body;
    const userId = req.user ? req.user._id : null;
    let cart = await findCart(userId, guestId);

    if (!cart) {
      cart = new Cart({
        user: userId || undefined,
        guestId: userId ? undefined : guestId || uuidv4(),
        items: [{ product: productId, quantity }],
      });
    } else {
      const existingItem = cart.items.find(
        (item) => item.product.toString() === productId
      );
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }
    }
    await cart.save();
    return res.status(200).json({
      message: "Cart updated successfully",
      guestId: cart.guestId,
      cart,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to add into cart !" });
  }
};

exports.getCart = async (req, res) => {
  try {
    const { guestId } = req.query;
    const userId = req.user ? req.user._id : null;

    const cart = await findCart(userId, guestId);
    if (!cart) {
      return res.status(200).json({ message:'Empty Cart', cart: null });
    }
    res.status(200).json({ cart });
  } catch (error) {
    res.status(500).json({ message: "Failed to get cart !" });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { productId, guestId } = req.body;
    const userId = req.user ? req.user._id : null;

    let cart = await findCart(userId, guestId);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found !" });
    }
    cart.items = cart.items.filter((item) => {
      item.product.toString !== productId;
    });
    await cart.save();
    res.status(200).json({ message: "Item removed", cart });
  } catch (error) {
    res.status(500).json({ message: "Failed to remove item from cart !" });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const { guestId } = req.body;
    const userId = req.user ? req.user._id : null;
    let cart = await findCart(userId, guestId);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found !" });
    }
    cart.items = [];
    await cart.save();
  } catch (error) {
    res.status(500).json({ message: "Failed to clear cart !" });
  }
};
