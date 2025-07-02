import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VideoUploadRequest, VideoUploadResponse, VideoProcessingStatus, VideoMetadata } from './types';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VideoUploadService {
  private apiUrl = `${environment.apiUrl}/videos`;

  constructor(private http: HttpClient) {}

  uploadVideo(uploadData: VideoUploadRequest): Observable<VideoUploadResponse> {
    const formData = new FormData();
    formData.append('file', uploadData.file);
    formData.append('title', uploadData.title);
    formData.append('description', uploadData.description);
    formData.append('tags', uploadData.tags);
    formData.append('visibility', uploadData.visibility);

    return this.http.post<VideoUploadResponse>(`${this.apiUrl}/process`, formData);
  }

  getProcessingStatus(videoId: string): Observable<VideoProcessingStatus> {
    return this.http.get<VideoProcessingStatus>(`${this.apiUrl}/status/${videoId}`);
  }

  getVideoMetadata(videoId: string): Observable<{ success: boolean; metadata: VideoMetadata }> {
    return this.http.get<{ success: boolean; metadata: VideoMetadata }>(`${this.apiUrl}/metadata/${videoId}`);
  }

  cancelProcessing(videoId: string): Observable<VideoUploadResponse> {
    return this.http.post<VideoUploadResponse>(`${this.apiUrl}/${videoId}/cancel`, {});
  }

  // Helper method to validate file before upload
  validateVideoFile(file: File): { valid: boolean; error?: string } {
    const maxSize = 1024 * 1024 * 1024; // 1GB
    const allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime'];

    if (!file) {
      return { valid: false, error: 'No file selected' };
    }

    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'Invalid file type. Please upload MP4, WebM, or QuickTime video.' };
    }

    if (file.size > maxSize) {
      return { valid: false, error: 'File size exceeds 1GB limit' };
    }

    return { valid: true };
  }
} 