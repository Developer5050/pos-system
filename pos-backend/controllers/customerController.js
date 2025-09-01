const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getCustomers = async (req, res) => {
  try {
    const customers = await prisma.customer.findMany({
      orderBy: { createdAt: "asc" },
    });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch customers" });
  }
};

const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.customer.delete({
      where: { id: Number(id) },
    });

    res.json({ message: "Customer deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete customer" });
  }
};

module.exports = {
  getCustomers,
  deleteCustomer,
};
