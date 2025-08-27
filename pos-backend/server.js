require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");

// Routes
const authRoute = require("./routes/authRoute");

// PORT
const port = process.env.PORT;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/static", express.static(path.join(__dirname, "uplaod")));

// Use Routes
app.use("/user/auth", authRoute);

// Start Server
app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});
