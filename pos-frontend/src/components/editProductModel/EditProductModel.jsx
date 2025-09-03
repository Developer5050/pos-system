import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const EditProductModal = ({ product, categories, onClose, setProducts }) => {
  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
    sellingPrice: "",
    costPrice: "",
    stock: "",
    brand: "",
    unit: "piece",
    discount: "",
    category: "",
    image: "",
    status: "Active",
    imageFile: null,
    imagePreview: "",
  });

  const [loading, setLoading] = useState(false);

  // Populate form when product changes
  useEffect(() => {
    if (product) {
      setEditFormData({
        title: product.title,
        description: product.description,
        sellingPrice: product.sellingPrice,
        costPrice: product.costPrice,
        stock: product.stock,
        brand: product.brand,
        unit: product.unit,
        discount: product.discount,
        image: product.image,
        status: product.status,
        category: product.category?.name || "",
        imageFile: null,
        imagePreview: product.image,
      });
    }
  }, [product]);

  // Handle image upload for edit form
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditFormData({
          ...editFormData,
          imageFile: file,
          imagePreview: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Calculate discount price editform
  useEffect(() => {
    const calculateDiscount = () => {
      const sellingPrice = parseFloat(editFormData.sellingPrice);
      const costPrice = parseFloat(editFormData.costPrice);

      if (sellingPrice && costPrice && sellingPrice > 0) {
        if (costPrice < sellingPrice) {
          // Normal discount
          const discountPercent =
            ((sellingPrice - costPrice) / sellingPrice) * 100;
          setEditFormData((prev) => ({
            ...prev,
            discount: discountPercent.toFixed(2),
          }));
        } else if (costPrice > sellingPrice) {
          // Price increase → negative discount
          const discountPercent =
            ((costPrice - sellingPrice) / sellingPrice) * 100;
          setEditFormData((prev) => ({
            ...prev,
            discount: discountPercent.toFixed(2),
          }));
        } else {
          // Equal prices → 0 discount
          setEditFormData((prev) => ({
            ...prev,
            discount: "0",
          }));
        }
      } else {
        // Invalid input → reset
        setEditFormData((prev) => ({
          ...prev,
          discount: "0",
        }));
      }
    };

    calculateDiscount();
  }, [editFormData.sellingPrice, editFormData.costPrice]);

  // Handle form input changes for edit modal
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value,
    });
  };

  // Handle edit form submission
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", editFormData.title);
    formData.append("description", editFormData.description);
    formData.append("sellingPrice", editFormData.sellingPrice);
    formData.append("costPrice", editFormData.costPrice);
    formData.append("stock", editFormData.stock);
    formData.append("brand", editFormData.brand);
    formData.append("unit", editFormData.unit);
    formData.append("discount", editFormData.discount);
    formData.append("status", editFormData.status);
    formData.append("category", editFormData.category); // only name
    if (editFormData.imageFile) {
      formData.append("image", editFormData.imageFile);
    }

    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5000/api/product/edit-product/${product.id}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      const data = await response.json();
      if (response.ok) {
        // Update frontend state with returned product
        setProducts((prev) =>
          prev.map((p) => (p.id === product.id ? data.product : p))
        );

        toast.success("✏️ Product updated successfully");
        onClose();
      } else {
        console.error("Error:", data.error);
        toast.error(data.error || "❌ Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("❌ Error updating product");
    } finally {
      setLoading(false);
    }
  };

  if (!product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              Edit Product
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          <form onSubmit={handleUpdateSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-black mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={editFormData.title}
                  onChange={handleEditInputChange}
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
                  value={editFormData.brand}
                  onChange={handleEditInputChange}
                  className="w-full p-1.5 border rounded-md text-[14px]  focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-black mb-1">
                  Selling Price ($) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="sellingPrice"
                  value={editFormData.sellingPrice}
                  onChange={handleEditInputChange}
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
                  value={editFormData.costPrice}
                  onChange={handleEditInputChange}
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
                  value={editFormData.stock}
                  onChange={handleEditInputChange}
                  className="w-full p-1.5 border rounded-md text-[14px]  focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-black mb-1">
                  Unit <span className="text-red-500">*</span>
                </label>
                <select
                  name="unit"
                  value={editFormData.unit}
                  onChange={handleEditInputChange}
                  className="w-full p-1.5 border rounded-md text-[14px]  focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="PIECE">PIECE</option>
                  <option value="KILOGRAM">KILOGRAM</option>
                  <option value="LITER">LITER</option>
                  <option value="PACK">PACK</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-black mb-1">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  name="status"
                  value={editFormData.status}
                  onChange={handleEditInputChange}
                  className="w-full p-1.5 border rounded-md text-[14px]  focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  name="discount"
                  value={editFormData.discount}
                  onChange={handleEditInputChange}
                  readOnly
                  className="w-full p-1.5 border rounded-md text-[14px]  focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-black mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={editFormData.category}
                  onChange={handleEditInputChange}
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
                  Image
                </label>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    {editFormData.imagePreview ? (
                      <img
                        src={editFormData.imagePreview}
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
                      JPG, PNG or GIF (Max 2MB)
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
                value={editFormData.description}
                onChange={handleEditInputChange}
                rows="2"
                className="w-full p-1.5 border rounded-md text-[14px]  focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                {loading ? "Updating..." : "Update Product"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProductModal;