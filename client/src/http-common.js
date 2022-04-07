import axios from "axios";

export default axios.create({
  baseURL: process.env.API_BASE_URL || "http://localhost:9000/",
  headers: {
    "Content-type": "application/json"
  }
});