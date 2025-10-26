const mongoose = require("mongoose");
const mongoURI = process.env.MONGO_URI

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(mongoURI);
    console.log(`mongoDB connected ${conn.connection.host}`);
  } catch (err) {
    console.log(`Error : ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
