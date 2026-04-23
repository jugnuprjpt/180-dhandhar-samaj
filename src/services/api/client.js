import { API_CONFIG } from './config';

class ApiClient {
    constructor(baseUrl = API_CONFIG.BASE_URL) {
        this.baseUrl = baseUrl;
    }

    async request(method, endpoint, options = {}) {
        const url = new URL(`${this.baseUrl}${endpoint}`);

        if (options.params) {
            Object.entries(options.params).forEach(([key, value]) => {
                url.searchParams.append(key, String(value));
            });
        }

        const headers = {
            ...API_CONFIG.HEADERS,
            ...options.headers,
        };

        try {
            const response = await fetch(url.toString(), {
                method,
                headers,
                body: options.body ? JSON.stringify(options.body) : undefined,
                credentials: options.credentials || 'include',
                cache: options.cache || 'default',
                next: options.next,
            });

            const data = await response.json().catch(() => null);

            if (!response.ok) {
                return {
                    data: null,
                    error: data?.message || response.statusText || 'An unexpected error occurred',
                    status: response.status,
                };
            }

            return {
                data,
                error: null,
                status: response.status,
                message: data?.message,
            };
        } catch (error) {
            console.error(`API Request Error [${method} ${endpoint}]:`, error);
            return {
                data: null,
                error: error instanceof Error ? error.message : 'Network error',
                status: 500,
            };
        }
    }

    get(endpoint, options) {
        return this.request('GET', endpoint, options);
    }

    post(endpoint, body, options) {
        return this.request('POST', endpoint, { ...options, body });
    }

    put(endpoint, body, options) {
        return this.request('PUT', endpoint, { ...options, body });
    }

    patch(endpoint, body, options) {
        return this.request('PATCH', endpoint, { ...options, body });
    }

    delete(endpoint, options) {
        return this.request('DELETE', endpoint, options);
    }
}

export const apiClient = new ApiClient();
