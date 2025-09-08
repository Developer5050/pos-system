const  express = require("express");
const router = express.Router();
const {
  addSupplier,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
  getSuppliers,
} = require("../controllers/supplierController");

router.post("/add-supplier", addSupplier); // Add Supplier
router.get("/get-all-suppliers", getSuppliers); // Get All Suppliers
router.get("/get-supplier/:id", getSupplierById); // Get Supplier by ID
router.put("/update-supplier/:id", updateSupplier); // Update Supplier
router.delete("/delete-supplier/:id", deleteSupplier); // Delete Supplier

module.exports = router;
