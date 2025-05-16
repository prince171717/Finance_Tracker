import { Mail } from "lucide-react";
import React, { useState } from "react";
import { handleError, handleSuccess } from "../lib/utils";
import { axiosInstance } from "../lib/axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState(" ");

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      handleError("Email is required");
    }

    try {
      const res = await axiosInstance.post("/api/forgot-password", { email });
      if (res.status === 200) {
        handleSuccess(res.data.message);
        setEmail("");
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      handleError(message);
    }
  };

  return (
    <div className="w-full flex justify-center items-center">
      <div className="container flex flex-col justify-center items-center bg-[#0e2834] shadow-[8px_8px_24px_0px_rgba(66,68,90,1)] px-8 py-6 rounded-2xl w-full max-w-[400px]">
        <div>
          <h1 className="mb-5 text-2xl">Forgot Password</h1>
        </div>
        <form className="space-y-6 w-full" onSubmit={handleSubmit}>
          <div className="form-control">
            <label className="label py-2">
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
                value={email}
              />
            </div>
          </div>
          <button className="bg-purple-700 w-full text-white text-center border-none text-[20px] rounded-md p-2 cursor-pointer my-2.5">
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
