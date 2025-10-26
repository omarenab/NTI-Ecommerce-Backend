const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const connectDB = require("./config/db.config");
const path = require("path");
const port = process.env.PORT;
const app = express();
const corsMiddleware = require("./middlewares/cors.middleware");

app.use(corsMiddleware);
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "./uploads")));

app.use("/api/users", require("./routes/user.route"));
app.use("/api/auth", require("./routes/auth.route"));
app.use("/api/products", require("./routes/product.route"));
app.use("/api/cart", require("./routes/cart.route"));
app.use("/api/orders", require("./routes/order.route"));
app.use("/api/faqs", require("./routes/faq.route"));
app.use("/api/testimonials", require("./routes/testimonial.route"));
app.use("/api/categories", require("./routes/category.route"));
app.use("/api/subcategories", require("./routes/subcategory.route"));
app.use("/api/navbar", require("./routes/navbar.route"));
connectDB();

app.listen(port, () => {
  console.log(`Server started at port ${port}`);
});
