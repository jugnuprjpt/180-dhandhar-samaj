import { apiClient, API_ENDPOINTS } from './api';

export const EventService = {
    async createEvent(data) {
        return apiClient.post(API_ENDPOINTS.EVENTS.CREATE, data);
    },

    async listEvent(data = {}) {
        return apiClient.post(API_ENDPOINTS.EVENTS.LIST, data);
    },

    async listEventByStatus(status) {
        return apiClient.get(API_ENDPOINTS.EVENTS.BY_STATUS(status));
    },

    async updateEvent(id, data) {
        return apiClient.patch(API_ENDPOINTS.EVENTS.BY_ID(id), data);
    },

    async deleteEvent(id) {
        return apiClient.delete(API_ENDPOINTS.EVENTS.DELETE || '/events/delete', { body: { id } });
    },
 
};
