import axios from "axios";

export default axios.create({
  baseURL: "https://botsailer-api.vercel.app",
});