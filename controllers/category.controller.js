const Category = require("../models/category.model");
const SubCategory = require("../models/subcategory.model");
const slugify = require("slugify");

exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const slug = slugify(name, { lower: true });
    const isExisting = await Category.findOne({ name });
    if (isExisting) {
      return res.status(400).json({ message: "Category already exists !" });
    }
    const category = await Category.create({ name, slug });
    res.status(201).json({
      message: ` ${category.name} Category created successfully`,
      data: category,
    });
  } catch (error) {
    console.log(`Error in createCategory : ${error.message}`);
    res
      .status(500)
      .json({ message: "Category creation failed !", error: error.message });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isDeleted: false });
    const data = [];

    for await (const category of categories) {
      const subCategories = await SubCategory.find({
        isDeleted: false,
        category: category._id,
      }).select("name");

      data.push({
        _id: category._id,
        name: category.name,
        subCategories,
      });
    }

    return res.status(200).json({
      message: "Categories fetched successfully",
      data: data,
    });
  } catch (error) {
    console.log(`Error in getCategories: ${error.message}`);
    return res.status(500).json({
      message: "Failed to fetch categories !",
    });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    const isExisting = await Category.findOne({ name });
    if (isExisting) {
      return res.status(400).json({ message: "Category  already exists" });
    }
    const category = await Category.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );
    return res.status(200).json({
      message: `${category.name} Category updated successfully`,
      data: category,
    });
  } catch (error) {
    console.log(`Error In updateCategory: ${error.message}`);
    return res.status(500).json({ message: "Updating Category failed" });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndUpdate(id,{isDeleted:true},{new:true});
    if (!category) {
      return res.status(404).json({ message: "Category not found !" });
    }
    res.status(200).json({message: ` ${category.name}  deleted successfully `,data:category});
  } catch (error) {
    console.log(`Error in deleteCategory : ${error.message}`);
    
    res.status(500).json({ message: "Failed to delete Category !" });
  }
};
