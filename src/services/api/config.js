const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        LOGOUT: '/auth/logout',
        SESSION: '/auth/session',
        REGISTER_LIST: '/registerlist',
    },
    MEMBERS: {
        LIST: '/members/list',
        CREATE: '/members/create',
        BY_ID: (id) => `/members/${id}`,
        PROFILE: '/members/profile',
        BY_ROLE: (role) => `/members/memberbyRole/${role}`,
    },
    EVENTS: {
        LIST: '/events/list',
        CREATE: '/events/create',
        BY_ID: (id) => `/events/${id}`,
        BY_STATUS: (status) => `/events/eventbyStatus/${status}`,
    },
    DONATIONS: {
        LIST: '/donations/list',
        CREATE: '/donations/create',
        GOALS: '/donations/goals',
    },
    DONATION_CREATE: {
        LIST: '/donationCreate/list',
        CREATE: '/donationCreate/create',
    },
    ACHIEVEMENTS: {
        LIST: '/achievements/list',
        CREATE: '/achievements/create',
        BY_ID: (id) => `/achievements/${id}`,
    },
    FAMILY: {
        LIST: '/family/list',
        UPDATE: '/family/update',
        BY_AUTH: (authId) => `/family/${authId}`
    }
};

export const API_CONFIG = {
    BASE_URL,
    TIMEOUT: 10000,
    HEADERS: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
};
