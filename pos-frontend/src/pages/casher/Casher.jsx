import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { FaFilter } from "react-icons/fa";

const Casher = () => {
  // Sample product data
  const products = [
    {
      id: 1,
      name: "Almond Brown Sugar Croissant",
      description: "Sweet croissant with topping almonds and brown sugar",
      image:
        "https://optimise2.assets-servd.host/bridor-new/production/uploads/59103_side_W.png?w=1200&auto=compress%2Cformat&fit=crop&dm=1655312074&s=efff3ab7abded93884f0a2007dea00c1",
      price: 12.98,
      unit: "3 pcs",
      category: "Croissant",
    },
    {
      id: 2,
      name: "Smoke Tenderloin Slice Croissant",
      description:
        "Palm croissant with smoke tenderloin beef sliced and vegetable",
      price: 10.01,
      unit: "2 pcs",
      category: "Croissant",
    },
    {
      id: 3,
      name: "Sweet Granulated Sugar Croissant",
      description: "Classic croissant with granulated sugar topping",
      price: 8.92,
      unit: "3 pcs",
      category: "Croissant",
    },
    {
      id: 4,
      name: "Sweet Chocolate Chocochips Croissant",
      description: "Chocolate-filled croissant with chocochips",
      price: 11.01,
      unit: "1 pcs",
      category: "Croissant",
    },
    {
      id: 6,
      name: "Berry Whipped Cream Croissant",
      description: "Sweet croissant with blueberries and strawberries inside",
      price: 8.92,
      unit: "3 pcs",
      category: "Croissant",
    },
    {
      id: 6,
      name: "Basic Croissant La Ta Dhore",
      description: "Traditional French croissant",
      price: 5.58,
      unit: "1 pcs",
      category: "Croissant",
    },
    {
      id: 7,
      name: "Belgian Waffle",
      description: "Classic Belgian waffle with powdered sugar",
      price: 7.5,
      unit: "1 pcs",
      category: "Waffle",
    },
    {
      id: 8,
      name: "Chocolate Waffle",
      description: "Waffle with chocolate chips and syrup",
      price: 9.25,
      unit: "1 pcs",
      category: "Waffle",
    },
    {
      id: 9,
      name: "Cappuccino",
      description: "Espresso with steamed milk and foam",
      price: 4.75,
      unit: "1 cup",
      category: "Coffee",
    },
  ];

  // State for current order
  const [orderItems, setOrderItems] = useState([
    {
      id: 2,
      name: "Smoke Tenderloin Slice Croissant",
      price: 10.01,
      quantity: 1,
    },
    {
      id: 4,
      name: "Sweet Chocolate Chocochips Croissant",
      price: 11.01,
      quantity: 2,
    },
    {
      id: 3,
      name: "Sweet Granulated Sugar Croissant",
      price: 5.58,
      quantity: 1,
    },
  ]);

  // State for active category
  const [activeCategory, setActiveCategory] = useState("All");

  // Filter products by category
  const filteredProducts =
    activeCategory === "All"
      ? products
      : products.filter((product) => product.category === activeCategory);

  // Get unique categories
  const categories = [
    "All",
    ...new Set(products.map((product) => product.category)),
  ];

  // Function to add item to order
  const addToOrder = (product) => {
    const existingItem = orderItems.find((item) => item.id === product.id);

    if (existingItem) {
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
          name: product.name,
          price: product.price,
          quantity: 1,
        },
      ]);
    }
  };

  // Function to remove item from order
  const removeFromOrder = (id) => {
    setOrderItems(orderItems.filter((item) => item.id !== id));
  };

  // Function to adjust quantity
  const adjustQuantity = (id, adjustment) => {
    setOrderItems(
      orderItems.map((item) => {
        if (item.id === id) {
          const newQuantity = item.quantity + adjustment;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
        }
        return item;
      })
    );
  };

  // Calculate order totals
  const subtotal = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const discount = 5.0;
  const tax = subtotal * 0.06; // 6% tax
  const total = subtotal - discount + tax;

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-50 font-ubuntu">
      {/* Left side - Product Menu */}
      <div className="w-full lg:w-3/5 p-4 lg:p-6 overflow-y-auto">
        <div className="mb-6 flex justify-between items-center">
          {/* Left side - Welcome text */}
          <div>
            <h1 className="text-2xl font-bold text-black">Welcome, Ahmad</h1>
            <p className="text-gray-800">Discover whatever you need easily</p>
          </div>

          {/* Right side - Search bar */}
          <div className="flex items-center gap-2">
            <div className="relative w-60 lg:w-72">
              <input
                type="text"
                placeholder="Search Product..."
                className="w-full border border-gray-300 rounded-md py-1 pl-9 pr-4 text-[14px]  
                     focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <FiSearch className="absolute left-3 top-2 text-gray-500 text-md" />
            </div>

            {/* Filter Icon (Button) */}
            <button className="p-1.5 border border-gray-300 rounded-lg hover:bg-gray-100">
              <FaFilter className="text-gray-600 text-lg" />
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="flex space-x-5 mb-6 overflow-x-auto pb-2">
          {categories.map((category, index) => (
            <button
              key={index}
              className={`px-4 py-1 rounded-3xl whitespace-nowrap text-[12px] lg:text-base ${
                activeCategory === category
                  ? "bg-blue-600 text-white"
                  : "bg-white text-black border border-black"
              }`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Product Grid - 3 columns on larger screens */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-md transition-shadow border border-blue-100"
              onClick={() => addToOrder(product)}
            >
              <div className="h-32 bg-blue-50 rounded flex items-center justify-center mb-3">
                <img src={product.image} alt="product-image" />
              </div>
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-black text-sm">
                  {product.name}
                </h3>
              </div>
              {product.description && (
                <p className="text-[11px] text-gray-700 mb-3">
                  {product.description}
                </p>
              )}
              <div>
                <span className="text-black font-medium text-md">
                  ${product.price.toFixed(2)}
                </span>
                <span className="ml-2 text-gray-500 text-sm h-1">/</span>
                <span className="text-gray-600 text-sm"> {product.unit}</span>
              </div>
              <button className="w-full py-1.5 mt-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors">
                Add to Order
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Right side - Order Summary */}
      <div className="w-full lg:w-2/5 bg-white p-4 lg:p-6 shadow-lg flex flex-col border-t lg:border-t-0 lg:border-l border-blue-200">
        <h2 className="text-xl font-bold text-black mb-4">Current Order</h2>

        {/* Order Items */}
        {orderItems.length > 0 && (
          <div className="flex-grow overflow-y-auto mb-4 max-h-60 lg:max-h-96">
            {orderItems.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center py-2 border-b border-blue-100"
              >
                {/* Left Side: Image + Text */}
                <div className="flex items-center space-x-2 flex-1">
                  <div className="w-16 h-16 px-2 bg-blue-200 rounded flex items-center justify-center">
                    <img
                      src={item.image}
                      alt="product-image"
                      className="max-h-14 object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium text-black text-[14px]">
                      {item.name}
                    </h3>
                    <p className="text-gray-600 font-medium text-sm">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Right Side: Quantity + Remove */}
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
        )}

        {/* Agar empty hai to yeh message dikhana ho to niche add karein */}
        {orderItems.length === 0 && (
          <p className="text-black text-center py-4">Your order is empty</p>
        )}

        {/* Order Summary */}
        <div className="border-t border-blue-200 pt-3 space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-black text-[15px] font-semibold">
              Subtotal
            </span>
            <span className="font-medium text-black">
              ${subtotal.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-black font-semibold text-[15px]">
              Discount sales
            </span>
            <span className="text-black font-medium">
              -${discount.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-black font-semibold text-[15px]">
              Total sales tax
            </span>
            <span className="font-medium text-black">${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-blue-200 font-bold text-black text-[18px]">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Payment Button */}
        <button
          className="mt-4 bg-blue-600 text-white py-1.5 rounded-md font-semibold hover:bg-blue-700 transition-colors text-sm lg:text-base"
          disabled={orderItems.length === 0}
        >
          Continue to Payment
        </button>
      </div>
    </div>
  );
};

export default Casher;
