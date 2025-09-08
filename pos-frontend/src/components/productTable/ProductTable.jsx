import React from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";

const ProductTable = ({
  products,
  onEditClick,
  onDeleteClick,
  toggleStatus,
  startIndex,
}) => {
  if (products.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead className="bg-black">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                  ID
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Image
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Title
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-white uppercase tracking-wider">
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
            <tbody>
              <tr>
                <td
                  colSpan="9"
                  className="py-8 text-center text-gray-500 font-ubuntu"
                >
                  No products found. Try adjusting your search or filters.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 rounded-lg shadow-md overflow-hidden">
          <thead className="bg-black border-b border-gray-300">
            <tr>
              {[
                "ID",
                "Image",
                "Title",
                "Price",
                "Quantity",
                "Status",
                "Created",
                "Updated",
                "Actions",
              ].map((header, idx) => (
                <th
                  key={idx}
                  className={`py-3 px-4 text-left text-xs font-medium text-white uppercase tracking-wider ${
                    idx !== 8 ? "border-r border-white" : ""
                  }`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="bg-white">
            {products.map((product, index) => (
              <tr
                key={product.id}
                className={`hover:bg-gray-50 border-b border-gray-200`}
              >
                <td className="py-4 px-4 font-medium text-gray-900 border-r border-gray-200">
                  {startIndex + index + 1}
                </td>
                <td className="py-4 px-4 border-r border-gray-200">
                  <img
                    src={`http://localhost:5000/${product.image}`}
                    alt={product.name}
                    className="w-16 h-16 rounded-md object-cover"
                  />
                </td>
                <td className="py-4 px-2 font-bold text-[13px] border-r border-gray-200">
                  {product.title}
                </td>
                <td className="py-4 px-4 text-sm border-r border-gray-200">
                  $
                  {product.sellingPrice !== undefined &&
                  product.sellingPrice !== null
                    ? product.sellingPrice.toFixed(2)
                    : "0.00"}
                </td>
                <td className="py-4 px-2 border-r border-gray-200">
                  <span
                    className={`py-1 px-2 rounded-full text-xs font-medium ${
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
                <td className="py-4 px-4 border-r border-gray-200">
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
                <td className="py-4 px-2 text-sm text-gray-500 border-r border-gray-200">
                  {product.createdAt}
                </td>
                <td className="py-4 px-2 text-sm text-gray-500 border-r border-gray-200">
                  {product.updatedAt}
                </td>
                <td className="py-4 px-4 border-r border-gray-200">
                  <div className="flex space-x-2">
                    <button
                      className="text-green-500 hover:text-green-700"
                      onClick={() => onEditClick(product)}
                    >
                      <FiEdit />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => onDeleteClick(product)}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductTable;
