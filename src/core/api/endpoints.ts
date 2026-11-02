export const Endpoints = {
    login: '/auth/login',
    register: '/auth/register',
    refresh: '/auth/refresh',
    me: '/auth/me',
    logout: '/auth/logout'
} as const;

export const PicsumEndpoints = {
    list: '/v2/list',
} as const;