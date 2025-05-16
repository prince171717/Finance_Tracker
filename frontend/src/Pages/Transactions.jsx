import React, { useEffect, useState } from "react";
import { handleError, handleSuccess } from "../lib/utils";
import { axiosInstance } from "../lib/axios";
import { Delete, Edit, Search, View } from "lucide-react";
import Confirmation from "../Components/Confirmation";
import ViewModal from "../Components/ViewModal";

const Transactions = () => {
  const [transactionData, setTransactionData] = useState({
    amount: "",
    type: "",
    category: "",
    description: "",
    date: "",
  });

  const [storeTransaction, setStoreTransaction] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [viewTransactionModal, setViewTransactionModal] = useState(false);
  const [viewTransaction, setViewTransaction] = useState([]);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);

  // Pagination state

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const transactionPerPage = 5;

  useEffect(() => {
    handleFetch();
  }, [currentPage]);

  const handleChange = (e) => {
    setTransactionData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFetch = async () => {
    try {
      const res = await axiosInstance.get(
        `/api/fetch-transaction?page=${currentPage}&limit=${transactionPerPage}`
      );
      if (res.data.success) {
        setStoreTransaction(res.data.fetchUserTransaction);
        setTotalPages(res.data.totalPages);
      }
    } catch (error) {
      const messageFromBackend = error.response?.data?.message || error.message;
      console.log("Error in handlefetch transtion page", messageFromBackend);
      handleError(messageFromBackend);
    }
  };

  const isTransactionFormValid = () => {
    const { amount, type, category, description } = transactionData;
    return amount && type && category && description;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = { ...transactionData };

    if (!payload.date) {
      delete payload.date;
    } else {
      // Convert YYYY-MM-DD to ISO string for backend
      payload.date = new Date(payload.date).toISOString();
    }

    try {
      if (editId) {
        const res = await axiosInstance.put(
          `/api/update-transaction/${editId}`,
          payload
        );

        if (res.data.success) {
          handleSuccess(res.data.message);
          setTransactionData({
            amount: "",
            type: "",
            category: "",
            description: "",
            date: "",
          });
          setShowForm(false);
          setEditId(null);
          handleFetch();
        }
      } else {
        const res = await axiosInstance.post("/api/add-transaction", payload);
        if (res.data.success) {
          handleSuccess(res.data.message);
          handleFetch();
          setTransactionData({
            amount: "",
            type: "",
            category: "",
            description: "",
            date: "",
          });
        }
      }
    } catch (error) {
      const messageFromBackend = error.response?.data?.message || error.message;
      console.log("Error in Transaction frontend", messageFromBackend);
      handleError(messageFromBackend);
    }
  };

  const handleDelete = async (id) => {
    setDeleteId(id);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    try {
      const res = await axiosInstance.delete(
        `/api/delete-transaction/${deleteId}`
      );
      if (res.data.success) {
        handleSuccess(res.data.message);
        setStoreTransaction(
          storeTransaction.filter((data) => data._id !== deleteId)
        );
      }
    } catch (error) {
      handleError(error.response?.data?.message || "Server Error");
    } finally {
      setShowModal(false);
      setDeleteId(null);
    }
  };

  const handleViewTransaction = (data) => {
    setViewTransactionModal(true);
    setViewTransaction([data]);
  };

  const sortedTransaction = [...storeTransaction].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  const filteredTransactions = sortedTransaction.filter((data) => {
    const searchLower = search.toLowerCase();
    const dateStr = new Date(data.date).toLocaleDateString().toLowerCase();

    return (
      data.amount.toString().includes(searchLower) ||
      data.type.toLowerCase().includes(searchLower) ||
      data.category.toLowerCase().includes(searchLower) ||
      dateStr.includes(searchLower)
    );
  });

  const handleEdit = (data) => {
    console.log("Raw date:", data.date); // Should log 2025-05-09T04:07:58.131Z
    const formattedDate = data.date
      ? new Date(data.date).toISOString().split("T")[0]
      : "";
    console.log("Formatted date:", formattedDate); // Should log 2025-05-09

    setEditId(data._id);
    setTransactionData({
      amount: data.amount,
      type: data.type,
      category: data.category,
      description: data.description,
      date: formattedDate, // Set YYYY-MM-DD format
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(!showForm);
    setEditId(null);
    setTransactionData({
      amount: "",
      type: "",
      category: "",
      description: "",
      date: "",
    });
  };

  // pagination logic

  // console.log("transaction page",storeTransaction)

  return (
    <div className="p-6 max-w-full mx-auto">
      <div className="flex justify-center items-center mb-4">
        <div className="w-full">
          <div className="pr-2 py-2 text-xl sm:text-2xl font-medium text-center sm:">
            Transactions
          </div>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-5">
            <div className="w-full sm:w-auto flex justify-center items-center">
              <div className="relative  w-full sm:w-96">
                <input
                  type="text"
                  name="transaction"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search your older transactions"
                  className="p-2 pl-10 pr-16 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 text-gray-900 max-sm:placeholder:text-[13px]"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </div>

                <button
                  className="absolute inset-y-0 right-0 px-3 sm:px-4 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors duration-200 flex items-center text-sm sm:text-base cursor-pointer"
                  onClick={() => setSearch("")}
                >
                  {search ? "Clear" : "Search"}
                </button>
              </div>
            </div>
            <div
              className="w-full sm:w-auto bg-blue-600 text-white text-base sm:text-lg tracking-wider py-2 px-4 text-center rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors duration-200 cursor-pointer"
              onClick={handleCancel}
            >
              {showForm ? "Cancel" : "Add Transaction"}
            </div>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="mb-6 bg-white dark:bg-gray-800 p-6 rounded-md shadow-md">
          <h1 className="text-lg font-medium mb-4">Add New Transaction</h1>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {/* Amount */}

            <div>
              <label
                htmlFor="amount"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Amount
              </label>
              <input
                type="number"
                name="amount"
                value={transactionData.amount}
                onChange={handleChange}
                placeholder="Enter amount"
                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* type */}

            <div>
              <label
                htmlFor="type"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Type
              </label>
              <select
                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                name="type"
                onChange={handleChange}
                value={transactionData.type}
                required
              >
                <option value="">Select Type</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>

            {/* category */}

            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Category
              </label>
              <input
                type="text"
                name="category"
                value={transactionData.category}
                onChange={handleChange}
                placeholder="Enter category eg.(food,shopping)"
                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white placeholder:text-[12px]"
              />
            </div>

            {/* date */}

            <div>
              <label
                htmlFor="date"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Date (optional)
              </label>
              <input
                type="date"
                name="date"
                value={transactionData.date}
                onChange={handleChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* description */}

            <div className="sm:col-span-2">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Description
              </label>
              <textarea
                type="text"
                name="description"
                value={transactionData.description}
                onChange={handleChange}
                placeholder="Enter the description"
                className="resize-none mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                rows={4}
              />
            </div>

            {/* submit button */}

            <div className="sm:col-span-2" title="submit">
              <button
                disabled={!isTransactionFormValid()}
                type="submit"
                className={`w-full py-2 text-xl rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 hover:dark:bg-blue-600 transition-colors duration-200 ${
                  !isTransactionFormValid()
                    ? "opacity-50 cursor-not-allowed dark:opacity-50" // Lower opacity
                    : "cursor-pointer"
                }`}
              >
                {editId ? "Update Transaction" : "Submit Transaction"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Transaction list */}

      {!showForm && (
        <div className="mt-6">
          <h2 className="text-lg font-medium mb-4">Transaction History</h2>
          {storeTransaction.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">
              No transactions found.
            </p>
          ) : (
            <div className="overflow-x-auto rounded-md">
              <table className="min-w-full bg-white dark:bg-gray-800 rounded-md shadow-md">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-700 ">
                    <th className="p-3  text-sm font-medium text-gray-700 dark:text-gray-300">
                      Sr.No
                    </th>
                    <th className="p-3  text-sm font-medium text-gray-700 dark:text-gray-300">
                      Id
                    </th>
                    {/* <th className="p-3  text-sm font-medium text-gray-700 dark:text-gray-300">
                      Name
                    </th>
                    <th className="p-3  text-sm font-medium text-gray-700 dark:text-gray-300">
                      Email
                    </th> */}
                    <th className="p-3  text-sm font-medium text-gray-700 dark:text-gray-300">
                      Amount
                    </th>
                    <th className="p-3  text-sm font-medium text-gray-700 dark:text-gray-300">
                      Type
                    </th>
                    <th className="p-3  text-sm font-medium text-gray-700 dark:text-gray-300">
                      Category
                    </th>
                    <th className="p-3  text-sm font-medium text-gray-700 dark:text-gray-300">
                      Date
                    </th>
                    <th className="p-3  text-sm font-medium text-gray-700 dark:text-gray-300">
                      Description
                    </th>
                    <th className="p-3  text-sm font-medium text-gray-700 dark:text-gray-300">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredTransactions.map((data, index) => (
                    <tr
                      key={data._id}
                      className="border-b dark:border-gray-700 text-center"
                    >
                      <td className="p-3 text-gray-900 dark:text-white">
                        {index + 1}
                      </td>
                      <td className="p-3 text-gray-900 dark:text-white">
                        {data.userId._id}
                      </td>

                      {/* <td className="p-3 text-gray-900 dark:text-white">
                        {data.userId.fullName}
                      </td>
                      <td className="p-3 text-gray-900 dark:text-white">
                        {data.userId.email}
                      </td> */}

                      <td className="p-3 text-gray-900 dark:text-white">
                        {data.amount}
                      </td>
                      <td className="p-3 text-gray-900 dark:text-white">
                        {data.type}
                      </td>
                      <td className="p-3 text-gray-900 dark:text-white">
                        {data.category}
                      </td>
                      <td className="p-3 text-gray-900 dark:text-white">
                        {new Date(data.date).toLocaleDateString()}
                      </td>
                      <td className="p-3 text-gray-900 dark:text-white max-w-96 break-words">
                        {data.description.length > 40
                          ? data.description.slice(0, 40) + "..."
                          : data.description}
                      </td>
                      <td className="p-3 text-gray-900 dark:text-white grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <button onClick={() => handleViewTransaction(data)}>
                          <View />
                        </button>
                        <button>
                          <Edit onClick={() => handleEdit(data)} />
                        </button>
                        <button onClick={() => handleDelete(data._id)}>
                          <Delete />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>

                {/* pagination controls */}

              
              </table>
                <div className="flex justify-center items-center mt-4 gap-2 w-full">
                  <button
                    className="px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-400"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                  >
                    Prev
                  </button>
                  <span className="px-3 py-1">
                    Page{currentPage} of {totalPages}
                  </span>
                  <button
                    className="px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-400"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
            </div>
          )}
        </div>
      )}

      <ViewModal
        isOpen={viewTransactionModal}
        onCancel={() => setViewTransactionModal(false)}
        viewTransaction={viewTransaction}
      />

      <Confirmation
        isOpen={showModal}
        onConfirm={confirmDelete}
        onCancel={() => setShowModal(false)}
        message="Are you sure you want to delete this transaction?"
      />
    </div>
  );
};

export default Transactions;
