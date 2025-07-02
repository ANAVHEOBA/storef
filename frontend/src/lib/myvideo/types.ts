export interface MyVideosResponse {
  success: boolean;
  videos: VideoDetails[];
}

export interface VideoDetails {
  _id: string;
  userId: string;
  title: string;
  description: string;
  originalName: string;
  status: 'completed' | 'processing' | 'failed';
  visibility: 'public' | 'private';
  tags: string[];
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
  metadata: {
    duration: number;
    size: number;
    resolutions: string[];
  };
  files: {
    original: {
      path: string;
      cdnUrl: string;
      commp: string;
    };
    thumbnail: {
      path: string;
    };
    processed: any[];
  };
} 