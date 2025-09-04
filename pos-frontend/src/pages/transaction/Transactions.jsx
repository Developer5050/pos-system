import React, { useState } from "react";

const Transactions = () => {
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      supplier: "ABC Supplier",
      products: [
        { name: "Product A", qty: 10, price: 50 },
        { name: "Product B", qty: 5, price: 100 },
      ],
      paid: 500,
    },
  ]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Transactions</h1>
      <table className="w-full border-collapse bg-white rounded-lg shadow">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-3 border">Supplier</th>
            <th className="p-3 border">Products</th>
            <th className="p-3 border">Total Amount</th>
            <th className="p-3 border">Paid Amount</th>
            <th className="p-3 border">Due Amount</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => {
            const total = t.products.reduce((acc, p) => acc + p.qty * p.price, 0);
            return (
              <tr key={t.id} className="hover:bg-gray-50">
                <td className="p-3 border">{t.supplier}</td>
                <td className="p-3 border">
                  {t.products.map((p, i) => (
                    <div key={i}>
                      {p.name} - {p.qty} pcs @ ${p.price}
                    </div>
                  ))}
                </td>
                <td className="p-3 border">${total}</td>
                <td className="p-3 border">${t.paid}</td>
                <td className="p-3 border">${total - t.paid}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Transactions;
