export interface Patient {
  id: string;
  name: string;
  phoneNumber: string | null;
  email: string | null;
  createdAt?: string; // ISO date-time, if the backend sends it
}