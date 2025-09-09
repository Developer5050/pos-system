require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");

// Routes
const authRoute = require("./routes/authRoute");
const productRoute = require("./routes/productRoute");
const categoryRoute = require("./routes/categoryRoute");
const orderRoute = require("./routes/orderRoute");
const customerRoute = require("./routes/customerRoute");
const dashboardRoute = require("./routes/statsRoute");
const settingRoute = require("./routes/settingRoutes");
const supplierRoute = require("./routes/supplierRoute");
const transactionRoute = require("./routes/transactionRoute");

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
app.use("/api/order", orderRoute);
app.use("/api/customer", customerRoute);
app.use("/api/dashboard", dashboardRoute);
app.use("/api/setting", settingRoute);
app.use("/api/supplier", supplierRoute);
app.use("/api/transaction", transactionRoute);

// Start Server
app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});
