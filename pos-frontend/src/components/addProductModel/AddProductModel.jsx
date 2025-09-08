import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const AddProductModal = ({
  categories,
  onClose,
  setProducts,
  products,
  setCurrentPage,
}) => {
  const [suppliers, setSuppliers] = useState([]);
  const [loadingSuppliers, setLoadingSuppliers] = useState(true);

  const [addFormData, setAddFormData] = useState({
    title: "",
    description: "",
    sellingPrice: "",
    costPrice: "",
    stock: "",
    brand: "",
    unit: "piece",
    discount: "0",
    barcode: "",
    category: "",
    supplierId: "", 
    image: "",
    status: "Active",
    imageFile: null,
    imagePreview: "",
  });

  const [loading, setLoading] = useState(false);

  // 🔹 Fetch all suppliers from backend
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/supplier/get-all-suppliers"
        );
        if (!response.ok) throw new Error("Failed to fetch suppliers");
        const data = await response.json();
        setSuppliers(data);
      } catch (err) {
        console.error("Error fetching suppliers:", err);
        toast.error("Failed to load suppliers ❌");
      } finally {
        setLoadingSuppliers(false);
      }
    };
    fetchSuppliers();
  }, []);

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAddFormData({
          ...addFormData,
          imageFile: file,
          imagePreview: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Calculate discount %
  useEffect(() => {
    const sellingPrice = parseFloat(addFormData.sellingPrice);
    const costPrice = parseFloat(addFormData.costPrice);

    if (sellingPrice && costPrice && sellingPrice > 0) {
      const discountPercent = ((sellingPrice - costPrice) / sellingPrice) * 100;
      setAddFormData((prev) => ({
        ...prev,
        discount: discountPercent.toFixed(2),
      }));
    } else {
      setAddFormData((prev) => ({
        ...prev,
        discount: "0",
      }));
    }
  }, [addFormData.sellingPrice, addFormData.costPrice]);

  // Handle input change
  const handleAddInputChange = (e) => {
    const { name, value } = e.target;
    setAddFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle submit
  const handleAddSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const user = JSON.parse(localStorage.getItem("user"));
      const currentUserId = user?.id;

      if (!currentUserId) throw new Error("User is not logged in");

      const formData = new FormData();
      formData.append("title", addFormData.title);
      formData.append("brand", addFormData.brand);
      formData.append("barcode", addFormData.barcode);
      formData.append("createdById", currentUserId);
      formData.append("sellingPrice", addFormData.sellingPrice);
      formData.append("costPrice", addFormData.costPrice);
      formData.append("stock", addFormData.stock);
      formData.append("unit", addFormData.unit || "PIECE");
      formData.append("status", addFormData.status || "ACTIVE");
      formData.append("description", addFormData.description || "");
      formData.append("category", addFormData.category || "");
      formData.append("discount", addFormData.discount || "0");
      formData.append("supplierId", addFormData.supplierId); // 👈 supplier id

      if (addFormData.imageFile) {
        formData.append("image", addFormData.imageFile);
      }

      const response = await fetch(
        "http://localhost:5000/api/product/add-product",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const newProduct = await response.json();
      setProducts([...products, newProduct.product]);

      toast.success("✅ Product added successfully");
      onClose();
      setCurrentPage(1);
    } catch (err) {
      console.error("Error adding product:", err);
      toast.error(err.message || "❌ Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Add New Product</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          <form onSubmit={handleAddSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-bold text-black mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={addFormData.title}
                  onChange={handleAddInputChange}
                  className="w-full p-1.5 border rounded-md text-[14px]"
                  required
                />
              </div>

              {/* Brand */}
              <div>
                <label className="block text-sm font-bold text-black mb-1">
                  Brand *
                </label>
                <input
                  type="text"
                  name="brand"
                  value={addFormData.brand}
                  onChange={handleAddInputChange}
                  className="w-full p-1.5 border rounded-md text-[14px]"
                  required
                />
              </div>

              {/* Supplier Dropdown */}
              <div>
                <label className="block text-sm font-bold text-black mb-1">
                  Supplier *
                </label>
                <select
                  name="supplierId"
                  value={addFormData.supplierId}
                  onChange={handleAddInputChange}
                  className="w-full p-2 border rounded-md text-[14px]"
                  required
                >
                  <option value="">Select Supplier</option>
                  {loadingSuppliers ? (
                    <option disabled>Loading suppliers...</option>
                  ) : (
                    suppliers.map((supplier) => (
                      <option key={supplier.id} value={supplier.id}>
                        {supplier.name} ({supplier.company || "No Company"})
                      </option>
                    ))
                  )}
                </select>
              </div>

              {/* Selling Price */}
              <div>
                <label className="block text-sm font-bold text-black mb-1">
                  Selling Price ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="sellingPrice"
                  value={addFormData.sellingPrice}
                  onChange={handleAddInputChange}
                  className="w-full p-1.5 border rounded-md text-[14px]"
                  required
                />
              </div>

              {/* Cost Price */}
              <div>
                <label className="block text-sm font-bold text-black mb-1">
                  Discount Price ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="costPrice"
                  value={addFormData.costPrice}
                  onChange={handleAddInputChange}
                  className="w-full p-1.5 border rounded-md text-[14px]"
                  required
                />
              </div>

              {/* Stock */}
              <div>
                <label className="block text-sm font-bold text-black mb-1">
                  Stock *
                </label>
                <input
                  type="number"
                  name="stock"
                  value={addFormData.stock}
                  onChange={handleAddInputChange}
                  className="w-full p-1.5 border rounded-md text-[14px]"
                  required
                />
              </div>

              {/* Unit */}
              <div>
                <label className="block text-sm font-bold text-black mb-1">
                  Unit *
                </label>
                <select
                  name="unit"
                  value={addFormData.unit}
                  onChange={handleAddInputChange}
                  className="w-full p-1.5 border rounded-md text-[14px]"
                  required
                >
                  <option value="PIECE">PIECE</option>
                  <option value="KILOGRAM">KILOGRAM</option>
                  <option value="LITER">LITER</option>
                  <option value="METER">METER</option>
                  <option value="PACK">PACK</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-bold text-black mb-1">
                  Status *
                </label>
                <select
                  name="status"
                  value={addFormData.status}
                  onChange={handleAddInputChange}
                  className="w-full p-2 border rounded-md text-[14px]"
                  required
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </div>

              {/* Discount */}
              <div>
                <label className="block text-sm font-bold text-black mb-1">
                  Discount (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="discount"
                  value={addFormData.discount}
                  readOnly
                  className="w-full p-1.5 border rounded-md text-[14px] bg-gray-100"
                />
              </div>

              {/* Barcode */}
              <div>
                <label className="block text-sm font-bold text-black mb-1">
                  Barcode
                </label>
                <input
                  type="text"
                  name="barcode"
                  value={addFormData.barcode}
                  onChange={handleAddInputChange}
                  className="w-full p-1.5 border rounded-md text-[14px]"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-bold text-black mb-1">
                  Category *
                </label>
                <select
                  name="category"
                  value={addFormData.category}
                  onChange={handleAddInputChange}
                  className="w-full p-2 border rounded-md text-[14px]"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Image */}
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-black mb-1">
                  Image *
                </label>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    {addFormData.imagePreview ? (
                      <img
                        src={addFormData.imagePreview}
                        alt="Preview"
                        className="w-16 h-16 rounded-md object-cover border"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-md border border-dashed border-gray-300 flex items-center justify-center">
                        <i className="fas fa-image text-gray-400"></i>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="block w-full text-sm text-gray-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-bold text-black mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={addFormData.description}
                onChange={handleAddInputChange}
                rows="3"
                className="w-full p-1.5 border rounded-md text-[14px]"
              ></textarea>
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1 border border-gray-300 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1 bg-blue-500 text-white rounded-md"
                disabled={loading}
              >
                {loading ? "Adding..." : "Add Product"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProductModal;
