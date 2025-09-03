const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createOrder = async (req, res) => {
  try {
    const { customerName, email, phone, address, items, status } = req.body;

    if (!customerName || !email || !phone || !address || !items || items.length === 0) {
      return res.status(400).json({
        message: "customerName, email, phone, address and items are required",
      });
    }

    // ✅ Find or Create Customer
    let customer = await prisma.customer.findUnique({ where: { email } });
    if (!customer) {
      customer = await prisma.customer.create({
        data: { name: customerName, email, phone, address },
      });
    }

    let subtotal = 0;
    const orderItemsData = [];

    // ✅ Run transaction for stock check + reduce
    await prisma.$transaction(async (tx) => {
      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new Error(`Product with ID ${item.productId} not found`);
        }

        if (!product.sellingPrice) {
          throw new Error(`Product ${product.id} has no price set`);
        }

        if (product.stock < item.quantity) {
          throw new Error(`${product.name} is out of stock`);
        }

        // ✅ Reduce stock safely
        await tx.product.update({
          where: { id: product.id },
          data: {
            stock: { decrement: item.quantity }, // 👈 recommended way
          },
        });

        subtotal += product.sellingPrice * item.quantity;

        orderItemsData.push({
          quantity: item.quantity,
          price: product.sellingPrice,
          productId: item.productId,
        });
      }
    });

    // ✅ Get Tax Settings
    const settings = await prisma.settings.findFirst();
    const tax = settings?.taxEnabled ? Number(settings.taxRate || 0) : 0;

    const totalAmount = subtotal + tax;
    const orderNumber = `ORD-${Date.now()}`;

    // ✅ Create order
    const order = await prisma.order.create({
      data: {
        orderNumber,
        amount: totalAmount,
        status: status || "PAID",
        customer: { connect: { id: customer.id } },
        orderItems: { create: orderItemsData },
      },
      include: {
        customer: true,
        orderItems: { include: { product: true } },
      },
    });

    res.status(201).json(order);
  } catch (error) {
    console.error("❌ Error creating order:", error);
    res.status(400).json({ error: error.message || "Internal Server Error" });
  }
};

const getAllOrder = async (req, res) => {
  try {
    const order = await prisma.order.findMany({
      include: {
        customer: true,
        orderItems: { include: { product: true } },
      },
      orderBy: { createdAt: "desc" },
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

const getOrderReceipt = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await prisma.order.findUnique({
      where: { id: parseInt(orderId) },
      include: {
        customer: true,
        orderItems: { include: { product: true } },
      },
    });

    if (!order) return res.status(404).send("Order not found");

    // Generate items HTML
    const itemsHtml = order.orderItems
      .map(
        (item) => `
      <tr>
        <td>${item.product.title}</td>
        <td>${item.quantity}</td>
        <td>$${item.price.toFixed(2)}</td>
        <td>$${(item.quantity * item.price).toFixed(2)}</td>
      </tr>
    `
      )
      .join("");

    const totalAmount = order.orderItems
      .reduce((acc, item) => acc + item.quantity * item.price, 0)
      .toFixed(2);

    // Full HTML receipt
    const html = `
      <html>
        <head>
          <title>Order Receipt</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h2 { text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .total { text-align: right; font-weight: bold; margin-top: 10px; }
            .customer-info { margin-top: 20px; }
            button { margin-bottom: 20px; padding: 10px 20px; cursor: pointer; }
            @media print {
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <button onclick="window.print()">Print Receipt</button>
          <h2>POS System Receipt</h2>
          <div class="customer-info">
            <p><strong>Name:</strong> ${order.customer.name}</p>
            <p><strong>Email:</strong> ${order.customer.email}</p>
            <p><strong>Phone:</strong> ${order.customer.phone}</p>
            <p><strong>Address:</strong> ${order.customer.address}</p>
            <p><strong>Order Date:</strong> ${new Date(
              order.createdAt
            ).toLocaleString()}</p>
          </div>

          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <p class="total">Total: $${totalAmount}</p>
          <p style="text-align:center;">Thank you for your purchase!</p>
        </body>
      </html>
    `;

    res.send(html);
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to fetch order");
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await prisma.order.update({
      where: { id: parseInt(orderId) },
      data: { status },
    });

    res.status(200).json(order);
  } catch (error) {
    res.status(400).json({
      error: "Failed to updated Status",
    });
  }
};

const getLatestOrders = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 8; // default 5 orders
    const orders = await prisma.order.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
      include: {
        customer: true,
      },
    });

    res.json(orders);
  } catch (error) {
    console.error("Error fetching latest orders:", error);
    res.status(500).json({ error: "Failed to fetch latest orders" });
  }
};

module.exports = {
  createOrder,
  getAllOrder,
  getOrderById,
  deleteOrder,
  getOrderReceipt,
  updateOrderStatus,
  getLatestOrders,
};
