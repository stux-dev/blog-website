import axios from "axios"

const API = axios.create({
    baseURL : "http://localhost:3001/api/auth",
    headers : {
        "Content-Type" : "application/json",
    },
});

export const loginUser = async (email, password) => {
    try {
      const { data } = await API.post("/login", { email, password });
      return data.token;
    } catch (error) {
      console.error("Login failed", error.response?.data?.message || error.message);
      throw error;
    }
};


export const setAuthToken = (token) => {
    if (token) {
      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete API.defaults.headers.common["Authorization"];
    }
  };
  
  