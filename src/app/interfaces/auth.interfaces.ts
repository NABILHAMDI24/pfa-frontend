// src/app/interfaces/auth.interfaces.ts

// Interface for login request payload
export interface LoginRequest {
  username: string;
  password: string;
}

// Interface for login response payload
export interface LoginResponse {
  token: string;
  message: string;
}

// Interface for signup request payload
export interface SignupRequest {
  username: string;
  email: string;
  password: string;
}

// Interface for signup response payload
export interface SignupResponse {
  message: string;
}