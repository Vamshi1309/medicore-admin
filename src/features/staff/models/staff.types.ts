export type StaffRole = 'DOCTOR' | 'RECEPTIONIST' | 'PHARMACIST' | 'RADIOLOGIST';

export interface Staff {
  id: string;
  name: string;
  staffId: string;
  role: string;
  isActive: boolean;
  email?: string | null;
  phoneNumber?: string | null;
  createdAt?: string; // ISO date-time from the backend
}