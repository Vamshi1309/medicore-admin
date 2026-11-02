export const ADMIN_ROLE = 'ADMIN';

export const formatRole = (role?: string) => {
    if (!role) return '';
    if (role === ADMIN_ROLE) return 'Administrator';
    const text = role.replace(/_/g, ' ').toLowerCase();
    return text.charAt(0).toUpperCase() + text.slice(1);
};