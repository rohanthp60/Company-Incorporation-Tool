import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export function getToken() {
    return localStorage.getItem('token');
}

export function setToken(token) {
    localStorage.setItem('token', token);
}

export function clearToken() {
    localStorage.removeItem('token');
}

export async function signup(username, password) {
    const response = await axios.post(`${API_BASE_URL}/auth/signup`, { username, password });
    return response.data;
}

export async function login(username, password) {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, { username, password });
    return response.data.token;
}

export function getUserInfo() {
    const token = getToken();
    if (!token) return null;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload; // Return the entire payload for more detailed user information
}