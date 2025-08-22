import React, { useState } from "react";
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

  // Metrics Cards Data
  const metrics = [
    { title: "Today's Revenue", value: "$2,482", icon: "💰" },
    { title: "Today's Orders", value: "48", icon: "🛒" },
    {
      title: "Total Orders",
      value: "143",
      icon: "📊",
    },
    { title: "New Customers", value: "12", icon: "👥" },
  ];

  // Chart Data
  const chartData = {
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

  // Orders Data
  const orders = [
    {
      id: "#1001",
      customer: "John Doe",
      amount: "$120.50",
      status: "Completed",
      date: "2023-10-25 14:30",
    },
    {
      id: "#1002",
      customer: "Sarah Smith",
      amount: "$85.25",
      status: "Completed",
      date: "2023-10-25 13:15",
    },
    {
      id: "#1003",
      customer: "Mike Johnson",
      amount: "$210.00",
      status: "Pending",
      date: "2023-10-25 12:45",
    },
    {
      id: "#1004",
      customer: "Emily Davis",
      amount: "$54.75",
      status: "Completed",
      date: "2023-10-25 11:20",
    },
    {
      id: "#1005",
      customer: "Alex Wilson",
      amount: "$185.30",
      status: "Refunded",
      date: "2023-10-25 10:05",
    },
    {
      id: "#1006",
      customer: "Maria Garcia",
      amount: "$92.40",
      status: "Completed",
      date: "2023-10-24 16:50",
    },
    {
      id: "#1007",
      customer: "David Brown",
      amount: "$135.75",
      status: "Pending",
      date: "2023-10-24 15:30",
    },
    {
      id: "#1008",
      customer: "Lisa Miller",
      amount: "$68.90",
      status: "Completed",
      date: "2023-10-24 14:15",
    },
    {
      id: "#1009",
      customer: "Robert Wilson",
      amount: "$210.25",
      status: "Completed",
      date: "2023-10-24 12:40",
    },
    {
      id: "#1010",
      customer: "Jennifer Lee",
      amount: "$45.60",
      status: "Refunded",
      date: "2023-10-24 11:05",
    },
  ];

  // Low Stock Items Data
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
      legend: { position: "top" },
      title: {
        display: true,
        text: `Sales Overview - ${
          timeRange.charAt(0).toUpperCase() + timeRange.slice(1)
        }`,
        font: { size: 16, weight: "bold" },
        color: "#000000", // Gray-800
        style: { fontFamily: "Ubuntu, sans-serif" },
      },
    },
    scales: {
      y: { beginAtZero: true, grid: { color: "rgba(0, 0, 0, 0.1)" } },
      x: { grid: { color: "rgba(0, 0, 0, 0.1)" } },
    },
  };

  // chart data configuration
  const chartDataConfig = {
    labels: chartData[timeRange].labels,
    datasets: [
      {
        label: "Orders",
        data: chartData[timeRange].orders,
        backgroundColor: "rgba(59, 130, 246, 0.8)",
        borderColor: "rgb(59, 130, 246)",
        borderWidth: 1,
        borderRadius: 3,
        barPercentage: 0.6, // Increased from 0.4 → bars closer
      },
      {
        label: "Customers",
        data: chartData[timeRange].customers,
        backgroundColor: "rgba(139, 92, 246, 0.8)",
        borderColor: "rgb(139, 92, 246)",
        borderWidth: 1,
        borderRadius: 3,
        barPercentage: 0.6, // Increased from 0.4 → bars closer
      },
    ],
  };

  const displayedOrders = showAllOrders ? orders : orders.slice(0, 5);

  return (
    <div className="flex min-h-screen bg-gray-100 font-ubuntu">
      {/* Main Content */}
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
            <div className="w-9 h-9 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
              JD
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
                  <span className="text-green-500 text-sm font-medium">
                    {metric.change}
                  </span>
                </div>
                <div className="text-3xl">{metric.icon}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8 mb-8">
          {/* Bar Chart */}
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
              <Bar options={chartOptions} data={chartDataConfig} />
            </div>
          </div>
        </div>

        {/* Low Stock Items */}
        {/* Latest Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
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
                  {displayedOrders.map((order, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-3 text-black font-medium text-[15px]">
                        {order.id}
                      </td>
                      <td className="py-3 font-semibold text-[15px]">
                        {order.customer}
                      </td>
                      <td className="py-3 font-bold text-[15px]">
                        {order.amount}
                      </td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            order.status === "Completed"
                              ? "bg-green-100 text-green-800"
                              : order.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Low Stock Alert
            </h2>

            {/* Table Style Grid */}
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
                  {/* Left: Product Name */}
                  <div className="px-4 py-2 text-gray-800 font-medium">
                    {item.name}
                  </div>

                  {/* Right: Stock */}
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
