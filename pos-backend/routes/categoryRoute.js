const express = require("express");
const router = express.Router();

const {
  addCategory,
  updateCategory,
  deleteCategory,
  getAllCategories,
} = require("../controllers/categoryController");

// add category route
router.post("/add-category", addCategory);
// update category route
router.put("/update-category/:id", updateCategory);
// delete category route
router.delete("/delete-category/:id", deleteCategory);
// get all category route
router.get("/get-all-category", getAllCategories);

module.exports = router;
