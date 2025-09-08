import React, { useState, useEffect } from "react";
import axios from "axios";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null); // track which transaction is being updated

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/transactions");
      setTransactions(res.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePaidChange = (id, value) => {
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, paid: Number(value) } : t
      )
    );
  };

  const updatePaidAmount = async (transaction) => {
    try {
      setUpdatingId(transaction.id);
      await axios.put(`http://localhost:5000/api/transactions/${transaction.id}`, {
        paid: transaction.paid,
      });
      fetchTransactions(); // refresh after update
    } catch (error) {
      console.error("Error updating paid amount:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <div className="p-6">Loading transactions...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Transactions</h1>
      <table className="min-w-full border border-gray-300 rounded-lg shadow-md overflow-hidden">
        <thead className="bg-gray-900">
          <tr>
            {["Supplier", "Products", "Status", "Total Amount", "Paid Amount", "Due Amount", "Action"].map(
              (header, idx) => (
                <th
                  key={idx}
                  className={`py-3 px-4 text-left text-xs font-medium text-white uppercase tracking-wider ${
                    idx !== 6 ? "border-r border-gray-700" : ""
                  }`}
                >
                  {header}
                </th>
              )
            )}
          </tr>
        </thead>

        <tbody className="bg-white">
          {transactions.length > 0 ? (
            transactions.map((t) => {
              const total = t.products.reduce((acc, p) => acc + p.qty * p.price, 0);
              const due = total - t.paid;
              const status =
                due === 0 ? "Paid" : due > 0 && t.paid > 0 ? "Partial" : "Due";

              return (
                <tr key={t.id} className="hover:bg-gray-50 border-b border-gray-200">
                  <td className="py-4 px-4 border-r border-gray-200 font-medium">{t.supplier}</td>
                  <td className="py-4 px-4 border-r border-gray-200">
                    {t.products.map((p, i) => (
                      <div key={i}>
                        {p.name} - {p.qty} pcs @ ${p.price}
                      </div>
                    ))}
                  </td>
                  <td className="py-4 px-4 border-r border-gray-200">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        status === "Paid"
                          ? "bg-green-200 text-green-800"
                          : status === "Partial"
                          ? "bg-yellow-200 text-yellow-800"
                          : "bg-red-200 text-red-800"
                      }`}
                    >
                      {status}
                    </span>
                  </td>
                  <td className="py-4 px-4 border-r border-gray-200">${total.toFixed(2)}</td>
                  <td className="py-4 px-4 border-r border-gray-200">
                    <input
                      type="number"
                      value={t.paid}
                      onChange={(e) => handlePaidChange(t.id, e.target.value)}
                      className="w-20 px-2 py-1 border rounded text-sm"
                    />
                  </td>
                  <td className="py-4 px-4 border-r border-gray-200">${due.toFixed(2)}</td>
                  <td className="py-4 px-4 border-r border-gray-200">
                    <button
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                      onClick={() => updatePaidAmount(t)}
                      disabled={updatingId === t.id}
                    >
                      {updatingId === t.id ? "Updating..." : "Update"}
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="7" className="text-center py-8 text-gray-500">
                No transactions found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Transactions;
