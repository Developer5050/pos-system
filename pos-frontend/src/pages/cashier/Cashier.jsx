import React, { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { FaFilter } from "react-icons/fa";
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

  const navigate = useNavigate();

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

  // Add to order
  const addToOrder = (product) => {
    const existing = orderItems.find((item) => item.id === product.id);
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

  // Adjust quantity
  const adjustQuantity = (id, adjustment) =>
    setOrderItems(
      orderItems.map((item) => {
        if (item.id === id) {
          const qty = item.quantity + adjustment;
          return qty > 0 ? { ...item, quantity: qty } : item;
        }
        return item;
      })
    );

  const subtotal = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const discount = settings.discount || 0;

  // Correct tax calculation
  const tax = settings.taxEnabled
    ? settings.taxInclusive
      ? subtotal - subtotal / (1 + settings.taxRate / 100)
      : subtotal * (settings.taxRate / 100)
    : 0;

  const total = subtotal - discount + tax;

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
      discount,
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
      toast.success("✅ Order placed successfully!");
      setShowPaymentModal(false);
      setOrderItems([]);
      setUserDetails({
        name: "",
        email: "",
        phone: "",
        address: "",
        paymentMethod: "COD",
      });
      navigate("/");
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

  if (isLoading || !settings.taxEnabled) {
    return <div>Loading settings...</div>;
  }

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
                className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-md transition-shadow border border-blue-100"
                onClick={() => addToOrder(product)}
              >
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
                <div>
                  <span className="text-black font-medium text-md">
                    ${Number(product.sellingPrice || 0).toFixed(2)}
                  </span>
                  <span className="ml-2 text-gray-500 text-sm">/</span>
                  <span className="text-gray-600 text-sm">
                    {product.unit || "1 pcs"}
                  </span>
                </div>
                <button
                  className="w-full py-1.5 mt-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    addToOrder(product);
                  }}
                >
                  Add to Order
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

          {/* Discount (always 0) */}
          <div className="flex justify-between items-center">
            <span className="text-black font-semibold text-[15px]">
              Discount
            </span>
            <span className="text-black font-medium">$0.00</span>
          </div>

          {/* Tax (fixed from settings) */}
          {settings.taxEnabled && (
            <div className="flex justify-between">
              <span className="text-black font-semibold text-[15px]">Tax</span>
              <span className="font-medium text-black">
                %{Number(settings.taxRate || 0).toFixed(2)}
              </span>
            </div>
          )}

          {/* Total */}
          <div className="flex justify-between pt-2 border-t border-blue-200 font-bold text-black text-[18px]">
            <span>Total</span>
            <span>
              $
              {subtotal > 0
                ? (
                    subtotal +
                    (settings.taxEnabled ? Number(settings.taxRate || 0) : 0)
                  ).toFixed(2)
                : "0.00"}
            </span>
          </div>
        </div>

        <button
          className="mt-4 bg-blue-600 text-white py-1.5 rounded-md font-semibold hover:bg-blue-700 transition-colors text-sm lg:text-base"
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

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Cashier;
