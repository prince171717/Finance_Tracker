import { Navigate } from "react-router-dom";
import { useAuth } from "../context/Authcontext";

export const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? children : <Navigate to={"/"} replace />;
};

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to={"/login"} replace />;
};
