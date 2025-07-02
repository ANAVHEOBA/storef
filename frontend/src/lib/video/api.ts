import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { VideoGalleryResponse, ApiError } from './types';

@Injectable({
  providedIn: 'root'
})
export class VideoApiService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Fetches the video gallery from the API
   * @param page Optional page number for pagination
   * @returns Observable of VideoGalleryResponse
   */
  getVideoGallery(page: number = 1): Observable<VideoGalleryResponse> {
    return this.http
      .get<VideoGalleryResponse>(`${this.apiUrl}/videos/gallery`, {
        params: { page: page.toString() }
      })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Handles API errors
   * @param error HttpErrorResponse
   * @returns Observable error
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      errorMessage = error.error?.message || `Error Code: ${error.status}`;
    }

    return throwError(() => ({
      success: false,
      message: errorMessage
    } as ApiError));
  }
} 