import axios, { Axios, AxiosRequestConfig } from 'axios';
import { BASE_API_URL } from '../config/config';
import { jwtDecode, JwtPayload } from 'jwt-decode';

// Create an axios instance with the base URL
const api = axios.create({
    baseURL: BASE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// function to check token is valid or expires
const isTokenValid = (token: string): boolean => {
    if (!token) return false;
    try {
        const decoded = jwtDecode<JwtPayload>(token);
        if (decoded.exp) {
            const currentTime = Date.now() / 1000; // in seconds
            return decoded.exp > currentTime;
        }
        return false;
    } catch (error) {
        console.error('Invalid token:', error);
        return false;
    }
};

// Add a request interceptor to include the token in headers
api.interceptors.request.use((config: any) => {
    const token: any = localStorage.getItem('token');

    if (!token) return config;

    if (!isTokenValid(token)) {
        localStorage.removeItem('token');
        window.location.href = '/';
        return Promise.reject('No valid token found');
    }

    config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
    };

    return config;
});


// Response interceptor to handle responses globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Handle unauthorized access, e.g., redirect to login
            localStorage.removeItem('token');
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

export default api;