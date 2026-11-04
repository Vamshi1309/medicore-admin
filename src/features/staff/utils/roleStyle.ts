import { Colors } from '@/theme/colors';
import { formatRole } from '@/constants/roles';
import { StaffRole } from '../models/staff.types';

export const ROLE_STYLE: Record<StaffRole, { label: string; color: string; background: string }> = {
  DOCTOR: { label: 'Doctor', color: Colors.primary, background: Colors.primarySoft },
  RECEPTIONIST: { label: 'Receptionist', color: Colors.purple, background: Colors.purpleSoft },
  PHARMACIST: { label: 'Pharmacist', color: Colors.success, background: Colors.successSoft },
  RADIOLOGIST: { label: 'Radiologist', color: Colors.orange, background: Colors.orangeSoft },
};

// Unknown roles from the backend still render, in a neutral style
export const getRoleStyle = (role: string) =>
  ROLE_STYLE[role as StaffRole] ?? {
    label: formatRole(role),
    color: Colors.muted,
    background: Colors.border,
  };

export const STAFF_ROLE_OPTIONS = (Object.keys(ROLE_STYLE) as StaffRole[]).map((value) => ({
  label: ROLE_STYLE[value].label,
  value,
}));