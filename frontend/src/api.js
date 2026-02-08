import axios from "axios";

const API = axios.create({
  baseURL: "https://hrms-backend-mmp3.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;