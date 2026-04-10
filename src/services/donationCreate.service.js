import { apiClient, API_ENDPOINTS } from './api';

export const DonationCreateService = {
    async createDonation(data) {
        return apiClient.post(API_ENDPOINTS.DONATION_CREATE.CREATE, data);
    },

    async listDonations(data = {}) {
        return apiClient.get(API_ENDPOINTS.DONATION_CREATE.LIST, data);
    },

    async deleteDonation(id) {
        return apiClient.delete(`/donationCreate/${id}`);
    },
};
