require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");

// Routes
const authRoute = require("./routes/authRoute");
const productRoute = require("./routes/productRoute");
const categoryRoute = require("./routes/categoryRoute");
const orderController = require("./routes/orderRoute");
const customerController = require("./routes/customerRoute");
const generateReceipt = require("./routes/receiptRoute");

// PORT
const port = process.env.PORT;

// Middleware
app.use(cors());
// Body parsers (important order)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Use Routes
app.use("/user/auth", authRoute);
app.use("/api/product", productRoute);
app.use("/api/category", categoryRoute);
app.use("/api/order", orderController);
app.use("/api/customer", customerController);
app.use("/api/receipt", generateReceipt);

// Start Server
app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});
