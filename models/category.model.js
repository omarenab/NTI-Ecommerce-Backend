const mongoose = require("mongoose");
const slugify = require("slugify");
const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, unique: true },
    subCategories: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Subcategory" },
    ],
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);
categorySchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true });
  }
  next();
});

categorySchema.pre(["findOneAndUpdate", "findByIdAndUpdate"], function (next) {
  const update = this.getUpdate();
  if (update.name) {
    update.slug = slugify(update.name, { lower: true });
  }
  if (update.$set && update.$set.name) {
    update.$set.slug = slugify(update.$set.name, { lower: true });
  }

  this.setUpdate(update);
  next();
});

module.exports = mongoose.model("Category", categorySchema);
