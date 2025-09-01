const express = require("express"); // <-- correct
const router = express.Router();

const { generateReceipt } = require("../controllers/receiptController");

// Route
router.get("/:orderId", generateReceipt);

module.exports = router;
