export interface DashboardStats {
  totalPatients: number;
  totalDoctors: number;
  totalOtherStaff: number;
  todaysAppointments: number;
  newPatientsThisMonth?: number;
  activeDoctorsToday?: number;
  staffTeams?: number;
  remainingAppointments?: number;
}