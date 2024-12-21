import axios from "axios";
// import { useNavigate } from "react-router-dom";
const url = import.meta.env.VITE_API_URL;

axios.defaults.withCredentials = true;
export default axios.create({
  baseURL: url,
});

export const api = axios.create({
  baseURL: url,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
