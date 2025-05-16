import { axiosInstance } from "./axios";

export const checkauth = async () => {
  try {
    const res = await axiosInstance.get("/api/check-auth");
    console.log(res.data);
    return {
      isAuthenticated: res.data.isAuthenticated,
      userData: res.data.user,
    };
  } catch (error) {
    console.log("Error in checkAuth frontend",error.message)
    return {
        isAuthenticated: false,
        userData: null,
      };
  }
};
