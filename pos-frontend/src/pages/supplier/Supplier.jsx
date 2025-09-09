import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { toast } from "react-toastify";

const Supplier = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [supplierToDelete, setSupplierToDelete] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    companyName: "",
  });

  // ✅ Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const suppliersPerPage = 5;

  // ✅ Fetch suppliers
  const fetchSuppliers = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/supplier/get-all-suppliers"
      );
      console.log("Fetched suppliers:", res.data);

      // Ensure companyName is mapped properly
      const suppliersData = res.data.suppliers.map((supplier) => ({
        ...supplier,
        companyName: supplier.companyName || "", // fallback if backend sends `company`
      }));

      setSuppliers(suppliersData);
    } catch (err) {
      console.error("Error fetching suppliers:", err.response?.data || err);
      toast.error("❌ Failed to fetch suppliers");
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Add / Update Supplier
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSupplier) {
        await axios.put(
          `http://localhost:5000/api/supplier/update-supplier/${editingSupplier.id}`,
          form
        );
        toast.success("✅ Supplier updated successfully");
      } else {
        await axios.post(
          "http://localhost:5000/api/supplier/add-supplier",
          form
        );
        toast.success("✅ Supplier added successfully");
      }
      fetchSuppliers();
      handleCloseModal();
    } catch (err) {
      console.error("Error saving supplier:", err.response?.data || err);
      toast.error("❌ Failed to save supplier");
    }
  };

  // ✅ Delete Supplier
  const confirmDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:5000/api/supplier/delete-supplier/${supplierToDelete.id}`
      );
      toast.success("✅ Supplier deleted successfully");
      setSuppliers(suppliers.filter((s) => s.id !== supplierToDelete.id));
      setDeleteModal(false);
      setSupplierToDelete(null);
    } catch (err) {
      console.error("Error deleting supplier:", err.response?.data || err);
      toast.error("❌ Failed to delete supplier");
    }
  };

  // ✅ Close Modal Helper
  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingSupplier(null);
    setForm({
      name: "",
      email: "",
      phone: "",
      address: "",
      companyName: "",
    });
  };

  // ✅ Pagination logic
  const indexOfLastSupplier = currentPage * suppliersPerPage;
  const indexOfFirstSupplier = indexOfLastSupplier - suppliersPerPage;
  const currentSuppliers = suppliers.slice(
    indexOfFirstSupplier,
    indexOfLastSupplier
  );
  const totalPages = Math.ceil(suppliers.length / suppliersPerPage);

  return (
    <div className="p-6 font-ubuntu">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Suppliers</h1>
        <button
          onClick={() => setOpenModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700"
        >
          + Add Supplier
        </button>
      </div>

      {/* Supplier Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full border border-gray-300 rounded-lg shadow-md overflow-hidden">
          <thead className="bg-gray-900">
            <tr>
              {["Name", "Company", "Phone", "Email", "Action"].map(
                (header, idx) => (
                  <th
                    key={idx}
                    className={`py-3 px-4 text-left text-xs font-medium text-white uppercase tracking-wider ${
                      idx !== 4 ? "border-r borderr-white" : ""
                    }`}
                  >
                    {header}
                  </th>
                )
              )}
            </tr>
          </thead>

          <tbody className="bg-white text-sm">
            {currentSuppliers.length > 0 ? (
              currentSuppliers.map((supplier) => (
                <tr
                  key={supplier.id}
                  className="hover:bg-gray-50 border-b border-gray-200"
                >
                  <td className="py-3 px-4 border-r border-gray-200">
                    {supplier.name}
                  </td>
                  <td className="py-3 px-4 border-r border-gray-200">
                    {supplier.companyName}
                  </td>
                  <td className="py-3 px-4 border-r border-gray-200">
                    {supplier.phone}
                  </td>
                  <td className="py-3 px-4 border-r border-gray-200">
                    {supplier.email}
                  </td>
                  <td className="py-3 px-4 border-r border-gray-200 flex gap-2">
                    <FiEdit
                      className="text-green-600 cursor-pointer hover:text-green-700"
                      onClick={() => {
                        setEditingSupplier(supplier);
                        setForm({
                          name: supplier.name,
                          email: supplier.email,
                          phone: supplier.phone,
                          address: supplier.address,
                          companyName: supplier.companyName || "",
                        });
                        setOpenModal(true);
                      }}
                    />
                    <FiTrash2
                      className="text-red-600 cursor-pointer hover:text-red-700"
                      onClick={() => {
                        setSupplierToDelete(supplier);
                        setDeleteModal(true);
                      }}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-8 text-gray-500">
                  No suppliers added yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ Pagination Footer */}
      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-gray-600">
          Showing {indexOfFirstSupplier + 1}–
          {Math.min(indexOfLastSupplier, suppliers.length)} of{" "}
          {suppliers.length} results
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Add/Edit Supplier Modal */}
      {openModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
            <h2 className="text-xl font-bold mb-4">
              {editingSupplier ? "Edit Supplier" : "Add Supplier"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-1">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="border p-1.5 text-sm rounded w-full focus:outline-none  focus:border-blue-500 focus:ring-blue-500"
                    name="name"
                    value={form.name}
                    onChange={handleFormChange}
                    required
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    className="border p-1.5 text-sm rounded w-full focus:outline-none  focus:border-blue-500 focus:ring-blue-500"
                    name="email"
                    value={form.email}
                    onChange={handleFormChange}
                    required
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="border p-1.5 text-sm rounded w-full focus:outline-none  focus:border-blue-500 focus:ring-blue-500"
                    name="phone"
                    value={form.phone}
                    onChange={handleFormChange}
                    required
                    placeholder="Enter your phone"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="border p-1.5 text-sm rounded w-full focus:outline-none  focus:border-blue-500 focus:ring-blue-500"
                    name="address"
                    value={form.address}
                    onChange={handleFormChange}
                    required
                    placeholder="Enter your address"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block font-medium mb-1">Company</label>
                  <input
                    className="border p-1.5 text-sm rounded w-full focus:outline-none  focus:border-blue-500 focus:ring-blue-500"
                    name="companyName"
                    value={form.companyName}
                    onChange={handleFormChange}
                    placeholder="Company name"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-10">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="bg-gray-300  px-4 py-2 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-lg font-bold mb-4">Confirm Delete</h2>
            <p>
              Are you sure you want to delete{" "}
              <strong>{supplierToDelete?.name}</strong>?
            </p>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setDeleteModal(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Supplier;
