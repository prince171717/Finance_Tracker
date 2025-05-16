import React, { useEffect } from "react";

const ViewModal = ({ isOpen, onCancel, viewTransaction }) => {
  // Close modal on Escape key press
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onCancel();
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;
  return (
    <div className="fixed top-0 bottom-0 right-0 left-0 px-5 bg-black/75 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-500 p-6 rounded-md w-full">
        <h2 className="text-xl font-semibold mb-2">Transaction Details</h2>
        
        <div className="overflow-x-auto rounded-md">
          <table className="min-w-full bg-white dark:bg-gray-800 rounded-md shadow-md">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700 ">
                <th className="p-3  text-sm font-medium text-gray-700 dark:text-gray-300">
                  Id
                </th>
                <th className="p-3  text-sm font-medium text-gray-700 dark:text-gray-300">
                  Name
                </th>
                <th className="p-3  text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </th>
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
              </tr>
            </thead>

            <tbody>
              {viewTransaction.map((data) => (
                <tr
                  key={data._id}
                  className="border-b dark:border-gray-700 text-center"
                >
                  <td className="p-3 text-gray-900 dark:text-white">
                    {data.userId._id}
                  </td>
                  <td className="p-3 text-gray-900 dark:text-white">
                    {data.userId.fullName}
                  </td>
                  <td className="p-3 text-gray-900 dark:text-white">
                    {data.userId.email}
                  </td>

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
                    {data.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      <div className="flex justify-end">
          <button
          onClick={onCancel}
          className=" mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Close
        </button>
      </div>
      </div>
    </div>
  );
};

export default ViewModal;
