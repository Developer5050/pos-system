const express = require("express");
const router = express.Router();
const {
  createOrder,
  getAllOrder,
  deleteOrder,
  getOrder
} = require("../controllers/orderController");

// create order route
router.post("/create-order", createOrder);
// create get all order
router.get("/get-all-orders", getAllOrder);
// create delete route
router.delete("/delete-order/:id", deleteOrder);
// get Order 
router.get("/get-order", getOrder);

module.exports = router;
