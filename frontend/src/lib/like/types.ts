export interface LikeVideoResponse {
  success: boolean;
  liked: boolean;
  likesCount: number;
}

export interface ApiError {
  success: boolean;
  message: string;
} 