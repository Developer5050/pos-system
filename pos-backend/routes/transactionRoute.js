const express = require("express");
const router = express.Router();
const {
  createTransaction,
  getTransaction,
  getTransactionById,
  deleteTransaction,
} = require("../controllers/transactionController");

router.post("/create-transaction", createTransaction);
router.get("/get-all-transaction", getTransaction);
router.get("/:id", getTransactionById);
router.delete("/delete-transaction/:id", deleteTransaction);

module.exports = router;
