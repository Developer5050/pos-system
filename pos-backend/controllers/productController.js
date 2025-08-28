const { PrismaClient } = require("@prisma/client");
const { json } = require("express");
const prisma = new PrismaClient();

// Generate SKU
const generateSKU = async () => {
  const count = await prisma.product.count();
  return `SKU-${String(count + 1).padStart(3, "0")}`;
};

// Generate Barcode
const generateBarcode = async () => {
  const count = await prisma.product.count();
  return `BAR-${String(count + 1).padStart(5, "0")}`;
};

// Calculate Discount
const calculateDiscount = (costPrice, sellingPrice) => {
  if (!costPrice || !sellingPrice) return 0;
  if (sellingPrice >= costPrice) return 0;
  return ((costPrice - sellingPrice) / costPrice) * 100;
};

const addProduct = async (req, res) => {
  try {
    // Trim all keys to prevent trailing space issues
    const body = Object.fromEntries(
      Object.entries(req.body).map(([k, v]) => [k.trim(), v])
    );

    const {
      title,
      description,
      stock,
      status = "ACTIVE",
      unit = "PIECE",
      brand,
      costPrice,
      sellingPrice,
      createdById,
      categoryId,
    } = body;

    if (!brand || brand.trim() === "") {
      return res.status(400).json({ error: "Brand is required" });
    }

    const image = req.file?.path;

    const discount = calculateDiscount(
      parseFloat(costPrice),
      parseFloat(sellingPrice)
    );

    const product = await prisma.product.create({
      data: {
        title,
        description: description || null,
        stock: parseInt(stock) || 0,
        status,
        unit,
        brand: brand.trim(),
        costPrice: parseFloat(costPrice),
        sellingPrice: parseFloat(sellingPrice),
        discount,
        image: image || null,
        sku: await generateSKU(),
        barcode: await generateBarcode(),
        createdById: parseInt(createdById),
        categoryId: categoryId ? parseInt(categoryId) : null,
      },
    });

    res.status(200).json({ message: "Product Created Successfully", product });
  } catch (error) {
    console.error(error);
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
    } = req.body;
    const image = req.file?.path;

    let discount;
    if (costPrice && sellingPrice) {
      discount = calculateDiscount(
        parseFloat(costPrice),
        parseFloat(sellingPrice)
      );
    }

    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        title,
        description,
        stock: stock !== undefined ? parseInt(stock) : undefined,
        status,
        unit,
        brand,
        costPrice: costPrice !== undefined ? parseFloat(costPrice) : undefined,
        sellingPrice:
          sellingPrice !== undefined ? parseFloat(sellingPrice) : undefined,
        ...(discount !== undefined && { discount }),
        ...(image && { image }),
        categoryId: categoryId ? parseInt(categoryId) : undefined,
      },
    });

    res.status(200).json({ message: "Product updated successfully", product });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: { createdBy: true },
      orderBy: { updatedAt: "asc" },
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
