export type StaffRole = 'DOCTOR' | 'RECEPTIONIST' | 'PHARMACIST' | 'RADIOLOGIST';

export interface Staff {
    id: string;
    name: string;
    staffId: string;
    role: StaffRole;
    isActive: boolean;
}