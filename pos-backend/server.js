require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const connectDB = require("./database/databaseConfig");
const authRoutes = require("./routes/authRoute");

// Connect to MongoDB
connectDB();

// Port
const port = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/user/auth", authRoutes);

app.listen(port, () => {
  console.log(`Server running is port ${port}`);
});
