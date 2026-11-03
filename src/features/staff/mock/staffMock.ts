import { Staff } from '../models/staff.types';

export const MOCK_STAFF: Staff[] = [
    { id: '1', name: 'Dr. Maya Chen', staffId: 'MED-1042', role: 'DOCTOR', isActive: true },
    { id: '2', name: 'Noah Williams', staffId: 'MED-1041', role: 'RECEPTIONIST', isActive: true },
    { id: '3', name: 'Priya Patel', staffId: 'MED-1040', role: 'PHARMACIST', isActive: true },
    { id: '4', name: 'Elias Brooks', staffId: 'MED-1039', role: 'RADIOLOGIST', isActive: false },
    { id: '5', name: 'Dr. Sofia Morgan', staffId: 'MED-1038', role: 'DOCTOR', isActive: true },
    { id: '6', name: 'Avery Kim', staffId: 'MED-1037', role: 'RECEPTIONIST', isActive: true },
];