const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const { mergeCarts } = require("../utilities/cart.utils");

const signToken = (user) => {
  return jwt.sign(
    { id: user._id, name: user.name, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
  );
};

exports.register = (role) => {
  return async (req, res) => {
    try {
      const { name, email, password, addresses, phoneNumber } = req.body;
      if (!["admin", "user"].includes(role)) {
        return res.status(400).json({ Error: "Invalid role" });
      }
      const existing = await User.findOne({ email });
      if (existing) {
        //Account Reactivation
        if (existing.isDeleted === true) {
          existing.name = name;
          existing.password = password;
          existing.role = role;
          existing.phoneNumber = phoneNumber;
          existing.addresses = addresses;
          existing.isDeleted = false;
          await existing.save();
          const token = signToken(existing);
          return res.status(201).json({
            message: `${role} is registered successfully`,
            data: { token },
          });
        }
        return res.status(400).json({ message: "Email already exists !" });
      }
      const user = await User.create({
        name,
        email,
        password,
        addresses,
        phoneNumber,
        role,
      });
      const token = signToken(user);
      res.status(201).json({
        message: `${role} is registered successfully`,
        data: user,
        token: token,
      });
    } catch (error) {
      console.log(`Error in register : ${error.message}`);
      res.status(500).json({ message: `Failed to register ${role} !` });
    }
  };
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "Email or Password is Invalid !" });
    }
    const isCorrect = await user.correctPassword(password);
    if (isCorrect) {
      const token = signToken(user);
      await mergeCarts(user._id, guestId);
      return res
        .status(200)
        .json({ message: "login successfull", data: { token } });
    }
    return res.status(404).json({ message: "Email or Password is invalid !" });
  } catch (error) {
    console.log(`Error in login : ${error.message}`);
    res.status(500).json({ message: "Error login failed !" });
  }
};
