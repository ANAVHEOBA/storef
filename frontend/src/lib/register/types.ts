export interface RegisterRequest {
  email: string;
  password: string;
  username: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  token: string;
  verificationCode: string;
}

export interface VerifyEmailRequest {
  email: string;
  code: string;
}

export interface VerifyEmailResponse {
  success: boolean;
  message: string;
}

export interface ApiError {
  success: boolean;
  message: string;
} 