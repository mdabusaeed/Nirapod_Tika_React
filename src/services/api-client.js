import axios from "axios";

const apiClient = axios.create({
    baseURL: "https://nirapod-tika-sub.vercel.app/api/v1/",
});

export default apiClient;