const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// createTransaction
const createTransaction = async (req, res) => {
  try {
    const { supplierId, items, paidAmount = 0, status = "Due" } = req.body;

    console.log(
      "Payload received in backend:",
      JSON.stringify(req.body, null, 2)
    );

    // Convert supplierId to Int
    const sId = Number(supplierId);
    if (!Number.isInteger(sId)) {
      return res.status(400).json({ error: "supplierId must be an integer" });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "items must be a non-empty array" });
    }

    // ✅ Sanitize items (lookup productId by name if needed)
    const sanitizedItems = await Promise.all(
      items.map(async (item) => {
        let productId;

        if (item.productId) {
          productId = Number(item.productId);
        } else if (item.product) {
          // 👇 Assume frontend sent product.id in product field
          productId = Number(item.product);

          if (isNaN(productId)) {
            const product = await prisma.product.findFirst({
              where: { title: item.product },
            });
            if (!product) {
              throw new Error(`Product not found: ${item.product}`);
            }
            productId = product.id;
          }
        } else {
          throw new Error(
            "Each item must have either productId or product name"
          );
        }

        return {
          productId,
          quantity: Number(item.quantity),
          price: Number(item.price),
        };
      })
    );

    // ✅ Calculate totals
    const totalAmount = sanitizedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const dueAmount = totalAmount - (Number(paidAmount) || 0);

    // ✅ Create transaction
    const transaction = await prisma.transaction.create({
      data: {
        supplierId: sId,
        totalAmount,
        paidAmount: Number(paidAmount) || 0,
        dueAmount,
        status,
        items: {
          create: sanitizedItems,
        },
      },
      include: {
        supplier: true,
        items: { include: { product: true } },
      },
    });

    for (const item of items) {
      await prisma.product.update({
        where: { id: Number(item.productId) },
        data: {
          stock: {
            increment: Number(item.quantity),
          },
        },
      });
    }

    res.status(201).json({
      message: "Transaction created successfully.",
      transaction,
    });
  } catch (error) {
    console.error("Error creating transaction:", error);
    res
      .status(500)
      .json({ error: error.message || "Failed to create transaction" });
  }
};

// get all transaction
const getTransaction = async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        supplier: true,
        items: { include: { product: true } },
      },
    });
    res.status(200).json({
      message: "Get all transactions.",
      transactions,
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
};

// getTransactionById
const getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await prisma.transaction.findUnique({
      where: { id: parseInt(id) },
      include: {
        supplier: true,
        items: { include: { product: true } },
      },
    });

    if (!transaction)
      return res.status(404).json({ error: "Transaction not found" });

    res.json(transaction);
  } catch (error) {
    console.error("Error fetching transaction:", error);
    res.status(500).json({ error: "Failed to fetch transaction" });
  }
};

// delete transaction
const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.transaction.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    res.status(500).json({ error: "Failed to delete transaction" });
  }
};

module.exports = {
  createTransaction,
  getTransaction,
  getTransactionById,
  deleteTransaction,
};
