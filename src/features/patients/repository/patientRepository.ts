import { apiClient } from '@/core/api/apiClient';
import { Endpoints } from '@/core/api/endpoints';
import { ApiResponse } from '@/core/api/types';
import { toList } from '@/core/api/unwrap';
import { PatientDto, toPatient } from '../models/patient.dto';
import { Patient } from '../models/patient.types';

type PatientListResponse = ApiResponse<PatientDto[] | { content: PatientDto[] }>;

export const patientRepository = {
  getAll: async (): Promise<Patient[]> => {
    const res = await apiClient.get<PatientListResponse>(Endpoints.patients);
    return toList(res.data.data)
      .map(toPatient)
      .sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? '')); // newest first
  },
};