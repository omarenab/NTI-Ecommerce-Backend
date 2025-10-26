const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

exports.authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer" || !authHeader)) {
    return res.status(401).json({ message: "No Token is Provided !" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decode.id).select("-password");
    if (!user) {
      res.status(401).json({ message: "User Not Found !" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: "token is not valid or expired" });
  }
};

exports.authenticate_optional = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
    }
  } catch (error) {
    // ignore errors — just continue as guest
  }
  next();
};
