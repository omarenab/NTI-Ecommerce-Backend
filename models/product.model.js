const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: String, required: true },
    stock: { type: Number, required: true },
    imgURL: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    attributes: { type: Map, of: String },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    subcategory: { type: mongoose.Schema.Types.ObjectId, ref: "Subcategory" },
    rating: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

productSchema.pre(/^find/, function (next) {
  this.where({ isDeleted: { $ne: true } }); // only get non-deleted
  next();
});

module.exports = mongoose.model("Product", productSchema);
