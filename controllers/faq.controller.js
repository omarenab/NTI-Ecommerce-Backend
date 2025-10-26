const FAQ = require("../models/faq.model");

exports.createFaq = async (req, res) => {
  try {
    const { question, answer } = req.body;
    q = " ?";
    question += q;
    const faq = await FAQ.create({ question, answer });
    res.status(201).json({ message: "FAQ is created ", data: faq });
  } catch (error) {
    console.log(`Error in createFaq : ${error.message}`);
    res.status(500).json({ message: "Failed to create FAQ" });
  }
};

exports.getFaqs = async (req, res) => {
  try {
    const faqs = await FAQ.find();
    if (!faqs) {
      return res.status(404).json({ message: "FAQs are not found !" });
    }
    res.status(200).json({ message: "FAQs fetched successfully", data: faqs });
  } catch (error) {
    console.log(`Error in getFaqs : ${error.message}`);
    res.status(500).json({ message: "Failed to fetch FAQs !" });
  }
};

exports.updateFaq = async (req, res) => {
  try {
    const { question, answer } = req.body;
    q = " ?";
    question += q;
    const updates = { question, answer };
    const { id } = req.params;
    const isExisting = await FAQ.findOne({ question });
    if (isExisting) {
      return res.status(404).json({ message: "Question already exist !" });
    }
    const faq = await FAQ.findByIdAndUpdate(id, updates, { new: true });
    res.status(200).json({ message: "FAQ updated successfully", data: faq });
  } catch (error) {
    console.log(`Error in update Faq: ${err.message}`);
    res.status(500).json({ message: "FAQ failed to update !" });
  }
};

exports.deleteFaq = async (req, res) => {
  try {
    const { id } = req.params;
    const faq = await FAQ.findByIdAndUpdate(
      íd,
      { isDeleted: true },
      { new: true }
    );

    res.status(200).json({ message: "FAQ deleted successfully", data: faq });
  } catch (error) {
    console.log(`Error in delteFaq : ${error.message}`);

    res.status(500).json({ message: `Failed to delete faq  ` });
  }
};
