import AppLayout from "../Components/AppLayout";
import { ProtectedRoute, PublicRoute } from "./customRoutes";
import Login from "../Pages/Login";
import SignUppage from "../Pages/SignUp";
import ForgotPassword from "../Pages/ForgotPassword";
import { createBrowserRouter } from "react-router-dom";
import ResetPassword from "../Pages/ResetPassword";
import Transactions from "../Pages/Transactions";
import { AuthProvider } from "../context/Authcontext";
import Home from "../Pages/Home";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    ),
    children: [
      {
        path: "/",
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
      },

      {
        path: "/transactions",
        element: (
          <ProtectedRoute>
            <Transactions />
          </ProtectedRoute>
        ),
      },
      {
        path: "/login",
        element: (
          <PublicRoute>
            <Login />
          </PublicRoute>
        ),
      },
      {
        path: "/signup",
        element: (
          <PublicRoute>
            <SignUppage />
          </PublicRoute>
        ),
      },
      {
        path: "/forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "/reset-password/:token",
        element: <ResetPassword />,
      },
    ],
  },
]);
