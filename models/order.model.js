const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: "User" },
    items: [
      {
        product: {
          type: mongoose.Types.ObjectId,
          ref: "Product",
        },
        quantity: Number,
        price: Number,
      },
    ],
    shipping: {
      addresses: [
        {
          type: String,
          required: true,
        },
      ],
      phone : String,
      city: String,
      country: String,  
    },
    totalPrice: Number,
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    orderStatus: {
      type: String,
      enum: ["processing", "prepared", "shipped", "delivered", "cancelled"],
      default: "processing",
    },
    history: [
      {
        status: String,
        changedAt: { type: Date, default: Date.now },
        changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    ],
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Order", orderSchema);

orderSchema.pre(/^find/, function (next) {
  this.where({ isDeleted: { $ne: true } });
  next();
});
orderSchema.pre(/^update/, function (next) {
  this.where({ isDeleted: { $ne: true } });
  next();
});
