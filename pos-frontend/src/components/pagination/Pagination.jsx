import React from "react";

const Pagination = ({
  currentPage,
  totalPages,
  itemsPerPage,
  filteredProducts,
  startIndex,
  setCurrentPage,
}) => {
  // Generate page numbers for pagination
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
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
  );
};

export default Pagination;
