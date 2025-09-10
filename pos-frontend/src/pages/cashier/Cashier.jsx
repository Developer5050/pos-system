import React, { useState, useEffect, useRef } from "react";
import { FiSearch } from "react-icons/fi";
import { FaFilter, FaPrint } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Cashier = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [categoryMap, setCategoryMap] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [orderItems, setOrderItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState(null);

  const navigate = useNavigate();
  const receiptRef = useRef();

  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    paymentMethod: "COD",
  });

  // Settings state (tax & discount)
  const [settings, setSettings] = useState({
    taxEnabled: false,
    taxRate: 0,
    taxInclusive: false,
    discount: 0,
  });

  // Load settings from localStorage or backend
  useEffect(() => {
    const local = localStorage.getItem("taxSettings");
    if (local) {
      const parsed = JSON.parse(local);
      setSettings({
        taxEnabled: parsed.taxEnabled,
        taxRate: Number(parsed.taxRate || 0),
        taxInclusive: parsed.taxInclusive,
        discount: Number(parsed.discount || 0),
      });
    }

    const fetchSettings = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/setting/tax-setting"
        );
        const data = {
          taxEnabled: res.data.taxEnabled,
          taxRate: Number(res.data.taxRate || 0),
          taxInclusive: res.data.taxInclusive,
          discount: Number(res.data.discount || 0),
        };
        setSettings((prev) => ({ ...prev, ...data }));
        localStorage.setItem("taxSettings", JSON.stringify(data));
      } catch (err) {
        console.error("Failed to fetch settings", err);
      }
    };

    fetchSettings();
  }, []);

  // Update localStorage whenever settings change
  useEffect(() => {
    localStorage.setItem("taxSettings", JSON.stringify(settings));
  }, [settings]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/category/get-all-category"
        );
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();
        const lookup = {};
        data.forEach((cat) => (lookup[cat.id] = cat.name));
        setCategoryMap(lookup);
        setCategories(["All", ...data.map((cat) => cat.name)]);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/product/get-all-products"
        );
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      activeCategory === "All" ||
      categoryMap[product.categoryId] === activeCategory;
    const matchesSearch =
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Add to order with stock validation
  const addToOrder = (product) => {
    // Check if product is out of stock
    if (product.stock <= 0) {
      toast.error(`${product.title} is out of stock!`);
      return;
    }

    // Check if adding more than available stock
    const existing = orderItems.find((item) => item.id === product.id);
    if (existing && existing.quantity >= product.stock) {
      toast.error(`Only ${product.stock} items available in stock!`);
      return;
    }

    if (existing) {
      setOrderItems(
        orderItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setOrderItems([
        ...orderItems,
        {
          id: product.id,
          name: product.title,
          price: product.sellingPrice,
          quantity: 1,
          image: product.image,
          stock: product.stock, // Keep track of stock
        },
      ]);
    }
    toast.success(`${product.title} added to order`);
  };

  // Remove from order
  const removeFromOrder = (id) => {
    const removedItem = orderItems.find((item) => item.id === id);
    setOrderItems(orderItems.filter((item) => item.id !== id));
    toast.info(`${removedItem.name} removed from order`);
  };

  // Adjust quantity with stock validation
  const adjustQuantity = (id, adjustment) => {
    setOrderItems(
      orderItems.map((item) => {
        if (item.id === id) {
          const newQuantity = item.quantity + adjustment;

          // Check if trying to add more than available stock
          if (adjustment > 0 && newQuantity > item.stock) {
            toast.error(`Only ${item.stock} items available in stock!`);
            return item;
          }

          // Check if quantity is valid
          if (newQuantity > 0) {
            return { ...item, quantity: newQuantity };
          }
        }
        return item;
      })
    );
  };

  const subtotal = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const discountAmount = subtotal * (settings.discount / 100) || 0;
  const discountedSubtotal = subtotal - discountAmount;

  // ✅ Tax calculation: hamesha exact percentage
  const tax = settings.taxEnabled
    ? discountedSubtotal * (settings.taxRate / 100) // direct 10%
    : 0;

  // ✅ Total = discountedSubtotal + tax
  const total = discountedSubtotal + tax;

  // Place order
  const handlePlaceOrder = async () => {
    if (
      !userDetails.name ||
      !userDetails.email ||
      !userDetails.phone ||
      !userDetails.address
    ) {
      toast.error("Please fill in all required customer details!");
      return;
    }
    if (orderItems.length === 0) {
      toast.error("Your order is empty!");
      return;
    }

    const orderData = {
      customerName: userDetails.name,
      email: userDetails.email,
      phone: userDetails.phone,
      address: userDetails.address,
      items: orderItems.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price,
      })),
      subtotal,
      discount: settings.discount,
      discountAmount,
      tax,
      totalAmount: total,
      paymentMethod: userDetails.paymentMethod || "COD",
    };

    try {
      const res = await axios.post(
        "http://localhost:5000/api/order/create-order",
        orderData,
        { headers: { "Content-Type": "application/json" } }
      );

      // Generate receipt data
      setReceiptData({
        orderId: res.data.orderId || Date.now(),
        customerName: userDetails.name,
        email: userDetails.email,
        phone: userDetails.phone,
        address: userDetails.address,
        items: orderItems,
        subtotal,
        discount: settings.discount,
        discountAmount,
        tax,
        total,
        paymentMethod: userDetails.paymentMethod,
        date: new Date().toLocaleString(),
      });

      toast.success("✅ Order placed successfully!");
      setShowPaymentModal(false);
      setShowReceipt(true);

      // Reset order items and user details without refreshing
      setOrderItems([]);
      setUserDetails({
        name: "",
        email: "",
        phone: "",
        address: "",
        paymentMethod: "COD",
      });

      console.log("Order response:", res.data);
    } catch (error) {
      console.error("Order error:", error);
      if (error.response && error.response.data) {
        toast.error("❌ Failed to place order: " + error.response.data.message);
      } else {
        toast.error("❌ Something went wrong while placing the order");
      }
    }
  };

  // Print receipt
  const handlePrintReceipt = () => {
    const receiptContent = receiptRef.current;
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
    <html>
      <head>
        <title>Receipt</title>
        <style>
          body { font-family: Arial, sans-serif, ubuntu; margin: 20px; }
          .receipt { border: 1px solid #000; padding: 20px; max-width: 800px; margin: 0 auto; }
          .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #000; padding-bottom: 10px; }

          /* Customer Table */
          .customer-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          .customer-table th, .customer-table td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }
          .customer-table th {
            background-color: #f2f2f2;
            font-weight: bold;
          }

          /* Items Table */
          .items-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          .items-table th, .items-table td { 
            padding: 8px; 
            text-align: center; 
            border: 1px solid #ddd; 
          }
          .items-table th { background-color: #f2f2f2; font-weight: bold; }

          /* Summary Table (Right Side) */
          .summary { width: 40%; margin-left: auto; border-collapse: collapse; margin-top: 20px; }
          .summary td { padding: 6px; border: none; }
          .summary .label { text-align: left; font-weight: 600; }
          .summary .value { text-align: right; font-weight: bold; }
          .summary .total { font-size: 16px; font-weight: bold; border-top: 2px solid #000; padding-top: 8px; }

          .thank-you { text-align: center; margin-top: 20px; font-style: italic; border-top: 1px solid #000; padding-top: 10px; }
          
          @media print {
            body { margin: 0; }
            .receipt { border: none; padding: 15px; max-width: 100%; }
          }
        </style>
      </head>
      <body onload="window.print();">
        <div class="receipt">
          <div class="header">
            <h2>POS System</h2>
            <p>Receipt</p>
          </div>

          <!-- Customer Details -->
          <!-- Customer Details -->
<table class="customer-table" style="font-family: Ubuntu, Arial, sans-serif; width:100%; border-collapse: collapse; margin-bottom: 20px;">
  <thead>
    <tr>
      <th style="border:1px solid #ddd; padding:8px; background:#f2f2f2;">Customer Name</th>
      <th style="border:1px solid #ddd; padding:8px; background:#f2f2f2;">Email</th>
      <th style="border:1px solid #ddd; padding:8px; background:#f2f2f2;">Phone</th>
      <th style="border:1px solid #ddd; padding:8px; background:#f2f2f2;">Address</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="border:1px solid #ddd; padding:8px;">${
        receiptData.customerName || "N/A"
      }</td>
      <td style="border:1px solid #ddd; padding:8px;">${
        receiptData.email || "N/A"
      }</td>
      <td style="border:1px solid #ddd; padding:8px;">${
        receiptData.phone || "N/A"
      }</td>
      <td style="border:1px solid #ddd; padding:8px;">${
        receiptData.address || "N/A"
      }</td>
    </tr>
  </tbody>
</table>


          <!-- Order Items -->
          <table class="items-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${receiptData.items
                .map(
                  (item) => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.quantity}</td>
                  <td>$${item.price.toFixed(2)}</td>
                  <td>$${(item.price * item.quantity).toFixed(2)}</td>
                </tr>`
                )
                .join("")}
            </tbody>
          </table>

          <!-- Order Summary (Right Side) -->
          <table class="summary">
            <tr>
              <td class="label">Subtotal:</td>
              <td class="value">$${receiptData.subtotal.toFixed(2)}</td>
            </tr>

            ${
              receiptData.discount > 0
                ? `
              <tr>
                <td class="label">Discount (${receiptData.discount}%):</td>
                <td class="value">-$${receiptData.discountAmount.toFixed(
                  2
                )}</td>
              </tr>`
                : ""
            }

            <tr>
              <td class="label">Tax:</td>
              <td class="value">$${receiptData.tax.toFixed(2)}</td>
            </tr>

            <tr>
              <td class="label total">Total:</td>
              <td class="value total">$${receiptData.total.toFixed(2)}</td>
            </tr>

            <tr>
              <td class="label">Payment Method:</td>
              <td class="value">${receiptData.paymentMethod || "COD"}</td>
            </tr>
          </table>

          <div class="thank-you">Thank you for your purchase!</div>
        </div>
      </body>
    </html>
  `);
    printWindow.document.close();
  };

  // Close receipt
  const handleCloseReceipt = () => {
    setShowReceipt(false);
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-xl">Loading products...</div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-xl text-red-500">Error: {error}</div>
      </div>
    );

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-50 font-ubuntu">
      {/* Left - Product Menu */}
      <div className="w-full lg:w-3/5 p-4 lg:p-6 overflow-y-auto">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <div
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="w-9 h-9 bg-blue-500 rounded-full flex items-center justify-center text-white hover:bg-blue-600 transition">
              <i className="fa-solid fa-cash-register text-lg"></i>
            </div>
            <div>
              <h1 className="text-xl font-bold text-black">Welcome, Ahmad</h1>
              <p className="text-gray-800 text-sm">
                Discover whatever you need easily
              </p>
            </div>
          </div>

          {/* Search + Filter */}
          <div className="flex items-center gap-2">
            <div className="relative w-60 lg:w-72">
              <input
                type="text"
                placeholder="Search Product..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-300 rounded-md py-1.5 pl-9 pr-4 text-[15px] focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <FiSearch className="absolute left-3 top-2.5 text-gray-500 text-md" />
            </div>
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100">
              <FaFilter className="text-gray-600 text-lg" />
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="flex space-x-4 mb-6 overflow-x-auto pb-4 mt-10">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              className={`px-4 py-1 rounded-3xl whitespace-nowrap text-[12px] lg:text-base ${
                activeCategory === cat
                  ? "bg-blue-600 text-white"
                  : "bg-white text-black border border-black"
              }`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                className={`bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-md transition-border relative ${
                  product.stock <= 0 ? "opacity-70" : "border border-blue-100"
                }`}
                onClick={() => product.stock > 0 && addToOrder(product)}
              >
                {/* Stock Alert Badge */}
                {product.stock <= 0 && (
                  <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
                    Out of Stock
                  </div>
                )}
                {product.stock > 0 && product.stock <= 5 && (
                  <div className="absolute top-2 right-2 bg-yellow-600 text-white text-xs px-2 py-1 rounded">
                    Low Stock : {product.stock}
                  </div>
                )}

                <div className="h-32 rounded flex items-center justify-center mb-3">
                  <img
                    src={`http://localhost:5000/${product.image.replace(
                      "\\",
                      "/"
                    )}`}
                    alt={product.title}
                    className="h-[100px] object-contain"
                  />
                </div>
                <h3 className="font-semibold text-black text-sm">
                  {product.title}
                </h3>
                <p className="text-[11px] text-gray-700 mb-3">
                  {product.description}
                </p>
                <div className="flex justify-between items-center mt-2">
                  {/* Price & Unit */}
                  <div>
                    <span className="text-black font-medium text-md">
                      ${Number(product.sellingPrice || 0).toFixed(2)}
                    </span>
                    <span className="ml-2 text-gray-500 text-sm">/</span>
                    <span className="text-gray-600 text-sm">
                      {product.unit || "1 pcs"}
                    </span>
                  </div>

                  {/* Stock Right Side */}
                  <div className="text-sm text-green-600">
                    Stock :{" "}
                    <span
                      className={`font-medium ${
                        product.stock <= 0
                          ? "text-red-600"
                          : product.stock <= 5
                          ? "text-yellow-600"
                          : "text-green-600"
                      }`}
                    >
                      {product.stock}
                    </span>
                  </div>
                </div>

                <button
                  className={`w-full py-1.5 mt-2 rounded text-sm transition-colors ${
                    product.stock <= 0
                      ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                  disabled={product.stock <= 0}
                  onClick={(e) => {
                    e.stopPropagation();
                    addToOrder(product);
                  }}
                >
                  {product.stock <= 0 ? "Out of Stock" : "Add to Order"}
                </button>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-8">
              No products found.
            </div>
          )}
        </div>
      </div>

      {/* Right - Order Summary */}
      <div className="w-full lg:w-2/5 bg-white p-4 lg:p-6 shadow-lg flex flex-col border-t lg:border-t-0 lg:border-l border-blue-200">
        <h2 className="text-xl font-bold text-black mb-4">Current Order</h2>
        {orderItems.length > 0 ? (
          <div className="flex-grow overflow-y-auto mb-4 max-h-60 lg:max-h-96">
            {orderItems.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center py-2 border-b border-blue-100"
              >
                <div className="flex items-center space-x-2 flex-1">
                  <div className="w-16 h-16 px-2 rounded flex items-center justify-center">
                    <img
                      src={`http://localhost:5000/${item.image.replace(
                        "\\",
                        "/"
                      )}`}
                      alt={item.name}
                      className="max-h-16 object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium text-black text-[14px]">
                      {item.name}
                    </h3>
                    <p className="text-gray-600 font-medium text-sm">
                      ${Number(item.price).toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-2xl"
                    onClick={(e) => {
                      e.stopPropagation();
                      adjustQuantity(item.id, -1);
                    }}
                  >
                    -
                  </button>
                  <span className="w-6 text-center text-[14px]">
                    {item.quantity}
                  </span>
                  <button
                    className="w-7 h-7 rounded-full bg-blue-500 text-white flex items-center justify-center text-2xl"
                    onClick={(e) => {
                      e.stopPropagation();
                      adjustQuantity(item.id, 1);
                    }}
                  >
                    +
                  </button>
                  <button
                    className="ml-2 text-red-500 text-2xl font-bold hover:text-red-700 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromOrder(item.id);
                    }}
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-black text-center py-4">Your order is empty</p>
        )}

        {/* Totals */}
        <div className="border-t border-blue-200 pt-3 space-y-3 text-sm p-4 bg-white rounded-lg shadow">
          {/* Subtotal */}
          <div className="flex justify-between">
            <span className="text-black text-[15px] font-semibold">
              Subtotal
            </span>
            <span className="font-medium text-black">
              ${subtotal.toFixed(2)}
            </span>
          </div>

          {/* Discount */}
          {settings.discount > 0 && (
            <div className="flex justify-between">
              <span className="text-black text-[15px] font-semibold">
                Discount ({settings.discount}%)
              </span>
              <span className="font-medium text-black">
                -${discountAmount.toFixed(2)}
              </span>
            </div>
          )}

          {/* Tax */}
          {settings.taxEnabled && (
            <div className="flex justify-between">
              <span className="text-black font-semibold text-[15px]">
                Tax ({settings.taxRate}%)
                {settings.taxInclusive ? " (Included)" : ""}
              </span>
              <span className="font-medium text-black">${tax.toFixed(2)}</span>
            </div>
          )}

          <hr className="border-blue-200 text-sm bg-white" />

          {/* Total */}
          <div className="flex justify-between text-[15px]">
            <span className="font-semibold">Total:</span>
            <span className="text-black font-bold">${total.toFixed(2)}</span>
          </div>
        </div>

        <button
          className={`mt-4 text-white py-1.5 rounded-md font-semibold transition-colors text-sm lg:text-base ${
            orderItems.length === 0
              ? "bg-blue-600 hover:bg-blue-700 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
          disabled={orderItems.length === 0}
          onClick={() => setShowPaymentModal(true)}
        >
          Continue to Payment
        </button>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-[420px] rounded-2xl shadow-2xl p-6 animate-fadeIn">
            <h2 className="text-xl font-bold text-gray-800 mb-5 text-center border-b pb-3">
              📝 Enter Your Details
            </h2>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={userDetails.name}
                  onChange={(e) =>
                    setUserDetails({ ...userDetails, name: e.target.value })
                  }
                  className="w-full border border-gray-300 px-4 py-1 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter your Email"
                  value={userDetails.email}
                  onChange={(e) =>
                    setUserDetails({ ...userDetails, email: e.target.value })
                  }
                  className="w-full border border-gray-300 px-4 py-1 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter phone number"
                  value={userDetails.phone}
                  onChange={(e) =>
                    setUserDetails({ ...userDetails, phone: e.target.value })
                  }
                  className="w-full border border-gray-300 px-4 py-1 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  placeholder="Enter delivery address"
                  rows={2}
                  value={userDetails.address}
                  onChange={(e) =>
                    setUserDetails({ ...userDetails, address: e.target.value })
                  }
                  className="w-full border border-gray-300 px-4 py-1 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                ></textarea>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              💳 Payment Options
            </h3>
            <div className="flex items-center space-x-2 border p-1 rounded-md">
              <input
                type="checkbox"
                id="cod"
                checked={userDetails.paymentMethod === "COD"}
                onChange={() =>
                  setUserDetails({ ...userDetails, paymentMethod: "COD" })
                }
                className="h-3 w-3 text-blue-600 border-gray-300 rounded"
              />
              <label
                htmlFor="cod"
                className="text-gray-700 font-medium text-[14px]"
              >
                Cash on Delivery (COD)
              </label>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                className="px-5 py-1 rounded-md bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition"
                onClick={() => setShowPaymentModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-5 py-1 rounded-md bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition"
                onClick={handlePlaceOrder}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {showReceipt && receiptData && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 animate-fadeIn">
            <h2 className="text-xl font-bold text-gray-800 mb-2 text-center border-b pb-2">
              🧾 Order Receipt
            </h2>

            <div ref={receiptRef} className="receipt-content text-sm">
              {/* Header */}
              <div className="text-center mb-2">
                <h3 className="font-bold text-lg">INVOICE</h3>
                <p>
                  <span className="font-bold">Order #:</span>{" "}
                  {receiptData.orderId}
                </p>
                <p>
                  <span className="font-bold">Date:</span> {receiptData.date}
                </p>
              </div>

              {/* Customer Details */}
              <h4 className="font-semibold border-b">Customer Details</h4>
              <table className="w-full mb-2 border">
                <thead className="bg-black border-collapse">
                  <tr>
                    <th className="p-1 text-center text-white border">Name</th>
                    <th className="p-1 text-center text-white border">Email</th>
                    <th className="p-1 text-center text-white border">Phone</th>
                    <th className="p-1 text-center text-white border">
                      Address
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t">
                    <td className="p-1 text-center border">
                      {receiptData.customerName}
                    </td>
                    <td className="p-1 text-center border">
                      {receiptData.email}
                    </td>
                    <td className="p-1 text-center border">
                      {receiptData.phone}
                    </td>
                    <td className="p-1 text-center border">
                      {receiptData.address}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Order Items */}
              <h4 className="font-semibold border-b">Order Items</h4>
              <table className="w-full mb-2 border">
                <thead className="bg-black border-collapse">
                  <tr>
                    <th className="p-1 text-center text-white border">
                      Product
                    </th>
                    <th className="p-1 text-center text-white border">Qty</th>
                    <th className="p-1 text-center text-white border">Price</th>
                    <th className="p-1 text-center text-white border">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {receiptData.items.map((item) => (
                    <tr key={item.id} className="border-t">
                      <td className="p-1 text-center border">{item.name}</td>
                      <td className="p-1 text-center border">
                        {item.quantity}
                      </td>
                      <td className="p-1 text-center border">
                        ${item.price.toFixed(2)}
                      </td>
                      <td className="p-1 text-center border">
                        ${(item.price * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Order Summary */}
              <div className="w-full md:w-40 ml-auto">
                <h4 className="font-semibold border-b text-right pb-1">
                  Order Summary
                </h4>

                {/* Subtotal */}
                <div className="flex justify-between mb-1">
                  <span className="font-extrabold text-md">Subtotal:</span>
                  <span>${receiptData.subtotal.toFixed(2)}</span>
                </div>

                {/* Discount (agar ho to dikhana) */}
                {/* {receiptData.discount > 0 && (
                  <div className="flex justify-between">
                    <span className="font-medium">
                      Discount ({receiptData.discount}%):
                    </span>
                    <span>- ${receiptData.discountAmount.toFixed(2)}</span>
                  </div>
                )} */}

                {/* Tax */}
                <div className="flex justify-between">
                  <span className="font-extrabold text-md">Tax:</span>
                  <span>${receiptData.tax.toFixed(2)}</span>
                </div>

                {/* Total */}
                <div className="flex justify-between mt-0.5 border-t">
                  <span className="font-semibold text-lg">Total:</span>
                  <span className="font-semibold text-lg">
                    ${receiptData.total.toFixed(2)}
                  </span>
                </div>

                {/* Payment Method */}
                <div className="flex justify-between mt-0.5">
                  <span className="font-semibold">Payment Method:</span>
                  <span>{receiptData.paymentMethod || "COD"}</span>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-3">
              <button
                className="px-5 py-1.5 rounded-md bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition flex items-center gap-2"
                onClick={handlePrintReceipt}
              >
                <FaPrint /> Print
              </button>
              <button
                className="px-5 py-1.5 rounded-md bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition"
                onClick={handleCloseReceipt}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Cashier;
