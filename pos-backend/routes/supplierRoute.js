const express = require("express");
const router = express.Router();
const {
  createSupplier,
  getAllSupplier,
  deleteSupplier,
  updateSupplier
} = require("../controllers/supplierController");
const upload = require("../middlewares/multerConfig");

// create supplier
router.post("/create-supplier", upload.single("image"), createSupplier);
// get all suppliers
router.get("/get-all-suppliers", getAllSupplier);
// update supplier
router.put("/update/:id", upload.single("image"), updateSupplier);
// delete supplier
router.delete("/delete-supplier/:id", deleteSupplier);

module.exports = router;
