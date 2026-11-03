import { Patient } from '../models/patient.types';

export const MOCK_TOTAL_PATIENTS = 1284;
export const MOCK_NEW_THIS_MONTH = 36;

export const MOCK_PATIENTS: Patient[] = [
    { id: '1', name: 'Emma Thompson', phone: '+1 415 555 0169', email: 'emma.thompson@email.com', joinedAt: '2024-05-18' },
    { id: '2', name: 'James Wilson', phone: '+1 415 555 0121', email: 'james.wilson@email.com', joinedAt: '2024-05-16' },
    { id: '3', name: 'Olivia Martinez', phone: '+1 415 555 0199', email: 'olivia.m@email.com', joinedAt: '2024-05-11' },
    { id: '4', name: 'Liam Anderson', phone: '+1 415 555 0174', email: 'liam.a@email.com', joinedAt: '2024-05-06' },
    { id: '5', name: 'Charlotte Lee', phone: '+1 415 555 0153', email: 'charlotte.lee@email.com', joinedAt: '2024-04-28' },
    { id: '6', name: 'Benjamin Carter', phone: '+1 415 555 0108', email: 'ben.carter@email.com', joinedAt: '2024-04-22' },
];