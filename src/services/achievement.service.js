import { apiClient, API_ENDPOINTS } from './api';

export const AchievementService = {
    async createAchievement(data) {
        return apiClient.post(API_ENDPOINTS.ACHIEVEMENTS.CREATE, data);
    },

    async listAchievement(data = {}) {
        return apiClient.post(API_ENDPOINTS.ACHIEVEMENTS.LIST, data);
    },

    async updateAchievement(id, data) {
        return apiClient.patch(API_ENDPOINTS.ACHIEVEMENTS.BY_ID(id), data);
    },

    async deleteAchievement(id) {
        return apiClient.delete('/achievements/delete', { body: { id } });
    },
};
