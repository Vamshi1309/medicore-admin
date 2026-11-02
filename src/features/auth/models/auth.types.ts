export interface LoginRequest {
  phoneNumber: string;
  password: string;
}

export interface RegisterRequest extends LoginRequest {
  name: string;
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