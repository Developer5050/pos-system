import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiTrash2 } from "react-icons/fi";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Fetch customers from API
  const fetchCustomers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/customer/get-customer"
      );
      setCustomers(response.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Filter customers based on search term
  const filteredCustomers = customers.filter((customer) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (customer.name?.toLowerCase() || "").includes(searchLower) ||
      (customer.email?.toLowerCase() || "").includes(searchLower) ||
      (customer.phone?.toLowerCase() || "").includes(searchLower) ||
      (customer.address?.toLowerCase() || "").includes(searchLower)
    );
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCustomers = filteredCustomers.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  // Delete customer
  const confirmDelete = async () => {
    if (customerToDelete) {
      try {
        await axios.delete(
          `http://localhost:5000/api/customer/delete-customer/${customerToDelete.id}`
        );

        // Remove deleted customer from state
        setCustomers(customers.filter((c) => c.id !== customerToDelete.id));
        closeDeleteModal();

        // Adjust pagination if needed
        if (currentCustomers.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } catch (error) {
        console.error("Error deleting customer:", error);
      }
    }
  };

  const openDeleteModal = (customer) => {
    setCustomerToDelete(customer);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setCustomerToDelete(null);
  };

  return (
    <div className="p-5 bg-gray-100 min-h-screen font-ubuntu">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
          Customer List
        </h1>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search customers..."
            className="pl-3 pr-4 py-2 text-[15px] border rounded-md focus:outline-none  focus:border-blue-500 focus:ring-blue-500 w-full md:w-64"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded-lg shadow-md overflow-hidden">
            <thead className="bg-gray-900">
              <tr>
                {[
                  "ID",
                  "Name",
                  "Email",
                  "Phone",
                  "Address",
                  "Created At",
                  "Actions",
                ].map((header, idx) => (
                  <th
                    key={idx}
                    className={`py-3 px-4 text-left text-xs font-medium text-white uppercase tracking-wider ${
                      idx !== 6 ? "border-r border-white" : ""
                    }`}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="bg-white">
              {currentCustomers.length > 0 ? (
                currentCustomers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="hover:bg-gray-50 border-b border-gray-200"
                  >
                    <td className="py-4 px-4 text-sm border-r border-gray-200">
                      {customer.id}
                    </td>
                    <td className="py-4 px-4 text-sm border-r border-gray-200">
                      {customer.name}
                    </td>
                    <td className="py-4 px-4 text-sm border-r border-gray-200">
                      {customer.email}
                    </td>
                    <td className="py-4 px-4 text-sm border-r border-gray-200">
                      {customer.phone}
                    </td>
                    <td className="py-4 px-4 text-sm max-w-xs truncate border-r border-gray-200">
                      {customer.address}
                    </td>
                    <td className="py-4 px-1 text-sm border-r border-gray-200">
                      {customer.createdAt}
                    </td>
                    <td className="py-4 px-4 text-md border-r border-gray-200 text-center text-sm">
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => openDeleteModal(customer)}
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-gray-500">
                    No customers found.
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
              Showing {indexOfFirstItem + 1} to{" "}
              {Math.min(indexOfLastItem, filteredCustomers.length)} of{" "}
              {filteredCustomers.length} results
            </div>
            <div className="flex space-x-1">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {pageNumbers.map((number) => (
                <button
                  key={number}
                  onClick={() => setCurrentPage(number)}
                  className={`px-3 py-1 border rounded-md text-sm ${
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
                className="px-3 py-1 border rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {deleteModalOpen && (
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
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 
              1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 
              0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  ></path>
                </svg>
              </div>

              {/* Heading */}
              <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
                Delete Customer
              </h3>

              {/* Message */}
              <p className="text-sm text-gray-500 text-center mb-6">
                Are you sure you want to delete{" "}
                <span className="font-bold text-gray-800">
                  {customerToDelete?.name}?
                </span>
              </p>

              {/* Buttons */}
              <div className="flex justify-center space-x-3">
                <button
                  onClick={closeDeleteModal}
                  className="px-3 py-1 border border-gray-300 rounded-md text-gray-700 
                       hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
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

export default Customers;
