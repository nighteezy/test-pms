import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.BASE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
