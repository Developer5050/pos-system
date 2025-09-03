const express = require("express");
const router = express.Router();

const {
  getTaxSetting,
  updateTaxSetting,
  inventorySetting,
  inventorySettingUpdate
} = require("../controllers/settingController");

// get tax route
router.get("/tax-setting", getTaxSetting);
// uppdate tax route
router.put("/tax-settings-update", updateTaxSetting);
// inventory setting route
router.get("/inventory-setting", inventorySetting);
// inventory Setting Update route
router.put("/inventory-settings-update", inventorySettingUpdate)

module.exports = router;
