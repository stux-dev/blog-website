import axios from "axios"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    
  }, 
});

apiClient.interceptors.request.use(
  (config) => {
    // Get the token from local storage
    const token = localStorage.getItem('token');

    // If the token exists, add it to the Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // IMPORTANT: return the config object
    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);


export default apiClient;