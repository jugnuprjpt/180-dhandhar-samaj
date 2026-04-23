import { apiClient, API_ENDPOINTS } from './api';

export const FamilyService = {
    async updateFamilyDetails(data) {
        return apiClient.post(API_ENDPOINTS.FAMILY.UPDATE, data);
    },

    async getFamilyDetails(authId) {
        return apiClient.get(API_ENDPOINTS.FAMILY.BY_AUTH(authId));
    },

    async getAllFamilies() {
        return apiClient.get(API_ENDPOINTS.FAMILY.LIST);
    },

    async deleteFamilyRecord(id) {
        return apiClient.delete(`/family/${id}`);
    }
};
