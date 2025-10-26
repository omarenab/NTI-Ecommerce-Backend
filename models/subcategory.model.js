const mongoose = require("mongoose");
const subSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    isDeleted:{type:Boolean,default:false}
  },
  { timestamps: true }
);

subSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true });
  }
  next();
});

subSchema.pre(["findOneAndUpdate", "findByIdAndUpdate"], function (next) {
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

module.exports = mongoose.model("Subcategory", subSchema);
