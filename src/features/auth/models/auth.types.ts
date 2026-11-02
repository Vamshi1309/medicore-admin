export interface StaffLoginRequest {
  staffId: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface User {
  id: string;
  name: string;
  staffId: string | null;
  phoneNumber: string;
  role: string;
}