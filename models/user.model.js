const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Name is required "], trim: true },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please enter a valid email address",
      ],
    },
    phoneNumber: { type: String, required: [true, "Phone number is required"] ,trim:true},
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 8,
      select: false,
      match: [
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character",
      ],
    },
    addresses: [
      { type: String, required: [true, "address is required "], trim: true },
    ],
    role: { type: String, enum: ["admin", "user"], default: "user" },
    isDeleted: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
userSchema.pre("findOneAndUpdate","findByIdAndUpdate", function (next) {
  const update = this.getUpdate();
  if (!update.password && !(update.$set && update.$set.password)) {
    return next();
  }
  const password = update.password || update.$set.password;
  const hashed = bcrypt.hashSync(password, 12);
  if (update.password) {
    update.password = hashed;
  } else {
    update.$set.password = hashed;
  }
  next();
});

userSchema.methods.correctPassword =  function (inputPassword) {
  return  bcrypt.compare(inputPassword, this.password);
};
userSchema.pre(/^find/, function (next) {
  this.where({ isDeleted: { $ne: true } })
  next();
});

module.exports = mongoose.model("User", userSchema);
