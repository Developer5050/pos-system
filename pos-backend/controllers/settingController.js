const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getTaxSetting = async (req, res) => {
  try {
    let settings = await prisma.settings.findFirst();
    if (!settings) {
      settings = await prisma.settings.create({
        data: {
          taxEnabled: true,
          taxRate: 10, // Number
          taxInclusive: true,
          discount: 0,
        },
      });
    }

    res.json({
      taxEnabled: settings.taxEnabled,
      taxRate: Number(settings.taxRate), // ensure number
      taxInclusive: settings.taxInclusive,
      discount: settings.discount || 0,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch tax settings" });
  }
};


const updateTaxSetting = async (req, res) => {
  let { taxEnabled, taxRate, taxInclusive } = req.body;

  try {
    // ensure taxRate is a number
    taxRate = parseFloat(taxRate);

    let settings = await prisma.settings.findFirst();
    if (!settings) {
      settings = await prisma.settings.create({
        data: { taxEnabled, taxRate, taxInclusive },
      });
    } else {
      settings = await prisma.settings.update({
        where: { id: settings.id },
        data: { taxEnabled, taxRate, taxInclusive },
      });
    }

    res.json(settings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update tax settings" });
  }
};

module.exports = { getTaxSetting, updateTaxSetting };
