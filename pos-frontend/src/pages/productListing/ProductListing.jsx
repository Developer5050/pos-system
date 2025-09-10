import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiTrash2, FiSearch } from "react-icons/fi";

const ProductListing = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);
  const [products, setProducts] = useState([]);
  const [newTransaction, setNewTransaction] = useState({
    supplierId: "",
    items: [{ productId: "", quantity: "", price: "" }],
    paidAmount: "",
    status: "Paid",
  });

  const limit = 5;

  useEffect(() => {
    fetchTransactions();
    fetchSuppliers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [search, statusFilter, transactions]);

  // Fetch products
  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/product/get-all-products"
      );
      console.log("Products API Response:", res.data);

      // ✅ backend returns direct array
      setProducts(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchSuppliers();
    fetchProducts(); // 👈 fetch products too
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/transaction/get-all-transaction"
      );
      setTransactions(res.data.transactions);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/supplier/get-all-suppliers"
      );
      setSuppliers(res.data.suppliers);
    } catch (error) {
      console.error(error);
    }
  };

  const applyFilters = () => {
    let temp = [...transactions];
    if (search) {
      temp = temp.filter((t) =>
        t.supplier?.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (statusFilter) {
      temp = temp.filter((t) => t.status === statusFilter);
    }
    setFilteredTransactions(temp);
    setPage(1);
  };

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / limit);
  const startIdx = (page - 1) * limit;
  const currentTransactions = filteredTransactions.slice(
    startIdx,
    startIdx + limit
  );

  // Add Product Row
  const addProductRow = () => {
    setNewTransaction((prev) => ({
      ...prev,
      items: [...prev.items, { productId: "", quantity: 0, price: 0 }],
    }));
  };

  // Update Product Row
  const updateItem = (index, field, value) => {
    const updatedItems = [...newTransaction.items];
    updatedItems[index][field] = value;
    setNewTransaction({ ...newTransaction, items: updatedItems });
  };

  // Calculate total
  const totalAmount = newTransaction.items.reduce(
    (sum, item) => sum + (+item.quantity || 0) * (+item.price || 0),
    0
  );

  // Create transaction
  const handleCreateTransaction = async () => {
    try {
      const payload = {
        ...newTransaction,
        totalAmount,
        items: newTransaction.items.map((item) => ({
          productId: +item.productId,
          quantity: +item.quantity,
          price: +item.price,
        })),
        paidAmount: +newTransaction.paidAmount || 0,
      };

      const res = await axios.post(
        "http://localhost:5000/api/transaction/create-transaction",
        payload
      );

      setTransactions([res.data.transaction, ...transactions]);
      setFilteredTransactions([res.data.transaction, ...transactions]);

      // ✅ Stock ko refresh karne ke liye products fetch karo
      fetchProducts();

      setShowModal(false);
      setNewTransaction({
        supplierId: "",
        items: [{ productId: "", quantity: "", price: "" }],
        paidAmount: "",
        status: "Paid",
      });
    } catch (error) {
      console.error(error);
    }
  };

  // Delete transaction
  const handleDeleteTransaction = async () => {
    try {
      await axios.delete(
        `http://localhost:5000/api/transaction/${transactionToDelete.id}`
      );
      setTransactions((prev) =>
        prev.filter((t) => t.id !== transactionToDelete.id)
      );
      setShowDeleteModal(false);
      setTransactionToDelete(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePrintTransaction = (transaction) => {
    const printWindow = window.open("", "_blank");
    const html = `
    <html>
      <head>
        <title>Transaction</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Ubuntu&display=swap');
          body { 
            font-family: 'Ubuntu', sans-serif; 
            padding: 20px; 
          }
          table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-bottom: 20px;
          }
          th, td { 
            border: 1px solid #000; 
            padding: 5px; 
            text-align: left; 
          }
          th { 
            background-color: #f0f0f0; 
          }
          td.right { 
            text-align: right; 
          }
          .summary { 
            font-weight: bold; 
            text-align: right; 
            margin-bottom: 2px;
          }
        </style>
      </head>
      <body>
        <h2>Transaction - ${transaction.supplier?.name || "N/A"}</h2>
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${transaction.items
              .map(
                (item) => `
                  <tr>
                    <td>${item.product?.title || item.product}</td>
                    <td>${item.quantity}</td>
                    <td>$${item.price}</td>
                    <td>$${(item.quantity * item.price).toFixed(2)}</td>
                  </tr>
                `
              )
              .join("")}
          </tbody>
        </table>
        
        <p class="summary">Total: $${transaction.totalAmount.toFixed(2)}</p>
        <p class="summary">Paid: $${transaction.paidAmount.toFixed(2)}</p>
        <p class="summary">Status: ${transaction.status}</p>
      </body>
    </html>
  `;
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="p-4 mt-2">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold font-ubuntu">Product Listing</h2>

        <div className="flex gap-2 items-center">
          <div className="relative w-64">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
              <FiSearch />
            </span>
            <input
              type="text"
              placeholder="Search by Supplier..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-[15px] pl-9 font-ubuntu pr-1 py-2 border rounded-md focus:outline-none focus:border-blue-500  focus:ring-blue-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border px-2 py-2 font-ubuntu rounded-md focus:outline-none  focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="Paid">Paid</option>
            <option value="Partial">Partial</option>
            <option value="Due">Due</option>
          </select>

          {/* Create Transaction Button */}
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded-md font-ubuntu"
          >
            + Product Lisitng
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <table className="min-w-full bg-white border-collapse font-ubuntu">
        <thead className="bg-black">
          <tr>
            <th className="py-2 px-4 text-white text-sm border">Supplier</th>
            <th className="py-2 px-4 text-white text-sm border">Products</th>
            <th className="py-2 px-4  text-white text-sm border">Total</th>
            <th className="py-2 px-4  text-white text-sm border">Paid</th>
            <th className="py-2 px-4  text-white text-sm border">Due</th>
            <th className="py-2 px-4  text-white text-sm border">Status</th>
            <th className="py-2 px-4  text-white text-sm border">Action</th>
          </tr>
        </thead>
        <tbody>
          {currentTransactions.map((t, index) => (
            <tr key={t.id || index} className="text-center align-top">
              <td className="py-2 px-4 border">{t.supplier?.name || "N/A"}</td>

              {/* Products */}
              <td className="py-2 px-4 border text-left">
                <table className="w-full text-sm border border-gray-200">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-2 py-1 border">Product</th>
                      <th className="px-2 py-1 border">Qty</th>
                      <th className="px-2 py-1 border">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {t.items?.map((item, i) => (
                      <tr key={i} className="text-center">
                        <td className="px-2 py-1 border">
                          {item.product?.title || "N/A"}
                        </td>
                        <td className="px-2 py-1 border">{item.quantity}</td>
                        <td className="px-2 py-1 border">${item.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </td>

              <td className="py-2 px-4 border">
                ${(t?.totalAmount || 0).toFixed(2)}
              </td>
              <td className="py-2 px-4 border">
                ${(t?.paidAmount || 0).toFixed(2)}
              </td>
              <td className="py-2 px-4 border">
                ${((t?.totalAmount || 0) - (t?.paidAmount || 0)).toFixed(2)}
              </td>

              <td className="py-2 px-4 border text-center">
                <span
                  className={`px-2 py-1 rounded-full text-sm font-semibold ${
                    t.status === "Paid"
                      ? "bg-green-100 text-green-800"
                      : t.status === "Partial"
                      ? "bg-yellow-100 text-yellow-800"
                      : t.status === "Due"
                      ? "bg-red-100 text-red-800"
                      : ""
                  }`}
                >
                  {t.status}
                </span>
              </td>

              {/* Delete Action */}
              <td className="py-2 px-4 border text-center">
                <div className="flex justify-center items-center gap-2">
                  {/* Delete Icon */}
                  <FiTrash2
                    className="text-red-600 cursor-pointer hover:text-red-700"
                    onClick={() => {
                      setTransactionToDelete(t);
                      setShowDeleteModal(true);
                    }}
                  />

                  {/* Print Icon */}
                  <button
                    onClick={() => handlePrintTransaction(t)}
                    className="text-blue-600 hover:text-blue-700 text-sm"
                  >
                    🧾
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4 font-ubuntu text-sm">
        <div className="text-gray-600">
          Showing {startIdx + 1} -{" "}
          {Math.min(startIdx + limit, filteredTransactions.length)} of{" "}
          {filteredTransactions.length} transactions
        </div>

        <div className="flex justify-center items-center gap-3 font-ubuntu">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-3 py-1 border rounded-md disabled:opacity-50"
          >
            Prev
          </button>

          {Array.from({ length: Math.min(5, totalPages) }, (_, idx) => {
            let startPage = Math.max(1, page - 2);
            let endPage = Math.min(totalPages, startPage + 4);
            startPage = Math.max(1, endPage - 4);

            const currentPage = startPage + idx;

            return (
              <button
                key={currentPage}
                onClick={() => setPage(currentPage)}
                className={`px-3 py-1 border rounded-md ${
                  page === currentPage ? "bg-blue-500 text-white" : ""
                }`}
              >
                {currentPage}
              </button>
            );
          })}

          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="px-3 py-1 border rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Create Transaction Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-5 rounded-md w-[500px] shadow-lg font-ubuntu">
            <h3 className="text-2xl font-bold mb-2 text-gray-800">
              Product Listing
            </h3>

            {/* Supplier */}
            <div className="mb-4">
              <label className="block text-md font-bold text-gray-700 mb-1">
                Supplier <span className="text-red-400">*</span>
              </label>
              <select
                value={newTransaction.supplierId}
                onChange={(e) =>
                  setNewTransaction({
                    ...newTransaction,
                    supplierId: e.target.value,
                  })
                }
                className="border px-3 py-1.5 rounded-md w-full text-sm focus:outline-none  focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select Supplier</option>
                {Array.isArray(suppliers) &&
                  suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
              </select>
            </div>

            {/* Products */}
            <div className="mb-1">
              <label className="block text-md font-bold text-gray-700 mb-2">
                Products
              </label>

              {newTransaction.items.map((item, idx) => (
                <div key={idx} className="flex gap-2 mb-3 items-end">
                  {/* Product Dropdown */}
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Name <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={item.productId || ""}
                      onChange={(e) =>
                        updateItem(idx, "productId", e.target.value)
                      }
                      className="border px-3 py-1.5 text-[14px] rounded-md w-full"
                    >
                      <option value="">Select Product</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Quantity */}
                  <div className="w-24">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantity
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(idx, "quantity", e.target.value)
                      }
                      className="border px-3 py-1.5 text-[14px] rounded-md w-full"
                    />
                  </div>

                  {/* Price */}
                  <div className="w-28">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={item.price}
                      onChange={(e) => updateItem(idx, "price", e.target.value)}
                      className="border px-3 py-1.5 text-[14px] rounded-md w-full"
                    />
                  </div>
                </div>
              ))}

              <button
                onClick={addProductRow}
                className="text-[12px] text-blue-600 hover:text-blue-800 font-medium"
              >
                + Add Product
              </button>
            </div>

            {/* Paid Amount */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Paid Amount
              </label>
              <input
                type="number"
                placeholder="Enter Paid Amount"
                min={0}
                value={newTransaction.paidAmount}
                onChange={(e) =>
                  setNewTransaction({
                    ...newTransaction,
                    paidAmount: +e.target.value,
                  })
                }
                className="border px-3 py-1.5 text-[14px] rounded w-full focus:outline-none  focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* Status */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                value={newTransaction.status}
                onChange={(e) =>
                  setNewTransaction({
                    ...newTransaction,
                    status: e.target.value,
                  })
                }
                className="border px-3 py-1.5 text-[15px] rounded w-full focus:outline-none  focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="Paid">Paid</option>
                <option value="Partial">Partial</option>
                <option value="Due">Due</option>
              </select>
            </div>

            {/* Total */}
            <div className="font-bold mb-6 text-gray-800 text-right">
              Total: ${totalAmount.toFixed(2)}
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-1.5 border rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTransaction}
                className="px-5 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
            <div className="p-6">
              {/* Red Warning Icon */}
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 
              2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 
              0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  ></path>
                </svg>
              </div>

              {/* Heading */}
              <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
                Delete Transaction
              </h3>

              {/* Message */}
              <p className="text-sm text-gray-500 text-center mb-6">
                Are you sure you want to delete this transaction{" "}
                {transactionToDelete?.supplier?.name && (
                  <span className="font-bold text-gray-800">
                    {transactionToDelete.supplier.name}?
                  </span>
                )}
              </p>

              {/* Buttons */}
              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-3 py-1 border border-gray-300 rounded-md text-gray-700 
                       hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteTransaction}
                  className="px-3 py-1 bg-red-600 text-white rounded-md 
                       hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductListing;
