// Video interface matching the API response
export interface Video {
  id: string;
  title: string;
  creator: string;
  views: number;
  duration: number;
  thumbnail: string;
  cdnUrl: string;
  createdAt: string;
}

// Pagination interface from API response
export interface Pagination {
  current: number;
  total: number;
  hasMore: boolean;
}

// API Response interface
export interface VideoGalleryResponse {
  success: boolean;
  videos: Video[];
  pagination: Pagination;
}

// API Error interface
export interface ApiError {
  success: false;
  message: string;
} 