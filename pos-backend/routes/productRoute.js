const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multerConfig");
const {
  addProduct,
  editProduct,
  getAllProducts,
  deleteProduct,
  getProductByCategory,
  updateStock
} = require("../controllers/productController");

// get all product route
router.get("/get-all-products", getAllProducts);
// add product route
router.post(
  "/add-product",
  upload.single("image"),
  addProduct
);
// edit product route
router.put("/edit-product/:id", upload.single("image"), editProduct);
// delete product route
router.delete("/delete-product/:id", deleteProduct);
// categroy by categpryId route
router.get("/category/:categoryId", getProductByCategory);
// stock update 
router.put("/stock-update", updateStock)

module.exports = router;
