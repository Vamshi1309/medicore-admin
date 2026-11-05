import { StaffRole } from './staff.types';

// Matches CreateStaffRequest.java. The Role enum values are sent as their names.
export interface CreateStaffRequest {
  name: string;
  password: string;
  role: StaffRole;
  phoneNumber?: string; // optional: omitted when empty
  email?: string;       // optional: omitted when empty
}