import {toast} from 'react-toastify'
import { motion, AnimatePresence } from "framer-motion";

export const handleSuccess = (msg)=>{
toast.success(msg,{
    position:"top-right",
    autoClose: 1000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
})
}

export const handleError = (msg) => {
    toast.error(msg, {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };
