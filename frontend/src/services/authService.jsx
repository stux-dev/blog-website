
import apiClient from "../api/apiClient";


export const loginUser = async (email, password) => {
  try {
    const { data } = await apiClient.post("/api/auth/login", { email, password });
    return {
      "token" : data.token,
      "user" : data.user
    };
  } catch (error) {
    console.error("Login failed:", error.response?.data?.message || error.message);
    throw error;
  }
};

export const setAuthToken = (token) => {
  if (token) {
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common["Authorization"];
  }
};

export const registerUser = async (first_name, last_name, dob, email, password) => {
  try {
    const { data } = await apiClient.post("/api/auth/register", {
      first_name,
      last_name,
      dob,
      email,
      password,
    });
    return data;
  } catch (error) {
    console.error("Registration failed:", error.response?.data?.message || error.message);
    throw error;
  }
};

export const verifyOtp = async(email, otp) => {
  try{
    const { data } = await apiClient.post("/api/auth/verify-otp", {email, otp});
    return data;
  }
  catch (error){
    console.error("OTP verification Failed!",error.response?.data?.message || error.message)
    throw error;
  }
}
