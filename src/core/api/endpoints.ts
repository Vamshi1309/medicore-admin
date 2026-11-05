export const Endpoints = {
    staffLogin: '/auth/staff/login',
    refresh: '/auth/refresh',
    me: '/auth/me',
    logout: '/auth/logout',
    adminStats: '/admin/stats',
    adminStaff: '/admin/staff',
    adminStaffStatus: (id: string) => `/admin/staff/${id}/status`,
} as const;

export const PicsumEndpoints = {
    list: '/v2/list',
} as const;