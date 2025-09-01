const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createOrder = async (req, res) => {
  try {
    const { customerName, email, phone, address, items, status } = req.body;

    // ✅ Validation
    if (
      !customerName ||
      !email ||
      !phone ||
      !address ||
      !items ||
      items.length === 0
    ) {
      return res.status(400).json({
        message: "customerName, email, phone, address and items are required",
      });
    }

    // ✅ Find or Create Customer
    let customer = await prisma.customer.findUnique({
      where: { email },
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          name: customerName,
          email,
          phone,
          address,
        },
      });
    }

    // ✅ Calculate total amount & prepare order items
    let totalAmount = 0;
    const orderItemsData = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        return res
          .status(404)
          .json({ message: `Product with ID ${item.productId} not found` });
      }

      if (!product.sellingPrice) {
        return res
          .status(400)
          .json({ message: `Product ${product.id} has no price set` });
      }

      totalAmount += product.sellingPrice * item.quantity;

      orderItemsData.push({
        quantity: item.quantity,
        price: product.sellingPrice, // ✅ always safe
        productId: item.productId,
      });
    }

    // ✅ Generate unique order number
    const orderNumber = `ORD-${Date.now()}`;

    // ✅ Create Order
    const order = await prisma.order.create({
      data: {
        orderNumber,
        amount: totalAmount,
        status: status || "PENDING",
        customer: {
          connect: { id: customer.id },
        },
        orderItems: {
          create: orderItemsData,
        },
      },
      include: {
        customer: true,
        orderItems: { include: { product: true } },
      },
    });

    res.status(201).json(order);
  } catch (error) {
    console.error("❌ Error creating order:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getOrder = async (req, res) => {
  try {
    const order = await prisma.order.findMany({
      include: {
        customer: true,
        orderItems: { include: { product: true } },
      },
    });

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id: Number(id) },
      include: {
        customer: true,
        orderItems: { include: { product: true } },
      },
    });

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch order" });
  }
};

// Delete Order by ID
const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    // Convert id to number because Prisma needs Int
    const orderId = parseInt(id, 10);

    // Step 1: delete orderItems first (foreign key constraint)
    await prisma.orderItem.deleteMany({
      where: { orderId },
    });

    // Step 2: delete order
    const deletedOrder = await prisma.order.delete({
      where: { id: orderId },
    });

    res.status(200).json({
      message: "Order deleted successfully",
      deletedOrder,
    });
  } catch (error) {
    console.error("❌ Error deleting order:", error);
    res.status(500).json({ error: "Failed to delete order" });
  }
};


module.exports = { createOrder, getOrder, getOrderById, deleteOrder };
