const mongoose = require("mongoose");
const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    guestId: {
      type: String,
      unique: true,
      sparse: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
        },
        priceAtAdd: { type: Number, required: true },
        priceChanged: { type: Boolean, default: false },
      },
    ],
    totalQuantity: { type: Number, default: 0 },
    totalPrice: { type: Number, default: 0 },
  },
  { timestamps: true }
);

cartSchema.pre("save", function (next) {
  if (this.items) {
    this.totalQuantity = this.items.reduce(
      (acc, item) => acc + item.quantity,
      0
    );

    this.totalPrice = this.items.reduce(
      (acc, item) => acc + item.quantity * item.priceAtAdd,
      0
    );
    this.updatedAt = Date.now();
  } else {
    this.totalPrice = 0;
    this.totalQuantity = 0;
  }
  next();
});
// Cleaning carts not used or processed for guests after 7 days
cartSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 7 });
module.exports = mongoose.model("Cart", cartSchema);
