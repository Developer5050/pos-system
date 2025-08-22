import React, { useState } from "react";

const Category = () => {
  const [categories, setCategories] = useState([
    { id: 1, name: "Electronics", createdAt: "2023-10-15", products: 24 },
    { id: 2, name: "Clothing", createdAt: "2023-10-10", products: 42 },
    { id: 3, name: "Groceries", createdAt: "2023-10-05", products: 18 },
    { id: 4, name: "Books", createdAt: "2023-09-28", products: 31 },
  ]);

  const [categoryName, setCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  // Filter categories based on search term
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!categoryName.trim()) return;

    if (editingCategory) {
      // Update existing category
      setCategories(
        categories.map((category) =>
          category.id === editingCategory.id
            ? { ...category, name: categoryName }
            : category
        )
      );
      setEditingCategory(null);
    } else {
      // Add new category
      const newCategory = {
        id:
          categories.length > 0
            ? Math.max(...categories.map((c) => c.id)) + 1
            : 1,
        name: categoryName,
        createdAt: new Date().toISOString().split("T")[0],
        products: 0,
      };
      setCategories([...categories, newCategory]);
    }

    setCategoryName("");
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
  };

  // Handle delete category confirmation
  const confirmDelete = () => {
    if (categoryToDelete) {
      setCategories(categories.filter((category) => category.id !== categoryToDelete.id));
      closeDeleteModal();
    }
  };

  // Cancel editing
  const cancelEdit = () => {
    setCategoryName("");
    setEditingCategory(null);
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen font-ubuntu">
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
              onChange={(e) => setSearchTerm(e.target.value)}
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
            />
          </div>
          <div className="flex items-end space-x-2">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white py-1.5 px-6 rounded-lg font-medium"
            >
              {editingCategory ? "Update" : "Add"} Category
            </button>
            {editingCategory && (
              <button
                type="button"
                onClick={cancelEdit}
                className="bg-gray-500 hover:bg-gray-600 text-white py-1.5 px-6 rounded-lg font-medium"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
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
              {filteredCategories.length > 0 ? (
                filteredCategories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className="py-4 px-4 font-medium text-gray-900">
                      {category.id}
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-bold text-sm">{category.name}</span>
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
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100"
                          onClick={() => openDeleteModal(category)}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-gray-500">
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
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">1</span> to{" "}
            <span className="font-medium">{filteredCategories.length}</span> of{" "}
            <span className="font-medium">{filteredCategories.length}</span>{" "}
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
                Delete Category
              </h3>
              
              <p className="text-sm text-gray-500 text-center mb-6">
                Are you sure you want to delete the category "{categoryToDelete?.name}"? 
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

export default Category;