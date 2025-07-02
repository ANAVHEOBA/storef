import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, tap, throwError, timer, retryWhen, mergeMap } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginRequest, LoginResponse, ApiError } from './types';

@Injectable({
  providedIn: 'root'
})
export class LoginApiService {
  private readonly apiUrl = environment.apiUrl;
  private readonly TOKEN_KEY = 'token';
  private readonly USER_KEY = 'user';
  private retryDelay = 1000; // 1 second
  private maxRetries = 3;

  constructor(private http: HttpClient) {}

  /**
   * Login user with email and password
   * @param data LoginRequest data containing email and password
   * @returns Observable of LoginResponse
   */
  login(data: LoginRequest): Observable<LoginResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http
      .post<LoginResponse>(`${this.apiUrl}/auth/login`, data, { headers })
      .pipe(
        tap(response => {
          console.log('Login API response:', response);
          if (response.success) {
            this.setToken(response.token);
            this.setUser(response.user);
          }
        }),
        retryWhen(errors =>
          errors.pipe(
            mergeMap((error, index) => {
              // Only retry on rate limit (429) and up to maxRetries times
              if (error.status === 429 && index < this.maxRetries) {
                console.log(`Retrying login attempt ${index + 1} after ${this.retryDelay}ms`);
                return timer(this.retryDelay * (index + 1));
              }
              return throwError(() => error);
            })
          )
        ),
        catchError(this.handleError)
      );
  }

  /**
   * Check if user is logged in
   * @returns boolean
   */
  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;

    // Check if token is expired
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp * 1000; // Convert to milliseconds
      if (Date.now() >= expiry) {
        this.logout();
        return false;
      }
      return true;
    } catch {
      this.logout();
      return false;
    }
  }

  /**
   * Get current user
   * @returns User object or null
   */
  getCurrentUser() {
    const userStr = localStorage.getItem(this.USER_KEY);
    try {
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      this.logout();
      return null;
    }
  }

  /**
   * Get auth token
   * @returns string or null
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Set auth token
   * @param token string
   */
  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  /**
   * Set user data
   * @param user User object
   */
  private setUser(user: any): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  /**
   * Logout user
   */
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
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
      if (error.status === 429) {
        errorMessage = 'Too many attempts. Please wait a moment and try again.';
      } else {
        errorMessage = error.error?.message || `Error Code: ${error.status}`;
      }
    }

    return throwError(() => ({
      success: false,
      message: errorMessage
    } as ApiError));
  }
} 