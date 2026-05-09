import axios from 'axios';
import { API } from '../constants/api-endpoints.js';

export const apiClient = axios.create({
    baseURL: API.AUTH.LOGIN.split("/api")[0],
    timeout: 10_000,
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
        const token = localStorage.getItem("access_token");
        if (token) config.headers.Authorization = `Bearer ${token}`;
    }

    return config
});

apiClient.interceptors.response.use(
    (res) => res,
    async (err) => {
        const orig = err.config;
        if (err.response?.status === 401 && !orig._retry) {
            orig._retry = true;
            try {
                const { data } = await axios.post(
                    API.AUTH.REFRESH, {}, { withCredentials: true }
                );
                localStorage.setItem("access_token", data.access_token);
                orig.headers.Authorization = `Bearer ${data.access_token}`;
                return apiClient(orig);
            } catch {
                localStorage.removeItem("access_token");
                window.location.href = "/login";
            }
        }
        return Promise.reject(err);
    }
);