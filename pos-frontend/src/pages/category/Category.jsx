import React, { useState, useEffect } from "react";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fetchLoading, setFetchLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Function to fetch all categories from API
  const fetchCategories = async () => {
    try {
      setFetchLoading(true);
      const response = await fetch(
        "http://localhost:5000/api/category/get-all-category"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }

      const data = await response.json();

      // Transform API data to match our component structure
      const formattedCategories = data.map((category) => ({
        id: category.id,
        name: category.name,
        createdAt: category.createdAt.split("T")[0],
        products: category.totalProducts || 0,
      }));

      setCategories(formattedCategories);
      setError("");
    } catch (err) {
      setError("Failed to load categories. Please try again.");
      console.error("Error fetching categories:", err);
    } finally {
      setFetchLoading(false);
    }
  };

  // Filter categories based on search term
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get current categories for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCategories = filteredCategories.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryName.trim()) return;

    setLoading(true);
    try {
      if (editingCategory) {
        // Update existing category via API
        const response = await fetch(
          `http://localhost:5000/api/category/update-category/${editingCategory.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: categoryName }),
          }
        );

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || "Failed to update category");
        }

        // Refresh categories after update
        await fetchCategories();
        setEditingCategory(null);
      } else {
        // Add new category via API
        const response = await fetch(
          "http://localhost:5000/api/category/add-category",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: categoryName }),
          }
        );

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || "Failed to add category");
        }

        // Refresh categories after adding
        await fetchCategories();
      }

      setCategoryName("");
      setError("");
      setCurrentPage(1); // Reset to first page after adding/editing
    } catch (err) {
      setError(err.message || "Failed to save category. Please try again.");
      console.error("Error saving category:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle edit category
  const handleEdit = (category) => {
    setCategoryName(category.name);
    setEditingCategory(category);
  };

  // Open delete confirmation modal
  const openDeleteModal = (category) => {
    setCategoryToDelete(category);
    setDeleteModalOpen(true);
  };

  // Close delete confirmation modal
  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setCategoryToDelete(null);
    setDeleteLoading(false);
  };

  // Handle delete category confirmation
  const confirmDelete = async () => {
    if (categoryToDelete) {
      setDeleteLoading(true);
      try {
        const response = await fetch(
          `http://localhost:5000/api/category/delete-category/${categoryToDelete.id}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || "Failed to delete category");
        }

        // Refresh categories after successful deletion
        await fetchCategories();
        closeDeleteModal();
        
        // Adjust current page if needed after deletion
        if (currentCategories.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } catch (err) {
        setError(err.message || "Failed to delete category. Please try again.");
        console.error("Error deleting category:", err);
        closeDeleteModal();
      }
    }
  };

  // Cancel editing
  const cancelEdit = () => {
    setCategoryName("");
    setEditingCategory(null);
    setError("");
  };

  // Generate page numbers for pagination
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="p-4 bg-gray-100 min-h-screen font-ubuntu">
      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
          Category
        </h1>

        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 w-full md:w-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search categories..."
              className="pl-10 pr-4 py-1.5 text-[15px] border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page when searching
              }}
            />
            <i className="fas fa-search absolute left-3 top-2.5 text-gray-400"></i>
          </div>
        </div>
      </div>

      {/* Add Category Form */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">
          {editingCategory ? "Edit Category" : "Add New Category"}
        </h2>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col md:flex-row gap-4"
        >
          <div className="flex-grow">
            <label
              htmlFor="categoryName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Category Name
            </label>
            <input
              type="text"
              id="categoryName"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="w-full p-1.5 text-[14px] border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter category name"
              required
              disabled={loading}
            />
          </div>
          <div className="flex items-end space-x-2">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white py-1.5 px-6 rounded-lg font-medium disabled:bg-blue-300"
              disabled={loading || !categoryName.trim()}
            >
              {loading
                ? editingCategory
                  ? "Updating..."
                  : "Adding..."
                : editingCategory
                ? "Update"
                : "Add"}{" "}
              Category
            </button>
            {editingCategory && (
              <button
                type="button"
                onClick={cancelEdit}
                className="bg-gray-500 hover:bg-gray-600 text-white py-1.5 px-6 rounded-lg font-medium"
                disabled={loading}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        {fetchLoading ? (
          <div className="py-8 text-center text-gray-500">
            Loading categories...
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-black">
                  <tr>
                    <th className="py-3 px-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                      ID
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Category Name
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Products
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Created At
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentCategories.length > 0 ? (
                    currentCategories.map((category) => (
                      <tr key={category.id} className="hover:bg-gray-50">
                        <td className="py-4 px-4 font-medium text-gray-900">
                          {category.id}
                        </td>
                        <td className="py-4 px-4">
                          <span className="font-bold text-sm">
                            {category.name}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                            {category.products} products
                          </span>
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-500">
                          {category.createdAt}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex space-x-2">
                            <button
                              className="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-100"
                              onClick={() => handleEdit(category)}
                              disabled={loading}
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button
                              className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100"
                              onClick={() => openDeleteModal(category)}
                              disabled={loading}
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
                        colSpan="5"
                        className="py-8 text-center text-gray-500"
                      >
                        {searchTerm
                          ? "No categories found matching your search."
                          : "No categories found. Add your first category!"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filteredCategories.length > 0 && (
              <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between">
                <div className="text-sm text-gray-700 mb-4 sm:mb-0">
                  Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
                  <span className="font-medium">
                    {Math.min(indexOfLastItem, filteredCategories.length)}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium">{filteredCategories.length}</span>{" "}
                  results
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  {pageNumbers.map(number => (
                    <button
                      key={number}
                      onClick={() => paginate(number)}
                      className={`px-3 py-1 border rounded-md text-sm font-medium ${
                        currentPage === number 
                          ? 'text-white bg-blue-600' 
                          : 'text-gray-700 bg-white hover:bg-gray-50'
                      }`}
                    >
                      {number}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

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
                Delete Category
              </h3>

              <p className="text-sm text-gray-500 text-center mb-6">
                Are you sure you want to delete the category "
                {categoryToDelete?.name}"? This action cannot be undone.
              </p>

              <div className="flex justify-center space-x-3">
                <button
                  onClick={closeDeleteModal}
                  className="px-3 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  disabled={deleteLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-red-400"
                  disabled={deleteLoading}
                >
                  {deleteLoading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Category;