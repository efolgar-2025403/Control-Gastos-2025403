import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

interface AuthResponse {
  message: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
  token: string;
}

interface MeResponse {
  user: {
    id: number;
    name: string;
    email: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:3000/api/auth';

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}/login`,
      {
        email,
        password
      }
    ).pipe(
      tap(response => {
        localStorage.setItem('control-gastos-token', response.token);
        localStorage.setItem(
          'control-gastos-user',
          JSON.stringify(response.user)
        );
      })
    );
  }

  register(
    name: string,
    email: string,
    password: string
  ): Observable<AuthResponse> {

    return this.http.post<AuthResponse>(
      `${this.apiUrl}/register`,
      {
        name,
        email,
        password
      }
    );
  }

  me(): Observable<MeResponse> {
    return this.http.get<MeResponse>(
      `${this.apiUrl}/me`
    );
  }

  getToken(): string | null {
    return localStorage.getItem('control-gastos-token');
  }

  getUser(): {
    id: number;
    name: string;
    email: string;
  } | null {

    const user = localStorage.getItem('control-gastos-user');

    if (!user) {
      return null;
    }

    try {
      return JSON.parse(user);
    } catch {
      return null;
    }
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem('control-gastos-token');
    localStorage.removeItem('control-gastos-user');
  }
}