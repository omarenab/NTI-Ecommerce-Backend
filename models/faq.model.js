const mongoose = require("mongoose");
const faqSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);
faqSchema.pre(/^find/, function (next) {
  this.where({ isDeleted: { $ne: true } }); // only get non-deleted
  next();
});
module.exports = mongoose.model("FAQ", faqSchema);
