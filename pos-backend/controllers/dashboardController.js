const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getDashboardStats = async (req, res) => {
  try {
    // Total Orders
    const totalOrders = await prisma.order.count();

    // Paid Orders
    const paidOrders = await prisma.order.count({
      where: { status: "PAID" },
    });

    // Total Revenue (sirf Paid Orders ka sum)
    const totalRevenue = await prisma.order.aggregate({
      _sum: { amount: true },
      where: { status: "PAID" },
    });

    // Total Customers
    const totalCustomers = await prisma.customer.count();

    res.status(200).json({
      totalOrders,
      paidOrders,
      totalRevenue: totalRevenue._sum.amount || 0,
      totalCustomers,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ error: "Failed to fetch dashboard stats" });
  }
};

const chartStats = async (req, res) => {
  try {
    // Get raw data without grouping
    const dailyOrders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: new Date(new Date().setDate(new Date().getDate() - 7)),
        },
      },
      select: {
        createdAt: true,
        id: true,
      },
    });

    const dailyCustomers = await prisma.customer.findMany({
      where: {
        createdAt: {
          gte: new Date(new Date().setDate(new Date().getDate() - 7)),
        },
      },
      select: {
        createdAt: true,
        id: true,
      },
    });

    const weeklyOrders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: new Date(new Date().setDate(new Date().getDate() - 28)),
        },
      },
      select: {
        createdAt: true,
        id: true,
      },
    });

    const weeklyCustomers = await prisma.customer.findMany({
      where: {
        createdAt: {
          gte: new Date(new Date().setDate(new Date().getDate() - 28)),
        },
      },
      select: {
        createdAt: true,
        id: true,
      },
    });

    const monthlyOrders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: new Date(new Date().setMonth(new Date().getMonth() - 6)),
        },
      },
      select: {
        createdAt: true,
        id: true,
      },
    });

    const monthlyCustomers = await prisma.customer.findMany({
      where: {
        createdAt: {
          gte: new Date(new Date().setMonth(new Date().getMonth() - 6)),
        },
      },
      select: {
        createdAt: true,
        id: true,
      },
    });

    res.json({
      dailyOrders,
      dailyCustomers,
      weeklyOrders,
      weeklyCustomers,
      monthlyOrders,
      monthlyCustomers,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
};
module.exports = { getDashboardStats, chartStats };
