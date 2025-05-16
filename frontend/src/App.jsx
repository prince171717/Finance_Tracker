import React from "react";
import { RouterProvider } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import { router } from "./Routes/routes";

const App = () => {
  return (
    <>
      <ToastContainer />
      <RouterProvider router={router} />
    </>
  );
};

export default App;
