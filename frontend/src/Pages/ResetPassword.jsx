import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { handleError, handleSuccess } from "../lib/utils";
import { axiosInstance } from "../lib/axios";
import { Eye, EyeOff, Lock } from "lucide-react";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [resetPassword, setResetPassword] = useState({
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });

  const handleChange = (e) => {
    setResetPassword({ ...resetPassword, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { password, confirmPassword } = resetPassword;
    if (!password || !confirmPassword) {
    return  handleError("All fields are required");
    } else if (password !== confirmPassword) {
     return handleError("password and confirmPassword should be same");
    }

    try {
      const res = await axiosInstance.post(
        `/api/reset-password/${token}`,
       {password: resetPassword.password}
      );
      if (res.status === 200) {
        handleSuccess(res.data.message);
        navigate("/login");
      }
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      handleError(msg);
    }
  };

  const handleTogglePassword = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <div className="w-full flex justify-center items-center">
      <div className="container flex flex-col justify-center items-center bg-[#0e2834] shadow-[8px_8px_24px_0px_rgba(66,68,90,1)] px-8 py-6 rounded-2xl w-full max-w-[400px]">
        <div>
          <h1 className="mb-5 text-2xl">Forgot Password</h1>
        </div>
        <form className="flex flex-col justify-center gap-3 w-full" onSubmit={handleSubmit} >
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
                value={resetPassword.password}
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
                value={resetPassword.confirmPassword}
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

          <button className="bg-purple-700 w-full text-white text-center border-none text-[20px] rounded-md p-2 cursor-pointer my-2.5">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
