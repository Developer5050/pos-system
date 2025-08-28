import React, { useState } from "react";

const Products = () => {
  // Sample product data
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Wireless Headphones",
      description: "High-quality wireless headphones with noise cancellation",
      image: "https://placehold.co/600x400",
      price: 79.99,
      costPrice: 45.0,
      quantity: 42,
      brand: "SoundMax",
      unit: "piece",
      discount: 10,
      status: "Active",
      createdAt: "2023-05-15",
      updatedAt: "2023-10-20",
    },
    {
      id: 2,
      name: "Smart Watch",
      description: "Smart watch with health monitoring features",
      image: "https://placehold.co/600x400",
      price: 199.99,
      costPrice: 120.0,
      quantity: 15,
      brand: "TechWear",
      unit: "piece",
      discount: 15,
      status: "Active",
      createdAt: "2023-06-10",
      updatedAt: "2023-10-18",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    description: "",
    price: "",
    costPrice: "",
    quantity: "",
    brand: "",
    unit: "piece",
    discount: "",
    image: "",
    status: "Active",
    imageFile: null,
    imagePreview: ""
  });

  const [addFormData, setAddFormData] = useState({
    name: "",
    description: "",
    price: "",
    costPrice: "",
    quantity: "",
    brand: "",
    unit: "piece",
    discount: "",
    image: "",
    status: "Active",
    imageFile: null,
    imagePreview: ""
  });

  // Handle image upload for both add and edit forms
  const handleImageUpload = (e, isEditForm = false) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (isEditForm) {
          setEditFormData({
            ...editFormData,
            imageFile: file,
            imagePreview: reader.result
          });
        } else {
          setAddFormData({
            ...addFormData,
            imageFile: file,
            imagePreview: reader.result
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Open add product modal
  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  // Close add product modal
  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setAddFormData({
      name: "",
      description: "",
      price: "",
      costPrice: "",
      quantity: "",
      brand: "",
      unit: "piece",
      discount: "",
      image: "",
      status: "Active",
      imageFile: null,
      imagePreview: ""
    });
  };

  // Open edit modal and populate form with product data
  const handleEditClick = (product) => {
    setEditingProduct(product);
    setEditFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      costPrice: product.costPrice,
      quantity: product.quantity,
      brand: product.brand,
      unit: product.unit,
      discount: product.discount,
      image: product.image,
      status: product.status,
      imageFile: null,
      imagePreview: product.image
    });
    setIsEditModalOpen(true);
  };

  // Open delete confirmation modal
  const openDeleteModal = (product) => {
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

  // Close delete confirmation modal
  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setProductToDelete(null);
  };

  // Handle delete product confirmation
  const confirmDelete = () => {
    if (productToDelete) {
      setProducts(products.filter((product) => product.id !== productToDelete.id));
      closeDeleteModal();
    }
  };

  // Close edit modal
  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setEditingProduct(null);
    setEditFormData({
      name: "",
      description: "",
      price: "",
      costPrice: "",
      quantity: "",
      brand: "",
      unit: "piece",
      discount: "",
      image: "",
      status: "Active",
      imageFile: null,
      imagePreview: ""
    });
  };

  // Handle form input changes for edit modal
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value,
    });
  };

  // Handle form input changes for add modal
  const handleAddInputChange = (e) => {
    const { name, value } = e.target;
    setAddFormData({
      ...addFormData,
      [name]: value,
    });
  };

  // Handle edit form submission
  const handleUpdateSubmit = (e) => {
    e.preventDefault();

    // For a real application, you would upload the image file to a server here
    // and get back a URL. For this example, we'll use a placeholder or data URL
    let imageUrl = editingProduct.image;
    if (editFormData.imageFile) {
      // In a real app, this would be the uploaded image URL
      // For demo purposes, we'll use the data URL directly
      imageUrl = editFormData.imagePreview;
    }

    // Update the product in the products array
    const updatedProducts = products.map((product) =>
      product.id === editingProduct.id
        ? {
            ...product,
            name: editFormData.name,
            description: editFormData.description,
            price: parseFloat(editFormData.price),
            costPrice: parseFloat(editFormData.costPrice),
            quantity: parseInt(editFormData.quantity),
            brand: editFormData.brand,
            unit: editFormData.unit,
            discount: parseInt(editFormData.discount),
            status: editFormData.status,
            image: imageUrl,
            updatedAt: new Date().toISOString().split("T")[0],
          }
        : product
    );

    setProducts(updatedProducts);
    handleCloseModal();
  };

  // Handle add form submission
  const handleAddSubmit = (e) => {
    e.preventDefault();

    // For a real application, you would upload the image file to a server here
    let imageUrl = "https://placehold.co/600x400"; // default placeholder
    if (addFormData.imageFile) {
      // In a real app, this would be the uploaded image URL
      // For demo purposes, we'll use the data URL directly
      imageUrl = addFormData.imagePreview;
    }

    // Add new product to the products array
    const newProduct = {
      id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
      name: addFormData.name,
      description: addFormData.description,
      price: parseFloat(addFormData.price),
      costPrice: parseFloat(addFormData.costPrice),
      quantity: parseInt(addFormData.quantity),
      brand: addFormData.brand,
      unit: addFormData.unit,
      discount: parseInt(addFormData.discount),
      image: imageUrl,
      status: addFormData.status,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    };

    setProducts([...products, newProduct]);
    closeAddModal();
  };

  // Filter products based on search term and status filter
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || product.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Handle status toggle
  const toggleStatus = (id) => {
    setProducts(
      products.map((product) =>
        product.id === id
          ? {
              ...product,
              status: product.status === "Active" ? "Inactive" : "Active",
            }
          : product
      )
    );
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen font-ubuntu">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
          Product List
        </h1>

        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 w-full md:w-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              className="pl-10 pr-3 py-2 text-[15px] border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
          </div>

          <select
            className="p-2 py-1.5 text-[15px] border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-auto"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          <button 
            className="bg-blue-500 hover:bg-blue-600 text-white text-[14px] py-1 px-3 rounded-md flex items-center justify-center"
            onClick={openAddModal}
          >
            <i className="fas fa-plus mr-2 "></i> Add Product
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-black">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                  ID
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Image
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium  text-white uppercase tracking-wider">
                  Title
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium  text-white uppercase tracking-wider">
                  Price
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Quantity
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Status
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Created
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Updated
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="py-4 px-4 font-medium text-gray-900">
                      {product.id}
                    </td>
                    <td className="py-4 px-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-10 h-10 rounded-md object-cover"
                      />
                    </td>
                    <td className="py-4 px-4 font-bold text-sm">
                      {product.name}
                    </td>
                    <td className="py-4 px-4 text-sm">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          product.quantity > 10
                            ? "bg-green-100 text-green-800"
                            : product.quantity > 0
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {product.quantity} in stock
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium cursor-pointer ${
                          product.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                        onClick={() => toggleStatus(product.id)}
                      >
                        {product.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-500">
                      {product.createdAt}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-500">
                      {product.updatedAt}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex space-x-2">
                        <button
                          className="text-blue-500 hover:text-blue-700"
                          onClick={() => handleEditClick(product)}
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          className="text-red-500 hover:text-red-700"
                          onClick={() => openDeleteModal(product)}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="9"
                    className="py-8 text-center text-gray-500 font-ubuntu"
                  >
                    No products found. Try adjusting your search or filters.
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
            <span className="font-medium">{filteredProducts.length}</span> of{" "}
            <span className="font-medium">{filteredProducts.length} </span>
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

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  Add New Product
                </h2>
                <button
                  onClick={closeAddModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>

              <form onSubmit={handleAddSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-black mb-1">
                    Title *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={addFormData.name}
                      onChange={handleAddInputChange}
                      className="w-full p-1.5 border rounded-md text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-black mb-1">
                      Brand *
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
                      Cost Price ($) *
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
                      Selling Price ($) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      name="price"
                      value={addFormData.price}
                      onChange={handleAddInputChange}
                      className="w-full p-1.5 border rounded-md text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-black mb-1">
                      Stock *
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      value={addFormData.quantity}
                      onChange={handleAddInputChange}
                      className="w-full p-1.5 border rounded-md text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-black mb-1">
                      Unit *
                    </label>
                    <select
                      name="unit"
                      value={addFormData.unit}
                      onChange={handleAddInputChange}
                      className="w-full p-1.5 border rounded-md text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="piece">Piece</option>
                      <option value="kg">Kilogram</option>
                      <option value="liter">Liter</option>
                      <option value="meter">Meter</option>
                      <option value="pack">Pack</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-black mb-1">
                      Status *
                    </label>
                    <select
                      name="status"
                      value={addFormData.status}
                      onChange={handleAddInputChange}
                      className="w-full p-1.5 border rounded-md text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-black mb-1">
                      Discount (%)
                    </label>
                    <input
                      type="number"
                      name="discount"
                      value={addFormData.discount}
                      onChange={handleAddInputChange}
                      min="0"
                      max="100"
                      className="w-full p-1.5 border rounded-md text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

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
                        <label className="block">
                          <span className="sr-only">Choose product image</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, false)}
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
                    value={addFormData.description}
                    onChange={handleAddInputChange}
                    rows="3"
                    className="w-full p-1.5 border rounded-md text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={closeAddModal}
                    className="px-3 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Add Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  Edit Product
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>

              <form onSubmit={handleUpdateSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-black mb-1">
                      Title *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={editFormData.name}
                      onChange={handleEditInputChange}
                      className="w-full p-1.5 border rounded-md text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-black mb-1">
                      Brand *
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
                      Cost Price ($) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      name="costPrice"
                      value={editFormData.costPrice}
                      onChange={handleEditInputChange}
                      className="w-full p-1.5 border rounded-md  text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-black mb-1">
                      Selling Price ($) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      name="price"
                      value={editFormData.price}
                      onChange={handleEditInputChange}
                      className="w-full p-1.5 border rounded-md text-[14px]  focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-black mb-1">
                      Stock *
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      value={editFormData.quantity}
                      onChange={handleEditInputChange}
                      className="w-full p-1.5 border rounded-md text-[14px]  focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-black mb-1">
                      Unit *
                    </label>
                    <select
                      name="unit"
                      value={editFormData.unit}
                      onChange={handleEditInputChange}
                      className="w-full p-1.5 border rounded-md text-[14px]  focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="piece">Piece</option>
                      <option value="kg">Kilogram</option>
                      <option value="liter">Liter</option>
                      <option value="meter">Meter</option>
                      <option value="pack">Pack</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-black mb-1">
                      Status *
                    </label>
                    <select
                      name="status"
                      value={editFormData.status}
                      onChange={handleEditInputChange}
                      className="w-full p-1.5 border rounded-md text-[14px]  focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-black mb-1">
                      Discount (%)
                    </label>
                    <input
                      type="number"
                      name="discount"
                      value={editFormData.discount}
                      onChange={handleEditInputChange}
                      min="0"
                      max="100"
                      className="w-full p-1.5 border rounded-md text-[14px]  focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
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
                            onChange={(e) => handleImageUpload(e, true)}
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
                    onClick={handleCloseModal}
                    className="px-3 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Update Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
              </div>
              
              <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
                Delete Product
              </h3>
              
              <p className="text-sm text-gray-500 text-center mb-6">
                Are you sure you want to delete the product "{productToDelete?.name}"? 
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

export default Products;