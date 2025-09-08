import React, { useState } from "react";
import { FiEye, FiEdit, FiTrash2 } from "react-icons/fi";

const Supplier = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [slip, setSlip] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    company: "",
  });
  const [products, setProducts] = useState([
    { name: "", type: "", quantity: "", price: "", batchNumber: "" },
  ]);

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const newSupplier = { id: Date.now(), ...form, products };
    setSuppliers([newSupplier, ...suppliers]);
    setForm({ name: "", email: "", phone: "", address: "", company: "" });
    setProducts([
      { name: "", type: "", quantity: "", price: "", batchNumber: "" },
    ]);
    setOpenModal(false);
  };

  return (
    <div className="p-6">
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
        <table className="w-full border-collapse">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3 border">Name</th>
              <th className="p-3 border">Company</th>
              <th className="p-3 border">Phone</th>
              <th className="p-3 border">Email</th>
              <th className="p-3 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.length > 0 ? (
              suppliers.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="p-3 border">{s.name}</td>
                  <td className="p-3 border">{s.company}</td>
                  <td className="p-3 border">{s.phone}</td>
                  <td className="p-3 border">{s.email}</td>
                  <td className="p-3 border flex gap-2">
                    <FiEye
                      className="text-blue-600 cursor-pointer"
                      onClick={() => setViewSupplier(s)}
                    />
                    <FiEdit className="text-green-600 cursor-pointer" />
                    <FiTrash2 className="text-red-600 cursor-pointer" />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center p-4">
                  No suppliers added yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Supplier Modal */}
      {openModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Add Supplier</h2>
            <form onSubmit={handleSubmit}>
              {/* Supplier Details */}
              <div className="grid grid-cols-2 gap-4">
                <input
                  className="border p-2 rounded"
                  name="name"
                  placeholder="Supplier Name"
                  value={form.name}
                  onChange={handleFormChange}
                />
                <input
                  className="border p-2 rounded"
                  name="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleFormChange}
                />
                <input
                  className="border p-2 rounded"
                  name="phone"
                  placeholder="Phone"
                  value={form.phone}
                  onChange={handleFormChange}
                />
                <input
                  className="border p-2 rounded"
                  name="address"
                  placeholder="Address"
                  value={form.address}
                  onChange={handleFormChange}
                />
                <input
                  className="border p-2 rounded col-span-2"
                  name="company"
                  placeholder="Company"
                  value={form.company}
                  onChange={handleFormChange}
                />
              </div>

              {/* Product Fields */}
              <h3 className="text-lg font-semibold mt-6 mb-2">Products</h3>
              {products.map((prod, index) => (
                <div
                  key={index}
                  className="grid grid-cols-5 gap-2 mb-2 border p-2 rounded"
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
    </div>
  );
};

export default Supplier;
