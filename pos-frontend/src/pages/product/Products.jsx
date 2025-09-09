import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ProductTable from "../../components/productTable/ProductTable";
import AddProductModal from "../../components/addProductModel/AddProductModel";
import EditProductModal from "../../components/editProductModel/EditProductModel";
import DeleteModal from "../../components/deleteModel/DeleteModel";
import Pagination from "../../components/pagination/Pagination";

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

  const itemsPerPage = 5;

  // Filter products based on search term and status filter
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title
      ?.toLowerCase()
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

  // Fetch Products
  const fetchProducts = async (silent = false) => {
    try {
      if (!silent) setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/product/get-all-products"
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (Array.isArray(data)) {
        setProducts(data);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  // Fetch Categories
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

  // Initial load + background refresh
  useEffect(() => {
    fetchProducts();
    fetchCategories();

    // background refresh every 30s
    const stockUpdateInterval = setInterval(() => fetchProducts(true), 30000);

    return () => clearInterval(stockUpdateInterval);
  }, []);

  // Reset to first page when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  // Modal Handlers
  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => setIsAddModalOpen(false);

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingProduct(null);
  };

  const openDeleteModal = (product) => {
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setProductToDelete(null);
  };

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

        setProducts(products.filter((p) => p.id !== productToDelete.id));
        closeDeleteModal();
        toast.success("Product deleted successfully ✅");
      } catch (error) {
        console.error("Error deleting product:", error);
        toast.error("❌ Failed to delete product");
      }
    }
  };

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
              className="pl-10 pr-3 py-2 text-[15px] border rounded-md focus:outline-none  focus:border-blue-500 focus:ring-blue-500 w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
          </div>

          <select
            className="p-2 py-1.5 text-[15px] border rounded-md focus:outline-none  focus:border-blue-500 focus:ring-blue-500 w-full md:w-auto"
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
      <ProductTable
        products={currentProducts}
        onEditClick={handleEditClick}
        onDeleteClick={openDeleteModal}
        toggleStatus={toggleStatus}
        startIndex={startIndex}
      />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        filteredProducts={filteredProducts}
        startIndex={startIndex}
        setCurrentPage={setCurrentPage}
      />

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <AddProductModal
          categories={categories}
          onClose={closeAddModal}
          setProducts={setProducts}
          products={products}
          setCurrentPage={setCurrentPage}
        />
      )}

      {/* Edit Product Modal */}
      {isEditModalOpen && (
        <EditProductModal
          product={editingProduct}
          categories={categories}
          onClose={handleCloseEditModal}
          setProducts={setProducts}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <DeleteModal
          product={productToDelete}
          onClose={closeDeleteModal}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
};

export default Products;
