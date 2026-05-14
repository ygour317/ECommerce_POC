import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AuthResponse {
  token: string;
  email: string;
  role: string;
  fullName: string | null;
}

export interface UserProfile {
  id: number;
  email: string;
  fullName: string | null;
  role: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/api/auth/login`, { email, password })
      .pipe(tap((res) => this.setSession(res)));
  }

  register(email: string, password: string, fullName?: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/api/auth/register`, {
        email,
        password,
        fullName: fullName || undefined,
      })
      .pipe(tap((res) => this.setSession(res)));
  }

  me(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${environment.apiUrl}/api/auth/me`);
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_role');
    void this.router.navigate(['/login']);
  }

  get token(): string | null {
    return localStorage.getItem('access_token');
  }

  isLoggedIn(): boolean {
    return !!this.token;
  }

  isAdmin(): boolean {
    return localStorage.getItem('user_role') === 'ADMIN';
  }

  getEmail(): string | null {
    return localStorage.getItem('user_email');
  }

  private setSession(res: AuthResponse): void {
    localStorage.setItem('access_token', res.token);
    localStorage.setItem('user_email', res.email);
    localStorage.setItem('user_role', res.role);
  }
}
