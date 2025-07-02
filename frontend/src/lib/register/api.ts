import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { 
  RegisterRequest, 
  RegisterResponse, 
  VerifyEmailRequest,
  VerifyEmailResponse,
  ApiError 
} from './types';

@Injectable({
  providedIn: 'root'
})
export class RegisterApiService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Register a new user
   * @param data RegisterRequest data containing email, password, and username
   * @returns Observable of RegisterResponse
   */
  register(data: RegisterRequest): Observable<RegisterResponse> {
    return this.http
      .post<RegisterResponse>(`${this.apiUrl}/auth/register`, data)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Verify email with verification code
   * @param data VerifyEmailRequest data containing email and verification code
   * @returns Observable of VerifyEmailResponse
   */
  verifyEmail(data: VerifyEmailRequest): Observable<VerifyEmailResponse> {
    return this.http
      .post<VerifyEmailResponse>(`${this.apiUrl}/auth/verify-email`, data)
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