import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
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

  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
    sellingPrice: "",
    costPrice: "",
    stock: "",
    brand: "",
    unit: "piece",
    discount: "",
    category: "", // add
    image: "",
    status: "Active",
    imageFile: null,
    imagePreview: "",
  });

  const itemsPerPage = 5; // limit 5

  // Filter products based on search term and status filter
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || product.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate total pages
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Slice products for current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Generate page numbers for pagination
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "http://localhost:5000/api/product/get-all-products"
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          throw new Error("Invalid data format from API");
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/category/get-all-category"
        );

        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchProducts();
    fetchCategories();
  }, []);

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
            imagePreview: reader.result,
          });
        } else {
          setAddFormData({
            ...addFormData,
            imageFile: file,
            imagePreview: reader.result,
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

  // Reset to first page when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  // Open edit modal and populate form with product data
  const handleEditClick = (product) => {
    setEditingProduct(product);
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
      category: product.category?.name || "", // add
      imageFile: null,
      imagePreview: product.image,
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
  const confirmDelete = async () => {
    if (productToDelete) {
      try {
        const res = await fetch(
          `http://localhost:5000/api/product/delete-product/${productToDelete.id}`,
          { method: "DELETE" }
        );

        if (!res.ok) {
          throw new Error(`Failed to delete product: ${res.status}`);
        }

        // Update frontend state
        setProducts(products.filter((p) => p.id !== productToDelete.id));
        closeDeleteModal();
        alert("Product deleted successfully ✅");
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("❌ Failed to delete product");
      }
    }
  };

  // Close edit modal
  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setEditingProduct(null);
    setEditFormData({
      title: "",
      description: "",
      sellingPrice: "",
      costPrice: "",
      stock: "",
      brand: "",
      unit: "piece",
      discount: "",
      image: "",
      status: "ACTIVE",
      imageFile: null,
      imagePreview: "",
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

      toast.success("✅ Product added successfully"); // 👈 toast only once
      closeAddModal();
      setCurrentPage(1); // Reset to first page after adding
    } catch (err) {
      console.error("Error adding product:", err);
      toast.error(err.message || "❌ Failed to add product");
      alert(err.message); // Show error to user
    } finally {
      setLoading(false);
    }
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
      const response = await fetch(
        `http://localhost:5000/api/product/edit-product/${editingProduct.id}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      const data = await response.json();
      if (response.ok) {
        // Update frontend state with returned product
        setProducts((prev) =>
          prev.map((p) => (p.id === editingProduct.id ? data.product : p))
        );

        toast.success("✏️ Product updated successfully"); // 👈 toast only once
        handleCloseModal();
      } else {
        console.error("Error:", data.error);
        toast.error(data.error || "❌ Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("❌ Error updating product");
    }
  };

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
  // Show loading state
  if (loading) {
    return (
      <div className="p-4 bg-gray-100 min-h-screen font-ubuntu flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

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
              {currentProducts.length > 0 ? (
                currentProducts.map(
                  (
                    product // <-- yahan filteredProducts ki jagah currentProducts
                  ) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="py-4 px-4 font-medium text-gray-900">
                        {product.id}
                      </td>
                      <td className="py-4 px-4">
                        <img
                          src={`http://localhost:5000/${product.image}`}
                          alt={product.name}
                          className="w-16 h-16 rounded-md object-cover"
                        />
                      </td>
                      <td className="py-4 px-2 font-bold text-[13px]">
                        {product.title}
                      </td>
                      <td className="py-4 px-4 text-sm">
                        $
                        {product.sellingPrice !== undefined &&
                        product.sellingPrice !== null
                          ? product.sellingPrice.toFixed(2)
                          : "0.00"}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`py-1 rounded-full text-xs font-medium ${
                            product.quantity > 10
                              ? "bg-green-100 text-green-800"
                              : product.quantity > 0
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {product.stock} in stock
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium cursor-pointer ${
                            product.status === "ACTIVE"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                          onClick={() => toggleStatus(product.id)}
                        >
                          {product.status || "ACTIVE"}
                        </span>
                      </td>
                      <td className="py-4 px-2 text-sm text-gray-500">
                        {product.createdAt}
                      </td>
                      <td className="py-4 px-2 text-sm text-gray-500">
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
                  )
                )
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
        <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between mt-4">
          <div className="text-sm text-gray-700 mb-4 sm:mb-0">
            Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
            <span className="font-medium">
              {Math.min(startIndex + itemsPerPage, filteredProducts.length)}
            </span>{" "}
            of <span className="font-medium">{filteredProducts.length}</span>{" "}
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
                            onChange={(e) => handleImageUpload(e, false)}
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
                            onChange={(e) => handleImageUpload(e, false)}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                          />
                        </label>
                        <p className="text-xs text-gray-500 mt-1">
                          JPG, JPEG, PNG or GIF (Max 2MB)
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* <div className="md:col-span-2">
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
                  </div> */}
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
                Delete Product
              </h3>

              <p className="text-sm text-gray-500 text-center mb-6">
                Are you sure you want to delete the product "
                {productToDelete?.title}"? This action cannot be undone.
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
