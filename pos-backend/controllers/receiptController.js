const PDFDocument = require("pdfkit");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const generateReceipt = async (req, res) => {
  const { orderId } = req.params;

  try {
    // Fetch order with customer and products
    const order = await prisma.order.findUnique({
      where: { id: parseInt(orderId) },
      include: {
        customer: true,
        orderItems: {
          include: { product: true },
        },
      },
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Create a new PDF document
    const doc = new PDFDocument({ margin: 50 });

    // Set headers for PDF download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=receipt_${order.orderNumber}.pdf`
    );

    doc.pipe(res);

    // --- Header ---
    doc.fontSize(22).text("POS Store", { align: "center" });
    doc.fontSize(14).text(`Receipt #${order.orderNumber}`, { align: "center" });
    doc.moveDown(2);

    // --- Customer Info ---
    doc.fontSize(12).text("Customer Information", { underline: true });
    doc.text(`Name   : ${order.customer.name}`);
    doc.text(`Email  : ${order.customer.email}`);
    doc.text(`Phone  : ${order.customer.phone}`);
    doc.text(`Address: ${order.customer.address}`);
    doc.moveDown();

    // --- Products ---
    doc.fontSize(12).text("Products", { underline: true });
    order.orderItems.forEach((item, index) => {
      doc.text(
        `${index + 1}. ${item.product.title} x${
          item.quantity
        } - $${item.price.toFixed(2)}`
      );
    });
    doc.moveDown();

    // --- Summary ---
    doc.fontSize(12).text("Summary", { underline: true });
    doc.text(`Total Amount: $${order.amount.toFixed(2)}`);
    doc.text(`Status      : ${order.status}`);
    doc.text(`Order Date  : ${order.orderDate.toISOString()}`);
    doc.moveDown(2);

    // --- Footer ---
    doc.fontSize(10).text("Thank you for your purchase!", { align: "center" });

    // Finalize PDF
    doc.end();
  } catch (error) {
    console.error("Receipt generation error:", error);
    res.status(500).json({ message: "Failed to generate receipt" });
  }
};

module.exports = { generateReceipt };
