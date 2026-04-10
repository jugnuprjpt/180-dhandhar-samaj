import { apiClient, API_ENDPOINTS } from './api';

export const AuthService = {
    async login(credentials) {
        return apiClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
    },

    async register(data) {
        return apiClient.post(API_ENDPOINTS.AUTH.REGISTER, data);
    },

    async logout() {
        return apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    },

    async getSession() {
        return apiClient.get(API_ENDPOINTS.AUTH.SESSION);
    }
};
