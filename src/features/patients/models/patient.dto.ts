import { Patient } from './patient.types';

// ASSUMED field names, modeled on StaffSummaryResponse.
// Replace with the real response DTO once you've checked the log.
export interface PatientDto {
  userId: string;
  name: string;
  phoneNumber: string | null;
  email: string | null;
  createdAt: string | null;
}

export const toPatient = (d: PatientDto): Patient => ({
  id: d.userId,
  name: d.name,
  phoneNumber: d.phoneNumber,
  email: d.email,
  createdAt: d.createdAt ?? undefined,
});