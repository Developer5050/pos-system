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
    {
      id: 4,
      firstName: "Emily",
      lastName: "Davis",
      email: "emily.davis@example.com",
      phone: "+1 (555) 456-7890",
      address: "101 Elm St, Houston, TX 77001",
      createdAt: "2023-08-05",
    },
    {
      id: 5,
      firstName: "David",
      lastName: "Wilson",
      email: "david.wilson@example.com",
      phone: "+1 (555) 567-8901",
      address: "202 Maple Dr, Phoenix, AZ 85001",
      createdAt: "2023-08-15",
    },
    {
      id: 6,
      firstName: "Jessica",
      lastName: "Brown",
      email: "jessica.brown@example.com",
      phone: "+1 (555) 678-9012",
      address: "303 Cedar Ln, Philadelphia, PA 19101",
      createdAt: "2023-09-01",
    },
    {
      id: 7,
      firstName: "Daniel",
      lastName: "Miller",
      email: "daniel.miller@example.com",
      phone: "+1 (555) 789-0123",
      address: "404 Birch St, San Antonio, TX 78201",
      createdAt: "2023-09-10",
    },
    {
      id: 8,
      firstName: "Lisa",
      lastName: "Taylor",
      email: "lisa.taylor@example.com",
      phone: "+1 (555) 890-1234",
      address: "505 Walnut Ave, San Diego, CA 92101",
      createdAt: "2023-09-20",
    },
    {
      id: 9,
      firstName: "Mark",
      lastName: "Anderson",
      email: "mark.anderson@example.com",
      phone: "+1 (555) 901-2345",
      address: "606 Spruce Dr, Dallas, TX 75201",
      createdAt: "2023-10-05",
    },
    {
      id: 10,
      firstName: "Amy",
      lastName: "Thomas",
      email: "amy.thomas@example.com",
      phone: "+1 (555) 012-3456",
      address: "707 Oak St, San Jose, CA 95101",
      createdAt: "2023-10-15",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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

  // Get current customers for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCustomers = filteredCustomers.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

  // Generate page numbers for pagination
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

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

      // Adjust current page if needed after deletion
      if (currentCustomers.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
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
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page when searching
              }}
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
              {currentCustomers.length > 0 ? (
                currentCustomers.map((customer) => (
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
        {filteredCustomers.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between">
            <div className="text-sm text-gray-700 mb-4 sm:mb-0">
              Showing{" "}
              <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
              <span className="font-medium">
                {Math.min(indexOfLastItem, filteredCustomers.length)}
              </span>{" "}
              of <span className="font-medium">{filteredCustomers.length}</span>{" "}
              results
            </div>

            <div className="flex space-x-1">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              {pageNumbers.map((number) => (
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
              ))}

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
        )}
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
