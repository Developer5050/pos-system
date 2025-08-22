import React, { useState } from 'react';

const Orders = () => {
  // Sample order data
  const [orders, setOrders] = useState([
    {
      id: 1001,
      customerName: 'John Doe',
      customerEmail: 'john.doe@example.com',
      customerPhone: '+1 (555) 123-4567',
      customerAddress: '123 Main St, New York, NY 10001',
      productName: 'Wireless Headphones',
      productId: 1,
      quantity: 1,
      totalAmount: 79.99,
      paymentMethod: 'Credit Card',
      status: 'Paid',
      createdAt: '2023-10-15 14:30'
    },
    {
      id: 1002,
      customerName: 'Sarah Smith',
      customerEmail: 'sarah.smith@example.com',
      customerPhone: '+1 (555) 234-5678',
      customerAddress: '456 Oak Ave, Los Angeles, CA 90001',
      productName: 'Smart Watch',
      productId: 2,
      quantity: 1,
      totalAmount: 199.99,
      paymentMethod: 'PayPal',
      status: 'Paid',
      createdAt: '2023-10-16 10:15'
    },
    {
      id: 1003,
      customerName: 'Mike Johnson',
      customerEmail: 'mike.j@example.com',
      customerPhone: '+1 (555) 345-6789',
      customerAddress: '789 Pine Rd, Chicago, IL 60601',
      productName: 'Bluetooth Speaker',
      productId: 3,
      quantity: 2,
      totalAmount: 99.98,
      paymentMethod: 'Cash',
      status: 'Unpaid',
      createdAt: '2023-10-17 16:45'
    },
    {
      id: 1004,
      customerName: 'Emily Davis',
      customerEmail: 'emily.davis@example.com',
      customerPhone: '+1 (555) 456-7890',
      customerAddress: '101 Elm St, Houston, TX 77001',
      productName: 'Gaming Mouse',
      productId: 4,
      quantity: 1,
      totalAmount: 59.99,
      paymentMethod: 'Credit Card',
      status: 'Paid',
      createdAt: '2023-10-18 11:20'
    },
    {
      id: 1005,
      customerName: 'Alex Wilson',
      customerEmail: 'alex.wilson@example.com',
      customerPhone: '+1 (555) 567-8901',
      customerAddress: '202 Maple Dr, Phoenix, AZ 85001',
      productName: 'Mechanical Keyboard',
      productId: 5,
      quantity: 1,
      totalAmount: 89.99,
      paymentMethod: 'Debit Card',
      status: 'Unpaid',
      createdAt: '2023-10-19 09:05'
    }
  ]);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [orderToView, setOrderToView] = useState(null);

  // Filter orders based on date range and status
  const filteredOrders = orders.filter(order => {
    const orderDate = new Date(order.createdAt);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    
    const inDateRange = (!start || orderDate >= start) && (!end || orderDate <= end);
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    
    return inDateRange && matchesStatus;
  });

  // Handle filter submission
  const handleFilter = (e) => {
    e.preventDefault();
    // Filtering is done automatically through state changes
  };

  // Toggle order status
  const toggleStatus = (id) => {
    setOrders(orders.map(order => 
      order.id === id 
        ? { ...order, status: order.status === 'Paid' ? 'Unpaid' : 'Paid' }
        : order
    ));
  };

  // Open delete confirmation modal
  const openDeleteModal = (order) => {
    setOrderToDelete(order);
    setDeleteModalOpen(true);
  };

  // Close delete confirmation modal
  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setOrderToDelete(null);
  };

  // Handle delete order confirmation
  const confirmDelete = () => {
    if (orderToDelete) {
      setOrders(orders.filter(order => order.id !== orderToDelete.id));
      closeDeleteModal();
    }
  };

  // Open view order modal
  const openViewModal = (order) => {
    setOrderToView(order);
    setViewModalOpen(true);
  };

  // Close view order modal
  const closeViewModal = () => {
    setViewModalOpen(false);
    setOrderToView(null);
  };

  return (
    <div className="p-2 bg-gray-100 min-h-screen font-ubuntu">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Order List</h1>
        
        {/* Filter Form */}
        <form onSubmit={handleFilter} className="bg-white p-4 rounded-lg shadow-md w-full md:w-auto">
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 mt-5">From Date</label>
              <input
                type="date"
                className="p-1.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 mt-5">To Date</label>
              <input
                type="date"
                className="p-1.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 mt-5">Status</label>
              <select
                className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Paid">Paid</option>
                <option value="Unpaid">Unpaid</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <button 
                type="submit"
                className= "bg-blue-500 hover:bg-blue-600 relative bottom-1 text-white py-1.5 px-4 rounded-md w-full"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-black">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium text-white uppercase tracking-wider">Order ID</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-white uppercase tracking-wider">Customer</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-white uppercase tracking-wider">Product</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-white uppercase tracking-wider">Amount</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-white uppercase tracking-wider">Status</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-white uppercase tracking-wider">Order Date</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-white uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.length > 0 ? (
                filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="py-4 px-4 font-medium text-gray-900">{order.id}</td>
                    <td className="py-4 px-4 text-sm font-bold">{order.customerName}</td>
                    <td className="py-4 px-4 text-sm font-bold">{order.productName}</td>
                    <td className="py-4 px-4 font-medium">${order.totalAmount.toFixed(2)}</td>
                    <td className="py-4 px-4">
                      <span 
                        className={`px-2 py-1 rounded-full text-xs font-medium cursor-pointer ${
                          order.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}
                        onClick={() => toggleStatus(order.id)}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-500">{order.createdAt.split(' ')[0]}</td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex space-x-2 justify-center">
                        <button 
                          className="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-100"
                          onClick={() => openViewModal(order)}
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                        <button 
                          className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100"
                          onClick={() => openDeleteModal(order)}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-gray-500">
                    No orders found for the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredOrders.length}</span> of{' '}
            <span className="font-medium">{filteredOrders.length}</span> results
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-500">
              Previous
            </button>
            <button className="px-3 py-1 border rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-500">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
              </div>
              
              <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
                Delete Order
              </h3>
              
              <p className="text-sm text-gray-500 text-center mb-6">
                Are you sure you want to delete order {orderToDelete?.id}? 
                This action cannot be undone.
              </p>

              <div className="flex justify-center space-x-3">
                <button
                  onClick={closeDeleteModal}
                  className="px-3 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Order Details Modal */}
      {viewModalOpen && orderToView && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  Order Details - #{orderToView.id}
                </h2>
                <button
                  onClick={closeViewModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Customer Information</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Name:</span> {orderToView.customerName}</p>
                    <p><span className="font-medium">Email:</span> {orderToView.customerEmail}</p>
                    <p><span className="font-medium">Phone:</span> {orderToView.customerPhone}</p>
                    <p><span className="font-medium">Address:</span> {orderToView.customerAddress}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Order Information</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Product:</span> {orderToView.productName}</p>
                    <p><span className="font-medium">Quantity:</span> {orderToView.quantity}</p>
                    <p><span className="font-medium">Total Amount:</span> ${orderToView.totalAmount.toFixed(2)}</p>
                    <p><span className="font-medium">Payment Method:</span> {orderToView.paymentMethod}</p>
                    <p>
                      <span className="font-medium">Status:</span> 
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                        orderToView.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {orderToView.status}
                      </span>
                    </p>
                    <p><span className="font-medium">Order Date:</span> {orderToView.createdAt}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={closeViewModal}
                  className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;