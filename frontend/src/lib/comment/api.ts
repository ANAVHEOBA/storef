import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AddCommentPayload, AddCommentResponse, ApiError, GetCommentsResponse, UpdateCommentPayload, UpdateCommentResponse } from './types';

@Injectable({
  providedIn: 'root'
})
export class CommentApiService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getComments(videoId: string, page: number = 1): Observable<GetCommentsResponse> {
    const params = new HttpParams().set('page', page.toString());
    
    return this.http.get<GetCommentsResponse>(`${this.apiUrl}/videos/${videoId}/comments`, { params })
      .pipe(
        catchError(this.handleError)
      );
  }

  addComment(videoId: string, payload: AddCommentPayload): Observable<AddCommentResponse> {
    return this.http.post<AddCommentResponse>(`${this.apiUrl}/videos/${videoId}/comments`, payload)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateComment(commentId: string, payload: UpdateCommentPayload): Observable<UpdateCommentResponse> {
    return this.http.put<UpdateCommentResponse>(`${this.apiUrl}/videos/comments/${commentId}`, payload)
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