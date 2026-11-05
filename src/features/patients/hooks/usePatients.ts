import { useQuery } from '@tanstack/react-query';
import { patientRepository } from '../repository/patientRepository';

export const PATIENTS_KEY = ['patients', 'list'] as const;

export function usePatients() {
  return useQuery({
    queryKey: PATIENTS_KEY,
    queryFn: patientRepository.getAll,
  });
}