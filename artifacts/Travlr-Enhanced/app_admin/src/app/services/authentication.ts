import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';

import { BROWSER_STORAGE } from '../storage';
import { User } from '../models/user';
import { AuthResponse } from '../models/auth-response';

@Injectable({
  providedIn: 'root',
})
export class Authentication {
  private readonly baseUrl = 'http://localhost:3000/api';
  private readonly tokenKey = 'travlr-token';

  constructor(
    private http: HttpClient,
    @Inject(BROWSER_STORAGE) private storage: Storage
  ) {}

  // Retrieve the current authentication token from browser storage.
  public getToken(): string {
    return this.storage.getItem(this.tokenKey) || '';
  }

  // Save a JWT after successful authentication.
  public saveToken(token: string): void {
    this.storage.setItem(this.tokenKey, token);
  }

  // Remove the current JWT when the user logs out.
  public logout(): void {
    this.storage.removeItem(this.tokenKey);
  }

  // Check whether the stored JWT exists, can be decoded, and has not expired.
  public isLoggedIn(): boolean {
    const token = this.getToken();

    if (!token) {
      return false;
    }

    try {
      const payload = this.decodeToken(token);

      if (!payload.exp) {
        this.logout();
        return false;
      }

      const tokenIsValid = payload.exp > Math.floor(Date.now() / 1000);

      if (!tokenIsValid) {
        this.logout();
      }

      return tokenIsValid;
    } catch (error) {
      console.error('Invalid authentication token:', error);
      this.logout();
      return false;
    }
  }

  // Return information stored in the current JWT.
  public getCurrentUser(): User | null {
    const token = this.getToken();

    if (!token) {
      return null;
    }

    try {
      const payload = this.decodeToken(token);

      return {
        email: payload.email,
        name: payload.name,
      } as User;
    } catch (error) {
      console.error('Unable to decode current user:', error);
      this.logout();
      return null;
    }
  }

  // Authenticate an existing user and save the returned JWT.
  public login(user: User, password: string): Observable<AuthResponse> {
    const formData = {
      email: user.email,
      password,
    };

    return this.http
      .post<AuthResponse>(`${this.baseUrl}/login`, formData)
      .pipe(
        tap((response: AuthResponse) => this.saveToken(response.token)),
        catchError((error: HttpErrorResponse) => this.handleAuthError(error))
      );
  }

  // Register a new user and save the returned JWT.
  public register(user: User, password: string): Observable<AuthResponse> {
    const formData = {
      name: user.name,
      email: user.email,
      password,
    };

    return this.http
      .post<AuthResponse>(`${this.baseUrl}/register`, formData)
      .pipe(
        tap((response: AuthResponse) => this.saveToken(response.token)),
        catchError((error: HttpErrorResponse) => this.handleAuthError(error))
      );
  }

  // Decode the payload section of a JWT while safely handling Base64URL encoding.
  private decodeToken(token: string): any {
    const parts = token.split('.');

    if (parts.length !== 3) {
      throw new Error('Invalid JWT format');
    }

    let payload = parts[1]
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    while (payload.length % 4) {
      payload += '=';
    }

    return JSON.parse(atob(payload));
  }

  // Convert authentication failures into consistent, user-friendly messages.
  private handleAuthError(error: HttpErrorResponse): Observable<never> {
    let message = 'An unexpected authentication error occurred.';

    if (error.status === 0) {
      message = 'Unable to connect to the server. Please try again later.';
    } else if (error.status === 400) {
      message = error.error?.message || 'Please check the information provided.';
    } else if (error.status === 401) {
      message = 'The email or password is incorrect.';
    } else if (error.status >= 500) {
      message = 'The server encountered an error. Please try again later.';
    }

    console.error('Authentication error:', error);
    return throwError(() => new Error(message));
  }
}
