import React, { useEffect, useState } from "react";
import axios from "axios";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const limit = 5; // transactions per page

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [search, statusFilter, transactions]);

  const fetchTransactions = async () => {
    try {
      const res = await axios.get("/api/transactions"); // fetch all transactions
      setTransactions(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const applyFilters = () => {
    let temp = [...transactions];

    if (search) {
      temp = temp.filter((t) =>
        t.supplier?.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (statusFilter) {
      temp = temp.filter((t) => t.status === statusFilter);
    }

    setFilteredTransactions(temp);
    setPage(1); // reset page after filter/search
  };

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / limit);
  const startIdx = (page - 1) * limit;
  const currentTransactions = filteredTransactions.slice(
    startIdx,
    startIdx + limit
  );

  return (
    <div className="p-4 mt-2">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Transactions</h2>

        <div className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="Search by Supplier..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-2 py-1 rounded"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border px-2 py-1 rounded"
          >
            <option value="">All Status</option>
            <option value="Paid">Paid</option>
            <option value="Partial">Partial</option>
            <option value="Due">Due</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="py-2 px-4 border">Supplier</th>
            <th className="py-2 px-4 border">Products</th>
            <th className="py-2 px-4 border">Total</th>
            <th className="py-2 px-4 border">Paid</th>
            <th className="py-2 px-4 border">Due</th>
            <th className="py-2 px-4 border">Status</th>
          </tr>
        </thead>
        <tbody>
          {currentTransactions.map((t, index) => (
            <tr key={t.id || index} className="text-center align-top">
              <td className="py-2 px-4 border">{t.supplier?.name || "N/A"}</td>

              {/* Products column with mini invoice */}
              <td className="py-2 px-4 border text-left">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="text-sm text-gray-600">
                      <th className="border px-2">Product</th>
                      <th className="border px-2">Qty</th>
                      <th className="border px-2">Price</th>
                      <th className="border px-2">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {t.items?.length > 0 ? (
                      t.items.map((item) => (
                        <tr key={item.id} className="text-sm">
                          <td className="border px-2">
                            {item.product?.name || "N/A"}
                          </td>
                          <td className="border px-2">{item.quantity}</td>
                          <td className="border px-2">
                            ${item.price?.toFixed(2) || "0.00"}
                          </td>
                          <td className="border px-2">
                            ${(item.price * item.quantity).toFixed(2)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={4}
                          className="text-center text-gray-500 py-2"
                        >
                          No items found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </td>

              <td className="py-2 px-4 border">
                ${(t?.totalAmount || 0).toFixed(2)}
              </td>
              <td className="py-2 px-4 border">
                ${(t?.paidAmount || 0).toFixed(2)}
              </td>
              <td className="py-2 px-4 border">
                ${(t?.dueAmount || 0).toFixed(2)}
              </td>

              <td className="py-2 px-4 border">{t.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Footer Pagination */}
      <div className="flex justify-between items-center mt-4">
        {/* Left: Showing info */}
        <div className="text-gray-600">
          Showing {startIdx + 1} -{" "}
          {Math.min(startIdx + limit, filteredTransactions.length)} of {limit}{" "}
          transactions
        </div>

        {/* Footer Pagination */}
        <div className="flex justify-center items-center mt-4 gap-3">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          {Array.from({ length: Math.min(5, totalPages) }, (_, idx) => {
            let startPage = Math.max(1, page - 2);
            let endPage = Math.min(totalPages, startPage + 4);
            startPage = Math.max(1, endPage - 4);

            const currentPage = startPage + idx;

            return (
              <button
                key={currentPage}
                onClick={() => setPage(currentPage)}
                className={`px-3 py-1 border rounded ${
                  page === currentPage ? "bg-blue-500 text-white" : ""
                }`}
              >
                {currentPage}
              </button>
            );
          })}

          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
