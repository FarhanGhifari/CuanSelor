import axios from 'axios';
import { ROUTES } from '../constants/routes';
import { API_BASE_URL } from '../constants/env';

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30_000, // 30 seconds untuk projection calculation
    headers: { "Content-Type": "application/json" },
    // Cookie Better Auth otomatis di-forward ke backend
    withCredentials: true,
});

apiClient.interceptors.response.use(
    (res) => res,
    async (err) => {
        if (err.response?.status === 401) {
            // Session expired - redirect ke login
            if (typeof window !== "undefined") {
                window.location.href = ROUTES.LOGIN;
            }
        }
        return Promise.reject(err);
    }
);