export interface ProfileUser {
  id: string;
  email: string;
  username: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileResponse {
  success: boolean;
  user: ProfileUser;
}

export interface ApiError {
  success: boolean;
  message: string;
} 
 
 
 
 
 