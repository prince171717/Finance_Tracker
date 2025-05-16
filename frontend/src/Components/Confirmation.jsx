import React from 'react'

const Confirmation = ({isOpen,onConfirm,onCancel,message}) => {
if(!isOpen) return null
  return (
    <div className="fixed inset-0 bg-black/75  flex items-center justify-center z-50">
    <div className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-md w-full max-w-sm">
      <p className="text-gray-900 dark:text-white mb-4">{message}</p>
      <div className="flex justify-end gap-2">
        <button
          onClick={onCancel}
          className="px-3 py-1 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded hover:bg-gray-400 dark:hover:bg-gray-500"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
  )
}

export default Confirmation