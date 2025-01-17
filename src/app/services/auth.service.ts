import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

// Interface for the login response
interface LoginResponse {
  message: string;
  username: string;
}

// Interface for the 2FA verification response
interface Verify2FAResponse {
  message: string;
  jwt?: string; // Optional JWT token
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080'; // URL de l'API backend

  constructor(private http: HttpClient) {}

  // Méthode pour la connexion
  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, { username, password })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          // Handle errors from the backend
          if (error.status === 401 || error.status === 400) {
            return throwError('Username or password incorrect');
          } else {
            return throwError('An error occurred. Please try again.');
          }
        })
      );
  }

  // Méthode pour vérifier le code 2FA
  verify2FA(username: string, code: string): Observable<Verify2FAResponse> {
    return this.http.post<Verify2FAResponse>(`${this.apiUrl}/auth/verify-2fa`, { username, code })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          // Handle errors from the backend
          if (error.status === 401 || error.status === 400) {
            return throwError('Invalid 2FA code');
          } else {
            return throwError('An error occurred. Please try again.');
          }
        })
      );
  }

  // Méthode pour l'inscription
  signup(username: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/signup`, { username, email, password })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          // Handle errors from the backend
          if (error.status === 400) {
            return throwError('Username or email already in use');
          } else {
            return throwError('An error occurred. Please try again.');
          }
        })
      );
  }
}