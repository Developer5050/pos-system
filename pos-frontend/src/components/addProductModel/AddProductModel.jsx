import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const AddProductModal = ({ categories, onClose, setProducts, products, setCurrentPage }) => {
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
    image: "",
    status: "Active",
    imageFile: null,
    imagePreview: "",
  });

  const [loading, setLoading] = useState(false);

  // Handle image upload for add form
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

  // Calculate discount price addform
  useEffect(() => {
    const calculateDiscount = () => {
      const sellingPrice = parseFloat(addFormData.sellingPrice);
      const discountPrice = parseFloat(addFormData.costPrice);

      if (sellingPrice && discountPrice && sellingPrice > 0) {
        if (discountPrice < sellingPrice) {
          // Normal discount: discount price is lower than selling price
          const discountPercent =
            ((sellingPrice - discountPrice) / sellingPrice) * 100;
          setAddFormData((prev) => ({
            ...prev,
            discount: discountPercent.toFixed(2),
          }));
        } else if (discountPrice > sellingPrice) {
          // Price increase: show negative discount (or 0 if you prefer)
          const discountPercent =
            ((sellingPrice - discountPrice) / sellingPrice) * 100;
          setAddFormData((prev) => ({
            ...prev,
            discount: discountPercent.toFixed(2), // This will be negative
          }));
        } else {
          // Prices are equal
          setAddFormData((prev) => ({
            ...prev,
            discount: "0",
          }));
        }
      } else {
        // Reset discount if prices are invalid
        setAddFormData((prev) => ({
          ...prev,
          discount: "0",
        }));
      }
    };

    calculateDiscount();
  }, [addFormData.sellingPrice, addFormData.costPrice]);

  // Handle form input changes for add modal
  const handleAddInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "costPrice" || name === "sellingPrice") {
      setAddFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else {
      setAddFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle add form submission
  const handleAddSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const user = JSON.parse(localStorage.getItem("user"));
      const currentUserId = user?.id;

      if (!currentUserId) {
        throw new Error("User is not logged in");
      }

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
      setCurrentPage(1); // Reset to first page after adding
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
            <h2 className="text-xl font-bold text-gray-800">
              Add New Product
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          <form onSubmit={handleAddSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-black mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={addFormData.title}
                  onChange={handleAddInputChange}
                  className="w-full p-1.5 border rounded-md text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-black mb-1">
                  Brand <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="brand"
                  value={addFormData.brand}
                  onChange={handleAddInputChange}
                  className="w-full p-1.5 border rounded-md text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

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
                  className="w-full p-1.5 border rounded-md text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-black mb-1">
                  Discount Price ($) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="costPrice"
                  value={addFormData.costPrice}
                  onChange={handleAddInputChange}
                  className="w-full p-1.5 border rounded-md text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-black mb-1">
                  Stock <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="stock"
                  value={addFormData.stock}
                  onChange={handleAddInputChange}
                  className="w-full p-1.5 border rounded-md text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-black mb-1">
                  Unit <span className="text-red-500">*</span>
                </label>
                <select
                  name="unit"
                  value={addFormData.unit}
                  onChange={handleAddInputChange}
                  className="w-full p-1.5 border rounded-md text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="PIECE">PIECE</option>
                  <option value="KILOGRAM">KILOGRAM</option>
                  <option value="LITER">LITER</option>
                  <option value="METER">METER</option>
                  <option value="PACK">PACK</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-black mb-1">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  name="status"
                  value={addFormData.status}
                  onChange={handleAddInputChange}
                  className="w-full p-2 border rounded-md text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-black mb-1">
                  Discount (%) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="discount"
                  value={addFormData.discount}
                  onChange={handleAddInputChange}
                  className="w-full p-1.5 border rounded-md text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  readOnly
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-black mb-1">
                  Barcode <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="barcode"
                  value={addFormData.barcode}
                  onChange={handleAddInputChange}
                  className="w-full p-1.5 border rounded-md text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-black mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={addFormData.category}
                  onChange={handleAddInputChange}
                  className="w-full p-2 border rounded-md text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-500"
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

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-black mb-1">
                  Image <span className="text-red-500">*</span>
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
                    <label className="block">
                      <span className="sr-only">Choose product image</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      JPG, JPEG, PNG or GIF (Max 2MB)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-black mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={addFormData.description}
                onChange={handleAddInputChange}
                rows="3"
                className="w-full p-1.5 border rounded-md text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
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