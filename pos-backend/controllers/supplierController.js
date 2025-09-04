const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createSupplier = async (req, res) => {
  try {
    const { name, email, phone, address, companyName } = req.body;
    console.log(req.body);
    const slip = req.file ? req.file.path : null;

    const supplier = await prisma.supplier.create({
      data: {
        name,
        email,
        phone,
        address,
        companyName,
        slip,
      },
    });

    res.status(200).json({
      message: "Supplier Create Successfully.",
      supplier,
    });
  } catch (error) {
    res.status(500).json({ error: "Unable to create supplier" });
  }
};

const getAllSupplier = async (req, res) => {
  try {
    const suppliers = await prisma.supplier.findMany({
      include: {
        products: true,
        supplierSlips: true,
      },
    });

    res.status(200).json({
      message: "Get all Suppliers.",
      suppliers,
    });
  } catch (error) {
    res.status(400).json({
      error: "Enable to fetch suppliers",
    });
  }
};

const updateSupplier = async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, address, companyName } = req.body;

  try {
    // Agar naya file aya hai
    let slip;
    if (req.file) {
      slip = req.file.path;

      // Old supplier slip delete karne ka option
      const oldSupplier = await prisma.supplier.findUnique({
        where: { id: parseInt(id) },
      });
      if (oldSupplier && oldSupplier.slip && fs.existsSync(oldSupplier.slip)) {
        fs.unlinkSync(oldSupplier.slip);
      }
    }

    const supplier = await prisma.supplier.update({
      where: { id: parseInt(id) },
      data: {
        name,
        email,
        phone,
        address,
        companyName,
        ...(slip && { slip }), // agar slip hai to update karo
      },
    });

    res.json({
      message: "Supplier updated successfully.",
      supplier,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to update supplier" });
  }
};

const deleteSupplier = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.supplier.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: "Supplier deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to delete supplier" });
  }
};

module.exports = { createSupplier, getAllSupplier, updateSupplier, deleteSupplier };
