import React, { useState } from "react";

const Customers = () => {
  // Sample customer data
  const [customers, setCustomers] = useState([
    {
      id: 1,
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phone: "+1 (555) 123-4567",
      address: "123 Main St, New York, NY 10001",
      createdAt: "2023-05-15",
    },
    {
      id: 2,
      firstName: "Sarah",
      lastName: "Smith",
      email: "sarah.smith@example.com",
      phone: "+1 (555) 234-5678",
      address: "456 Oak Ave, Los Angeles, CA 90001",
      createdAt: "2023-06-10",
    },
    {
      id: 3,
      firstName: "Michael",
      lastName: "Johnson",
      email: "michael.j@example.com",
      phone: "+1 (555) 345-6789",
      address: "789 Pine Rd, Chicago, IL 60601",
      createdAt: "2023-07-22",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);

  // Filter customers based on search term
  const filteredCustomers = customers.filter((customer) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      customer.firstName.toLowerCase().includes(searchLower) ||
      customer.lastName.toLowerCase().includes(searchLower) ||
      customer.email.toLowerCase().includes(searchLower) ||
      customer.phone.toLowerCase().includes(searchLower) ||
      customer.address.toLowerCase().includes(searchLower)
    );
  });

  // Open delete confirmation modal
  const openDeleteModal = (customer) => {
    setCustomerToDelete(customer);
    setDeleteModalOpen(true);
  };

  // Close delete confirmation modal
  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setCustomerToDelete(null);
  };

  // Handle delete customer confirmation
  const confirmDelete = () => {
    if (customerToDelete) {
      setCustomers(
        customers.filter((customer) => customer.id !== customerToDelete.id)
      );
      closeDeleteModal();
    }
  };

  return (
    <div className="p-5 bg-gray-100 min-h-screen font-ubuntu">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
          Customer List
        </h1>

        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 w-full md:w-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search customers..."
              className="pl-10 pr-4 py-1.5 text-[15px] border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-black">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                  ID
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Name
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Email
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Phone
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Address
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-white uppercase tracking-wider min-w-[120px]">
                  Created At
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="py-4 px-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {customer.id}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap text-sm text-black">
                      <div className="flex items-center">
                        {customer.firstName} {customer.lastName}
                      </div>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap text-sm text-black">
                      <div className="flex items-center">{customer.email}</div>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap text-sm text-black">
                      <div className="flex items-center">{customer.phone}</div>
                    </td>
                    <td className="py-4 px-4 text-sm text-black max-w-xs">
                      <div className="flex items-center">
                        <span className="truncate">{customer.address}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap text-sm text-black">
                      {customer.createdAt}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex">
                        <button
                          className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100"
                          onClick={() => openDeleteModal(customer)}
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
                    No customers found. Try adjusting your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">1</span> to{" "}
            <span className="font-medium">{filteredCustomers.length}</span> of{" "}
            <span className="font-medium">{filteredCustomers.length}</span>{" "}
            results
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
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  ></path>
                </svg>
              </div>

              <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
                Delete Customer
              </h3>

              <p className="text-sm text-gray-500 text-center mb-6">
                Are you sure you want to delete the customer "
                {customerToDelete?.firstName} {customerToDelete?.lastName}"?
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
    </div>
  );
};

export default Customers;
