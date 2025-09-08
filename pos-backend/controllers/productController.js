const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Generate SKU
const generateSKU = async () => {
  const count = await prisma.product.count();
  return `SKU-${String(count + 1).padStart(3, "0")}`;
};

const addProduct = async (req, res) => {
  try {
    const body = Object.fromEntries(
      Object.entries(req.body).map(([k, v]) => [
        k.trim(),
        typeof v === "string" ? v.trim() : v,
      ])
    );

    const {
      title,
      description,
      stock,
      status = "Active",
      unit = "PIECE",
      brand,
      costPrice,
      sellingPrice,
      createdById,
      category,
      barcode,
      discount,
      supplierId,
    } = body;

    if (!title) return res.status(400).json({ error: "Title is required" });
    if (!brand) return res.status(400).json({ error: "Brand is required" });
    if (!barcode) return res.status(400).json({ error: "Barcode is required" });
    if (!createdById)
      return res.status(400).json({ error: "createdById is required" });
    if (!supplierId)
      return res.status(400).json({ error: "SupplierId is required" });

    // validate supplier exists
    const supplier = await prisma.supplier.findUnique({
      where: { id: parseInt(supplierId) },
    });
    if (!supplier) {
      return res.status(400).json({ error: "Supplier not found" });
    }

    // discount
    const discountValue = parseFloat(discount);
    if (isNaN(discountValue)) {
      return res.status(400).json({ error: "Discount must be a valid number" });
    }

    // category lookup
    let categoryId = null;
    if (category) {
      const categoryRecord = await prisma.category.findUnique({
        where: { name: category },
      });
      if (!categoryRecord) {
        return res
          .status(400)
          .json({ error: `Category "${category}" not found` });
      }
      categoryId = categoryRecord.id;
    }

    const statusNormalized =
      status && status.toUpperCase() === "INACTIVE" ? "INACTIVE" : "ACTIVE";
    const unitNormalized = unit ? unit.toUpperCase() : "PIECE";

    const product = await prisma.product.create({
      data: {
        title,
        description: description || null,
        stock: parseInt(stock) || 0,
        status: statusNormalized,
        unit: unitNormalized,
        brand: brand.trim(),
        costPrice: parseFloat(costPrice),
        sellingPrice: parseFloat(sellingPrice),
        discount: discountValue,
        image: req.file?.path || null,
        sku: await generateSKU(),
        barcode: barcode.trim(),
        createdById: parseInt(createdById),
        categoryId,
        supplierId: parseInt(supplierId), // 👈 supplierId set here
      },
    });

    res.status(200).json({ message: "Product Created Successfully", product });
  } catch (error) {
    console.error("Add product error:", error);
    res.status(400).json({ error: error.message });
  }
};

const editProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      description,
      stock,
      status,
      unit,
      brand,
      costPrice,
      sellingPrice,
      category, // <-- frontend se category name ayegi
      discount,
    } = req.body;

    const image = req.file?.path;

    // 🔹 Category name se ID find karo
    let categoryId;
    if (category) {
      const categoryRecord = await prisma.category.findUnique({
        where: { name: category.trim() },
      });

      if (!categoryRecord) {
        return res.status(400).json({ error: "Category not found" });
      }

      categoryId = categoryRecord.id;
    }

    // 🔹 Product update
    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        title,
        description,
        stock: stock ? parseInt(stock) : undefined,
        status,
        unit,
        brand,
        costPrice: costPrice ? parseFloat(costPrice) : undefined,
        sellingPrice: sellingPrice ? parseFloat(sellingPrice) : undefined,
        discount: discount ? parseFloat(discount) : undefined, // 👈 sirf save karo
        ...(image && { image }),
        ...(categoryId && { categoryId }),
      },
    });

    res.status(200).json({ message: "Product updated successfully", product });
  } catch (error) {
    console.error("Edit Product Error:", error);
    res.status(400).json({ error: error.message });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: { createdBy: true },
      orderBy: { updatedAt: "desc" },
    });

    res.status(200).json(products);
  } catch (error) {
    res.status(400), json({ error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const response = await prisma.product.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({
      message: "Product Delete Successfully",
      response,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

const getProductByCategory = async (req, res) => {
  try {
    const { categoryId } = req.body;

    const products = await prisma.product.findMany({
      where: { categoryId: parseInt(categoryId) },
      include: { createdBy: true, category: true },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

module.exports = {
  addProduct,
  editProduct,
  getAllProducts,
  deleteProduct,
  getProductByCategory,
};
