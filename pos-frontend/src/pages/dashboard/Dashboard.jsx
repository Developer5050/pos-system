import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState("daily");
  const [showAllOrders, setShowAllOrders] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [metrics, setMetrics] = useState([
    { title: "Today's Revenue", value: "$0", icon: "💰" },
    { title: "Paid Orders", value: "0", icon: "🛒" },
    { title: "Total Orders", value: "0", icon: "📊" },
    { title: "Total Customers", value: "0", icon: "👥" },
  ]);
  const [chartData, setChartData] = useState({
    daily: { labels: [], orders: [], customers: [] },
    weekly: { labels: [], orders: [], customers: [] },
    monthly: { labels: [], orders: [], customers: [] },
  });
  const [chartLoading, setChartLoading] = useState(true);

  // Fetch metrics from API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/dashboard/stats");
        if (!res.ok) throw new Error("Failed to fetch stats");
        const data = await res.json();

        setMetrics([
          {
            title: "Today's Revenue",
            value: `$${data.totalRevenue || 0}`,
            icon: "💰",
          },
          { title: "Paid Orders", value: data.paidOrders || 0, icon: "🛒" },
          { title: "Total Orders", value: data.totalOrders || 0, icon: "📊" },
          {
            title: "Total Customers",
            value: data.totalCustomers || 0,
            icon: "👥",
          },
        ]);
      } catch (err) {
        console.error("Error fetching stats:", err);
        setError(
          "Failed to load stats. Please check if the server is running."
        );
      }
    };

    fetchStats();
  }, []);

  // Fetch latest orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          "http://localhost:5000/api/order/latest?limit=0"
        );
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();
        setOrders(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError(
          "Failed to load orders. Please check if the server is running."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Process raw data from API
  const processChartData = (rawData) => {
    // If API is not available, use mock data
    if (!rawData || Object.keys(rawData).length === 0) {
      return {
        daily: {
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          orders: [45, 52, 38, 61, 55, 68, 72],
          customers: [12, 15, 10, 18, 14, 20, 22],
        },
        weekly: {
          labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
          orders: [320, 380, 350, 420],
          customers: [85, 95, 88, 110],
        },
        monthly: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
          orders: [1450, 1620, 1380, 1750, 1920, 2100],
          customers: [380, 420, 360, 450, 480, 520],
        },
      };
    }

    // For daily data - group by day of week
    const dailyLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dailyOrders = new Array(7).fill(0);
    const dailyCustomers = new Array(7).fill(0);

    if (rawData.dailyOrders) {
      rawData.dailyOrders.forEach((item) => {
        const dayOfWeek = new Date(item.createdAt).getDay();
        dailyOrders[dayOfWeek] += item._count?.id || 1;
      });
    }

    if (rawData.dailyCustomers) {
      rawData.dailyCustomers.forEach((item) => {
        const dayOfWeek = new Date(item.createdAt).getDay();
        dailyCustomers[dayOfWeek] += item._count?.id || 1;
      });
    }

    // For weekly data - group by week
    const weeklyLabels = ["Week 1", "Week 2", "Week 3", "Week 4"];
    const weeklyOrders = new Array(4).fill(0);
    const weeklyCustomers = new Array(4).fill(0);

    if (rawData.weeklyOrders) {
      rawData.weeklyOrders.forEach((item) => {
        const date = new Date(item.createdAt);
        const daysAgo = Math.floor((new Date() - date) / (1000 * 60 * 60 * 24));
        const weekIndex = Math.min(3, Math.floor(daysAgo / 7));
        weeklyOrders[weekIndex] += item._count?.id || 1;
      });
    }

    if (rawData.weeklyCustomers) {
      rawData.weeklyCustomers.forEach((item) => {
        const date = new Date(item.createdAt);
        const daysAgo = Math.floor((new Date() - date) / (1000 * 60 * 60 * 24));
        const weekIndex = Math.min(3, Math.floor(daysAgo / 7));
        weeklyCustomers[weekIndex] += item._count?.id || 1;
      });
    }

    // For monthly data - group by month
    const monthlyLabels = [];
    const monthlyOrders = [];
    const monthlyCustomers = [];

    // Generate last 6 month names
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
      const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
      monthlyLabels.push(months[month.getMonth()]);
      monthlyOrders.push(0);
      monthlyCustomers.push(0);
    }

    if (rawData.monthlyOrders) {
      rawData.monthlyOrders.forEach((item) => {
        const date = new Date(item.createdAt);
        const monthDiff =
          (today.getFullYear() - date.getFullYear()) * 12 +
          (today.getMonth() - date.getMonth());
        if (monthDiff >= 0 && monthDiff < 6) {
          monthlyOrders[5 - monthDiff] += item._count?.id || 1;
        }
      });
    }

    if (rawData.monthlyCustomers) {
      rawData.monthlyCustomers.forEach((item) => {
        const date = new Date(item.createdAt);
        const monthDiff =
          (today.getFullYear() - date.getFullYear()) * 12 +
          (today.getMonth() - date.getMonth());
        if (monthDiff >= 0 && monthDiff < 6) {
          monthlyCustomers[5 - monthDiff] += item._count?.id || 1;
        }
      });
    }

    return {
      daily: {
        labels: dailyLabels,
        orders: dailyOrders,
        customers: dailyCustomers,
      },
      weekly: {
        labels: weeklyLabels,
        orders: weeklyOrders,
        customers: weeklyCustomers,
      },
      monthly: {
        labels: monthlyLabels,
        orders: monthlyOrders,
        customers: monthlyCustomers,
      },
    };
  };

  // Fetch Chart Stats
  useEffect(() => {
    const fetchChartStats = async () => {
      try {
        setChartLoading(true);
        const res = await fetch(
          "http://localhost:5000/api/dashboard/chart-stats"
        );

        let data = {};
        if (res.ok) {
          data = await res.json();
        } else {
          console.warn("Chart stats API not available, using mock data");
        }

        // Process the data to group it correctly
        const processedData = processChartData(data);
        setChartData(processedData);
      } catch (err) {
        console.error("Error fetching chart stats:", err);
        // Use mock data if API fails
        const processedData = processChartData({});
        setChartData(processedData);
      } finally {
        setChartLoading(false);
      }
    };

    fetchChartStats();

    // Auto refresh every 30 seconds
    const interval = setInterval(fetchChartStats, 30000);
    return () => clearInterval(interval);
  }, []);

  // Low Stock Items
  const lowStockItems = [
    { name: "Coffee Beans", stock: 8 },
    { name: "Paper Cups", stock: 12 },
    { name: "Chocolate Syrup", stock: 5 },
    { name: "Napkins", stock: 15 },
    { name: "Straws", stock: 10 },
    { name: "Milk", stock: 7 },
    { name: "Sugar Packets", stock: 20 },
  ];

  // Chart Config
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: true,
        text: `Sales Overview - ${
          timeRange.charAt(0).toUpperCase() + timeRange.slice(1)
        }`,
        font: { size: 16, weight: "bold" },
        color: "#000000",
        padding: {
          top: 10,
          bottom: 20,
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        padding: 10,
        cornerRadius: 5,
        usePointStyle: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          font: {
            size: 11,
          },
        },
      },
      x: {
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          font: {
            size: 11,
          },
        },
      },
    },
  };

  // Chart Data Config
  const chartDataConfig = {
    labels: chartData[timeRange]?.labels || [],
    datasets: [
      {
        label: "Orders",
        data: chartData[timeRange]?.orders || [],
        backgroundColor: "rgba(59, 130, 246, 0.8)",
        borderColor: "rgb(59, 130, 246)",
        borderWidth: 1,
        borderRadius: 5,
        barPercentage: timeRange === "daily" ? 0.6 : 0.7,
        categoryPercentage: 0.6,
      },
      {
        label: "Customers",
        data: chartData[timeRange]?.customers || [],
        backgroundColor: "rgba(139, 92, 246, 0.8)",
        borderColor: "rgb(139, 92, 246)",
        borderWidth: 1,
        borderRadius: 5,
        barPercentage: timeRange === "daily" ? 0.6 : 0.7,
        categoryPercentage: 0.6,
      },
    ],
  };

  // Show either 5 latest or all orders
  const displayedOrders = showAllOrders ? orders : orders.slice(0, 5);

  return (
    <div className="flex min-h-screen bg-gray-100 font-ubuntu">
      <div className="flex-1 p-4">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <div className="flex items-center">
            <div className="relative mr-4">
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-3 py-1.5 w-80 text-[15px] border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <i className="fas fa-search absolute left-3 top-2.5 text-gray-400"></i>
            </div>
            <div className="w-9 h-9 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold cursor-pointer"
              onClick={() => navigate("/cashier")}>
               C
            </div>
          </div>
        </header>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <div key={index} className="bg-white rounded-xl shadow p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm">{metric.title}</p>
                  <h3 className="text-xl font-bold text-gray-800 mt-2">
                    {metric.value}
                  </h3>
                </div>
                <div className="text-3xl">{metric.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Sales Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-800">
                Sales Analytics
              </h2>
              <div className="flex space-x-2">
                {["daily", "weekly", "monthly"].map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-3 py-1.5 text-sm rounded-md font-medium transition-colors ${
                      timeRange === range
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {range.charAt(0).toUpperCase() + range.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-[300px]">
              {chartLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <Bar options={chartOptions} data={chartDataConfig} />
              )}
            </div>
          </div>
        </div>

        {/* Latest Orders & Low Stock */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Latest Orders */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-800">Latest Orders</h2>
              <button
                onClick={() => setShowAllOrders(!showAllOrders)}
                className="text-white bg-blue-600 text-sm rounded-md font-medium px-3 py-1.5"
              >
                {showAllOrders ? "Show Less" : "View All"}
              </button>
            </div>

            {error && (
              <div
                className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4"
                role="alert"
              >
                <p className="font-bold">Notice</p>
                <p>{error}</p>
              </div>
            )}

            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-pulse text-gray-500">
                  Loading orders from API...
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-black text-sm border-b">
                      <th className="pb-3">Order ID</th>
                      <th className="pb-3">Customer</th>
                      <th className="pb-3">Amount</th>
                      <th className="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedOrders.length > 0 ? (
                      displayedOrders.map((order, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="py-3 text-black font-medium text-[15px]">
                            {order.id}
                          </td>
                          <td className="py-3 font-semibold text-[15px]">
                            {order.customer?.name || order.customer}
                          </td>
                          <td className="py-3 font-bold text-[15px]">
                            ${order.amount}
                          </td>
                          <td className="py-3">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                order.status?.toLowerCase() === "paid"
                                  ? "bg-green-200 text-green-800"
                                  : order.status?.toLowerCase() === "pending"
                                  ? "bg-yellow-200 text-yellow-800"
                                  : order.status?.toLowerCase() === "cancelled"
                                  ? "bg-red-200 text-red-800"
                                  : "bg-gray-200 text-gray-800"
                              }`}
                            >
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="4"
                          className="py-4 text-center text-gray-500"
                        >
                          No orders found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Low Stock Alert */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Low Stock Alert
            </h2>

            <div className="w-full border border-gray-200 rounded-lg overflow-hidden">
              <div className="grid grid-cols-2 bg-gray-100 text-gray-700 font-semibold text-sm">
                <div className="px-4 py-2">Product</div>
                <div className="px-4 py-2 text-right">Stock</div>
              </div>

              {lowStockItems.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-2 items-center border-t border-gray-200 text-sm"
                >
                  <div className="px-4 py-2 text-gray-800 font-medium">
                    {item.name}
                  </div>
                  <div className="px-4 py-2 text-right">
                    <span className="bg-red-100 text-red-600 font-bold px-2 py-1.5 rounded-full text-md">
                      {item.stock} left
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate("/products")}
              className="w-52 mt-6 bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-md font-medium"
            >
              Manage Inventory
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
