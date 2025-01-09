import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse, // Ensure this is imported
} from '../interfaces/auth.interfaces'; // Ensure the path is correct

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/auth'; // Update with your backend URL
  private tokenKey = 'authToken'; // Key for storing the token in localStorage

  constructor(private http: HttpClient) {}

  // Login method
  login(loginRequest: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, loginRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Login failed. Please check your credentials.';
        if (error.error instanceof ErrorEvent) {
          // Client-side or network error
          errorMessage = 'A network error occurred. Please check your connection.';
        } else if (error.status === 0) {
          // Backend is unreachable
          errorMessage = 'Unable to connect to the server. Please try again later.';
        } else if (error.error && typeof error.error === 'string') {
          // Backend returned a plain text or invalid JSON response
          errorMessage = error.error;
        } else if (error.error && error.error.message) {
          // Backend returned a JSON response with an error message
          errorMessage = error.error.message;
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }

signup(signupRequest: SignupRequest): Observable<SignupResponse> {
    return this.http.post<SignupResponse>(`${this.baseUrl}/signup`, signupRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
          errorMessage = 'A network error occurred. Please check your connection.';
        } else if (error.status === 0) {
          errorMessage = 'Unable to connect to the server. Please try again later.';
        } else if (error.error && typeof error.error === 'string') {
          errorMessage = error.error;
        } else if (error.error && error.error.message) {
          errorMessage = error.error.message;
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  // Check if the user is authenticated
  isAuthenticated(): boolean {
    const token = localStorage.getItem(this.tokenKey);
    return !!token; // Returns true if a token exists
  }

  // Store the token in localStorage
  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  // Remove the token from localStorage
  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }
}