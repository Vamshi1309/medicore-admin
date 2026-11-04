import { Staff } from './staff.types';

// Matches StaffSummaryResponse.java
export interface StaffDto {
  userId: string;
  name: string;
  staffId: string;
  email: string | null;
  phoneNumber: string | null;
  role: string;
  isActive: boolean | null;
  createdAt: string | null;
}

export const toStaff = (d: StaffDto): Staff => ({
  id: d.userId,
  name: d.name,
  staffId: d.staffId,
  role: d.role,
  isActive: d.isActive ?? false,
  email: d.email,
  phoneNumber: d.phoneNumber,
  createdAt: d.createdAt ?? undefined,
});