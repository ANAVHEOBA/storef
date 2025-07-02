import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { StartStreamResponse, ApiError, UploadChunkResponse, StopStreamResponse } from './types';

@Injectable({
  providedIn: 'root'
})
export class StreamApiService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  startStream(): Observable<StartStreamResponse> {
    return this.http.post<StartStreamResponse>(`${this.apiUrl}/streams/start`, {})
      .pipe(
        catchError(this.handleError)
      );
  }

  uploadChunk(streamId: string, chunk: Blob, sequence: number): Observable<UploadChunkResponse> {
    const formData = new FormData();
    formData.append('video_chunk', chunk, `chunk-${sequence}.mp4`);
    formData.append('sequence', sequence.toString());

    return this.http.post<UploadChunkResponse>(`${this.apiUrl}/streams/${streamId}/upload`, formData)
      .pipe(
        catchError(this.handleError)
      );
  }

  stopStream(streamId: string): Observable<StopStreamResponse> {
    return this.http.post<StopStreamResponse>(`${this.apiUrl}/streams/${streamId}/stop`, {})
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