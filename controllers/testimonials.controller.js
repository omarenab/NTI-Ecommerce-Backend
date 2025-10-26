const Testimonial = require("../models/testimonial.model");

exports.createTestimonial = async (req, res) => {
  try {
    const { body, rating } = req.body;
    const testimonial = await Testimonial.create({
      user: req.user._id,
      body,
      rating,
    });
    res.status(201).json({
      message: "Testimonial created successfully but not published yet ",
      data: testimonial,
    });
  } catch (error) {
    console.log(`Error in createTestimonial : ${error.message}`);
    res.status(500).json({ message: "Failed to create testimonial !" });
  }
};

exports.getNonApprovedTestimonials = async (req, res) => {
  try {
    let filter = { isDeleted: false, isApproved: false };

    const testimonials = await Testimonial.find(filter)
      .populate("user", "name ")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Testimonials fetched successfully",
      data: testimonials,
    });
  } catch (error) {
    console.log(`Error in getNonApprovedTestimonials ${error.message}`);
    res
      .status(500)
      .json({ message: "Failed to fetch NonApproved-testimonials !" });
  }
};

exports.getApprovedTestimonials = async (req, res) => {
  try {
    let filter = { isDeleted: false, isApproved: true };

    const testimonials = await Testimonial.find(filter)
      .populate("user", "name ")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Testimonials fetched successfully",
      data: testimonials,
    });
  } catch (error) {
    console.log(`Error in getNonApprovedTestimonials ${error.message}`);
    res
      .status(500)
      .json({ message: "Failed to fetch Approved-testimonials !" });
  }
};

exports.deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const testimonial = await Testimonial.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );
    if (!testimonial) {
      return res
        .status(404)
        .json({ message: `Testimonial with "${id}" is not found !` });
    }
    res.status(200).json({
      message: "Testimonial soft deleted successfully ",
      data: testimonial,
    });
  } catch (error) {
    console.log(`Error in deleteTestimonial : ${error.message}`);
    res.status(500).json({ message: "Failed to soft delete testimonial !" });
  }
};

exports.approveTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const testimonial = await Testimonial.findByIdAndUpdate(
      id,
      { isApproved: true },
      { new: true }
    );
    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found !" });
    }
    res
      .status(200)
      .json({ message: "Testimonial has been approved", data: testimonial });
  } catch (error) {
    console.log(`Error in approveTestimonial ${error.message}`);
    res.status(500).json({ message: "Approving testimonial failed !" });
  }
};
