const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const addCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const categroy = await prisma.category.create({
      data: { name },
    });

    res.status(200).json({
      message: "Category add Successfully",
      categroy,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const category = await prisma.category.update({
      where: { id: parseInt(id) },
      data: { name },
    });

    res.status(200).json({
      message: "Category Updated Successfully",
      category,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const cate = await prisma.category.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({
      message: "Category Delete Successfully",
      cate,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        products: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const result = categories.map((cate) => ({
      id: cate.id,
      name: cate.name,
      totalProducts: cate.products.length,
      createdAt: cate.createdAt,
    }));

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

module.exports = { addCategory, updateCategory, deleteCategory,  getAllCategories };
