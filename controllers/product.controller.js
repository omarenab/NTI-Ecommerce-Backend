const Product = require("../models/product.model");
const Category = require("../models/category.model");
const SubCategory = require("../models/subcategory.model");
const slugify = require("slugify");
const path = require("path");
const fs = require("fs");

exports.createProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      category,
      subcategory,
      attributes,
      stock,
      subCategoryId,
    } = req.body;
    const subCategory = await SubCategory.findById(subCategoryId);
    const imgURL = req.file ? req.file.filename : null;
    const slug = slugify(title || Date.now().toString(), { lower: true });
    const isExist = await Product.findOne({ slug });
    if (isExist) {
      res.status(400).json({ message: "slug is already exists !" });
    }
    const product = await Product.create(
      {
        title,
        slug,
        description,
        price,
        category,
        subcategory,
        attributes,
        stock,
        imgURL,
        category: subCategory.category,
        subcategory: subCategoryId,
      },
      { runValidators: true }
    );
    res.status(201).json({ message: "Product is Created", product });
  } catch (error) {
    console.log(`Error in createProduct : ${error.message}`);
    res.status(500).json({ message: "Product Creation Fails !" });
  }
};

exports.getPaginateProducts = (req, res) => {
  res.status(200).json({ message: "product ", data: res.paginateResult });
};

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findOne(id).populate("category subcategory");
    if (!product || product.isDeleted) {
      res.status(404).json({
        message: "Product not Found !",
      });
    }
    res.status(200).json({ message: "Product fetched successfully", product });
  } catch (error) {
    console.log(`Error in getProductById : ${error.message}`);

    res.status(500).json({ message: "Product failed to fetch !" });
  }
};

exports.getProductBySlug = async (req, res) => {
  try {
    const slug = req.params.slug;
    const product = await Product.findOne({ slug }).populate(
      "category subcategory",
      "name"
    );
    if (product.isDeleted || !product) {
      return res.status(404).json({ message: "Product not found !" });
    }
    res.status(200).json({ message: `get product  "${slug}"`, data: product });
  } catch (error) {
    console.log(`Error in getProductBySlug : ${error.message}`);
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { title, description, price, stock, subCategoryId } = req.body;
    const img = req.file ? req.file.filename : null;
    const { id } = req.params;
    const subCategory = await SubCategory.findById(subCategoryId);
    const updatedData = {
      title,
      description,
      price,
      stock,
      subCategoryId,
      category: subCategory?.category,
      subCategory: subCategoryId,
      img,
    };
    const oldProduct = await Product.findById(id);
    if (!oldProduct) {
      return res.status(404).json({ message: "Product not Found !" });
    }
    if (req.body.title) {
      updatedData.slug = slugify(req.body.title, { lower: true });
    }
    if (req.file) {
      if (oldProduct.img) {
        const oldImagePath = path.join(
          __dirname,
          "..",
          "uploads",
          oldProduct.img
        );
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      updatedData.img = req.file.filename;
    }
    const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      message: "Product Updated Successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.log(`Error in updateProduct : ${error.message}`);
    res
      .status(500)
      .json({ message: "Server error failed to update product !" });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true }
    );
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found !" });
    }
    res.status(200).json({ message: "Product soft deleted successfully" });
  } catch (error) {
    console.log(`Error in deleteProduct : ${error.message}`);

    res.status(500).json({ message: "Failed to delete the product !" });
  }
};
