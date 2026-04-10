import { apiClient, API_ENDPOINTS } from './api';

export const DonationService = {
    async createDonation(data) {
        return apiClient.post(API_ENDPOINTS.DONATIONS.CREATE, data);
    },

    async listDonation(data = {}) {
        return apiClient.post(API_ENDPOINTS.DONATIONS.LIST, data);
    },

    async listDonationByStatus(status) {
        return apiClient.get(`/donations/donationbyStatus/${status}`);
    },

    async updateDonation(id, data) {
        return apiClient.patch(`/donations/${id}`, data);
    },

    async deleteDonation(id) {
        return apiClient.delete(`/donations/${id}`);
    },
};
