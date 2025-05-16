import React from "react";
import { axiosInstance } from "../lib/axios";
import { useState } from "react";
import { useEffect } from "react";
import { Pie } from "react-chartjs-2";
import "chart.js/auto"; // Needed for Chart.js

const Home = () => {
  const [storeTransaction, setStoreTransaction] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);

  useEffect(() => {
    const handleFetchAllData = async () => {
      try {
        const res = await axiosInstance.get("/api/fetch-all-transaction");
        if (res.data.success) {
          setStoreTransaction(res.data.fetchAllUserTransaction);
        }
      } catch (error) {
        const messageFromBackend =
          error.response?.data?.message || error.message;
        console.log("Error in handlefetch home page", messageFromBackend);
        handleError(messageFromBackend);
      }
    };
    handleFetchAllData();
  }, []);

  useEffect(() => {
    const income = storeTransaction
      .filter((data) => data.type === "income")
      .reduce((a, b) => a + Number(b.amount), 0);

    const expense = storeTransaction
      .filter((data) => data.type === "expense")
      .reduce((a, b) => a + Number(b.amount), 0);

    setTotalIncome(income);
    setTotalExpense(expense);
  }, [storeTransaction]);

  const balance = totalIncome - totalExpense;

  const expenseByCategory = {};

  storeTransaction
    .filter((data) => data.type === "expense")
    .forEach((data) => {
      if (expenseByCategory[data.category]) {
        expenseByCategory[data.category] += Number(data.amount);
      } else {
        expenseByCategory[data.category] = Number(data.amount);
      }
    });

  const chartData = {
    labels: Object.keys(expenseByCategory),
    datasets: [
      {
        data: Object.values(expenseByCategory),
        backgroundColor: [
          "#3b82f6",
          "#10b981",
          "#f59e0b",
          "#ef4444",
          "#8b5cf6",
        ],
      },
    ],
  };

  const latestFive = [...storeTransaction]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 8);

  // console.log("home page", storeTransaction);

  return (
    <div className="sm:p-6 p-3 w-full max-w-[90%] mx-auto">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      {/* Income Expense and balance */}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 text-center">
        <div className="bg-blue-100 p-4 rounded">
          <h2 className="text-gray-700 text-lg">
            {"Total Income".toUpperCase()}
          </h2>
          <p className="text-2xl font-bold text-black">
            ${totalIncome.toFixed(2)}
          </p>
        </div>
        <div className="bg-yellow-100 p-4 rounded">
          <h2 className="text-gray-700 text-lg">
            {"Total Expenses".toUpperCase()}
          </h2>
          <p className="text-2xl font-bold text-black">
            ${totalExpense.toFixed(2)}
          </p>
        </div>
        <div className={`${balance > 0?"bg-green-100":"bg-red-100"} p-4 rounded`}>
          <h2 className="text-gray-700 text-lg">{"Balance".toUpperCase()}</h2>
          <p className="text-2xl font-bold text-black">${balance.toFixed(2)}</p>
        </div>
      </div>

      {/* pie chart and transaction */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* pie chart  */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2 text-black">
            Expenses by Category
          </h2>
          <Pie data={chartData} />
        </div>

        {/* last 5 transaction */}

    <div className="bg-white sm:p-8 p-4 rounded shadow text-black">
  <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>

  <div className="overflow-x-auto">
    <table className="min-w-full text-sm">
      <thead>
        <tr className="text-left border-b border-black/20 text-black/55">
          <th className="py-3 px-2 whitespace-nowrap">Date</th>
          <th className="py-3 px-2 whitespace-nowrap">Type</th>
          <th className="py-3 px-2 whitespace-nowrap">Category</th>
          <th className="py-3 px-2 whitespace-nowrap">Amount</th>
        </tr>
      </thead>
      <tbody>
        {latestFive.map((data, index) => (
          <tr key={index} className="border-b border-black/20">
            <td className="py-3 px-2 whitespace-nowrap">{new Date(data.date).toLocaleDateString()}</td>
            <td className="py-3 px-2 whitespace-nowrap">{data.type}</td>
            <td className="py-3 px-2 whitespace-nowrap">{data.category}</td>
            <td className={`py-3 px-2 whitespace-nowrap ${data.type === "expense" ? "text-red-500" : "text-green-600"}`}>
              {data.type === "expense" ? "-" : "+"} ${data.amount}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

      </div>
    </div>
  );
};

export default Home;
