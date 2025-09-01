const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOrder,
  deleteOrder,
} = require("../controllers/orderController");

// create order route
router.post("/create-order", createOrder);
// create get all order
router.get("/get-all-orders", getOrder);
// create delete route
router.delete("/delete-order/:id", deleteOrder);

module.exports = router;
