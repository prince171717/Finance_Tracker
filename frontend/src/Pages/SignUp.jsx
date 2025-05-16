import React, { useEffect, useState } from "react";

import {
  AtSign,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  MessageSquare,
  User,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import AuthImagePattern from "../components/AuthImagePattern";
import { handleError, handleSuccess } from "../lib/utils";
import { axiosInstance } from "../lib/axios";

const SignUppage = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });

  const handleTogglePassword = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleChange = (e) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };

  const isFormValid = () => {
    const { fullName, username, email, password, confirmPassword } = signupData;
    return (
      fullName &&
      email &&
      username &&
      password &&
      confirmPassword &&
      password === confirmPassword
    );
  };

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage("");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid()) {
      return handleError("All fields required");
    }

    try {
      setIsLoading(true);
      const res = await axiosInstance.post("/api/signup", signupData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.data.success) {
        handleSuccess(res.data.message);
        setSignupData({
          fullName: "",
          email: "",
          username: "",
          password: "",
          confirmPassword: "",
        });
        navigate("/login");
      }
    } catch (error) {
      const messageFromBackend = error.response?.data?.message || error.message;
      handleError(messageFromBackend);
      setIsLoading(false);
      setErrorMessage(messageFromBackend);
      console.log(messageFromBackend);
    } finally {
      setIsLoading(false);
    }
  };

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
              <h1 className="text-2xl font-bold mt-2">Create Account</h1>
              <p className="text-base-content/60">
                Get started with your free account
              </p>
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

          {/* toast jaise method ko khudse ek component banaya hai */}

          {/* <ErrorToast
            message={errorMessage}
            onClose={() => setErrorMessage("")}
          /> */}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Full Name</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <User className="size-5 text-base-content/40" />
                </div>
                <input
                  type="text"
                  name="fullName"
                  className="input input-bordered w-full pl-10"
                  placeholder="John Doe"
                  onChange={handleChange}
                  value={signupData.fullName}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">E-mail</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <Mail className="size-5 text-base-content/40" />
                </div>
                <input
                  type="email"
                  name="email"
                  className="input input-bordered w-full pl-10"
                  placeholder="johndoe@gmail.com"
                  onChange={handleChange}
                  value={signupData.email}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Username</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <AtSign className="size-5 text-base-content/40" />
                </div>
                <input
                  type="text"
                  name="username"
                  className="input input-bordered w-full pl-10"
                  placeholder="John@123"
                  onChange={handleChange}
                  value={signupData.username}
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
                  type={showPassword.password ? "text" : "password"}
                  name="password"
                  className="input input-bordered w-full pl-10"
                  placeholder="......."
                  onChange={handleChange}
                  value={signupData.password}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center z-10"
                  onClick={() => handleTogglePassword("password")}
                >
                  {showPassword.password ? (
                    <Eye className="size-5 text-base-content/40" />
                  ) : (
                    <EyeOff className="size-5 text-base-content/40" />
                  )}
                </button>
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">confirmPassword</span>
              </label>
              <div className="relative ">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <Lock className="size-5 text-base-content/40" />
                </div>

                <input
                  type={showPassword.confirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  className="input input-bordered w-full px-10"
                  placeholder="......."
                  onChange={handleChange}
                  value={signupData.confirmPassword}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center z-10 "
                  onClick={() => handleTogglePassword("confirmPassword")}
                >
                  {showPassword.confirmPassword ? (
                    <Eye className="size-5 text-base-content/40" />
                  ) : (
                    <EyeOff className="size-5 text-base-content/40" />
                  )}
                </button>
              </div>
            </div>

            <button
              disabled={!isFormValid() || isLoading}
              type="submit"
              className="btn btn-primary w-full"
            >
              {isLoading ? "Creating..." : "Create Account"}
            </button>
          </form>
          <div className="text-center">
            <p className="text-base-content/60">
              Already have an account?
              <Link to="/login" className="link link-primary no-underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* right side */}
      <AuthImagePattern />
    </div>
  );
};

export default SignUppage;
