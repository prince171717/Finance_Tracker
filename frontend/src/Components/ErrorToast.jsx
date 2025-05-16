import { motion, AnimatePresence } from "framer-motion";

const ErrorToast = ({ message, onClose }) => {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50"
        >
          <div className="flex items-center justify-between gap-4">
            <span>{message}</span>
            <button onClick={onClose} className="text-white font-bold">×</button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ErrorToast;
