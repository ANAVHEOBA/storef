export interface StartStreamResponse {
  success: boolean;
  streamId: string;
}

export interface UploadChunkResponse {
  success: boolean;
  message: string;
}

export interface StopStreamResponse {
  success: boolean;
  message: string;
  videoId: string;
  videoUrl: string;
}

export interface ApiError {
  success: boolean;
  message: string;
} 