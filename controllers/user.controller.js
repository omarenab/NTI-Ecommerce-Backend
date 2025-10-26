const User = require("../models/user.model");
const mongoose = require("mongoose");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ isDeleted: false, role: "user" }).select(
      "-password"
    );
    res
      .status(200)
      .json({ message: "Users fetched successfully ", data: users });
  } catch (error) {
    console.log(`Error in getAllUsers : ${error.message}`);
    res.status(500).json({ message: "Failed to fetch users !" });
  }
};

exports.getLoggedInUser = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.user._id)) {
      return res.status(400).json({ message: "Invalid user ID format !" });
    }

    const user = await User.findById(req.user._id).select("-password");
    if (!user || user.isDeleted === true) {
      return res.status(404).json({ message: "User not found !" });
    }
    res.status(200).json({ message: "User fetched successfully", data: user });
  } catch (error) {
    console.log(`Error in getUser : ${error.message}`);
    res.status(500).json({ message: "Failed to fetch user !" });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID format !" });
    }
    const user = await User.findById(id).select("-password");
    if (!user || user.isDeleted === true) {
      return res.status(404).json({ message: "User not found !" });
    }
    res.status(200).json({ message: "User fetched successfully", data: user });
  } catch (error) {
    console.log(`Error in getUser : ${error.message}`);
    res.status(500).json({ message: "Failed to fetch user !" });
  }
};

exports.updateLoggedInUser = async (req, res) => {
  try {
    const { name, email, password, phoneNumber, addresses } = req.body;
    const userId = req.user._id;
    const user = await User.findByIdAndUpdate(
      userId,
      {
        name,
        email,
        password,
        phoneNumber,
        addresses,
      },
      { new: true }
    );
    res.status(200).json({
      message: "Your Personal profile updated successfully ",
      data: user,
    });
  } catch (error) {
    console.log(`Error in updateLoggedInUser : ${error.message}`);
    res.status(500).json({ message: "Updating User Failed !" });
  }
};

exports.deleteMySelfUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (user.role === "admin") {
      return res
        .status(403)
        .json({ message: `Unauthorized to delete ${user.role} ` });
    }
    user.isDeleted = true;
    await user.save();
    res.status(200).json({
      message: "User deleted successfully !",
      data: user,
    });
  } catch (error) {
    console.log(`Error in deleteMySelfUser : ${error.message}`);
    res.status(500).json("Failed to delete user !");
  }
};

exports.deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (user.role === "admin") {
      return res
        .status(400)
        .json({ message: "Unauthorized to delete admin !" });
    }
    user.isDeleted = true;
    await user.save();
    res.status(200).json({ message: `${user.role} is deleted successfully` });
  } catch (error) {
    console.log(`Error In deleteUserById: ${err.message}`);
    return res.status(500).json({ message: "Failed to delete !" });
  }
};

exports.restoreUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found !" });
    }
    if (!user.isDeleted) {
      return res.status(400).json({ message: "User is already active !" });
    }
    user.isDeleted = false;
    await user.save();
    res
      .status(200)
      .json({ message: `User is restored successfully `, data: user });
  } catch (error) {
    console.log(`Error in restoreUser : ${error.message}`);
    res.status(500).json({ message: "Failed to restore user" });
  }
};
