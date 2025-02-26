import axios from "axios";

export default axios.create({
  baseURL: "https://newtestapi-livid.vercel.app",
  // baseURL: "http://localhost:3005",
  headers: {
    Referer: "https://www.mangakakalot.gg/"
  }
});