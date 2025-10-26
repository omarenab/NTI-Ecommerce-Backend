const Order = require("../models/order.model");
const Product = require("../models/product.model");
const Cart = require("../models/cart.model");

exports.placeOrder = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      message: "Please login or create",
      requireLogin: true, // for using in frontend to redirect
    });
  }
  const userId = req.user._id;
  const session = await mongoose.StartSession();
  try {
    session.startTransaction();
    const cart = await Cart.findOne({ user: userId })
      .populate("items.product")
      .session(session);
    if (!cart || cart.items.length === 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Cart is empty" });
    }
    const lowstockWarnings = [];
    const orderItems = [];
    let totalPrice = 0;

    for (const item of cart.items) {
      const product = await Product.findById(item.product._id).session(session);
      if (!product) {
        await session.abortTransaction();
        session.endSession();
        return res
          .status(404)
          .json({ message: `Product "${item.product.name}" not found !` });
      }
      if (product.stock < item.quantity) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          message: `Insufficient stock for ${product.name} only ${product.stock} left`,
        });
      }
      if (product.stock < 5) {
        lowstockWarnings.push(
          `Hurry up! only ${product.name} ${product.stock} left `
        );
      }
      product.stock -= item.quantity;
      await product.save({ session });

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
      });
      totalPrice += product.price * item.quantity;
    }
    const newOrder = await Order.create(
      [
        {
          user: userId,
          items: orderItems,
          shipping: req.body.shipping,
          totalPrice: totalPrice,
          paymentStatus: "pending",
          orderStatus: "processing",
          history: [
            {
              status: "processing",
              changedBy: userId,
            },
          ],
        },
      ],
      { session }
    );
    await cart.deleteOne({ _id: cart._id }, { session });
    await session.commitTransaction();
    session.endSession();
    return res.status(201).json({
      message: "Order Place Successfully",
      order: newOrder[0],
      lowstockWarnings,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res
      .status(500)
      .json({ message: "Error Occured while placing your order !" });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: user.req._id })
      .populate("items.product", "name price")
      .populate("user", "name email")
      .populate("history.changedBy", "name email role")
      .sort({ createdAt: -1 });
    res.status(200).json({ data: orders });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user orders" });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("items.product", "name price")
      .populate("user", "name email")
      .populate("history.changedBy", "name email role"); // 👈 Added

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }
    res.status(200).json({ data: order });
  } catch (error) {
    res.status(500).json({ message: "Failed to get order." });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "processing",
      "prepared",
      "shipped",
      "delivered",
      "cancelled",
    ];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid order status !" });
    }

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found !" });

    order.orderStatus = status;
    order.history.push({
      status,
      changedBy: req.user._id,
    });

    await order.save();

    res.status(200).json({ message: "Order status updated.", data: order });
  } catch (error) {
    res.status(500).json({ message: "Failed to update order status !" });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found !" });
    }
    if (["shipped", "delivered"].includes(order.orderStatus)) {
      return res
        .status(400)
        .json({ message: "Order Cannot be cancelled after shipment" });
    }
    order.orderStatus = "cancelled";
    order.history.push({
      status: "cancelled",
      changedBy: req.user._id,
    });
    await order.save();
    res.status(200).json({ message: "Order Cancelled successfully", order });
  } catch (error) {
    res.status(500).json({ message: "Failed to cancel order !" });
  }
};

exports.getOrderStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({
      orderStatus: "processing",
    });
    const shippedOrders = await Order.countDocuments({
      orderStatus: "shipped",
    });
    const deliveredOrders = await Order.countDocuments({
      orderStatus: "delivered",
    });
    const cancelledOrders = await Order.countDocuments({
      orderStatus: "cancelled",
    });

    res.status(200).json({
      data: [
        totalOrders,
        pendingOrders,
        shippedOrders,
        deliveredOrders,
        cancelledOrders,
      ],
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch order statistics !" });
  }
};
