const express = require("express");
const router = express.Router();

const { getDashboardStats, chartStats } = require("../controllers/dashboardController");

// get dashboard stats
router.get("/stats", getDashboardStats);
// chart stats
router.get("/chart-stats", chartStats);

module.exports = router;