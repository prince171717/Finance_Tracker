import { createContext, useContext, useEffect, useState } from "react";
import { checkauth } from "../lib/checkauth";
import { useLocation, useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const verifyAuth = async () => {
      const authData = await checkauth();
      setIsAuthenticated(authData.isAuthenticated);
      setUser(authData.userData);

      if (
        authData.isAuthenticated &&
        (location.pathname === "/login" || location.pathname === "/signup")
      ) {
        if (authData.userData?.role === "admin") {
          navigate("/admin", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      } else if (!authData.isAuthenticated && location.pathname === "/") {
        navigate("/login", { replace: true });
      }
    };
    verifyAuth();
  }, [location.pathname, navigate]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = ()=>useContext(AuthContext)