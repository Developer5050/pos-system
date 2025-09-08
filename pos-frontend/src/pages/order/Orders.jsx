import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiEye, FiTrash2 } from "react-icons/fi";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [orderToView, setOrderToView] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Fetch orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "http://localhost:5000/api/order/get-all-orders"
      );
      setOrders(res.data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Delete order
  const confirmDelete = async () => {
    if (!orderToDelete) return;
    try {
      await axios.delete(
        `http://localhost:5000/api/order/delete-order/${orderToDelete.id}`
      );
      setOrders((prev) =>
        prev.filter((order) => order.id !== orderToDelete.id)
      );
      closeDeleteModal();
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  // Update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/order/${orderId}/status`, {
        status: newStatus,
      });
      setOrderToView((prev) => ({ ...prev, status: newStatus }));
      fetchOrders();
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  // Modals
  const openDeleteModal = (order) => {
    setOrderToDelete(order);
    setDeleteModalOpen(true);
  };
  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setOrderToDelete(null);
  };
  const openViewModal = (order) => {
    setOrderToView(order);
    setViewModalOpen(true);
  };
  const closeViewModal = () => {
    setViewModalOpen(false);
    setOrderToView(null);
  };

  // Pagination logic
  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = orders.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="p-4 bg-gray-100 min-h-screen font-ubuntu">
      <h1 className="text-2xl font-bold mb-4">Orders List</h1>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        {loading ? (
          <p className="text-center p-4">Loading orders...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
              <thead className="bg-black border-b border-gray-300">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-white border-r border-gray-300">
                    Order
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-white border-r border-gray-300">
                    Customer
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-white border-r border-gray-300">
                    Items
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-white border-r border-gray-300">
                    Amount
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-white border-r border-gray-300">
                    Status
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-white border-r border-gray-300">
                    Date
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-white">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white">
                {currentOrders.length > 0 ? (
                  currentOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-gray-50 border-b border-gray-200"
                    >
                      <td className="py-4 px-4 text-sm border-r border-gray-200">
                        {order.orderNumber}
                      </td>
                      <td className="py-4 px-4 font-medium text-[14px] border-r border-gray-200">
                        {order.customer?.name}
                      </td>
                      <td className="py-4 px-4 text-sm border-r border-gray-200">
                        {order.orderItems
                          ?.map(
                            (item) =>
                              `${item.product?.title} (x${item.quantity})`
                          )
                          .join(", ")}
                      </td>
                      <td className="py-4 px-4 border-r border-gray-200">
                        ${order.amount.toFixed(2)}
                      </td>
                      <td className="py-4 px-4 border-r border-gray-200">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            order.status === "PAID"
                              ? "bg-green-200 text-green-800"
                              : order.status === "CANCELLED"
                              ? "bg-red-200 text-red-800"
                              : "bg-yellow-200 text-yellow-800"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 border-r border-gray-200">
                        {new Date(order.createdAt).toISOString().split("T")[0]}
                      </td>
                      <td className="py-4 px-4 flex space-x-2">
                        <button
                          className="flex items-center text-blue-500 hover:text-blue-700"
                          onClick={() => openViewModal(order)}
                        >
                          <FiEye className="mr-1" />
                        </button>
                        <button
                          className="flex items-center text-red-500 hover:text-red-700"
                          onClick={() => openDeleteModal(order)}
                        >
                          <FiTrash2 className="mr-1 " />
                        </button>
                        <button
                          className="flex items-center text-green-500 hover:text-green-700"
                          onClick={() =>
                            window.open(
                              `http://localhost:5000/api/order/receipt/${order.id}`,
                              "_blank"
                            )
                          }
                        >
                          🧾
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-6 text-gray-500">
                      No orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between mt-4">
          <div className="text-sm text-gray-700 mb-4 sm:mb-0">
            Showing <span className="font-medium">{indexOfFirstItem + 1}</span>{" "}
            to{" "}
            <span className="font-medium">
              {Math.min(indexOfLastItem, orders.length)}
            </span>{" "}
            of <span className="font-medium">{orders.length}</span> results
          </div>

          <div className="flex space-x-1">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (number) => (
                <button
                  key={number}
                  onClick={() => setCurrentPage(number)}
                  className={`px-3 py-1 border rounded-md text-sm font-medium ${
                    currentPage === number
                      ? "text-white bg-blue-600"
                      : "text-gray-700 bg-white hover:bg-gray-50"
                  }`}
                >
                  {number}
                </button>
              )
            )}

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-96">
            <h3 className="text-lg font-bold mb-4">Delete Order</h3>
            <p className="mb-6">
              Are you sure you want to delete{" "}
              <span className="font-bold">{orderToDelete?.orderNumber}</span>?
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={closeDeleteModal}
                className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewModalOpen && orderToView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-2 border-b border-gray-200 pb-3">
              <h2 className="text-2xl font-bold text-gray-800">
                Order Details # {orderToView.orderNumber}
              </h2>
              <button
                onClick={closeViewModal}
                className="text-gray-400 hover:text-gray-700 text-xl font-bold transition"
              >
                ✖
              </button>
            </div>

            {/* Customer Info */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Customer Info
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-1">
                <p className="text-gray-800">
                  <span className="font-medium">Name:</span>{" "}
                  {orderToView.customer?.name}
                </p>
                <p className="text-gray-800">
                  <span className="font-medium">Email:</span>{" "}
                  {orderToView.customer?.email}
                </p>
                <p className="text-gray-800">
                  <span className="font-medium">Phone:</span>{" "}
                  {orderToView.customer?.phone}
                </p>
                <p className="text-gray-800">
                  <span className="font-medium">Address:</span>{" "}
                  {orderToView.customer?.address}
                </p>
              </div>
            </div>

            {/* Products */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Products
              </h3>
              <div className="bg-gray-50 p-2 rounded-lg space-y-1">
                {orderToView.orderItems?.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center border-b border-gray-200 last:border-b-0 py-2"
                  >
                    <p className="text-gray-800 font-medium">
                      {item.product?.title}
                    </p>
                    <p className="text-gray-600">
                      {item.quantity} × ${item.price.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Order Summary
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <p className="text-gray-800">
                  <span className="font-medium">Amount:</span> $
                  {orderToView.amount?.toFixed(2)}
                </p>

                <div className="text-gray-800">
                  <span className="font-medium">Status:</span>
                  <select
                    className="ml-3 border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={orderToView.status || "PAID"} // default PAID
                    onChange={(e) =>
                      updateOrderStatus(orderToView.id, e.target.value)
                    }
                  >
                    <option value="PAID">PAID</option>
                    <option value="REVERSED">REVERSED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </div>

                <p className="text-gray-800">
                  <span className="font-medium">Order Date:</span>{" "}
                  {new Date(orderToView.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={closeViewModal}
                className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
