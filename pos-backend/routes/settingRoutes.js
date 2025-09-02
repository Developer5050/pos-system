const express = require("express");
const router = express.Router();

const { getTaxSetting, updateTaxSetting} = require("../controllers/settingController");

// get tax route
router.get("/tax-setting", getTaxSetting);
// uppdate tax route 
router.put("/tax-settings-update", updateTaxSetting);

module.exports = router;

