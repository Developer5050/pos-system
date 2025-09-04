import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AddProductModal = ({ categories, onClose, setProducts, products, setCurrentPage }) => {
  const [addFormData, setAddFormData] = useState({
    title: "",
    description: "",
    sellingPrice: "",
    costPrice: "",
    stock: "",
    brand: "",
    unit: "PIECE",
    discount: "0",
    barcode: "",
    category: "",
    status: "ACTIVE",
    imageFile: null,
    imagePreview: "",
    batchNumber: "",
    type: "",
  });

  const [loading, setLoading] = useState(false);

  // Stable handler for input changes
  const handleAddInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setAddFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Image upload handler
  const handleImageUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setAddFormData((prev) => ({ ...prev, imageFile: file, imagePreview: reader.result }));
    };
    reader.readAsDataURL(file);
  }, []);

  // Calculate discount safely
  useEffect(() => {
    const sellingPrice = parseFloat(addFormData.sellingPrice);
    const costPrice = parseFloat(addFormData.costPrice);
    let discount = "0";

    if (sellingPrice && costPrice && sellingPrice > 0) {
      discount = (((sellingPrice - costPrice) / sellingPrice) * 100).toFixed(2);
    }

    if (discount !== addFormData.discount) {
      setAddFormData((prev) => ({ ...prev, discount }));
    }
  }, [addFormData.sellingPrice, addFormData.costPrice]);

  // Submit form
  const handleAddSubmit = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const currentUserId = user?.id;
      if (!currentUserId) throw new Error("User not logged in");

      const formData = new FormData();
      Object.entries(addFormData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });
      formData.append("createdById", currentUserId);

      const response = await axios.post(
        "http://localhost:5000/api/product/add-product",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setProducts([...products, response.data.product]);
      setCurrentPage(1);
      toast.success("✅ Product added successfully!");
      onClose();
    } catch (err) {
      console.error("Error adding product:", err);
      toast.error(err.response?.data?.error || "❌ Failed to add product");
    } finally {
      setLoading(false);
    }
  }, [addFormData, products, setProducts, setCurrentPage, onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Add New Product</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <i className="fas fa-times"></i>
            </button>
          </div>

          <form onSubmit={handleAddSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Title */}
              <InputField label="Title" name="title" value={addFormData.title} onChange={handleAddInputChange} required />
              {/* Brand */}
              <InputField label="Brand" name="brand" value={addFormData.brand} onChange={handleAddInputChange} required />
              {/* Selling Price */}
              <InputField label="Selling Price ($)" name="sellingPrice" type="number" step="0.01" value={addFormData.sellingPrice} onChange={handleAddInputChange} required />
              {/* Cost Price */}
              <InputField label="Cost Price ($)" name="costPrice" type="number" step="0.01" value={addFormData.costPrice} onChange={handleAddInputChange} required />
              {/* Stock */}
              <InputField label="Stock" name="stock" type="number" value={addFormData.stock} onChange={handleAddInputChange} required />
              {/* Unit */}
              <SelectField label="Unit" name="unit" value={addFormData.unit} onChange={handleAddInputChange} options={["PIECE","KILOGRAM","LITER","METER","PACK"]} />
              {/* Status */}
              <SelectField label="Status" name="status" value={addFormData.status} onChange={handleAddInputChange} options={["ACTIVE","INACTIVE"]} />
              {/* Discount */}
              <InputField label="Discount (%)" name="discount" value={addFormData.discount} readOnly />
              {/* Barcode */}
              <InputField label="Barcode" name="barcode" value={addFormData.barcode} onChange={handleAddInputChange} required />
              {/* Category */}
              <SelectField label="Category" name="category" value={addFormData.category} onChange={handleAddInputChange} options={categories.map(c => c.name)} placeholder="Select Category" />
              {/* Batch Number */}
              <InputField label="Batch Number" name="batchNumber" value={addFormData.batchNumber} onChange={handleAddInputChange} required />
              {/* Type */}
              <SelectField label="Type" name="type" value={addFormData.type} onChange={handleAddInputChange} options={["RAW","FINISHED"]} placeholder="Select Type" />
              {/* Image Upload */}
              <ImageUploadField imagePreview={addFormData.imagePreview} onChange={handleImageUpload} />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-bold text-black mb-1">Description</label>
              <textarea
                name="description"
                value={addFormData.description}
                onChange={handleAddInputChange}
                rows="3"
                className="w-full p-1.5 border rounded-md text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4">
              <button type="button" onClick={onClose} className="px-3 py-1 border rounded-md text-gray-700 hover:bg-gray-100">Cancel</button>
              <button type="submit" className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600" disabled={loading}>
                {loading ? "Adding..." : "Add Product"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Reusable components
const InputField = ({ label, name, value, onChange, type="text", step, readOnly=false, required=false }) => (
  <div>
    <label className="block text-sm font-bold text-black mb-1">{label}{required && <span className="text-red-500">*</span>}</label>
    <input type={type} step={step} name={name} value={value} onChange={onChange} readOnly={readOnly}
      className={`w-full p-1.5 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 ${readOnly ? "bg-gray-100" : ""}`} required={required} />
  </div>
);

const SelectField = ({ label, name, value, onChange, options, placeholder }) => (
  <div>
    <label className="block text-sm font-bold text-black mb-1">{label}</label>
    <select name={name} value={value} onChange={onChange} className="w-full p-1.5 border rounded-md text-sm focus:ring-2 focus:ring-blue-500">
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((opt, idx) => <option key={idx} value={opt}>{opt}</option>)}
    </select>
  </div>
);

const ImageUploadField = ({ imagePreview, onChange }) => (
  <div className="md:col-span-2">
    <label className="block text-sm font-bold text-black mb-1">Image</label>
    <div className="flex items-center space-x-4">
      <div className="relative">
        {imagePreview ? (
          <img src={imagePreview} alt="Preview" className="w-16 h-16 rounded-md object-cover border" />
        ) : (
          <div className="w-16 h-16 rounded-md border border-dashed border-gray-300 flex items-center justify-center">
            <i className="fas fa-image text-gray-400"></i>
          </div>
        )}
      </div>
      <div className="flex-1">
        <input type="file" accept="image/*" onChange={onChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
        <p className="text-xs text-gray-500 mt-1">JPG, JPEG, PNG or GIF (Max 2MB)</p>
      </div>
    </div>
  </div>
);

export default AddProductModal;
