const mongoose = require("mongoose");

const navbarSchema = new mongoose.Schema(
  {
    title:{type:String,required:true},
    logoUrl: { type: String, required: true },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    authButtons: [
      {
        label: { type: String, required: true },
        route: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Navbar", navbarSchema);
