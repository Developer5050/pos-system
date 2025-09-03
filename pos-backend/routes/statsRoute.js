const express = require("express");
const router = express.Router();

const {
  getDashboardStats,
  chartStats,
  lowStockThreshold,
} = require("../controllers/dashboardController");

// get dashboard stats
router.get("/stats", getDashboardStats);
// chart stats
router.get("/chart-stats", chartStats);
// low stock route
router.get("/low-stock", lowStockThreshold);

module.exports = router;
