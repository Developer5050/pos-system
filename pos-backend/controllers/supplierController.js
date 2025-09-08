const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// add suppliers
const addSupplier = async (req, res) => {
  try {
    const { name, email, phone, address, companyName } = req.body;
    console.log("data", req.body);

    const supplier = await prisma.supplier.create({
      data: {
        name,
        email,
        phone,
        address,
        companyName,
      },
    });

    res.status(200).json({
      message: "Add Supplier Sucessfully.",
      supplier,
    });
  } catch (error) {
    console.error("Error adding supplier:", error);
    res
      .status(500)
      .json({ message: "Failed to add supplier", error: error.message });
  }
};

// getSupplier
const getSuppliers = async (req, res) => {
  try {
    const suppliers = await prisma.supplier.findMany({
      include: {
        products: true,
      },
      orderBy: {
        createdAt: "desc", // ✅ newest suppliers first
      },
    });

    res.status(200).json({
      message: "Get all Suppliers.",
      suppliers,
    });
  } catch (error) {
    console.error("Error fetching suppliers:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch suppliers", error: error.message });
  }
};

// getSupplierById
const getSupplierById = async (req, res) => {
  try {
    const { id } = req.params;

    const supplier = await prisma.supplier.findUnique({
      where: { id: Number(id) },
      include: { products: true },
    });

    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    res.status(200).json(supplier);
  } catch (error) {
    console.error("Error fetching supplier:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch supplier", error: error.message });
  }
};

// updateSupplier
const updateSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, address, companyName } = req.body;

    const supplier = await prisma.supplier.update({
      where: { id: Number(id) },
      data: { name, email, phone, address, companyName },
    });

    res
      .status(200)
      .json({ message: "Supplier updated successfully", supplier });
  } catch (error) {
    console.error("Error updating supplier:", error);
    res
      .status(500)
      .json({ message: "Failed to update supplier", error: error.message });
  }
};

// deleteSupplier
const deleteSupplier = async (req, res) => {
  try {
    const { id } = req.params;

    const supplier = await prisma.supplier.delete({
      where: { id: Number(id) },
    });

    res
      .status(200)
      .json({ message: "Supplier deleted successfully", supplier });
  } catch (error) {
    console.error("Error deleting supplier:", error);
    res
      .status(500)
      .json({ message: "Failed to delete supplier", error: error.message });
  }
};

module.exports = {
  addSupplier,
  getSupplierById,
  getSuppliers,
  updateSupplier,
  deleteSupplier,
};
