import axios from "axios";
import { Import } from "lucide-react";

const axiosInstance = axios.create({
  baseURL:
    Import.meta.env.MODE === "development"
      ? "http://localhost:8000/api/v1"
      : "/api/v1",
  withCredentials: true,
});

export default axiosInstance;
