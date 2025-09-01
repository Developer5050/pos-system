const express = require("express");
const {
  getCustomers,
  deleteCustomer,
} = require("../controllers/customerController");

const router = express.Router();

router.get("/get-customer", getCustomers);
router.delete("/delete-customer/:id", deleteCustomer);


module.exports  = router;

