// authentication.service.ts

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private isAuthenticated = false;
  public redirectUrl: string = ''; 

  login(credentials: { email: string; password: string }): boolean {
    if (this.isValidCredentials(credentials)) {
      this.isAuthenticated = true;
      return true;
    } else {
      return false;
    }
  }

  logout(): void {
    this.isAuthenticated = false;
    this.redirectUrl = '/';
  }

  isAuthenticatedUser(): boolean {
    return this.isAuthenticated;
  }

  private isValidCredentials(credentials: { email: string; password: string }): boolean {
    return credentials.email === 'test@example.com' && credentials.password === 'Password123';
  }
}
