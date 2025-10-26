const Category = require("../models/category.model");
const Navbar = require("../models/navbar.model");
const Cart = require('../models/cart.model')


exports.createNavbar = async (req, res) => {
  try {
    const { categories, authButtons } = req.body;
    const logoUrl = req.file ? req.file.filename : null;

    const navbar = new Navbar({ logoUrl, categories, authButtons });
    await navbar.save();

    const populatedNavbar = await navbar.populate({
      path: "categories",
      populate: { path: "subCategories", select: "name slug" },
    });

    res.status(201).json({ message: "Navbar created", data: populatedNavbar });
  } catch (error) {
    res.status(500).json({ message: "Failed to create navbar" });
  }
};

exports.updateNavbar = async (req, res) => {
  try {
    const { title ,categories, authButtons } = req.body;
    const logoUrl = req.file ? req.file.filename : null;

    const navbar = await Navbar.findOneAndUpdate(
      {},
      { title ,logoUrl, categories, authButtons },
      { new: true }
    ).populate({
      path: "categories",
      populate: { path: "subCategories", select: "name slug" },
    });

    res.status(200).json(navbar);
  } catch (error) {
    res.status(500).json({ message: "Failed to update navbar", error });
  }
};

exports.getNavbar = async (req, res) => {
  try {
    const navbar = await Navbar.findOne().populate({
      path: "categories",
      populate: { path: "subCategories", select: "name slug" },
    });

    let cartCount = 0;
    if (req.user) {
      const cart = await Cart.findOne({ user: req.user._id });
      cartCount = cart ? cart.items.length : 0;
    }

    res.status(200).json({  navbar, cartCount });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch navbar", error });
  }
};