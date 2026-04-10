import { apiClient, API_ENDPOINTS } from './api';

export const MemberService = {
    async createMember(data) {
        return apiClient.post(API_ENDPOINTS.MEMBERS.CREATE, data);
    },

    async listMember(data = {}) {
        return apiClient.post(API_ENDPOINTS.MEMBERS.LIST, data);
    },

    async listMemberByRole(role) {
        return apiClient.get(API_ENDPOINTS.MEMBERS.BY_ROLE(role));
    },

    async updateMember(id, data) {
        return apiClient.patch(API_ENDPOINTS.MEMBERS.BY_ID(id), data);
    },

    async deleteMember(id) {
        return apiClient.delete(API_ENDPOINTS.MEMBERS.BY_ID(id));
    },
 
};
