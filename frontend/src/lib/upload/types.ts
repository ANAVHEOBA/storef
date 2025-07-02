export interface VideoUploadRequest {
  file: File;
  title: string;
  description: string;
  tags: string;
  visibility: 'public' | 'private';
}

export interface VideoUploadResponse {
  success: boolean;
  videoId?: string;
  message: string;
}

export interface VideoProcessingStatus {
  success: boolean;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  metadata?: VideoMetadata;
  error?: string;
}

export interface VideoMetadata {
  duration: number;
  size: number;
  resolutions: string[];
  files?: {
    original: {
      path: string;
      cdnUrl: string;
      commp: string;
    };
    thumbnail: {
      path: string;
    };
    processed: Array<{
      resolution: string;
      path: string;
      _id: string;
    }>;
  };
} 