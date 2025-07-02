import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { LikeVideoResponse, ApiError } from './types';

@Injectable({
  providedIn: 'root'
})
export class LikeApiService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  likeVideo(videoId: string): Observable<LikeVideoResponse> {
    return this.http.post<LikeVideoResponse>(`${this.apiUrl}/videos/${videoId}/like`, {})
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = error.error?.message || `Error Code: ${error.status}`;
    }

    return throwError(() => ({
      success: false,
      message: errorMessage
    } as ApiError));
  }
} 