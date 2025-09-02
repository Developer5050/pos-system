const express = require("express");
const router = express.Router();
const {
  createOrder,
  getAllOrder,
  deleteOrder,
  getOrderReceipt,
  updateOrderStatus,
  getLatestOrders,
} = require("../controllers/orderController");

// create order route
router.post("/create-order", createOrder);
// create get all order
router.get("/get-all-orders", getAllOrder);
// create delete route
router.delete("/delete-order/:id", deleteOrder);
// get Order
router.get("/receipt/:orderId", getOrderReceipt);
// update Status route
router.put("/:orderId/status", updateOrderStatus);
// lastest order route
router.get("/latest", getLatestOrders);

module.exports = router;
