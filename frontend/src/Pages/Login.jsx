import React, { useEffect, useState } from "react";
import { Eye, EyeOff, Lock, Mail, MessageSquare } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import AuthImagePattern from "../components/AuthImagePattern";
import { axiosInstance } from "../lib/axios";
import { handleError, handleSuccess } from "../lib/utils";

const Login = () => {
  const [loginData, setLoginData] = useState({
    emailOrUsername: "",
    password: "",
  });

  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const isFormValid = () => {
    const { emailOrUsername, password } = loginData;
    return emailOrUsername && password;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid()) {
      return handleError("All fields required");
    }
    try {
      const res = await axiosInstance.post("/api/login", loginData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.data.success) {
        handleSuccess(res.data.message);
        localStorage.setItem("isAuthenticated", true);
        localStorage.setItem("loggedInUser", res.data.loginUser.fullName);
        setLoginData({ emailOrUsername: "", password: "" });
        navigate("/");
      }
    } catch (error) {
      const messageFromBackend = error.response?.data?.message || error.message;
      console.log(error);
      handleError(messageFromBackend);
      setErrorMessage(messageFromBackend);
    }
  };

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage("");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  return (
    <div className="w-full grid lg:grid-cols-2">
      {/* left side div */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* LOGO */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <MessageSquare className="size-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">
                Sign In to your Account
              </h1>
            </div>
          </div>

          {errorMessage && (
            <div className="bg-red-100 text-red-600 p-3 rounded-md text-center font-medium relative">
              {errorMessage}
              <button
                className="absolute right-1 -top-2 text-black text-2xl cursor-pointer"
                onClick={() => setErrorMessage("")}
              >
                x
              </button>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">
                  E-mail or Username
                </span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <Mail className="size-5 text-base-content/40" />
                </div>
                <input
                  type="text"
                  name="emailOrUsername"
                  className="input input-bordered w-full pl-10"
                  placeholder="johndoe@gmail.com or username"
                  onChange={handleChange}
                  value={loginData.emailOrUsername}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <Lock className="size-5 text-base-content/40" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="input input-bordered w-full pl-10"
                  placeholder="......."
                  onChange={handleChange}
                  value={loginData.password}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center z-10"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <Eye className="size-5 text-base-content/40" />
                  ) : (
                    <EyeOff className="size-5 text-base-content/40" />
                  )}
                </button>
              </div>
            </div>

            <button
              disabled={!isFormValid()}
              type="submit"
              className="btn btn-primary w-full"
            >
              {/* {isLoading ? "Creating..." : "Create Account"}\ */}
              Sign In
            </button>
          </form>
          <div className="text-center">
            <p className="text-base-content/60">
              Don't have an account?
              <Link to="/signup" className="link link-primary no-underline">
                Sign Up
              </Link>
            </p>
            <span className="flex justify-center">
              <Link to="/forgot-password" className="text-white">
                Forgot password?
              </Link>
            </span>
          </div>
        </div>
      </div>

      {/* right side */}
      <AuthImagePattern />
    </div>
  );
};

export default Login;
