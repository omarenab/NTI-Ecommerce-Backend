const mongoose = require("mongoose");
module.exports = async (req, res, next) => {
  try {
    const { category, subcategory, minPrice, maxPrice, q } = req.query;
    const filter = {};
    if (category && mongoose.Types.ObjectId.isValid(category)) {
      filter.category = category;
    }
    if (subcategory && mongoose.Types.ObjectId.isValid(subcategory)) {
      filter.subcategory = subcategory;
    }
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (q) {
      filter.$text = { $search: q };
    }
    req.filter = filter;
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid filter paramaters" });
  }
};
