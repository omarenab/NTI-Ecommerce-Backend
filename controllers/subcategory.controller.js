const SubCategory = require("../models/subcategory.model");
const Category = require("../models/category.model");

exports.createSubCategory = async (req, res) => {
  try {
    const { name, categoryId } = req.body;
    const isExisting = await SubCategory.findOne({ name });
    if (isExisting) {
      return res.status(400).json({ message: "Subcategory already exists !" });
    }
    const subCategory = await SubCategory.create({
      name,
      category: categoryId,
    });
    res.status(201).json({
      message: ` ${subCategory} SubCategory created successfully`,
      data: subCategory,
    });
  } catch (error) {
    console.log(`Error in create :${error.message}`);
    res.status(500).json({ message: "Subcategory creation failed !" });
  }
};

exports.getSubCategories = async (req, res) => {
  try {
    const subCategories = await SubCategory.find({ isDeleted: false }).populate(
      "category",
      "name"
    );
    res.status(200).json({
      message: "Subcategories fetched successfully",
      data: subCategories,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to get subcategories !" });
  }
};

exports.deleteSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const subCategory = await SubCategory.findByIdAndUpdate(id,{isDeleted:true},{new:true})
    if (!subCategory) {
      return res.status(404).json({ message: "Subcategory not found !" });
    }
    res.status(200).json("Subcategory deleted successfully");
  } catch (error) {
    console.log(`Error in deleteSubCategory :${error.message}`);
    res.status(500).json({ message: "Failed to delete Subcategory !" });
  }
};

exports.modifySubCategory = async (req, res) => {
  try{

    const { name } = req.body;
    const { id } = req.params;
    const isExisting = await SubCategory.findOne({ name });
    if (isExisting) {
      return res.status(400).json({ message: "SubCategory already Exists !" });
    }
    const subcategory = await SubCategory.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );
    res.status(200).json({
      message: `Subcategory ${subcategory.name} is updated successfully`,
      data: subcategory,
    });
  } catch(error){
    console.log(`Error in modifysubcategory : ${error.message}`);
    res.status(500).json({message : 'Failed to modify Subcategory !'})
    
  }
  }
