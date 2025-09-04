import React, { useState, useEffect } from "react";
import { FiEye, FiEdit, FiTrash2, FiX } from "react-icons/fi";
import axios from "axios";

const Supplier = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [slip, setSlip] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    companyName: "",
  });

  const [editForm, setEditForm] = useState({
    id: "",
    name: "",
    email: "",
    phone: "",
    address: "",
    companyName: "",
  });

  const [products, setProducts] = useState([
    { name: "", type: "", quantity: "", price: "", batchNumber: "" },
  ]);

  // Fetch suppliers on component mount
  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/supplier/get-all-suppliers");
      
      if (response.data.suppliers) {
        setSuppliers(response.data.suppliers);
      } else {
        setError(response.data.message || "Failed to fetch suppliers");
      }
    } catch (err) {
      setError("Network error. Please try again.");
      console.error("Fetch suppliers error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEditFormChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleProductChange = (index, e) => {
    const newProducts = [...products];
    newProducts[index][e.target.name] = e.target.value;
    setProducts(newProducts);
  };

  const addProductField = () => {
    setProducts([
      ...products,
      { name: "", type: "", quantity: "", price: "", batchNumber: "" },
    ]);
  };

  const removeProductField = (index) => {
    if (products.length > 1) {
      const newProducts = [...products];
      newProducts.splice(index, 1);
      setProducts(newProducts);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    // Basic validation
    if (!form.name || !form.email || !form.phone || !form.companyName) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      
      // Create FormData to handle file upload
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("phone", form.phone);
      formData.append("address", form.address);
      formData.append("companyName", form.companyName);
      
      // Add products if any
      if (products.length > 0 && products[0].name) {
        formData.append("products", JSON.stringify(products));
      }
      
      // Add slip file if selected
      if (slip) {
        formData.append("image", slip);
      }

      const response = await axios.post(
        "http://localhost:5000/api/supplier/create-supplier", 
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.supplier) {
        // Add new supplier to the list
        setSuppliers([response.data.supplier, ...suppliers]);
        
        // Reset form
        setForm({ name: "", email: "", phone: "", address: "", companyName: "" });
        setProducts([{ name: "", type: "", quantity: "", price: "", batchNumber: "" }]);
        setSlip(null);
        setOpenModal(false);
        setSuccess("Supplier created successfully!");
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(response.data.message || "Failed to create supplier");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Network error. Please try again.");
      console.error("Create supplier error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    // Basic validation
    if (!editForm.name || !editForm.email || !editForm.phone || !editForm.companyName) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      
      const response = await axios.put(
        `http://localhost:5000/api/supplier/update/${editForm.id}`,
        editForm
      );

      if (response.data.supplier) {
        // Update supplier in the list
        setSuppliers(suppliers.map(s => 
          s.id === editForm.id ? response.data.supplier : s
        ));
        
        setEditModal(false);
        setSuccess("Supplier updated successfully!");
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(response.data.message || "Failed to update supplier");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Network error. Please try again.");
      console.error("Update supplier error:", err);
    } finally {
      setLoading(false);
    }
  };

  const setViewSupplier = (supplier) => {
    setSelectedSupplier(supplier);
    setViewModal(true);
  };

  const setEditSupplier = (supplier) => {
    setEditForm({
      id: supplier.id,
      name: supplier.name,
      email: supplier.email,
      phone: supplier.phone,
      address: supplier.address,
      companyName: supplier.companyName,
    });
    setEditModal(true);
  };

  const deleteSupplier = async (id) => {
    if (!window.confirm("Are you sure you want to delete this supplier?")) return;
    
    try {
      setLoading(true);
      const response = await axios.delete(`http://localhost:5000/api/supplier/delete-supplier/${id}`);
      
      if (response.data.message) {
        // Remove supplier from the list
        setSuppliers(suppliers.filter(s => s.id !== id));
        setSuccess("Supplier deleted successfully!");
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(response.data.message || "Failed to delete supplier");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Network error. Please try again.");
      console.error("Delete supplier error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      {/* Success Message */}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
          <button className="float-right font-bold" onClick={() => setSuccess("")}>
            <FiX />
          </button>
        </div>
      )}
      
      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
          <button className="float-right font-bold" onClick={() => setError("")}>
            <FiX />
          </button>
        </div>
      )}
      
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="text-lg">Processing...</p>
          </div>
        </div>
      )}

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

      {/*  Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3 border">Name</th>
              <th className="p-3 border">Company</th>
              <th className="p-3 border">Phone</th>
              <th className="p-3 border">Email</th>
              <th className="p-3 border">Address</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.length > 0 ? (
              suppliers.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="p-3 border">{s.name}</td>
                  <td className="p-3 border">{s.companyName}</td>
                  <td className="p-3 border">{s.phone}</td>
                  <td className="p-3 border">{s.email}</td>
                  <td className="p-3 border">{s.address || "N/A"}</td>
                  <td className="p-3 border flex gap-2">
                    <FiEye
                      className="text-blue-600 cursor-pointer"
                      onClick={() => setViewSupplier(s)}
                    />
                    <FiEdit 
                      className="text-green-600 cursor-pointer" 
                      onClick={() => setEditSupplier(s)}
                    />
                    <FiTrash2 
                      className="text-red-600 cursor-pointer" 
                      onClick={() => deleteSupplier(s.id)} 
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center p-4">
                  {loading ? "Loading suppliers..." : "No suppliers added yet."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Supplier Modal */}
      {openModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-40">
          <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add Supplier</h2>
              <button onClick={() => setOpenModal(false)} className="text-gray-500 hover:text-gray-700">
                <FiX size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              {/* Supplier Details */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <input
                    className="border p-2 rounded w-full"
                    name="name"
                    placeholder="Supplier Name *"
                    value={form.name}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div>
                  <input
                    className="border p-2 rounded w-full"
                    name="email"
                    type="email"
                    placeholder="Email *"
                    value={form.email}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div>
                  <input
                    className="border p-2 rounded w-full"
                    name="phone"
                    placeholder="Phone *"
                    value={form.phone}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div>
                  <input
                    className="border p-2 rounded w-full"
                    name="address"
                    placeholder="Address"
                    value={form.address}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="col-span-2">
                  <input
                    className="border p-2 rounded w-full"
                    name="companyName"
                    placeholder="Company *"
                    value={form.companyName}
                    onChange={handleFormChange}
                    required
                  />
                </div>
              </div>

              {/* Product Fields */}
              <h3 className="text-lg font-semibold mt-6 mb-2">Products (Optional)</h3>
              {products.map((prod, index) => (
                <div
                  key={index}
                  className="grid grid-cols-5 gap-2 mb-2 border p-2 rounded relative"
                >
                  <input
                    className="border p-2 rounded"
                    name="name"
                    placeholder="Name"
                    value={prod.name}
                    onChange={(e) => handleProductChange(index, e)}
                  />
                  <input
                    className="border p-2 rounded"
                    name="type"
                    placeholder="Type"
                    value={prod.type}
                    onChange={(e) => handleProductChange(index, e)}
                  />
                  <input
                    className="border p-2 rounded"
                    name="quantity"
                    placeholder="Qty"
                    value={prod.quantity}
                    onChange={(e) => handleProductChange(index, e)}
                  />
                  <input
                    className="border p-2 rounded"
                    name="price"
                    placeholder="Price"
                    value={prod.price}
                    onChange={(e) => handleProductChange(index, e)}
                  />
                  <input
                    className="border p-2 rounded"
                    name="batchNumber"
                    placeholder="Batch #"
                    value={prod.batchNumber}
                    onChange={(e) => handleProductChange(index, e)}
                  />
                  {products.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeProductField(index)}
                      className="absolute -right-8 top-2 text-red-500"
                    >
                      <FiX size={20} />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addProductField}
                className="bg-blue-500 text-white px-3 py-1 rounded mb-4"
              >
                + Add Product
              </button>

              {/* Image Upload */}
              <div className="mt-4">
                <label className="block mb-2">Upload Slip:</label>
                <input
                  type="file"
                  name="image"
                  onChange={(e) => setSlip(e.target.files[0])}
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  onClick={() => setOpenModal(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  Save
                </button>
              </div>
            </form>

            {/* View Slip Section */}
            {slip && (
              <div className="mt-4 border-t pt-4">
                <h3 className="font-semibold mb-2">View Slip:</h3>
                <a
                  href={URL.createObjectURL(slip)}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 underline"
                >
                  View Uploaded Slip
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* View Supplier Modal */}
      {viewModal && selectedSupplier && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-40">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Supplier Details</h2>
              <button onClick={() => setViewModal(false)} className="text-gray-500 hover:text-gray-700">
                <FiX size={24} />
              </button>
            </div>
            
            <div className="space-y-3">
              <p><strong>Name:</strong> {selectedSupplier.name}</p>
              <p><strong>Email:</strong> {selectedSupplier.email}</p>
              <p><strong>Phone:</strong> {selectedSupplier.phone}</p>
              <p><strong>Address:</strong> {selectedSupplier.address || "N/A"}</p>
              <p><strong>Company:</strong> {selectedSupplier.companyName}</p>
              
              {selectedSupplier.slip && (
                <div className="mt-4">
                  <strong>Slip:</strong>
                  <a 
                    href={`http://localhost:5000/${selectedSupplier.slip}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-blue-600 underline block mt-1"
                  >
                    View Slip
                  </a>
                </div>
              )}
            </div>
            
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setViewModal(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Supplier Modal */}
      {editModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-40">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Edit Supplier</h2>
              <button onClick={() => setEditModal(false)} className="text-gray-500 hover:text-gray-700">
                <FiX size={24} />
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit}>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <input
                    className="border p-2 rounded w-full"
                    name="name"
                    placeholder="Supplier Name *"
                    value={editForm.name}
                    onChange={handleEditFormChange}
                    required
                  />
                </div>
                <div>
                  <input
                    className="border p-2 rounded w-full"
                    name="email"
                    type="email"
                    placeholder="Email *"
                    value={editForm.email}
                    onChange={handleEditFormChange}
                    required
                  />
                </div>
                <div>
                  <input
                    className="border p-2 rounded w-full"
                    name="phone"
                    placeholder="Phone *"
                    value={editForm.phone}
                    onChange={handleEditFormChange}
                    required
                  />
                </div>
                <div className="col-span-2">
                  <input
                    className="border p-2 rounded w-full"
                    name="address"
                    placeholder="Address"
                    value={editForm.address}
                    onChange={handleEditFormChange}
                  />
                </div>
                <div className="col-span-2">
                  <input
                    className="border p-2 rounded w-full"
                    name="companyName"
                    placeholder="Company *"
                    value={editForm.companyName}
                    onChange={handleEditFormChange}
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  onClick={() => setEditModal(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Supplier;