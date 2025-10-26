const mongoose = require("mongoose");

const testSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    body: {
      type: String,
      required: [true, "Testimonial body is required "],
      trim: true,
    },
    rating: {
      type: Number,
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
      default: 1,
    },
    isApproved: { type: Boolean, default: false, index: true },
    isDeleted: { type: Boolean, default: false, index: true }, // index used here to accelerate the database operations
  },
  { timestamps: true }
);

module.exports = mongoose.model("Testimonial", testSchema);
